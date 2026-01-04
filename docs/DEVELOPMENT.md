# Development guide

Overview

- The project uses a modular-monolith structure. Each feature lives in `modules/<feature>`.
- Prisma is the primary ORM (MySQL). Use `core/prisma.js` to access the Prisma client.

Quickstart

```bash
# install deps
npm install

# generate Prisma client
npm run prisma:generate

# create and apply migrations (ensure DATABASE_URL is set)
npm run prisma:migrate

# seed (optional)
npm run seed

# start dev server
npm run dev
```

Running tests

- Unit tests: `npm test` (Jest)
- Integration tests: create a test database (`TEST_DATABASE_URL`) and run migrations + seed against it before running the suite.
- Tests import the app factory (`core/app.js`) — server does not auto-start when required.

Adding a module

1. Copy `templates/module-template/` into `modules/<name>/`.
2. Implement `routes/`, `controllers/`, `services/`, `models/` using the repository template in `templates/module-template/model-repo.js` (Prisma). Replace the placeholder `model` in the template with your Prisma model name (e.g., `course`) and adapt fields accordingly.
3. Export a router (or `{ router }`) from `modules/<name>/index.js` and the app will auto-register it.

Code style & linting

- Consider adding ESLint and Prettier. I can add a configuration and run autofix as a follow-up.

CI / PR checklist

- Run `npm ci` and `npm run prisma:generate` as part of CI
- Run migration & seed steps on a managed test database prior to integration tests
- Run `npm test` and ensure coverage thresholds (optional)

Notes

- Do not run migrations against production without review and backups.
- If you'd like, I can add GitHub Actions CI templates to run migrations and tests in a disposable environment (requires test DB credentials in secrets).