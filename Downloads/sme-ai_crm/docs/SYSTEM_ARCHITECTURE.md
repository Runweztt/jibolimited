# System Architecture — SME AI CRM (RAG Chatbot)

This document describes the system design: how a document goes from "uploaded
file" to "searchable knowledge," how a customer's question becomes an answer,
and how the business owner sees a log of every conversation on their
dashboard. Diagrams are Mermaid — they render directly on GitHub/GitLab or any
Markdown viewer that supports Mermaid.

For a file-by-file breakdown of the code, see `CODEBASE_GUIDE.md`.

---

## 1. High-level architecture

Three moving pieces: a React frontend (two faces — owner dashboard and public
customer chat), a FastAPI backend, and Postgres with `pgvector` as the only
datastore. The backend also talks to two ML components: a local embedding
model (runs in-process, no external call) and a remote LLM (OpenAI-compatible
API — currently Moonshot/Kimi).

```mermaid
flowchart LR
    subgraph Browser
        OwnerUI["Owner Dashboard\n(Documents / Conversations / Widget)"]
        CustomerUI["Customer Chat\n(/chat/:businessId)"]
    end

    subgraph Backend["FastAPI Backend (backend/app)"]
        API["API layer\napi/businesses.py, documents.py, chat.py"]
        SVC["Service layer\ningestion_service.py, rag_service.py"]
        RAG["RAG toolkit\nextraction, chunking, embeddings, prompts, llm"]
        REPO["Repository layer\nrepositories/*.py"]
    end

    DB[("Postgres + pgvector\nbusinesses / documents / document_chunks\nconversations / messages")]
    EMB["Local embedding model\nall-MiniLM-L6-v2 (in-process)"]
    LLM["External LLM API\nOpenAI-compatible (Moonshot/OpenAI)"]

    OwnerUI -- "REST (fetch)" --> API
    CustomerUI -- "REST (fetch)" --> API
    API --> SVC
    SVC --> RAG
    SVC --> REPO
    RAG --> EMB
    RAG --> LLM
    REPO --> DB
```

**Key design fact:** there is no authentication. A `business_id` (UUID) is the
only access control — every table row carries it, and every repository query
filters by it. The frontend stores it in `localStorage` and treats it like a
password. This is intentional for now (see `RAG_PIPELINE.md`), but must change
before this is exposed publicly beyond trusted users.

---

## 2. Data model (entity relationships)

```mermaid
erDiagram
    BUSINESS ||--o{ DOCUMENT : owns
    BUSINESS ||--o{ DOCUMENT_CHUNK : owns
    BUSINESS ||--o{ CONVERSATION : owns
    DOCUMENT ||--o{ DOCUMENT_CHUNK : "split into"
    CONVERSATION ||--o{ MESSAGE : contains

    BUSINESS {
        uuid id PK
        string name
        datetime created_at
    }
    DOCUMENT {
        uuid id PK
        uuid business_id FK
        string filename
        enum status "pending|processing|ready|failed"
        text error_message
    }
    DOCUMENT_CHUNK {
        uuid id PK
        uuid business_id FK
        uuid document_id FK
        int chunk_index
        text content
        vector embedding "384-dim, pgvector"
    }
    CONVERSATION {
        uuid id PK
        uuid business_id FK
        datetime created_at
    }
    MESSAGE {
        uuid id PK
        uuid conversation_id FK
        enum role "user|assistant"
        text content
    }
```

`business_id` is denormalized onto `document_chunks` (not just reached via
`document_id`) specifically so the similarity search query can filter by
business in a single index lookup, without a join.

---

## 3. Flow: uploading a document → making it searchable

Triggered from the **Documents** dashboard page. Runs synchronously — the
HTTP request doesn't return until the file is fully chunked, embedded, and
stored (fine for small-business-sized files; see note in
`ingestion_service.py` about moving this to a background job if files get
large).

