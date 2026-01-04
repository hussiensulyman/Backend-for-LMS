# Module template (Modular Monolith)

Structure:

- index.js -> export `{ router, service }` (minimal public interface)
- routes/index.js -> express.Router() (mount endpoints)
- services/<name>Service.js -> business logic; used by controllers
- controllers/<name>Controller.js -> thin controllers calling services
- models/<name>Repo.js -> repository (Prisma)
- tests/ -> unit tests for service + integration test skeleton for routes

Repository template notes:
- `model-repo.js` is a Prisma-focused example. Replace the placeholder `model` with your Prisma model name (for example, `course`).
- The template requires `core/prisma.js` (the Prisma client wrapper). Example methods include `create`, `findById`, `findMany`, `update`, and `delete`.

Use this template to scaffold new modules and to migrate existing ones. Prefer Prisma (MySQL) as the data layer.
