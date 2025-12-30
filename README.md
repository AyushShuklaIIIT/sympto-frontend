# Sympto Frontend (Web App)

This folder contains the **React + Vite** single-page application (SPA) for the Sympto Health Assessment Platform.

## Responsibilities

- User-facing UI (Home, Auth, Assessment, Dashboard)
- Handles authentication state in the browser (JWT stored in localStorage)
- Calls the backend API for users/assessments/consent
- Sends a best-effort warm-up request to reduce external AI cold starts

## Tech Stack

- React (Vite)
- React Router
- React Hook Form + Zod
- Tailwind CSS

## Getting Started (Local)

### Install

```bash
cd sympto
npm install
```

### Configure API URL

The app expects a backend API base URL (including `/api`).

- Default (no config): `http://localhost:5000/api`
- Recommended: set `VITE_API_URL` in your environment.

Example (PowerShell):

```powershell
$env:VITE_API_URL="http://localhost:5000/api"
npm run dev
```

### Run

```bash
npm run dev
```

Frontend dev server:

- `http://localhost:5173`

## Scripts

- `npm run dev` – start Vite dev server
- `npm run build` – build production assets
- `npm run preview` – preview the production build
- `npm test` – run tests (Vitest)
- `npm run lint` / `npm run lint:fix`
- `npm run format`

## Notes

- On app load, the frontend calls `GET /api/ai/health` (via the backend) to wake any sleeping external AI service hosted on Render.
- Protected routes (like `/dashboard` and `/assessment`) are guarded via `AuthGuard`.

## More Documentation

See the repo-level guide: [../DOCUMENTATION.md](../DOCUMENTATION.md)
