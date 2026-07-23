# Codebase Guide — How Everything Connects

A map of every source file in this repo, what it's responsible for, and how
it links to the files around it. Read `SYSTEM_ARCHITECTURE.md` first for the
diagrams/flows — this document is the reference for "which file do I open to
change X."

Layering, backend: `api/` (HTTP in/out) → `services/` (orchestration) →
`rag/` (RAG mechanics) + `repositories/` (DB access) → `models/` (table
definitions). Nothing skips a layer: `api/` never touches the database
directly, `services/` never writes raw SQL, `repositories/` never know about
HTTP.

Layering, frontend: `pages/` (routed screens) → `components/` (reusable UI)
→ `api/` (fetch wrappers) → backend. `context/` holds the one piece of global
state (which business is active).

---

## Backend — `backend/app/`

### Entry point & wiring

| File | Role |
|---|---|
| `main.py` | Creates the FastAPI app, adds CORS middleware (origins from `settings.cors_origins`), mounts `api_router`, defines `GET /health`. This is what uvicorn runs (`app.main:app`). |
| `api/router.py` | Combines the three route modules (`businesses`, `documents`, `chat`) under the `/api/v1` prefix. Anything added under `app/api/` must be registered here to become reachable. |
| `core/config.py` | `Settings` (pydantic-settings) — loads `.env` into one typed object: `database_url`, `llm_api_base/key/model`, `embedding_model/dim`, `cors_origins`. Imported everywhere as `from app.core.config import settings`. Change LLM provider or DB connection here (via `.env`, not code). |
| `core/database.py` | Creates the async SQLAlchemy `engine` and `SessionLocal`, defines the shared `Base` declarative class, and `get_db()` — a FastAPI dependency that yields one session per request and commits it once the request finishes. Every route that touches the DB takes `session: AsyncSession = Depends(get_db)`. |
| `core/logging.py` | `configure_logging()` (called once in `main.py`) sets the log format; `get_logger(name)` is used by services to log (e.g. `ingestion_service.py` logs failed ingestions). |

### API layer — `api/` (HTTP boundary only)

| File | Endpoints | Delegates to |
|---|---|---|
| `businesses.py` | `POST /businesses`, `GET /businesses/{id}` | `BusinessRepository` directly — no service needed, it's a plain create/read. |
| `documents.py` | `GET /businesses/{id}/documents`, `POST .../documents`, `PUT .../documents/{document_id}` | `DocumentRepository` (list), `IngestionService` (upload/re-upload — this is where the whole extract→chunk→embed pipeline is kicked off). |
| `chat.py` | `POST /businesses/{id}/chat`, `GET .../conversations`, `GET .../conversations/{id}` | `RAGService` (the actual chat turn), `ConversationRepository` + `MessageRepository` (listing/reading logs for the dashboard). |

Each router file declares its own `APIRouter(prefix=...)`; `router.py` is the
only place that stitches them together.

### Service layer — `services/` (orchestration, no SQL, no HTTP)

| File | Class | What it orchestrates |
|---|---|---|
| `ingestion_service.py` | `IngestionService` | The full "upload → searchable" job: create/update the `Document` row, call `rag/extraction.py` → `rag/chunking.py` → `rag/embeddings.py` in sequence, persist each chunk via `DocumentChunkRepository`, and set the document's final status (`ready`/`failed`). `reingest()` additionally wipes old chunks first via `DocumentChunkRepository.delete_for_document`. |
| `rag_service.py` | `RAGService` | The full "question → answer" job: find-or-create the `Conversation`, save the user's `Message`, embed the question (`rag/embeddings.py`), retrieve top-4 chunks (`DocumentChunkRepository.similarity_search`), build the system prompt (`rag/prompts.py`), call the LLM (`rag/llm.py`), save and return the assistant's `Message`. |

Both services are instantiated per-request in the API layer (`IngestionService(session)`, `RAGService(session)`) — they're not singletons, they just wrap the request's DB session.

### RAG toolkit — `rag/` (the actual retrieval-augmented-generation mechanics)

