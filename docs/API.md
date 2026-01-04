# API Reference — Detailed

This reference documents the main HTTP endpoints, authentication, common request/response shapes, and error formats.

---

## Authentication

### POST /api/auth/register

- Purpose: Create a new user
- Body (application/json):
  - `email` (string, required)
  - `password` (string, required)
  - `name` (string, optional)
  - `role` (string, optional, one of: `student`, `instructor`, `admin`)
- Responses:
  - **201 Created**: `{ id, email, name, role }`
  - **400 Bad Request**: `{ error: "validation_error", details: { field: msg } }`
- Rate limit: 20 requests per 15 minutes per IP.

### POST /api/auth/login

- Purpose: Authenticate user
- Body: `{ email, password }`
- Responses:
  - **200 OK**: `{ token: "<jwt>", user: { id, email, role } }`
  - **401 Unauthorized**: `{ error: "invalid_credentials" }`
- Rate limit: 20 requests per 15 minutes per IP.

---

## Common

### Headers & Auth

- Use `Authorization: Bearer <token>` for protected endpoints.
- All JSON requests should set `Content-Type: application/json`.

### Pagination

- Common query params: `page` (default 1), `limit` (default 20)
- Response page metadata: `{ data: [...], meta: { page, limit, total } }`

---

## Courses

### GET /api/courses

- Query: `page`, `limit`, `q` (search)
- **200 OK**: `{ data: [Course], meta }`

### GET /api/courses/:id

- **200 OK**: `Course`
- **404 Not Found**: `{ error: "not_found" }`

### POST /api/courses

- Auth: `Instructor` or `Admin`
- Body: `{ title (string), description (string), published (boolean) }`
- **201 Created**: `Course`
- **403 Forbidden**: `{ error: "forbidden" }`

### PUT /api/courses/:id

- Auth: `Instructor` or `Admin`
- **200 OK**: Updated Course

### POST /api/courses/enroll

- Auth: `Student`
- Body: `{ code (string) OR courseId (string) }`
- **200 OK**: `{ message: "Enrollment successful", enrollment }`
- **400/403** on invalid code or already enrolled

---

## Payments

### POST /api/payments/create-payment-intent

- Auth: User
- Rate limit: 60 requests per 5 minutes per IP.
- Body: `{ amount (integer, required, >0, smallest currency unit), currency (string, optional, 3-letter), metadata (object, optional; userId is auto-attached) }`
- **200 OK**: `{ clientSecret, paymentIntentId }`
- **400 Bad Request**: `{ error: "validation_error", message: "amount must be a positive integer (smallest currency unit)" }`

### POST /api/payments/subscribe

- Auth: User
- Rate limit: 60 requests per 5 minutes per IP.
- Body: `{ priceId (string, required), customerId (string, optional) }`
- **200 OK**: `{ subscriptionId, status }`
- **400 Bad Request**: `{ error: "validation_error", message: "priceId is required" }`

### POST /api/payments/webhook

- Purpose: Receive payment provider webhooks (Stripe)
- Note: The server expects the raw request body and `Stripe-Signature` header to verify the event
- Responses:
  - **200 OK**: `{ received: true, type: "<event type>" }`
  - **400 Bad Request**: invalid signature or missing `Stripe-Signature`

---

## Video module

### POST /api/videos

- Auth: Instructor
- Body: `{ title, description, sourceUrl, metadata }`
- **201 Created**: Video object

### GET /api/videos/:videoId

- **200 OK**: Video

### POST /api/videos/:videoId/comments

- Auth: Authenticated users
- Body: `{ text (string, required), timestamp (integer ms, optional, must be >= 0 if provided) }`
- **201 Created**: Comment (id, authorId, text, timestamp, createdAt)
- **400 Bad Request**: `{ error: "validation_error", message: "text is required" | "timestamp must be a non-negative integer (ms)" }`

### GET /api/videos/:videoId/comments

- Query: `page`, `limit`
- **200 OK**: `{ data: [Comment], meta }`

---

## Assignments

### POST /api/assignments

- Auth: `Admin` or `Instructor`
- Body: `{ course (string, required), title (string, required), description (string, optional), deadline (ISO datetime, optional) }`
- **201 Created**: Assignment
- **400 Bad Request**: `{ error: "validation_error", message: "course and title are required" }`

### POST /api/assignments/:id/submit

- Auth: `Student`
- Body: `{ file (string, required) }`
- **200 OK**: `{ message: "Assignment submitted successfully", assignment }`
- **404 Not Found**: `{ error: "not_found", message: "Assignment not found" }`

### GET /api/assignments

- Auth: Any authenticated user
- Query: `course`
- **200 OK**: `[Assignment]`

### PUT /api/assignments/:id

- Auth: `Admin` or `Instructor`
- Body: `{ title?, description?, deadline? }`
- **200 OK**: Updated assignment
- **404 Not Found**: `{ error: "not_found" }`

### DELETE /api/assignments/:id

- Auth: `Admin` or `Instructor`
- **200 OK**: `{ message: "Assignment deleted successfully" }`
- **404 Not Found**: `{ error: "not_found" }`

---

## Quizzes

### POST /api/quizzes/:courseId/quizzes

- Auth: `Admin` or `Instructor`
- Body: `{ questions (array, required, non-empty), duration (number, optional) }`
- **201 Created**: Quiz
- **400 Bad Request**: `{ error: "validation_error", message: "questions array is required" }`

### POST /api/quizzes/:id/submit

- Auth: `Student`
- Body: `{ answers (array, required) }`
- **200 OK**: `{ score, total }`
- **400 Bad Request**: `{ error: "validation_error", message: "answers array is required" }`
- **404 Not Found**: `{ error: "not_found", message: "Quiz not found" }`

---

## Standard Error format

- **400 Bad Request**: `{ error: "bad_request" | "validation_error", message: "...", details?: { field: 'error' } }`
- **401 Unauthorized**: `{ error: "unauthorized" }`
- **403 Forbidden**: `{ error: "forbidden" }`
- **404 Not Found**: `{ error: "not_found" }`
- **500 Internal Server Error**: `{ error: "server_error" }`

---

## Webhooks & Security notes

- Stripe webhook verification requires `STRIPE_WEBHOOK_SECRET` and the raw body. Use the Stripe CLI to test (`stripe listen --forward-to localhost:5000/api/payments/webhook`).

## OpenAPI / Machine-readable

- Minimal OpenAPI spec: `docs/openapi.yaml`
- Swagger UI: open `docs/swagger.html`
- Postman collection: `docs/postman-collection.json`
- If you want a fuller spec (schemas for all models and errors) or regenerated docs, call it out and I'll expand the spec + Postman collection.