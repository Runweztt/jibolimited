# How this chatbot works

This explains the code in `backend/app`, step by step, in plain language.

## The big picture

A business owner uploads their documents (price list, FAQ, policies, whatever). We
turn those documents into small searchable pieces. Then, when a customer asks the
chatbot a question, we search those pieces for anything relevant, and hand that to
an AI model along with the question, so it can answer using the business's own
information instead of guessing.

Two jobs, in order:

1. **Upload a file → make it searchable** (`ingestion_service.py`)
2. **Ask a question → get an answer** (`rag_service.py`)

## Job 1: Uploading a document

File: `app/services/ingestion_service.py`, called from `app/api/documents.py`.

When someone uploads a file (`POST /businesses/{id}/documents`), this happens:

1. **Save a row for the document** — status starts as `processing`.
2. **Read the text out of the file** — `app/rag/extraction.py`. PDF, Word, and
   plain text files each get read differently, but they all become one long
   string of text.
3. **Split the text into chunks** — `app/rag/chunking.py`. We can't feed a whole
   50-page document to the AI at once, so we cut it into pieces of about 1000
   characters. Each piece overlaps the previous one a bit, so a sentence that
   falls right on the cut doesn't get lost.
4. **Turn each chunk into an embedding** — `app/rag/embeddings.py`. An embedding
   is just a list of numbers that represents what a piece of text *means*.
   Two chunks about similar topics end up with similar numbers, even if they
   don't share any of the same words. We use a small model called
   `all-MiniLM-L6-v2` that runs on our own server, so this doesn't cost
   anything per file and doesn't depend on an outside API.
5. **Save each chunk + its embedding** — `app/repositories/document_repository.py`.
   Stored in a table called `document_chunks`, using Postgres's `pgvector`
   extension, which knows how to store and search these number-lists directly
   in the database.
6. **Mark the document `ready`** (or `failed`, with a reason, if something went
   wrong — like an empty file).

That's it — after this, the business's knowledge is searchable.

## Job 2: Answering a question

File: `app/services/rag_service.py`, called from `app/api/chat.py`.

When a customer sends a message (`POST /businesses/{id}/chat`):

1. **Save the customer's message** to the conversation.
2. **Turn their question into an embedding** — same embedding step as above, so
   the question and the document chunks are comparable.
3. **Search for the closest matching chunks** — `app/repositories/document_repository.py`,
   `similarity_search()`. Postgres compares the question's embedding against
   every chunk's embedding for that business, and returns the closest matches
   (we use the top 4). This comparison is what "RAG" (Retrieval-Augmented
   Generation) means: we *retrieve* relevant text, then *generate* an answer
   using it.
4. **Build the instructions for the AI** — `app/rag/prompts.py`. We take those
   4 matching chunks and put them into a message that tells the AI: "here is
   what you know about this business, only use this, don't make things up."
5. **Ask the AI model** — `app/rag/llm.py`. We send the instructions, the
   matching chunks, the conversation history, and the new question to an AI
   model (like GPT-4o-mini) and get back an answer.
6. **Save the AI's answer** and send it back to the customer.

## Why one business can't see another's data

Every document, chunk, and conversation has a `business_id` column. Every
database query in `app/repositories/` filters by that `business_id`. There's
no way to search or read anything without saying which business you mean —
this is the whole wall that keeps one business's data separate from another's.

There is currently no login system — a business's `id` acts like a password.
Add real authentication before putting this on the public internet.

## Why we search on every single message

Some chatbots have the AI *decide* whether it needs to search before answering
(useful for saying "hi" without wasting a search). This build always searches,
every time, no matter the question. It's simpler code, and searching a few
thousand chunks takes a few milliseconds, so there's no real cost to doing it
every time.

## Files, one more time, all in one list

| File | What it does |
|---|---|
| `app/models/business.py` | One business using the app |
| `app/models/document.py` | An uploaded file, and its text chunks |
| `app/models/conversation.py` | A chat thread and its messages |
| `app/rag/extraction.py` | Reads text out of PDF/Word/text files |
| `app/rag/chunking.py` | Splits text into small pieces |
| `app/rag/embeddings.py` | Turns text into numbers, for search |
| `app/rag/llm.py` | Talks to the AI model |
| `app/rag/prompts.py` | Builds the instructions sent to the AI |
| `app/services/ingestion_service.py` | Runs the whole "upload → searchable" job |
| `app/services/rag_service.py` | Runs the whole "question → answer" job |
| `app/api/documents.py` | The upload endpoint |
| `app/api/chat.py` | The chat endpoint |