| File | Function | Detail |
|---|---|---|
| `extraction.py` | `extract_text(filename, content_type, data)` | Branches on file type: `pypdf` for PDF, `python-docx` for `.docx`, otherwise decodes as UTF-8 plain text. Always returns one flat string. Libraries are imported lazily inside the branches so unrelated file types don't pay the import cost. |
| `chunking.py` | `chunk_text(text)` | Fixed-size sliding window: `CHUNK_SIZE = 1000` chars, `CHUNK_OVERLAP = 150` chars, so no sentence is fully lost at a cut boundary. Pure string slicing — no tokenizer, no sentence-boundary awareness. |
| `embeddings.py` | `embed_texts(list[str])`, `embed_text(str)` | Loads `sentence-transformers` model `all-MiniLM-L6-v2` once via `@lru_cache` (`_model()`), then encodes with `normalize_embeddings=True` so cosine similarity comparisons are fair regardless of text length. `embed_text` is just `embed_texts([text])[0]`, used for the single incoming chat question. |
| `prompts.py` | `build_system_prompt(retrieved_chunks)` | Wraps `BASE_INSTRUCTIONS` (the "only use this knowledge, don't invent business facts" rules) around the retrieved chunk texts, joined with `\n---\n`. Falls back to `NO_CONTEXT_NOTE` if nothing matched. This is the only place prompt wording lives — edit here to change chatbot tone/behavior. |
| `llm.py` | `generate_answer(system_prompt, history, user_message)`, `get_llm_client()` | Wraps an `AsyncOpenAI` client (cached via `@lru_cache`) pointed at `settings.llm_api_base`. Sends `[system, *history, user]` to `settings.llm_model` and returns the reply text. **Gotcha:** some OpenAI-compatible providers (Moonshot/Kimi) reject a non-default `temperature` — don't hardcode one unless you've confirmed the provider accepts it. |

`ingestion_service.py` uses `extraction.py` + `chunking.py` + `embeddings.py`.
`rag_service.py` uses `embeddings.py` + `prompts.py` + `llm.py`. Neither
service touches `pgvector`/SQL directly — that's the repository layer's job.

### Repository layer — `repositories/` (all SQL lives here)

| File | Class(es) | Notable methods |
|---|---|---|
| `base.py` | `BaseRepository[ModelType]` | Generic `get`, `create`, `update` shared by every repository below. Does **not** filter by `business_id` (not every model has one) — subclasses add that filtering explicitly. |
| `business_repository.py` | `BusinessRepository` | Just inherits the base — a business has no parent to scope by. |
| `document_repository.py` | `DocumentRepository`, `DocumentChunkRepository` | `list_for_business` (documents, newest first). `DocumentChunkRepository.similarity_search(business_id, embedding, limit)` — the pgvector query: `ORDER BY embedding.cosine_distance(embedding) LIMIT n`, filtered by `business_id` in the same `WHERE`. `delete_for_document` — wipes chunks before a re-upload's new ones are inserted. |
| `conversation_repository.py` | `ConversationRepository`, `MessageRepository` | `get_for_business(business_id, id)` — the tenant-isolation check (id **and** business_id together, so one business can't fetch another's conversation by guessing a UUID). `list_for_business`, `list_for_conversation` (messages, oldest first — chat order). |

Every method that touches a `business_id`-scoped table takes `business_id`
as an explicit argument and puts it in the `WHERE` clause — this is the
entire multi-tenancy mechanism in this codebase. There is no middleware or
global query filter doing this automatically.

### Models — `models/` (table definitions, SQLAlchemy ORM)

| File | Tables | Notes |
|---|---|---|
| `base.py` | — | `UUIDPKMixin` (UUID primary key, default `uuid4`), `TimestampMixin` (`created_at`/`updated_at`, server-side defaults). Every model below inherits both. |
| `business.py` | `businesses` | Just `id`, `name`, timestamps. Its `id` doubles as the only access-control token in the whole app (see docstring in the file). |
| `document.py` | `documents`, `document_chunks` | `DocumentStatus` enum (`pending/processing/ready/failed`). `DocumentChunk.embedding` is a `pgvector` `Vector(settings.embedding_dim)` column — dimension must match the embedding model's output size (384 for `all-MiniLM-L6-v2`). |
| `conversation.py` | `conversations`, `messages` | `MessageRole` enum (`user/assistant`). A conversation is just a grouping container — no title, no metadata, kept intentionally minimal. |

