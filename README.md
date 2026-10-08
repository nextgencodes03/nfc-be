# NFC-BE

Backend API for **NFC UI**. Serves the same seed/mock data the frontend used locally, over HTTP, so the UI can talk to a real API while we still have no database.

## Run

```bash
npm install
npm run dev
```

API: [http://localhost:4000](http://localhost:4000)

Health check: `GET /api/health`

## Demo accounts

Password: `demo1234`

| Role | Email |
| --- | --- |
| Customer | `krishna@nexalabs.dev` |
| Admin | `admin@yourdomain.com` |

## Pair with NFC UI

In the UI repo set:

```
VITE_API_BASE_URL=http://localhost:4000
```

Then start both:

1. `NFC-BE` → `npm run dev` (port 4000)
2. `NFC UI` → `npm run dev` (port 5173)

## Routes

| Method | Path | Auth |
| --- | --- | --- |
| POST | `/api/auth/login` | public |
| POST | `/api/auth/signup` | public |
| GET | `/api/profiles/username/:username` | public |
| GET | `/api/orders/:orderId` | public (confirmation page) |
| POST | `/api/orders` | optional |
| POST | `/api/orders/:orderId/pay` | public (checkout) |
| POST | `/api/analytics/visits` | public |
| GET/PUT | `/api/profiles/me`, `/api/profiles` | customer |
| GET | `/api/nfc-cards/mine` | customer |
| GET | `/api/customers`, `/api/nfc-cards`, `/api/orders` | admin |

Data lives in memory (seeded from `src/data`). Restarting the server resets it. Swap `src/db.ts` for PostgreSQL later without changing the routes.