```mermaid
sequenceDiagram
    actor Owner
    participant UI as Documents.jsx
    participant API as api/documents.py
    participant Ingest as IngestionService
    participant Extract as rag/extraction.py
    participant Chunk as rag/chunking.py
    participant Embed as rag/embeddings.py (local model)
    participant Repo as DocumentRepository /\nDocumentChunkRepository
    participant DB as Postgres (pgvector)

    Owner->>UI: choose file, click Upload
    UI->>API: POST /businesses/{id}/documents (multipart file)
    API->>Ingest: ingest(business_id, filename, content_type, bytes)
    Ingest->>Repo: create Document (status = processing)
    Repo->>DB: INSERT documents

    Ingest->>Extract: extract_text(filename, content_type, bytes)
    Extract-->>Ingest: raw text (PDF/DOCX/plain-text reader)

    Ingest->>Chunk: chunk_text(text)
    Chunk-->>Ingest: list[str] (~1000 chars, 150-char overlap)

    Ingest->>Embed: embed_texts(chunks)  (batched, one model call)
    Embed-->>Ingest: list[vector] (384-dim each)

    loop each chunk
        Ingest->>Repo: create DocumentChunk(content, embedding, chunk_index)
        Repo->>DB: INSERT document_chunks
    end

    Ingest->>Repo: update Document (status = ready)
    Repo->>DB: UPDATE documents
    Ingest-->>API: Document (ready)
    API-->>UI: 201 Created, document JSON
    UI->>UI: refresh list, show status badge
```

**Failure path:** if extraction/chunking/embedding throws (empty file,
unreadable PDF, etc.), `IngestionService._process` catches it, sets
`status = failed`, and writes a short `error_message` — the document is never
left stuck on `processing`. The Documents page shows this via `StatusBadge`
and the error text.

**Re-upload:** `PUT /businesses/{id}/documents/{document_id}` runs the same
pipeline but first deletes the document's existing chunks
(`delete_for_document`), so a corrected file doesn't leave stale chunks
alongside the new ones.

---

## 4. Flow: customer asks a question → chatbot answers (RAG)

Triggered from `ChatWindow.jsx`, used both on the public `/chat/:businessId`
page and as the dashboard's "preview" on the Widget page.

```mermaid
sequenceDiagram
    actor Customer
    participant UI as ChatWindow.jsx
    participant API as api/chat.py
    participant RAG as RAGService
    participant Embed as rag/embeddings.py
    participant Repo as DocumentChunkRepository
    participant DB as Postgres (pgvector)
    participant Prompt as rag/prompts.py
    participant LLM as rag/llm.py → external LLM API

    Customer->>UI: types a question, hits Send
    UI->>API: POST /businesses/{id}/chat {message, conversation_id?}
    API->>RAG: get_or_create_conversation(business_id, conversation_id)
    RAG->>DB: SELECT / INSERT conversations
    API->>RAG: ask(business_id, conversation, message)

    Note over RAG,DB: user message is saved first,\nbefore any retrieval/LLM call can fail
    RAG->>DB: INSERT messages (role=user)
    RAG->>DB: SELECT messages (conversation history)

    RAG->>Embed: embed_text(message)
    Embed-->>RAG: query vector (384-dim)

    RAG->>Repo: similarity_search(business_id, query_vector, limit=4)
    Repo->>DB: SELECT ... ORDER BY embedding <=> query_vector LIMIT 4\n(cosine distance, filtered by business_id)
    DB-->>RAG: top-4 matching chunks

    RAG->>Prompt: build_system_prompt(chunk texts)
    Prompt-->>RAG: system prompt ("use ONLY this business knowledge...")

    RAG->>LLM: generate_answer(system_prompt, history, message)
    LLM-->>RAG: assistant reply text

    RAG->>DB: INSERT messages (role=assistant)
    RAG-->>API: reply
    API-->>UI: 200 OK {conversation_id, reply}
    UI->>UI: append assistant bubble, scroll into view
```

**Why the retrieval search runs on every message:** rather than have the LLM
decide "do I need to search," the system always searches (top 4 chunks by
cosine distance), every turn. Simpler code path, and a similarity search over
a few thousand rows is fast enough that skipping it isn't worth the added
complexity — see `rag_service.py` / `prompts.py` comments.

**Why the model doesn't hallucinate business facts:** the system prompt
(`BASE_INSTRUCTIONS` in `rag/prompts.py`) explicitly restricts the model to
the retrieved chunks for anything business-specific, and tells it to say "I
don't have that information" rather than invent a price, policy, or phone
number. General chit-chat (greetings) is allowed to be answered normally.

---

## 5. Flow: business owner reviews conversation logs

This is pure read-path — no LLM or embedding calls involved, just querying
what was already saved during flow #4.

