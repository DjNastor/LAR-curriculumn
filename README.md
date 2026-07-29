# Lukulu Academy Curriculum Generator

React, Vite, and Express app for building project-based music-production curricula for Lukulu Academy & Recordings. Includes Afro House, Amapiano, EDM, DAW, music-business, Google Calendar/Drive, and Gemini generation features.

## Requirements

- Node.js 24.x (or Bun 1.2.20)
- `GEMINI_API_KEY` for AI generation

## Local development

```bash
bun install --frozen-lockfile
cp .env.example .env
# Add GEMINI_API_KEY to .env
bun run dev
```

The app runs on port `3000`. `GET /api/health` reports AI configuration without exposing the key.

## Verification

```bash
bun run lint
bun run build
```

## Deployment

The repository targets Node.js 24.x through `.nvmrc`, `package.json`, and `vercel.json`. Add `GEMINI_API_KEY` in Vercel Project Settings → Environment Variables. Never prefix it with `VITE_`, since Vite exposes `VITE_*` values to the browser.

Vercel serves the Vite frontend from `dist` and uses `api/index.ts` as the Node 24 serverless entry point. `VITE_API_URL` is optional and should remain empty when frontend and API share this Vercel project.

For Google Calendar/Drive, authorize the production domain in Firebase and Google Cloud OAuth settings and enable the requested APIs/scopes.

## Security

Gemini credentials remain server-side. AI endpoints enforce request-size validation and a lightweight per-instance limit of 20 requests per minute per IP. Use a shared limiter such as Upstash for strict multi-instance limits.
