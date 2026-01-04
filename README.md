# Backend for Learning Management System (LMS) ✅

A modular, production-ready backend for an LMS built with Node.js and Express. The repository follows a modular-monolith architecture and uses Prisma (MySQL) as the **primary and supported** data layer for the project.

---

## Table of contents

- About
- Key features
- Architecture
- Getting started
  - Prerequisites
  - Environment variables
  - Local development
  - Running tests
- Modules & conventions
- Payments (Stripe)
- Videos & media notes
- Contributing

---

## About

This backend provides APIs for managing users, courses, lessons, assignments, quizzes, forums, notifications, and media (videos). It is organized as a modular-monolith so each feature lives in its own self-contained module under `modules/` with its own routes, controllers, services, models, and tests.

---

## Key features

- User authentication and RBAC (Admin, Instructor, Student)
- Course, lesson, and enrollment management
- Assignments, quizzes, and progress tracking
- Forum and notifications
- Payment & subscription support (provider-agnostic, Stripe-first)
- Video hosting support with timestamped comments and hooks for real-time chat
- Unit and integration test scaffolding with CI in mind

---

## Security & validation updates (latest)

- Rate limiting: register/login are limited to 20 requests per 15 minutes per IP; payment intent + subscription endpoints are limited to 60 requests per 5 minutes per IP.
- RBAC tightened: course/lesson/resource/assignment creation and notification publishing require `admin|instructor`; assignment submissions and quiz submissions require `student`; quiz creation requires `admin|instructor`; forum posts now require authentication.
- Payments: payment intent requires a positive integer `amount` (smallest currency unit); subscriptions require `priceId`; webhooks reject requests missing the `Stripe-Signature` header.
- Videos: comments use the `text` field (not `content`); `timestamp` is optional but must be a non-negative integer if provided.
- Assignments: creation requires `course` and `title`; submission requires `file`; 404s return `error: not_found` when an assignment is missing.
- Quizzes: creation requires a non-empty `questions` array; submissions require an `answers` array; missing quizzes return `error: not_found`.

---

## Architecture

- Modular Monolith: feature modules under `modules/<feature>/` (controllers, routes, services, models, tests)
- Core infrastructure in `core/` (app factory, logger, DB wrapper, helpers)
- Prisma as primary ORM (MySQL recommended). `core/prisma.js` provides the Prisma client wrapper.
- Payment provider abstraction in `core/payments.js` (providers live at `core/payments-provider-<name>.js`)

---

## Getting started

### Prerequisites

- Node.js v16+ (or current LTS)
- MySQL server (local or remote) for Prisma migrations and CI
- Stripe CLI for local webhook testing (if testing payments)

### Environment variables

Create a `.env` file (or set env vars in your environment). Typical variables:

- `DATABASE_URL` — MySQL connection string (required)
- `NODE_ENV` — development|test|production
- `PORT` — server port (default 5000)
- `PAYMENT_PROVIDER` — `stripe` (default)
- `STRIPE_SECRET` — Stripe secret key
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook signing secret
- `JWT_SECRET` — secret for auth tokens

### Local development

Install dependencies, generate Prisma client, run migrations and seed data:

```bash
# install deps
npm install

# generate Prisma client
npm run prisma:generate

# create and apply migrations (ensure DATABASE_URL is set)
npm run prisma:migrate

# optional: seed the database
npm run seed

# start server (dev)
npm run dev
```

Notes:

- Server exports an app factory (`core/app.js`) and only starts when `server.js` is executed directly — this makes testing and integration easier.

### Running tests

- Unit tests: `npm test`
- Integration tests: these should run against a test database (run Prisma migrate + seed against a test DB prior to running tests in CI).

CI tip: in your pipeline run `npm ci`, `npm run prisma:generate`, `npm run prisma:migrate`, `npm run seed`, then `npm test`.

---

## Modules & conventions

