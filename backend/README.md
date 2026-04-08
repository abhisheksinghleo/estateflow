# Real Estate Backend (Express + Prisma)

MVP backend API for a real estate platform with role-based auth and listing approval workflow.

## Features

- Roles: `BUYER`, `SELLER`, `AGENT`, `ADMIN_HEAD`, `ADMIN_CO_HEAD`
- JWT authentication with bcrypt password hashing
- Auth endpoints: register, login, me
- Property listings with admin approval workflow
- Property filters + pagination
- Inquiry endpoints
- Favorite endpoints
- Admin listing approval/rejection endpoint
- Prisma schema with core tables

---

## Project Structure

- `server.js` – app bootstrap
- `src/app.js` – express app setup
- `src/routes` – route definitions
- `src/controllers` – request handlers
- `src/middlewares` – auth, validation, error handling
- `src/validators` – request payload validators
- `src/utils` – utility helpers (JWT)
- `src/config/prisma.js` – Prisma client instance
- `prisma/schema.prisma` – database schema

---

## Setup

1. Copy env file:
   - `cp .env.example .env`
2. Update `.env` values:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - optional `PORT`, `JWT_EXPIRES_IN`
3. Install dependencies:
   - `npm install`
4. Generate Prisma client:
   - `npm run prisma:generate`
5. Run migrations:
   - `npm run prisma:migrate`
6. Start server:
   - `npm run dev`

Default server URL: `http://localhost:5000`

---

## Scripts

- `npm run dev` – start with nodemon
- `npm run start` – start with node
- `npm run prisma:generate` – generate Prisma client
- `npm run prisma:migrate` – run Prisma migrations (dev)

---

## Environment Variables

Example (`.env.example`):

- `PORT=5000`
- `DATABASE_URL="postgresql://username:password@localhost:5432/real_estate_db?schema=public"`
- `JWT_SECRET="replace-with-a-strong-secret"`
- `JWT_EXPIRES_IN="7d"`

---

## API Base Path

- `/api/v1`

---

## Endpoint Overview

### Health
- `GET /health`

### Auth
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me` (Bearer token required)

### Properties
- `GET /api/v1/properties`  
  Public approved/published listings with filters + pagination
- `GET /api/v1/properties/:id`  
  Public approved/published listing detail
- `POST /api/v1/properties`  
  Create listing (roles: `SELLER`, `AGENT`, admin roles)
- `PATCH /api/v1/properties/:id`  
  Update listing (owner/admin)
- `GET /api/v1/properties/my/listings`  
  Authenticated user's listings

Supported query params:
- `page`, `limit`
- `city`, `type`, `purpose`
- `minPrice`, `maxPrice`

### Inquiries
- `POST /api/v1/inquiries`
- `GET /api/v1/inquiries/my`
- `GET /api/v1/inquiries/property/:propertyId` (owner/admin)

### Favorites
- `POST /api/v1/favorites/:propertyId`
- `DELETE /api/v1/favorites/:propertyId`
- `GET /api/v1/favorites/my/list`

### Admin
- `GET /api/v1/admin/properties/pending`
- `PATCH /api/v1/admin/properties/:id/status`  
  Body:
  - `{ "action": "APPROVE" }`
  - `{ "action": "REJECT", "rejectionReason": "..." }`

---

## Notes

- Admin roles cannot self-register via public register endpoint.
- New non-admin listings are created as `PENDING`.
- Non-admin listing updates are moved back to `PENDING`.
- Only `APPROVED` + `isPublished=true` listings are visible publicly.
- This is an MVP scaffold and can be extended with uploads, richer search, appointment flow, notifications, and testing.