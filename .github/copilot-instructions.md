# Khodiyar-Enterprise Copilot Instructions

## Project Overview

**Khodiyar Enterprise** is a full-stack e-commerce management platform built with:
- **Backend**: Node.js + Express.js + PostgreSQL (Prisma ORM)
- **Frontend**: React 19 + Vite + Tailwind CSS
- **Architecture**: Feature-based monorepo with strict separation of concerns

The platform includes user authentication, product management, shopping cart, orders, payments (Razorpay), admin dashboard, and email notifications.

## Essential Context for AI Agents

### Quick Commands

**Backend** (`cd backend`)
```bash
npm run dev              # Start development server with hot-reload
npm run migrate          # Run Prisma migrations
npm run generate         # Generate Prisma client
npm run studio           # Open Prisma Studio GUI
npm run format           # Format code with Prettier
```

**Frontend** (`cd client`)
```bash
npm run dev              # Start Vite dev server
npm run build            # Production build
npm run lint             # ESLint validation
npm run test:e2e         # Playwright E2E tests
```

### Architecture & Design Principles

This project strictly enforces several key patterns—**agents must follow these**:

#### 1. **No Prop Drilling**
- ❌ NEVER pass props through multiple component layers
- ✅ Use Zustand stores for shared state
- ✅ Use context only for localized provider patterns (not global state)

#### 2. **Centralized State Management (Zustand)**
All global state lives in `/store`:
- `useAuthStore.js` — User, token, session, roles
- `useCartStore.js` — Shopping cart items
- `useCategoryStore.js` — Product categories
- `useProductStore.js` — Product data
- `useCustomerStore.js` — Customer info
- etc.

**Rule**: Do NOT use React Context for global state.

#### 3. **API Layer (Centralized Axios)**
All API calls flow through `/api` layer:
- **`apiClient.js`** — Singleton Axios instance with interceptors
  - Base URL configuration
  - JWT token injection via interceptor
  - Global error handling
  - Request/response transformation
- **Feature APIs** — `authApi.js`, `cartApi.js`, `productApi.js`, `orderApi.js`, etc.

**Rule**: Do NOT call Axios directly in components. Route all HTTP requests through the `/api` layer.

#### 4. **Backend Structure**
- `/controllers/` — Route handlers (business logic entry points)
- `/routes/` — Route definitions (express Router setup)
- `/services/` — Domain logic layer
- `/middlewares/` — Authentication, validation, error handling
- `/validations/` — Zod schemas for request validation
- `/utils/` — Logging, helpers, utilities

**Rule**: Keep concerns separated. Controllers orchestrate, Services contain logic.

#### 5. **Frontend Structure**
```
client/src/
├── api/              # Axios client + API functions
├── store/            # Zustand stores
├── features/         # Feature-specific modules
├── components/       # Reusable UI components
├── hooks/            # Custom React hooks
├── routes/           # Route definitions
├── layouts/          # Layout wrappers
├── utils/            # Utilities
└── App.jsx, main.jsx
```

#### 6. **Feature-Based Organization**
- Group related code by feature, not by file type
- Example: All auth logic (components, forms, API calls) lives together
- Makes features portable and reduces interdependencies

### Key Technology Choices

**Backend:**
- **Validation**: Zod (request/response validation)
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: JWT (access + refresh tokens), bcryptjs, email OTP
- **File Uploads**: Cloudinary
- **Payments**: Razorpay v2.9.6
- **Email**: Nodemailer v8.0.2
- **Logging**: Winston with daily rotation

**Frontend:**
- **State**: Zustand v5.0.12
- **HTTP**: Axios v1.14.0
- **Server State**: TanStack React Query v5.96.1
- **Forms**: React Hook Form v7.72.0
- **Router**: React Router v7.13.0
- **UI**: Tailwind CSS v4.1.18, Lucide React icons
- **Compiler**: React Compiler enabled (impacts build times)

### Database Schema

PostgreSQL with Prisma. Key models:
- **User** — With Role enum (admin, user), soft-delete via `deleted_at`
- **Category** — Product categories
- **Product** — Products with images (Cloudinary URLs)
- **Cart** — Shopping cart items
- **Order** — Order tracking
- **Payment** — Payment records (Razorpay integration)
- **PasswordReset**, **Verification** — Auth workflows

