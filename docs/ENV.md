# Environment variables

This file documents common environment variables used by the backend.

Required

- `DATABASE_URL` — MySQL connection string in the format `mysql://user:pass@host:port/dbname` (used by Prisma).
- `JWT_SECRET` — Secret used to sign JWT tokens.

Payments (Stripe)

- `PAYMENT_PROVIDER` — `stripe` (default)
- `STRIPE_SECRET` — Stripe secret API key
- `STRIPE_WEBHOOK_SECRET` — Signing secret for webhook verification

App / runtime

- `NODE_ENV` — `development|test|production`
- `PORT` — Port the server listens on (default 5000)

Optional / Testing

- `TEST_DATABASE_URL` — a separate database URL for integration tests

Example `.env` (do not commit secrets):

```bash
DATABASE_URL="mysql://user:pass@localhost:3306/lms_dev"
JWT_SECRET="replace_this_with_a_strong_secret"
PAYMENT_PROVIDER=stripe
STRIPE_SECRET=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
PORT=5000
```

Security note

- Keep secrets out of version control and rotate keys on a schedule. Consider using a secrets manager (AWS Secrets Manager, Azure Key Vault, HashiCorp Vault) in production.