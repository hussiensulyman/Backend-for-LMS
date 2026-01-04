# Webhooks (Stripe)

This document explains how to set up and test Stripe webhooks for the LMS backend.

Why raw body matters

- Stripe signs webhook payloads using a secret. To verify the signature you must use the raw request body exactly as received and the `Stripe-Signature` header.
- The application captures the raw body for `/api/payments/webhook` to enable verification.
- Requests missing the `Stripe-Signature` header are rejected with a `400 validation_error`.

Environment

- `STRIPE_SECRET` — Stripe API secret key (used by the provider implementation)
- `STRIPE_WEBHOOK_SECRET` — Signing secret for webhook verification

Local testing (Stripe CLI)

1. Start your local server: `npm run dev` (default port 5000).
2. Run the Stripe CLI to forward events:

```bash
stripe listen --forward-to localhost:5000/api/payments/webhook
```

3. Trigger a test event:

```bash
stripe trigger payment_intent.succeeded
```

4. Check your server logs and DB for payment handling.

Writing tests for webhooks

- Unit: mock `core/payments-provider-stripe.js` and assert `verifyWebhook` gets called with raw body and header.
- Integration: create a test that creates a signed payload using `stripe.webhooks.constructEvent(payload, secret, signatureHeader)` and POSTs it to `/api/payments/webhook` with the `Stripe-Signature` header.

Security notes

- Do not log full webhook payloads in production (they may contain PII or sensitive data).
- Verify signatures for all events you depend on.

Troubleshooting

- If verification fails, confirm you forwarded the correct webhook secret and used the Stripe CLI's signature for the forwarded event.