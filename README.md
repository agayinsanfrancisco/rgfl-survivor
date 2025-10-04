# RGFL Survivor Fantasy League

Comprehensive notes for developing, configuring, and deploying the RGFL Survivor Fantasy League application. This document condenses the previous setup, deployment, and checklist markdown files into a single reference.

---

## 1. Quick Start

### Unix/Linux/macOS
```bash
./setup.sh
```

### Windows
```cmd
setup.bat
```

### What the script does
- Installs dependencies
- Generates the Prisma client
- Applies database schema and seeds baseline data
- Builds both client and server bundles

---

## 2. Manual Local Setup

### Prerequisites
- Node.js 18+
- npm
- Git
- Access to a PostgreSQL database

### Step-by-step
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Generate Prisma client**
   ```bash
   npx prisma generate
   ```
3. **Configure environment variables** – create a `.env` (never commit it):
   ```env
   DATABASE_URL=postgresql://USER:PASSWORD@HOST/DATABASE
   JWT_SECRET=<openssl rand -hex 64>
   CLIENT_ORIGIN=http://localhost:5000
   PORT=5050
   ENABLE_SETUP_ENDPOINT=false
   ```
4. **Apply schema** (destroys existing data when `--force-reset` is used):
   ```bash
   npx prisma db push --force-reset
   ```
5. **Seed sample data**
   ```bash
   npm run db:seed
   ```
6. **Run in development mode**
   ```bash
   npm run dev
   ```

### Available npm scripts
- `npm run dev` – Vite + server in watch mode
- `npm run build` – Builds client then server
- `npm run build:client` – Vite production build
- `npm run build:server` – TypeScript -> `dist/server`
- `npm run db:seed` – Seeds default league, users, weeks, and castaways
- `npm start` – Runs compiled server (`dist/server/index.js`)

---

## 3. Environment Variables

| Variable | Description | Required | Notes |
|----------|-------------|----------|-------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ | Provided automatically on Render when linked to the managed DB |
| `JWT_SECRET` | Used to sign authentication tokens | ✅ | Rotate whenever leaked; 64+ char random hex recommended |
| `CLIENT_ORIGIN` | Comma-separated list of allowed frontends for CORS | ✅ | e.g. `http://localhost:5000,https://rgfl-survivor.onrender.com` |
| `PORT` | Server port | ⛔️ (defaults to 5050) | Override when Render assigns a port |
| `ENABLE_SETUP_ENDPOINT` | Allows `/api/setup` reseeding | ⛔️ | Leave `false`/unset in production |

> **Tip:** Load `.env` into each shell with `export $(grep -v '^#' .env | xargs)` or use `direnv`.

---

## 4. Database & Seed Data

The Prisma schema defines:
- **User** – Authentication, admin flag, relations to picks and scores
- **League** – Single league per deployment
- **Castaway** – Contestants plus weekly results and picks
- **Week** – Episode weeks and active-week flag
- **Pick** – User selections per week
- **WeeklyResult** – Points awarded per castaway per week
- **Score** – Aggregated user scores per week

`npm run db:seed` creates:
- Default league (`RGFL Survivor Fantasy League 2024`)
- 18 Survivor 49 castaways (Kele, Hina, Uli)
- 13 weeks (week 3 active by default)
- Admin user: `admin@rgfl.com` / `admin123`
- Sample user: `user@rgfl.com` / `user123`

---

## 5. JWT-only Authentication

- Login/signup endpoints (`/api/auth/login` & `/api/auth/signup`) issue JWTs.
- Tokens are set as httpOnly cookies and echoed in responses for SPA storage.
- Guarded routes use the Authorization header or cookie token; `express-session` is no longer used.
- To force logout everywhere, rotate `JWT_SECRET` and redeploy.

---

## 6. Deploying to Render

### One-time database creation
1. Log in to [Render](https://dashboard.render.com).
2. **New ➜ PostgreSQL**
   - Name: `rgfl-db`
   - Plan: *Free*
   - Database: `rgfl_db`
   - User: `rgfl_user`
3. Save the generated connection string.

### Web service setup
1. **New ➜ Web Service** and select the GitHub repo.
2. Configure:
   - Name: `rgfl-survivor`
   - Environment: `Node`
   - Plan: *Free*
   - Branch: `main`
3. Build & deploy commands:
   - Build: `npm install && npm run build && npx prisma migrate deploy && npm run db:seed`
   - Start: `npm start`
   - Health check path: `/`
4. Environment variables:
   ```
   NODE_ENV=production
   DATABASE_URL=<use linked database>
   JWT_SECRET=<openssl rand -hex 64>
   CLIENT_ORIGIN=https://rgfl-survivor.onrender.com
   PORT=5050
   ```
5. Trigger the first deploy.

### Deployment checklist
- [ ] Database resource created and reachable
- [ ] Environment variables saved (watch for trailing spaces)
- [ ] Build completes without warnings
- [ ] Health check returns 200
- [ ] `/api/auth/login` and `/api/castaways` respond correctly
- [ ] Frontend renders over HTTPS

### Post-deploy verification
1. Login with the seeded admin account and confirm the dashboard loads.
2. Visit protected routes (Weekly Picks, Leaderboard, Admin pages).
3. Confirm `/api/picks/me` respects the active week.
4. Check Render logs for startup errors or missing environment warnings.

---

## 7. Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Build fails on Render | Missing dependency or TypeScript error | Check build logs, run `npm run build` locally |
| 503 from Prisma | DB unavailable or wrong `DATABASE_URL` | Verify database status and credentials |
| CORS errors in browser | `CLIENT_ORIGIN` missing or incorrect | Add the frontend URL (including protocol) |
| Users stay logged in after secret leak | `JWT_SECRET` not rotated | Generate a new secret, update env vars, redeploy |
| Static files outdated | Forgot to rebuild | Run `npm run build` before deployment |

---

## 8. Support & Next Steps

- Review server logs on Render for runtime diagnostics.
- For reseeding in production, temporarily set `ENABLE_SETUP_ENDPOINT=true`, call `POST /api/setup`, then revert to `false`.
- Keep dependencies patched (`npm outdated`, `npm audit fix`).
- Consider adding automated tests with Vitest (`npm run test`) before future feature deployments.

**You’re ready to ship Survivor fantasy updates! 🏆**
