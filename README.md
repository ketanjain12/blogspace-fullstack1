# BlogSpace — Full-stack Blogging Platform

A React + Vite + Tailwind frontend and Express + MySQL backend. The codebase is organized by feature and responsibility so another developer can navigate it without relying on a single large component or server file.

## Architecture

### Frontend (`frontend/src`)
- `components/`: reusable UI (header, footer, post card, ad components)
- `layouts/`: shared page layout and route protection
- `pages/`: route-level screens (home, post detail, auth, admin dashboard)
- `context/`: authentication state and actions
- `hooks/`: reusable data hooks
- `services/`: Axios client and request interceptor
- `styles.css`: global and responsive styles

### Backend (`backend/src`)
- `config/`: environment validation and MySQL connection/schema initialization
- `models/`: database access layer (User, Post, Ad)
- `services/`: business logic and validation
- `controllers/`: HTTP request/response handling
- `routes/`: endpoint definitions
- `middleware/`: authentication, authorization, errors
- `app.js`: Express app composition
- `server.js`: startup and database initialization

## Features
- User registration, login, logout and persisted JWT session
- Public published-post feed, search/category filtering and post details
- Admin dashboard, post CRUD, user activation/deletion
- MySQL tables created automatically on API startup (`users`, `posts`, `ads`)
- Demo admin and sample posts seeded only when missing
- Three responsive Google Publisher Tag test-ad placements on the homepage

## Requirements
- Node.js 20+
- MySQL 8+ (or compatible MySQL service)

## Local setup
1. Create a database: `CREATE DATABASE blogspace;`
2. Backend: `cd backend`, copy `.env.example` to `.env`, fill MySQL credentials and a strong `JWT_SECRET`.
3. Run `npm install` then `npm run dev`. Schema and initial demo records are initialized before the API listens.
4. In a second terminal: `cd frontend`, copy `.env.example` to `.env`, run `npm install` then `npm run dev`.
5. Open `http://localhost:5173`.

Default local admin (change before production): `admin@blogspace.local` / `ChangeMe_Admin_123!`.

## API overview
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET /api/posts`, `GET /api/posts/:slug`
- `GET /api/ads`
- Admin (Bearer JWT + admin role): `GET /api/admin/stats`, `GET/POST /api/admin/posts`, `PUT/DELETE /api/admin/posts/:id`, `GET/PUT/DELETE /api/admin/users/:id` (GET users is `/api/admin/users`)
- Health: `GET /api/health`

## Railway deployment
1. Create a Railway project and add a MySQL service.
2. Add a backend service from this GitHub repository. Set Root Directory to `/backend`.
3. Build command: leave blank (Railpack auto-detects Node and installs dependencies).
4. Start command: `npm start`.
5. Set backend variables: `NODE_ENV=production`, `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` from Railway's MySQL service references, `JWT_SECRET`, `JWT_EXPIRES_IN=7d`, `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `CLIENT_URL` (your exact Vercel origin). Do not expose DB credentials in frontend variables.
6. Generate a public domain for the backend and verify `/api/health`.

## Vercel deployment
1. Import the repository into Vercel.
2. Set Root Directory to `frontend`, Framework Preset to Vite, Build Command `npm run build`, Output Directory `dist`.
3. Add `VITE_API_URL=https://YOUR-RAILWAY-DOMAIN/api`.
4. Deploy. Copy the final Vercel origin into Railway's `CLIENT_URL` and redeploy the backend.

## Google GPT test ads
The homepage includes three responsive Google Publisher Tag test placements using Google's sample inventory path `/6355419/Travel/Europe`. These are test ads only, not monetized AdSense inventory. No publisher account is needed for this test implementation. Replace the sample path only when a real publisher/ad inventory is available and authorized.

## Engineering notes
- Never commit `.env` files or secrets.
- Do not trust a client-supplied role; authorization is enforced by backend middleware and the database user role.
- Database initialization is idempotent (`CREATE TABLE IF NOT EXISTS` and insert-if-missing seed behavior).
- This refactor preserves the existing API response shapes and database table names for deployment compatibility.


## Code style and API response conventions

The project uses a consistent two-space indentation, semicolons, single quotes, and a 100-character print width. The shared `.prettierrc.json` and `.editorconfig` define the formatting rules.

Run formatting from either application directory:

```bash
# Backend
cd backend
npm install
npm run format
npm run format:check

# Frontend (from the project root in a second terminal)
cd frontend
npm install
npm run format
npm run format:check
```

API status codes are used consistently: `200` for successful reads/updates/deletes, `201` for resource creation, `400` for invalid input, `401` for unauthenticated requests, `403` for insufficient permissions, `404` for missing resources/routes, `409` for duplicate records, and `500` for unexpected server errors. Existing response keys (`posts`, `post`, `user`, `token`, `stats`, and `users`) are retained for frontend compatibility.