### Schemas — `schemas/` (Pydantic request/response shapes, separate from ORM models)

| File | Purpose |
|---|---|
| `common.py` | `ORMModel` — base class with `from_attributes=True`, so any schema built straight from an ORM row (`Model.model_validate(orm_obj)`) works without boilerplate. |
| `business.py`, `document.py`, `chat.py` | Request bodies (`BusinessCreate`, `ChatRequest`) and response shapes (`BusinessRead`, `DocumentRead`, `ChatResponse`, `ConversationRead`/`ConversationDetail`, `MessageRead`) — these are what the FastAPI `response_model=` in each route actually returns, decoupled from the DB models so internal columns (like `error_message` formatting) can differ from the wire format if needed later. |

### Migrations — `alembic/`

| File | Purpose |
|---|---|
| `env.py` | Alembic's runtime config — points at `Base.metadata` and the database URL from `settings`, so `alembic revision --autogenerate` picks up model changes automatically. |
| `versions/0001_initial_schema.py` | The one migration so far: creates all five tables plus the `pgvector` extension and indices. Run automatically by `docker-compose.yml`'s `api` command (`alembic upgrade head`) before uvicorn starts. |

---

## Frontend — `frontend/src/`

No Redux/Zustand — the only global state is "which business is currently
active," held in `context/BusinessContext.jsx` and mirrored to
`localStorage`. Everything else is local `useState`/`useEffect` per page.

### Entry point & routing

| File | Role |
|---|---|
| `main.jsx` | Mounts the React tree: `BrowserRouter` → `BusinessProvider` → `App`. Also pulls in the two global stylesheets (`styles/tokens.css`, `styles/global.css`). |
| `App.jsx` | All routes in one place. `/` is the public landing/business-picker (`Home.jsx`). Everything under `/dashboard/*` is wrapped in `RequireBusiness` (redirects to `/` if no business is loaded) and `Layout` (sidebar nav). `/chat/:businessId` is public — no `RequireBusiness` guard — because it's the link a business's *customers* use. |
| `context/BusinessContext.jsx` | `BusinessProvider` + `useBusiness()` hook. Loads a previously saved business from `localStorage` on mount (`saveBusiness`/`clearBusiness` write through to storage too). This is the entire "session" mechanism — there's no server-side session or cookie. |
| `components/RequireBusiness.jsx` | Route guard: renders nothing while `loading`, redirects to `/` if `business` is null, otherwise renders children. Gatekeeper for every dashboard page. |

### Pages — `pages/` (one per route)

| File | Route | What it does |
|---|---|---|
| `Home.jsx` | `/` | Two modes: create a new business (`businessApi.create`) or load an existing one by pasting its id (`businessApi.get`). Either way, calls `saveBusiness()` then navigates to `/dashboard/documents`. This page *is* the "login" screen in a system with no real auth. |
| `Documents.jsx` | `/dashboard/documents` | Lists documents (`documentsApi.list`), uploads new ones via a hidden file input (`documentsApi.upload`, multipart `FormData`), shows each document's status via `StatusBadge` and its `error_message` if failed. This is the UI half of the ingestion flow described in `SYSTEM_ARCHITECTURE.md` §3. |
| `Conversations.jsx` | `/dashboard/conversations` | Lists conversations for the active business (`chatApi.listConversations`), newest first, each linking to its detail page. This is the "conversation log" the owner reviews. |
| `ConversationDetail.jsx` | `/dashboard/conversations/:conversationId` | Fetches one conversation's full message thread (`chatApi.getConversation`) and renders it as chat bubbles (reusing `ChatWindow.css` bubble styles) — read-only transcript view. |
| `WidgetInfo.jsx` | `/dashboard/widget` | Shows the shareable customer chat link (`/chat/{businessId}`), a copy-to-clipboard button, and a live embedded `ChatWindow` preview so the owner can test the exact experience their customers get. |
| `CustomerChat.jsx` | `/chat/:businessId` (public) | Looks up the business by the id in the URL (`businessApi.get`) to show its name, or shows "this chat link isn't valid" if not found. Renders `ChatWindow` — this is the actual page a business's customers use, no dashboard chrome, no login. |

