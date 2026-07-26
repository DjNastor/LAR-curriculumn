# Lukulu Academy Curriculum Generator

A React and Express application for building project-based music production curricula for Lukulu Academy & Recordings. It includes presets for Afro House, Amapiano, EDM, DAW workflows, music business, export, Google Calendar/Drive integrations, and optional Gemini-powered generation and refinement.

## Requirements

- Node.js 20+ (or Bun)
- A Gemini API key for AI generation (`GEMINI_API_KEY`)

## Local development

```bash
bun install
cp .env.example .env
# Add GEMINI_API_KEY to .env
bun run dev
```

The app runs on port `3000` by default. Set `PORT` to use another port. `GET /api/health` reports whether the AI key is configured without exposing it.

## Verification

```bash
bun run lint
bun run build
```

The app deliberately keeps the Gemini key on the Express server; do not put it in client-side Vite environment variables or commit `.env` files.

## Project structure

- `src/components/` — curriculum editor, viewer, export, integrations, and groove player
- `src/data/` — curriculum presets and groove patterns
- `src/lib/` — Google integration helpers
- `server.ts` — Express API and Gemini proxy

## Continuous integration

GitHub Actions runs the locked Bun install, TypeScript check, and production build for pushes and pull requests targeting `main`.
