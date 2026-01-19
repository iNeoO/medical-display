# Medical Display

Medical Display is a small monorepo for a hospital task dashboard backend and shared types.
This project is also an experimental attempt to implement search with an LLM.

## Specs

### Backend API

Base URL: `http://localhost:3000`

### Local data source

On startup, the backend imports `apps/backend/src/db/Medical Tasks.json` into a local
SQLite file `medica.db` (created in the backend working directory) if rows are missing.

## Quick start

```bash
pnpm install
pnpm dev:backend
```

Open `http://localhost:3000`.

## LLM setup (Ollama)

The backend expects Ollama to be running locally at `http://127.0.0.1:11434`.

```bash
ollama pull llama3.1
ollama serve
ollama run llama3.1
```

Optional environment overrides:

- `OLLAMA_HOST` (default: `http://127.0.0.1:11434`)
- `OLLAMA_MODEL` (default: `llama3.1`)