All models use:
- UUID primary keys (`gen_random_uuid()`)
- `created_at`, `updated_at` timestamps (UTC with timezone)
- `deleted_at` for soft deletes where applicable

### API Endpoints Structure

```
/api/auth/               # Authentication (login, signup, verify, reset)
/api/product/            # Product CRUD
/api/category/           # Category CRUD
/api/cart/               # Shopping cart
/api/order/              # Orders, /api/admin/orders/ for admin
/api/payment/            # Payment processing (Razorpay)
/api/user/               # User profile
/api/dashboard/          # Admin dashboard stats
```

### Code Style & Formatting

**Backend** (Prettier):
- `trailingComma: "es5"`
- `tabWidth: 2`
- `semi: true`
- `singleQuote: true`

**Frontend** (ESLint + Prettier):
- Recommended ESLint rules
- React Hooks plugin
- React Refresh plugin
- Ignores unused uppercase/underscore variables

### Important Patterns & Rules

#### ✅ DO:
1. Use Zustand for all shared state
2. Route all API calls through `/api` layer with apiClient
3. Use feature-based folder structure
4. Validate all inputs with Zod (backend)
5. Implement proper error handling in stores + components
6. Use React Query for server state caching
7. Use React Hook Form for forms
8. Keep components presentational (dumb)
9. Apply middleware-based auth checks
10. Use Prisma for all database queries

#### ❌ DO NOT:
1. Pass props through multiple component layers (no prop drilling)
2. Call Axios or fetch directly in components
3. Use React Context for global state
4. Mix business logic into UI components
5. Call Prisma queries directly in controllers (use services)
6. Skip input validation
7. Store sensitive data in localStorage (use httpOnly cookies where possible)
8. Create database models outside Prisma

### Authentication Flow

1. **Frontend**: User submits credentials → `authApi.login()` → Zustand `useAuthStore`
2. **Backend**: Request hits `/api/auth/login` → controller → service → JWT issued
3. **Token Storage**: Stored in Zustand (in-memory) + localStorage (persistence)
4. **Token Injection**: Axios interceptor automatically adds JWT to all requests
5. **Token Refresh**: Interceptor handles expired tokens via refresh endpoint
6. **Logout**: Clear Zustand store + localStorage

### Common Development Tasks

**Adding a new feature:**
1. Create Zustand store in `/store/useFeatureStore.js`
2. Create API functions in `/api/featureApi.js`
3. Create feature folder in `/features/featureName/`
4. Implement components that connect to store
5. Add routes in `/routes/`

**Adding a new API endpoint:**
1. Define Zod schema in `/validations/`
2. Create controller in `/controllers/`
3. Create service in `/services/` (if needed)
4. Define route in `/routes/`
5. Add middleware for auth/validation as needed

**Database changes:**
1. Update `prisma/schema.prisma`
2. Run `npm run migrate` to generate migration
3. Run migrations in dev: `npm run migrate`
4. Update Prisma client: `npm run generate`

### Troubleshooting

**Issue**: Token not included in API requests
- **Solution**: Verify Axios interceptor in `apiClient.js` is configured correctly

**Issue**: Props drilling causing component prop hell
- **Solution**: Create a Zustand store for shared state, remove props

**Issue**: React Query cache stale
- **Solution**: Configure queryClient with appropriate `staleTime` and `cacheTime`

**Issue**: CORS errors in development
- **Solution**: Check `backend/src/app.js` CORS configuration

### Related Documentation

- See `agents architecture.md` for comprehensive design patterns
- See `client/README.md` for frontend setup details
- Backend: Prisma schema at `backend/prisma/schema.prisma`
- Frontend: Route definitions at `client/src/routes/`

### File Inventory for Quick Reference

**Backend Core:**
- `backend/src/app.js` — Express app + middleware setup
- `backend/prisma/schema.prisma` — Database schema
- `backend/src/controllers/` — Request handlers
- `backend/src/services/` — Business logic
- `backend/src/validations/` — Zod schemas

**Frontend Core:**
- `client/src/main.jsx` — React + Query setup
- `client/src/api/apiClient.js` — HTTP client singleton
- `client/src/store/` — Zustand stores
- `client/src/routes/` — Route definitions
- `client/src/components/` — Reusable UI components

---

**Last Updated**: 2026-04-11  
**Maintained By**: Neel Pandya