### Shared components — `components/`

| File | Used by | Role |
|---|---|---|
| `ChatWindow.jsx` | `CustomerChat.jsx`, `WidgetInfo.jsx` | The chat UI itself: message list, input box, "typing" indicator. On submit, calls `chatApi.send(businessId, text, conversationId)`, appends the user bubble optimistically, then the assistant's reply once it comes back; tracks `conversationId` across turns so follow-up messages continue the same thread server-side. This is the one component embodying flow §4 from the architecture doc. |
| `Layout.jsx` | Every `/dashboard/*` route (via `App.jsx`) | Sidebar shell: business name, nav links (Documents/Conversations/Your chat link), "Switch business" button (`clearBusiness()` + redirect to `/`). Wraps an `<Outlet />` for the active page. |
| `StatusBadge.jsx` | `Documents.jsx` | Tiny presentational component — renders a document's status enum as a colored pill (styling in `StatusBadge.css`). |

### API layer — `api/` (the only place that calls the backend)

| File | Exports | Role |
|---|---|---|
| `client.js` | `api.get/post/put` | Thin `fetch` wrapper. Reads `VITE_API_URL` (defaults to `http://localhost:8000`). Auto-sets `Content-Type: application/json` unless the body is `FormData` (file uploads), and normalizes errors by throwing with the backend's `detail` message so every page's `catch (e) { setError(e.message) }` just works. |
| `resources.js` | `businessApi`, `documentsApi`, `chatApi` | One function per backend endpoint, each just building the URL/body and calling `client.js`. This is the single source of truth for "what URLs does the frontend call" — matches `api/router.py` on the backend 1:1. |

No component ever calls `fetch` directly — everything goes through
`resources.js`, which is what makes `client.js`'s error-handling and base URL
consistent everywhere.

---

## End-to-end trace: a single upload, start to finish

1. Owner on `Documents.jsx` picks a file → `handleFileChange` →
   `documentsApi.upload(business.id, file)` (`frontend/src/api/resources.js`)
2. → `POST http://<API>/api/v1/businesses/{id}/documents`, multipart body
3. Backend: `api/router.py` routes it to `documents.py: upload_document`
4. → `IngestionService(session).ingest(...)` (`services/ingestion_service.py`)
5. → `DocumentRepository.create(status=processing)` → `documents` table row
6. → `rag/extraction.py: extract_text` → `rag/chunking.py: chunk_text` →
   `rag/embeddings.py: embed_texts`
7. → loop: `DocumentChunkRepository.create(...)` → `document_chunks` rows
   (with `pgvector` embedding column)
8. → `DocumentRepository.update(status=ready)`
9. → `core/database.py: get_db()` commits the session as the request ends
10. → response bubbles back up through `documents.py` → JSON `DocumentRead`
11. Frontend: `Documents.jsx` calls `refresh()`, re-fetches the list, new
    card appears with a `ready` `StatusBadge`

## End-to-end trace: a single chat turn, start to finish

1. Customer on `CustomerChat.jsx` → `ChatWindow.jsx` → types a message,
   submits → `chatApi.send(businessId, text, conversationId)`
2. → `POST /api/v1/businesses/{id}/chat` `{message, conversation_id}`
3. Backend: `chat.py: chat()` → `RAGService(session)`
4. → `get_or_create_conversation` → `ConversationRepository`
5. → `RAGService.ask(...)`: save user `Message` → `MessageRepository.create`
6. → `rag/embeddings.py: embed_text(user_message)`
7. → `DocumentChunkRepository.similarity_search(business_id, vector, limit=4)`
   — pgvector `cosine_distance` query, scoped to this business only
8. → `rag/prompts.py: build_system_prompt(chunk contents)`
9. → `rag/llm.py: generate_answer(system_prompt, history, user_message)` →
   external LLM API call
10. → save assistant `Message` → `MessageRepository.create`
11. → session commits (`get_db`) → response `{conversation_id, reply}`
12. Frontend: `ChatWindow.jsx` appends the assistant bubble, scrolls into
    view; `conversationId` is retained so the *next* message continues the
    same thread (and shows up later under `Conversations.jsx` /
    `ConversationDetail.jsx` on the owner's dashboard).