```mermaid
sequenceDiagram
    actor Owner
    participant List as Conversations.jsx
    participant Detail as ConversationDetail.jsx
    participant API as api/chat.py
    participant ConvRepo as ConversationRepository
    participant MsgRepo as MessageRepository
    participant DB as Postgres

    Owner->>List: open "Conversations" tab
    List->>API: GET /businesses/{id}/conversations
    API->>ConvRepo: list_for_business(business_id)
    ConvRepo->>DB: SELECT ... WHERE business_id = ? ORDER BY created_at DESC
    DB-->>List: conversation list (id, created_at)

    Owner->>Detail: click a conversation row
    Detail->>API: GET /businesses/{id}/conversations/{conversation_id}
    API->>ConvRepo: get_for_business(business_id, conversation_id)
    Note over ConvRepo,DB: id + business_id checked together — ownership check
    ConvRepo->>DB: SELECT ... WHERE id=? AND business_id=?
    API->>MsgRepo: list_for_conversation(conversation_id)
    MsgRepo->>DB: SELECT ... WHERE conversation_id=? ORDER BY created_at ASC
    DB-->>Detail: full message thread
    Detail->>Owner: renders chat bubbles, user vs assistant
```

The `get_for_business` check (id **and** business_id in the same `WHERE`) is
what stops one business from reading another's conversation just by guessing
a conversation UUID — there's no separate auth layer doing this, it's baked
into every repository query.

---

## 6. Document lifecycle (state machine)

```mermaid
stateDiagram-v2
    [*] --> pending: Document row created
    pending --> processing: ingest() starts
    processing --> ready: text extracted, chunked,\nembedded, and stored
    processing --> failed: extraction/chunking/embedding\nthrew (empty file, bad PDF, etc.)
    ready --> processing: re-upload (PUT .../documents/{id})\nold chunks deleted first
    failed --> processing: re-upload
```

In practice `pending` is nearly instantaneous — `IngestionService.ingest()`
creates the row already flagged `processing` and immediately calls
`_process`, since the whole pipeline runs inline within the HTTP request.

---

## 7. Deployment topology (current: docker-compose)

```mermaid
flowchart TB
    subgraph Docker Compose
        api["api container\nuvicorn --reload\nFastAPI + RAG pipeline + embedding model"]
        pg[("postgres container\npgvector/pgvector:pg16")]
        api -- "asyncpg, port 5432" --> pg
    end
    browser["Browser\n(Vite dev server, separate process)"] -- "port 8000\nVITE_API_URL" --> api
```

Only two services run today (`api`, `postgres`) — the `docker-compose.yml`
in the repo root defines exactly these. The frontend runs separately (Vite
dev server / static build) and talks to the API over `VITE_API_URL`. Alembic
migrations run automatically on container start (`alembic upgrade head`)
before uvicorn boots.

> Note: earlier container names like `worker-notifications`,
> `worker-analytics`, `worker-voice`, `worker-crm`, `worker-ingestion`, and
> `redis` seen in `docker compose up` output are **orphans** from a prior,
> more complex compose file — they are not part of the current architecture.
> Run `docker compose up --remove-orphans` to clean them up.

---

## 8. External dependencies and where they plug in

| Dependency | Used by | Purpose |
|---|---|---|
| Postgres + `pgvector` extension | `core/database.py`, all repositories | Single datastore for relational rows *and* vector similarity search (`cosine_distance`) |
| `sentence-transformers` (`all-MiniLM-L6-v2`) | `rag/embeddings.py` | Turns text into 384-dim vectors, runs locally in the API container — no external API call, no per-request cost |
| OpenAI-compatible LLM API (`llm_api_base` / `llm_api_key` / `llm_model` in `.env`) | `rag/llm.py` | Generates the actual chat reply; works with OpenAI, Moonshot/Kimi, or anything that mirrors the OpenAI chat-completions schema |
| Alembic | `backend/alembic/` | Schema migrations, applied automatically on container start |

Swapping the LLM provider is a config-only change (`llm_api_base`,
`llm_api_key`, `llm_model` in `.env`) — no code change, as long as the
provider speaks the OpenAI chat-completions format. (Caveat: some providers,
like Moonshot's Kimi models, reject non-default `temperature` values — see
`rag/llm.py`.)
