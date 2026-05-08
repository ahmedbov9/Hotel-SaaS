# Hotel SaaS PMS Frontend

A modern multi-tenant hotel property management system frontend built with **Next.js**, **TypeScript**, and **Tailwind CSS**.

---

## Overview

This project is the frontend application for a hotel SaaS PMS and booking platform.

It provides two main experiences:

- **Dashboard experience** for hotel owners and staff
- **Public booking experience** for hotel guests

The frontend is designed to work with a multi-tenant backend where each hotel has its own isolated workspace, permissions, inventory, bookings, and financial operations.

---

## Main Goals

This frontend was built to demonstrate:

- clean scalable frontend architecture
- real-world dashboard design
- multi-tenant SaaS frontend patterns
- role and permission aware UI
- hotel operations workflows
- internal and public-facing product flows
- responsive layout across desktop, tablet, and mobile

---

## Tech Stack

- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **React Context API**
- **Fetch-based API client**
- **LocalStorage session persistence**
- **Responsive dashboard layout**

---

## Core Features

### Authentication
- login page
- register page
- session persistence
- protected dashboard routes
- guest-only auth routes
- logout flow

### Hotel Onboarding
- create hotel after registration
- auto-store selected hotel context
- redirect into dashboard after hotel creation

### Multi-Tenant Hotel Context
- current hotel context stored on the frontend
- hotel selection based on user memberships
- automatic `x-hotel-id` header support
- isolated dashboard data by selected hotel

### Permission-Aware UI
- sidebar links rendered based on membership permissions
- sensitive actions hidden when user lacks permission
- frontend UX guards aligned with backend permission rules

### Dashboard
- dashboard overview page
- report metrics
- upcoming bookings
- today check-ins
- today check-outs

### Room Types
- list room types
- create room type
- success, loading, error, and empty states

### Rooms
- list rooms
- create room
- link room to room type

### Guests
- list guests
- create guest profiles
- manage core guest information

### Bookings
- list bookings
- create booking
- booking workflow actions:
  - confirm
  - check-in
  - check-out
  - cancel

### Payments
- list payments
- create payment records
- booking-linked financial flow

### Invoices
- list invoices
- create invoice from booking
- update invoice status

### Staff / Memberships
- list hotel staff
- create membership
- activate / deactivate memberships

### Inventory
- search inventory by room type and date range
- bulk update inventory
- manage:
  - total inventory
  - reserved count
  - stop sell
  - minimum stay
  - price override

### Public Booking Flow
- public hotel page by slug
- hotel availability search
- room type results
- public booking submission flow

### UX Enhancements
- reusable success and error states
- reusable confirmation dialog
- responsive sidebar and topbar
- mobile drawer navigation

---

## Project Structure

```text
src/
ââ app/
â  ââ (auth)/
â  â  ââ login/
â  â  ââ register/
â  â  ââ create-hotel/
â  â
â  ââ (dashboard)/
â  â  ââ dashboard/
â  â  ââ room-types/
â  â  ââ rooms/
â  â  ââ guests/
â  â  ââ bookings/
â  â  ââ payments/
â  â  ââ invoices/
â  â  ââ memberships/
â  â  ââ inventory/
â  â  ââ layout.tsx
â  â
â  ââ (public)/
â  â  ââ hotel/
â  â     ââ [slug]/
â  â
â  ââ globals.css
â  ââ layout.tsx
â  ââ page.tsx
â
ââ components/
â  ââ auth/
â  ââ layout/
â  ââ shared/
â  ââ ui/
â
ââ features/
â  ââ auth/
â  ââ hotels/
â  ââ dashboard/
â  ââ room-types/
â  ââ rooms/
â  ââ guests/
â  ââ bookings/
â  ââ payments/
â  ââ invoices/
â  ââ memberships/
â  ââ inventory/
â  ââ public-booking/
â
ââ hooks/
ââ lib/
â  ââ api/
â  ââ constants/
â  ââ permissions/
â  ââ utils/
â
ââ providers/
ââ types/
ââ styles/
```

---

## Architecture Notes

The frontend follows a **feature-based structure** instead of grouping everything only by file type.

This helps keep related concerns together:

- API logic
- components
- local feature state
- feature-specific types

### Main Layers

- `app/` â routing and page composition
- `features/` â business-specific UI and API functions
- `components/` â reusable UI and layout building blocks
- `providers/` â app-level state providers
- `hooks/` â shared hooks
- `lib/` â utilities, API client, constants, permission helpers
- `types/` â shared TypeScript types

---

## Authentication Strategy

The frontend currently stores:

- `accessToken` in `localStorage`
- selected `hotelId` in `localStorage`

