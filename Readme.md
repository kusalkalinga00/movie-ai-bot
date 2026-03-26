# Movie Chatbot Monorepo

This repository hosts two independent applications in a single codebase:

- `movie-ai-backend`: NestJS API service
- `movie-ai-frontend`: Next.js web application

## Monorepo Model

This is a minimal monorepo baseline.

- Each app keeps its own `package.json` and `pnpm-lock.yaml`.
- Dependency installation and scripts are run per app directory.
- Shared repository hygiene is handled by root and app-level `.gitignore` files.

## Quick Start

Backend:

```bash
cd movie-ai-backend
pnpm install
pnpm run start:dev
```

Frontend:

```bash
cd movie-ai-frontend
pnpm install
pnpm run dev
```

## Notes

- Do not commit real secrets. Use local `.env` files and provide `.env.example` files for templates.
- Root-level and app-level `.gitignore` files are configured to keep local and generated files out of git.
