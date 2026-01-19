# medical-display Backend

```bash
pnpm install
pnpm run dev
```

```bash
open http://localhost:3000
```

## Ollama IA Setup

This service uses Ollama locally via HTTP at `http://127.0.0.1:11434`.

### Install model

```sh
ollama pull llama3.1
```

### Run Ollama

Start the Ollama server (if it is not already running):

```sh
ollama serve
```

Launch the model once to verify it is available:

```sh
ollama run llama3.1
```

### Configuration

Optional environment overrides:

- `OLLAMA_HOST` (default: `http://127.0.0.1:11434`)
- `OLLAMA_MODEL` (default: `llama3.1`)
