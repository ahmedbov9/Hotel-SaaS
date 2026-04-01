# Hotel-SaaS Backend

Multi-tenant hotel property management and booking backend built with Node.js, Express, and MongoDB.

This API is designed around real hotel operations: onboarding hotels, assigning staff access, managing room inventory, handling bookings, tracking payments and invoices, exposing reporting data, and supporting a public booking flow.

## Overview

Hotel-SaaS Backend is a modular Express application for hotel SaaS operations. Each hotel is treated as a separate tenant, and protected resources are scoped through the `x-hotel-id` header after authentication.

The codebase is organized by domain modules so each feature can keep its own controller, service, routes, validation, and model files while shared concerns live in common infrastructure folders.

## Core Capabilities

- Multi-tenant hotel architecture
- JWT authentication
- Hotel-scoped access using `x-hotel-id`
- Role and permission based access control
- Hotel creation and membership management
- Room type and room management
- Guest profile management
- Booking lifecycle handling
- Inventory and availability management
- Payment and invoice management
- Dashboard reporting
- Public booking flow by hotel slug
- Postman API collection
- Request validation with Zod
- Security middleware with Helmet, CORS, and rate limiting

## Tech Stack

- Node.js
- Express 5
- MongoDB
- Mongoose
- JWT
- Zod
- Helmet
- Morgan
- Express Rate Limit

## Project Structure

```text
src/
    app.js
    server.js
    common/
        database/
        errors/
        middlewares/
        utils/
    config/
        cors.js
        db.js
        env.js
        rateLimit.js
    docs/
    modules/
        auth/
        bookings/
        guests/
        hotels/
        inventory/
        invoices/
        memberships/
        payments/
        public/
        reports/
        room-types/
        rooms/
        users/
    routes/
        index.js
```

## Architecture Notes

- `src/app.js` wires middleware, API routes, and error handling.
- `src/server.js` connects to MongoDB and starts the HTTP server.
- `src/common` contains reusable middleware, error handling, and helper utilities.
- `src/config` centralizes environment variables, database setup, CORS, and rate limiting.
- `src/modules` groups each business domain into its own implementation boundary.
- `src/routes/index.js` mounts all route groups under `/api`.

## Tenant and Access Model

This backend uses two access layers:

1. Authentication through `Authorization: Bearer <token>`.
2. Tenant scoping through `x-hotel-id` for protected hotel-specific routes.

After authentication, the backend verifies that the user has an active membership in the selected hotel. Route-level permissions are then checked before controller execution.

### Default Role Intent

- `owner`: full access
- `manager`: operational access across rooms, guests, bookings, payments, and reports
- `receptionist`: front-desk access for guest and booking operations
- `accountant`: finance and reporting focused access

## API Base URLs

- API base: `http://localhost:5001/api`
- Postman collection: [Open in Postman](https://web.postman.co/workspace/Personal-Workspace~a870e76e-3cd7-4c5d-908b-c46b5b5486e9/collection/36195232-25ac54ba-ed26-4d2a-8c6e-861045f87ff4?action=share&source=copy-link&creator=36195232)

## Main Route Groups

### Public Routes

- `GET /api/public/:slug`
- `GET /api/public/:slug/availability`
- `POST /api/public/:slug/bookings`

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Hotels

- `POST /api/hotels`
- `GET /api/hotels/current`

### Operations

- `room-types`: list, get, create, update
- `rooms`: list, get, create, update
- `guests`: list, get, create, update
- `bookings`: list, get, create, update, confirm, check-in, check-out, cancel
- `inventory`: read and bulk update inventory or availability data
- `payments`: list, get, create
- `invoices`: list, get, create, update status
- `memberships`: list, create, update
- `reports`: dashboard summary

## Request Requirements

### Authentication Header

```http
Authorization: Bearer <jwt_token>
```

### Hotel Context Header

Use this header on hotel-scoped protected routes:

```http
x-hotel-id: <hotel_object_id>
```

## Environment Variables

Create a `.env` file in the project root.

```env
NODE_ENV=development
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/hotelhub
CLIENT_URL=http://localhost:5173
JWT_ACCESS_SECRET=your_super_secret_key
JWT_ACCESS_EXPIRES=2d
```

### Variable Reference

| Variable | Required | Description |
| --- | --- | --- |
| `NODE_ENV` | No | Runtime mode. Defaults to `development`. |
| `PORT` | No | API port. Defaults to `5001`. |
| `MONGO_URI` | Yes | MongoDB connection string. |
| `CLIENT_URL` | No | Allowed frontend origin for CORS. |
| `JWT_ACCESS_SECRET` | Yes | Secret used to sign and verify access tokens. |
| `JWT_ACCESS_EXPIRES` | No | Access token lifetime outside development mode. |

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create `.env` in the project root using the example above.

### 3. Start the development server

```bash
npm run dev
```

### 4. Start in production mode

```bash
npm start
```

## Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Starts the server with Nodemon. |
| `npm start` | Starts the server with Node.js. |

## Typical Usage Flow

1. Register a user.
2. Log in to receive a JWT.
3. Create a hotel.
4. Send the created hotel id in the `x-hotel-id` header.
5. Manage room types, rooms, guests, and staff memberships.
6. Create, confirm, and update bookings.
7. Record payments and manage invoices.
8. Read dashboard analytics from reports.
9. Expose public availability and booking via the hotel slug.

## Validation, Security, and Error Handling

- Input validation is handled with Zod schemas.
- Authentication is enforced with JWT middleware.
- Hotel access is enforced through membership checks.
- Permissions are checked per route.
- Helmet secures HTTP headers.
- CORS is restricted to the configured client origin.
- Rate limiting is applied on `/api`.
- Centralized error middleware handles application and validation errors.

## API Documentation

The API collection is available in Postman:

[Open Postman Collection](https://web.postman.co/workspace/Personal-Workspace~a870e76e-3cd7-4c5d-908b-c46b5b5486e9/collection/36195232-25ac54ba-ed26-4d2a-8c6e-861045f87ff4?action=share&source=copy-link&creator=36195232)

Use it to explore routes, test requests, and organize authentication and hotel-scoped headers during development.

## Development Notes

- All main API routes are mounted under `/api`.
- Public booking endpoints are separated from authenticated staff operations.
- Protected hotel routes expect both a valid JWT and a valid `x-hotel-id` header.
- The architecture is designed to keep route files thin and move business logic into services.

## Current Domain Coverage

This backend currently includes implementation structure for:

- authentication
- hotel onboarding
- memberships and staff permissions
- room types and rooms
- guests
- bookings
- inventory
- payments
- invoices
- reports
- public hotel booking flow

## Future Improvements

Potential future enhancements include:

- payment gateway sandbox integration
- webhook handling
- audit logs
- PDF invoice generation
- advanced reports
- transactional consistency improvements
- background jobs and notifications
- public booking confirmation emails


## Production Considerations

If this project were pushed further toward production, the next improvements would include:

- DB transactions for booking and inventory consistency
- gateway webhook verification
- centralized audit logging
- stronger rate limiting on public routes
- caching for availability queries
- async jobs for email notifications
- file storage strategy for hotel media
## License

ISC

## Author

Built by Ahmed Alfaifi