This was chosen for simplicity in the MVP.

### Important Note
For a stronger production setup, this should be upgraded to:

- short-lived access token in memory
- refresh token in `httpOnly cookie`

This would provide stronger protection than storing tokens in local storage.

---

## Hotel Context Strategy

This project uses a **multi-tenant hotel context** model.

After login:

- the frontend fetches the hotels the user can access
- the user selects the active hotel
- that hotel ID is stored locally
- every protected hotel-scoped request automatically includes:

```http
x-hotel-id: HOTEL_ID
```

This allows the same authenticated user to potentially belong to multiple hotels while keeping the current dashboard context isolated.

---

## Permission Strategy

The frontend does not replace backend authorization.

Instead, it adds **permission-aware UX** by:

- hiding unauthorized sidebar links
- hiding unauthorized create forms
- hiding unauthorized action buttons
- showing friendly permission-denied messages when needed

Examples:
- no `staff.read` â Staff link hidden
- no `payments.create` â payment form hidden
- no `bookings.cancel` â cancel button hidden

The backend remains the final source of truth for security.

---

## Responsive Design

The dashboard layout is responsive across:

- **Desktop** â fixed sidebar
- **Tablet** â collapsible sidebar via menu button
- **Mobile** â drawer-based sidebar with overlay

This ensures the application remains usable for staff across multiple devices.

---

## API Integration

The frontend communicates with the backend through a centralized API client.

### API Client Responsibilities
- attach `Authorization` header automatically
- attach `x-hotel-id` automatically
- normalize errors
- provide reusable methods for:
  - GET
  - POST
  - PATCH
  - PUT
  - DELETE

This avoids scattered `fetch()` usage across pages and components.

---

## User Flows

### Dashboard Flow
1. Register account
2. Login
3. Create hotel
4. Select active hotel
5. Access dashboard
6. Manage rooms, guests, bookings, payments, invoices, memberships, and inventory

### Public Booking Flow
1. Open hotel public page by slug
2. Search availability
3. View available room types
4. Submit booking as guest
5. Receive booking confirmation response

---

## Key UX Patterns

The frontend includes reusable UX patterns such as:

- confirmation dialogs for sensitive actions
- success messages after mutations
- error messages from API failures
- protected routes
- guest-only routes
- loading and empty states
- permission-aware UI rendering

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ahmedbov9/Hotel-SaaS
cd hotel-saas-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

### 4. Run the development server

```bash
npm run dev
```

### 5. Open the app

```text
http://localhost:3000
```

---

## Important Routes

### Auth
- `/login`
- `/register`
- `/create-hotel`

### Dashboard
- `/dashboard`
- `/room-types`
- `/rooms`
- `/guests`
- `/bookings`
- `/payments`
- `/invoices`
- `/memberships`
- `/inventory`

### Public
- `/hotel/[slug]`

---

## Example Frontend Capabilities

### Internal Dashboard
- manage hotel operations
- manage inventory and availability
- create and update bookings
- record payments
- generate invoices
- manage staff permissions

### Public Side
- guest-facing hotel page
- availability lookup
- online booking request flow

---

## Why This Frontend Matters

This frontend demonstrates more than basic page rendering.

It shows:

- scalable Next.js architecture
- TypeScript-first frontend development
- real-world state and context handling
- multi-tenant SaaS UI logic
- role and permission aware rendering
- dashboard workflow design
- internal and public product separation
- responsive design for operational systems

It is designed to resemble a real admin product frontend rather than a tutorial UI.

---

## Current Scope

This project currently focuses on a strong **MVP frontend** for a hotel PMS and booking SaaS.

It already covers:

- auth onboarding
- hotel creation
- multi-hotel context selection
- permission-aware dashboard navigation
- core CRUD workflows
- booking workflow actions
- financial management pages
- inventory management
- public hotel booking frontend

---

## Future Improvements

Potential next improvements include:

- toast notification system
- richer skeleton loading states
- advanced filters and search
- booking calendar view
- charts and visual analytics
- data tables with pagination
- optimistic UI updates
- file uploads for hotel media
- stronger auth strategy with refresh tokens
- better mobile booking experience
- dark mode
- internationalization

---

## Production Considerations

If this frontend were pushed further toward production, the next steps would include:

- memory-based access token handling
- refresh token flow with `httpOnly` cookies
- route-level server-side guards where needed
- robust form validation with shared schemas
- better state synchronization and cache strategy
- table virtualization for large datasets
- accessibility polish
- analytics and error monitoring
- deployment hardening

---

## Author

Built by Ahmed Alfaifi.

---

## License

MIT