- modules/ — each module should contain `controllers/`, `routes/`, `services/`, `models/`, and `tests/`.
- Expose a router (or object with `router` property) from `modules/<name>/index.js`. The app auto-registers modules and mounts them at `/api/<name>`.
- A module template is available at `templates/module-template/` that provides a starting point and test skeletons.

---

## Payments (Stripe-first)

Payments are implemented via a provider abstraction:

- `core/payments.js` loads a provider based on `PAYMENT_PROVIDER` (defaults to `stripe`).
- Stripe provider implementation lives at `core/payments-provider-stripe.js` and exposes `createPaymentIntent`, `createSubscription`, and `verifyWebhook`.
- Webhook endpoint: `POST /api/payments/webhook` — the app captures the raw request body for signature verification.

Required env vars for Stripe: `STRIPE_SECRET`, `STRIPE_WEBHOOK_SECRET`, and optionally `PAYMENT_PROVIDER=stripe`.

Testing webhooks locally:

1. Ensure a running local server with a reachable port (e.g., 5000).
2. Use the Stripe CLI: `stripe listen --forward-to localhost:5000/api/payments/webhook`.
3. Trigger test events and assert webhook handling in `modules/payments/tests`.

---

## Videos & media notes

- The `videos` module supports storing video metadata and timestamped comments (in-video annotations).
- Store large media files in an object store (S3-compatible) and keep references in the DB.
- For large-media processing (transcoding, thumbnails), offload to background workers (e.g., Redis + BullMQ).
- Real-time chat can be added via Socket.IO or a pub/sub layer later.

---

## Contributing

- Follow the module template for new features.
- Add unit tests and, where appropriate, integration tests that run against a test DB.
- Open issues and PRs with clear descriptions and a test demonstrating the change.

## Documentation

- `docs/API.md` — Human-readable, detailed API reference
- `docs/openapi.yaml` — Machine-readable OpenAPI 3.0 spec
- `docs/swagger.html` — Swagger UI (served at `/api/docs` when the app is running)
- `docs/postman-collection.json` — Postman collection generated from the API
- `docs/ENV.md` — Environment variables and examples
- `docs/WEBHOOKS.md` — Webhook setup and testing (Stripe)
- `docs/DEVELOPMENT.md` — Development guide, tests, and module conventions

> Tip: Open `docs/swagger.html` in your browser to view the interactive Swagger UI (it reads `docs/openapi.yaml` from the repo).
---
Happy building! ⚡️

## **Module-based structure (Modular Monolith)**

The project has been refactored into a modular-monolith architecture to improve encapsulation and make it easier to add features.

- modules/ — feature modules (each contains its own `controllers/`, `routes/`, `models/`, `tests/`)
- core/ — shared infra (app factory, logger, db, middleware wrappers)
- models/ — compatibility wrappers (re-export module models)

Database migration note:

This project now uses **Prisma** as the primary SQL ORM. Prisma provides a type-safe client plus a migration system (`prisma migrate`). If you want to run migrations and seed the database locally:

- Ensure `DATABASE_URL` is set in your environment (MySQL connection string)
- Run `npm install` then `npm run prisma:generate`
- Run `npm run prisma:migrate` to apply migrations
- Run `npm run seed` to create initial data

How to add a new module (quick):

1. Create `modules/<name>/` with `controllers/`, `routes/`, `models/`.
2. Export routes (and optionally a service) from `modules/<name>/index.js` (recommended: `module.exports = { router: require('./routes'), service: require('./services/<name>Service') }`).
3. The app auto-registers modules and mounts them at `/api/<name>` (it accepts either a router directly or an object with `router`).
4. Add module tests inside `modules/<name>/tests` and run `npm test`.

Notes: Keep shared utilities in `core/` and prefer module-local models where appropriate.

Module Template: A reusable module template is available at `templates/module-template/` (includes example `routes`, `service`, `model-repo`, and test skeletons). Use it when adding or migrating modules.

Note: Sequelize and Umzug were removed in favor of Prisma. Legacy Sequelize helpers were replaced with safe stubs (see `core/sql.js`).

