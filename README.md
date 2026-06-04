# BDShop Client

BDShop Client is the customer and admin frontend for a full-stack e-commerce platform built for the Bangladesh market. It provides product browsing, cart management, guest checkout, order tracking, customer account pages, and an admin dashboard for store operations.

This repository contains only the frontend application. The backend API lives in the separate `bdshop-server` repository.

## Project Summary

BDShop is designed as a production-style e-commerce application, not just a static product showcase. The frontend talks to a REST API for products, authentication, checkout quotes, orders, returns, newsletter subscriptions, reviews, and admin operations.

The application supports both logged-in customers and guest buyers. Guests can place orders with an email address and later track their orders using a public `BDS-...` order number.

## Main Features

### Customer Experience

- Home page with product sections and promotional areas.
- Product catalog with search, category filters, sorting, pagination, and responsive product cards.
- Product detail page with product information, images, pricing, reviews, and related actions.
- Persistent local cart.
- Guest checkout without requiring login.
- Authenticated checkout for registered customers.
- Checkout total verification through the backend before payment.
- Cash on Delivery support.
- Stripe card payment UI.
- Thank-you page with real order tracking information.
- Public order tracking page using order number and email.
- Customer dashboard with account, orders, addresses, reviews, and password management.
- Newsletter subscription from the footer.
- Return request page connected to the backend.
- Friendly customer-facing error messages that hide API keys, stack traces, and provider errors.

### Admin Experience

- Admin dashboard with overview metrics.
- Product management with create, edit, delete, image upload, and inventory-related fields.
- Order management with product status and payment status updates.
- Customer directory with role and activation controls.
- Basic analytics and revenue visualization.

### SEO and UX

- Responsive layout for mobile and desktop.
- SEO meta tags in `index.html`.
- Build-time generation of `sitemap.xml` and `robots.txt`.
- Lazy-loaded route pages.
- Error boundary with safe public message.
- CSRF token support for unsafe API requests.

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router
- TanStack Query
- Zustand
- Tailwind CSS
- React Hook Form
- Zod
- Stripe React SDK
- Axios
- Lucide React
- Framer Motion
- Recharts

## Repository Structure

```text
bdshop-client/
  scripts/
    generate-seo.mjs          # Generates sitemap.xml and robots.txt after build
  src/
    components/               # Shared UI, layout, cart, product, error boundary
    hooks/                    # Shared React hooks
    pages/
      account/                # Order history and public tracking
      auth/                   # Login, register, forgot password
      catalog/                # Product catalog and product details
      checkout/               # Checkout flow and payment UI
      dashboard/              # Admin and customer dashboards
      info/                   # Help, returns, privacy, terms, cookie pages
    services/
      apiClient.ts            # Axios client with CSRF support
    store/                    # Zustand stores
    utils/                    # Currency, auth, friendly error helpers
  index.html
  package.json
```

## How the Frontend Talks to the Backend

The app uses `VITE_API_BASE_URL` as the API base URL. In local development this usually points to:

```text
http://localhost:5000/api
```

Important API areas used by this client:

- `/services` for product catalog and admin product management.
- `/users` and `/auth` for authentication and account management.
- `/orders` for checkout, order history, order tracking, and admin order management.
- `/public/newsletter` for footer newsletter subscription.
- `/public/returns` for return requests.
- `/upload` for admin image uploads.
- `/csrf-token` for CSRF protection.

## Requirements

- Node.js 20 or newer recommended.
- npm.
- Running BDShop backend API.

The app may run on Node 18, but some tooling dependencies expect newer Node versions. For CI or production builds, Node 20+ is the safer choice.

## Environment Variables

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Example:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=pk_test_replace_me
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_FACEBOOK_APP_ID=your_facebook_app_id_here
```

### Environment Notes

- `VITE_API_BASE_URL` must point to the backend `/api` URL.
- `VITE_STRIPE_PUBLIC_KEY` must be a real Stripe publishable key for card payments.
- If OAuth client IDs are missing, users can still use email login and registration.
- Never place backend secrets in frontend environment variables.

## Installation

```bash
npm install
```

## Run Locally

Start the backend first, then run:

```bash
npm run dev
```

Default frontend URL:

```text
http://localhost:5173
```

## Build

```bash
npm run build
```

The build command:

1. Type-checks the project with TypeScript.
2. Builds the Vite app.
3. Generates SEO files in `dist`.

Preview the production build:

```bash
npm run preview
```

## Available Scripts

```bash
npm run dev       # Start Vite dev server
npm run build     # Type-check, build, and generate SEO files
npm run preview   # Preview built app
npm run lint      # Run ESLint
```

## Key User Flows

### Guest Checkout

1. Customer adds products to cart.
2. Customer opens checkout.
3. If not logged in, customer enters email and delivery details.
4. Frontend requests a backend checkout quote.
5. Backend returns trusted subtotal, shipping fee, discount, tax, and total.
6. Customer chooses card payment or Cash on Delivery.
7. After order creation, the app stores and displays the real `BDS-...` tracking number.

### Public Order Tracking

The tracking page is available at:

```text
/track-order
```

Customers enter:

- Order number, for example `BDS-MPXWIHDH-QHUJ`
- Email address used at checkout

The page also supports prefilled tracking links:

```text
/track-order?orderId=BDS-MPXWIHDH-QHUJ&email=customer@example.com
```

### Admin Product Management

Admins can:

- Create products.
- Upload images.
- Edit product data.
- Delete products.
- Review product inventory and catalog information.

## Error Handling

The frontend intentionally avoids exposing raw technical messages to customers.

For example, Stripe/API/server/internal errors are mapped to friendly messages such as:

```text
Payment is temporarily unavailable. Please try Cash on Delivery or contact support.
```

This behavior is handled through `src/utils/userFriendlyError.ts` and the shared toast hook.

## Deployment

For static hosting:

1. Set the `VITE_*` environment variables in the hosting provider.
2. Run `npm run build`.
3. Deploy the `dist` directory.
4. Configure SPA fallback so all routes serve `index.html`.

Backend CORS must include the deployed frontend origin.

## Production Checklist

- Use a real API URL in `VITE_API_BASE_URL`.
- Configure Stripe publishable key.
- Configure OAuth client IDs if social login is needed.
- Confirm backend CORS allows the frontend domain.
- Run `npm run build`.
- Test guest checkout, logged-in checkout, order tracking, and admin product update.

## Related Repository

Backend API:

```text
bdshop-server
```

Run the backend before using checkout, login, admin pages, newsletter, returns, and order tracking.

## Current Limitations

- Cart is still primarily local on the frontend.
- Full E2E browser tests are not included yet.
- Payment success depends on correct Stripe backend and webhook configuration.
- Real email delivery depends on valid SMTP credentials.

## Roadmap

- Server-synced cart and wishlist.
- More advanced admin inventory views.
- End-to-end tests for checkout, payment, and auth.
- Better order notification emails.
- More detailed SEO structured data.
