# ecommerce_project_frontend

# stayfinder — Frontend

The React frontend for **stayfinder**, an Airbnb-style stay-booking marketplace. Users browse and filter listings, book stays into a cart, check out via Stripe, and review past trips.

This is the **frontend half** of a full-stack project — it consumes a REST API served by the companion backend repository. Both need to be running for the app to work.

> Built as a learning project, inspired by Airbnb's booking experience. Not affiliated with Airbnb.

## Features

- **Browse listings** with live filtering by keyword, maximum price, and category (Beachfront, Cabins, City, Countryside, Luxury).
- **Listing detail** pages with a booking form (check-in, check-out, guest count).
- **Authentication** — register and log in; the JWT is persisted to `localStorage` and attached to authenticated requests.
- **Cart** — add bookings, remove them, and see a running total based on nights × nightly price.
- **Checkout** — creates a Stripe Checkout session and redirects the browser to Stripe to complete payment.
- **Trips** — view past orders/bookings.
- **Flash messages** — transient toast notifications for success and error feedback.

## Tech stack

| Concern | Library |
|---------|---------|
| UI framework | [React 19](https://react.dev/) |
| Build tool / dev server | [Vite 8](https://vite.dev/) |
| Routing | [wouter](https://github.com/molefrog/wouter) |
| State management | [Jotai](https://jotai.org/) (atoms) |
| Forms & validation | [Formik](https://formik.org/) + [Yup](https://github.com/jquense/yup) |
| HTTP client | [axios](https://axios-http.com/) |
| Styling | Bootstrap classes + custom CSS |

## Project structure

The application lives in the `airbnb-ecom/` subdirectory. All commands below are run from inside it.

```
airbnb-ecom/
├── index.html
├── vite.config.js          # Dev server on host:true, port 5173
├── package.json
└── src/
    ├── main.jsx            # App entry
    ├── App.jsx             # Routes (wouter)
    ├── Navbar.jsx          # Auth-aware navigation
    ├── FlashMessageDisplay.jsx
    ├── Homepage.jsx        # Listing grid + search/price/category filters
    ├── ListingDetail.jsx   # Single listing + booking form
    ├── UserLogin.jsx       # Login form
    ├── RegisterPage.jsx    # Registration form
    ├── ShoppingCartPage.jsx# Cart + Stripe checkout
    ├── OrdersPage.jsx      # Past trips
    ├── UserStore.jsx       # JWT auth atom + localStorage persistence
    ├── CartStore.jsx       # Cart atom + cart API calls
    └── FlashMessageStore.jsx # Toast message atom
```

## Getting started

### Prerequisites

- Node.js (18+ recommended)
- The **backend API** running and reachable (see the backend repository's README)

### 1. Install

```bash
cd airbnb-ecom
npm install
```

### 2. Configure the backend URL

The frontend reads the API base URL from an environment variable. Create a `.env` file in `airbnb-ecom/`:

```
VITE_API_URL=http://localhost:3000
```

Set the value to wherever your backend is running (match the port from the backend repo). Vite only exposes variables prefixed with `VITE_`, and the app reads it as `import.meta.env.VITE_API_URL` — without it, every API request will fail.

### 3. Run

```bash
npm run dev
```

The dev server starts on **http://localhost:5173** (with `host: true`, so it's also reachable on your local network).

### Other scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Routes

| Path | Page | Notes |
|------|------|-------|
| `/` | Homepage | Listing grid with search, price, and category filters |
| `/listings/:id` | Listing detail | Booking form; requires login to add to cart |
| `/login` | Login | |
| `/register` | Register | |
| `/cart` | Cart | Remove items, view total, checkout |
| `/orders` | Trips | Past bookings |

## Backend API consumed

The frontend expects the backend to expose these endpoints, all relative to `VITE_API_URL`:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/listings` | List/filter listings (query: `category`, `search`, `maxPrice`) |
| `GET` | `/api/listings/:id` | Single listing detail |
| `POST` | `/api/users` | Register a new user |
| `POST` | `/api/users/login` | Log in, returns a JWT |
| `GET` | `/api/cart` | Fetch the current user's cart *(auth)* |
| `POST` | `/api/cart` | Add a booking to the cart *(auth)* |
| `DELETE` | `/api/cart/:cartId` | Remove a cart item *(auth)* |
| `POST` | `/api/checkout` | Create a Stripe Checkout session *(auth)* |
| `GET` | `/api/orders` | Fetch past orders/trips *(auth)* |

Authenticated requests send the JWT as an `Authorization: Bearer <token>` header.

## Notes

- **Auth token** is stored in `localStorage` and rehydrated on load via the `UserStore` atom.
- **Checkout** redirects the browser to the Stripe-hosted session URL returned by the backend; payment configuration lives on the backend.
- Category IDs in the homepage filter (`1`–`5`) are expected to match the backend's seeded `categories` table.