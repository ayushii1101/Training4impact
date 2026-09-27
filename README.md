# Training4Impact

Redevelopment of the [Training4Impact.com](https://training4impact.com) medical fellowship
website — medical fellowships for Doctors, Nurses & Perfusionists (Cardiac Critical Care,
Echocardiography, ECMO, Cardio Diabetes and open certificate courses).

This project is split into:

- **`frontend/`** — React + Vite + Tailwind CSS + React Router application.
- **`backend/`** — Express + SQLite (Node `node:sqlite`) REST API with Razorpay
  Test-Mode order creation, payment verification and webhook handling.

## Quick Start

```bash
# Backend
cd backend
cp .env.example .env    # fill in Razorpay TEST credentials + webhook secret
npm install
npm run dev

# Frontend
cd frontend
cp .env.example .env    # fill in VITE_API_URL and VITE_RAZORPAY_KEY_ID (TEST key)
npm install
npm run dev
```

Production frontend build:

```bash
cd frontend
VITE_API_URL=https://<api-domain> VITE_RAZORPAY_KEY_ID=<test-or-live-key> npm run build
```

## Backend tests

```bash
cd backend
npm test
```

Tests run offline (a throwaway SQLite database in a temp directory) and exercise
the webhook signature handling, idempotency, unsupported events and the single /
multi-course enrollment flow.

## Environment configuration

See `backend/.env.example` and `frontend/.env.example`. Only placeholder variable
names live in the repository — real credentials must never be committed.

- **Dev / Test**: Razorpay Test Mode keys, `RAZORPAY_WEBHOOK_SECRET`, `PORT`
  (default 5000), `CORS_ORIGIN` (defaults to `http://localhost:5173`).
- **Production**: separate Live Mode credentials, a production webhook secret,
  the port required by the hosting provider and `CORS_ORIGIN` set to exactly the
  production frontend origin(s). No wildcard CORS is used in production.

## Production HTTPS deployment requirements

- The frontend is a static Vite build; serve it over **HTTPS** and set
  `VITE_API_URL` to the HTTPS backend URL at build time.
- The backend API must be reachable over **HTTPS** and its
  `/api/payments/webhook` endpoint must be publicly reachable so Razorpay can
  deliver webhooks. Razorpay webhooks require a public HTTPS URL.
- Configure `CORS_ORIGIN` with your frontend origin(s). Server-to-server clients
  (health checks, webhooks) are not affected by CORS.
- Set `RAZORPAY_WEBHOOK_SECRET` to the same secret configured in the Razorpay
  dashboard, and add `payment.captured`, `payment.failed` and `order.paid`
  events to the webhook.
- TLS termination is typically handled by the hosting provider's reverse proxy.
  The backend also sets `X-Content-Type-Options`, `X-Frame-Options` and
  `Referrer-Policy` headers.
- `RAZORPAY_KEY_SECRET` and `RAZORPAY_WEBHOOK_SECRET` live only in the backend
  environment and are never shipped to or exposed by the frontend.

## Status

- FRONTEND: complete
- BACKEND: implemented (Razorpay Test-Mode orders + verification + webhooks)
- PAYMENT BACKEND: implemented, production-readiness steps in progress
- RAZORPAY: Test Mode only — do not switch to Live Mode until the production
  environment, HTTPS webhook delivery and Live credentials are in place
- DISCOUNT / COUPON SYSTEM: not implemented