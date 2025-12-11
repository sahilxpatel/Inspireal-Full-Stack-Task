# 🏪 B2B Marketplace

> A modern B2B marketplace platform connecting **suppliers** and **buyers** for seamless business transactions.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)
![NextAuth](https://img.shields.io/badge/NextAuth-v5-purple)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [User Workflows](#-user-workflows)
- [API Reference](#-api-reference)
- [Testing](#-testing)
- [Known Limitations](#-known-limitations)
- [AI Usage & Development Process](#-ai-usage--development-process)

---

## 🎯 Overview

This B2B Marketplace is a full-stack web application that enables:
- **Suppliers** to list their products/services and manage incoming orders
- **Buyers** to browse listings, request purchases, and track their orders

The platform supports two pricing models:
1. **Fixed Price** - Buyers purchase at a set price
2. **RFQ (Request for Quote)** - Buyers request custom quotes for negotiation

---

## ✨ Features

### 🔐 Authentication & Security
| Feature | Description |
|---------|-------------|
| User Registration | Sign up as either a **Buyer** or **Supplier** |
| Secure Login | Password hashing with bcrypt, JWT sessions |
| Role-Based Access | Different dashboards and permissions per role |
| Protected Routes | Middleware blocks unauthorized access |

### 🏭 For Suppliers
| Feature | Description |
|---------|-------------|
| Create Listings | Add products/services with pricing, categories, and details |
| Manage Listings | Edit, activate, or deactivate your listings |
| Handle Requests | View incoming purchase/quote requests |
| Order Status | Accept ✅, Reject ❌, or Mark as Paid 💰 |

### 🛒 For Buyers
| Feature | Description |
|---------|-------------|
| Browse Catalog | View all active listings from suppliers |
| Filter by Category | Find raw materials, services, or other products |
| Submit Requests | Purchase at fixed price or request custom quotes |
| Track Orders | Monitor status: Pending → Accepted → Paid |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework with App Router & Server Actions |
| **TypeScript** | Type-safe development |
| **Prisma 5** | ORM for database operations |
| **SQLite** | Development database (easily switch to PostgreSQL) |
| **NextAuth v5** | Authentication with JWT strategy |
| **Zod** | Schema validation for forms and APIs |
| **bcryptjs** | Password hashing |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **npm** or **yarn** - Package manager

### Step-by-Step Setup

```bash
# 1️⃣ Clone and navigate to project
cd marketplace

# 2️⃣ Install dependencies
npm install

# 3️⃣ Set up the database
npx prisma migrate dev

# 4️⃣ Seed with sample data (10 listings + 2 users)
npx prisma db seed

# 5️⃣ Start the development server
npm run dev
```

### 🌐 Open in Browser

Visit **[http://localhost:3000](http://localhost:3000)** to see the app!

---

### 🔑 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| **Supplier** | `supplier@example.com` | `password123` |
| **Buyer** | `buyer@example.com` | `password123` |

---

### ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
# Database connection
DATABASE_URL="file:./dev.db"

# NextAuth configuration
AUTH_SECRET="your-super-secret-key-change-in-production"
AUTH_URL="http://localhost:3000"
```

> 💡 **Tip**: To use PostgreSQL, update `DATABASE_URL` and change the provider in `prisma/schema.prisma`

---

## 📁 Project Structure

```
marketplace/
├── 📂 prisma/
│   ├── schema.prisma          # Database models (User, Listing, Request)
│   ├── seed.ts                # Sample data script (10 listings)
│   └── migrations/            # Database migrations
│
├── 📂 src/
│   ├── 📂 app/                # Next.js App Router pages
│   │   ├── page.tsx           # 🏠 Home - Public catalog
│   │   ├── layout.tsx         # Root layout with navigation
│   │   │
│   │   ├── 📂 api/            # API Routes
│   │   │   ├── auth/          # NextAuth endpoints
│   │   │   └── requests/      # Request status & payment APIs
│   │   │
│   │   ├── 📂 auth/           # Authentication pages
│   │   │   ├── login/         # 🔑 Login page
│   │   │   ├── register/      # 📝 Registration page
│   │   │   └── logout/        # 🚪 Logout handler
│   │   │
│   │   ├── 📂 dashboard/      # 📊 User dashboard (role-based)
│   │   │
│   │   ├── 📂 listings/       # Supplier listing management
│   │   │   ├── new/           # ➕ Create new listing
│   │   │   ├── mine/          # 📋 View my listings
│   │   │   └── [id]/edit/     # ✏️ Edit listing
│   │   │
│   │   ├── 📂 requests/       # 📥 Supplier: Incoming requests
│   │   └── 📂 my-requests/    # 📤 Buyer: My sent requests
│   │
│   ├── 📂 components/         # Reusable UI components
│   │   ├── Navigation.tsx     # Top navigation bar
│   │   ├── CategoryFilter.tsx # Category dropdown filter
│   │   └── RequestForm.tsx    # Purchase/quote form
│   │
│   ├── 📂 lib/                # Utilities & configuration
│   │   ├── auth.ts            # NextAuth configuration
│   │   ├── db.ts              # Prisma client instance
│   │   └── validators.ts      # Zod validation schemas
│   │
│   ├── 📂 types/              # TypeScript type definitions
│   │   └── next-auth.d.ts     # Extended session types
│   │
│   └── middleware.ts          # Route protection middleware
│
├── .env                       # Environment variables
├── package.json               # Dependencies & scripts
└── tsconfig.json              # TypeScript configuration
```

---

## 👥 User Workflows

### 🏭 Supplier Journey

**Step-by-step:**
1. Register with role **"Supplier"**
2. Login and access the Dashboard
3. Click **"Create New Listing"**
4. Fill in product details:
   - Title & Description
   - Category (Raw Material / Service / Other)
   - Pricing type (Fixed Price or RFQ)
   - Country of Origin
5. Wait for buyer requests
6. View requests in **"Incoming Requests"**
7. Accept ✅ or Reject ❌ requests
8. For accepted fixed-price orders, mark as **Paid** 💰

---

### 🛒 Buyer Journey

**Step-by-step:**
1. Register with role **"Buyer"**
2. Login and access the Dashboard
3. Browse the **Catalog** (home page)
4. Filter by category if needed
5. Click on a listing to view details
6. Submit a request:
   - **Fixed Price**: Enter quantity, see total
   - **RFQ**: Add a message for the supplier
7. Track status in **"My Requests"**

---

## 📡 API Reference

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signin` | Login user |
| POST | `/api/auth/signout` | Logout user |
| GET | `/api/auth/session` | Get current session |

### Request Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| PATCH | `/api/requests/[id]/status` | Update request status (accept/reject) |
| POST | `/api/requests/[id]/payment` | Mark order as paid |

---

## 🧪 Testing

### Run Tests

```bash
npm test
```

### Test Coverage
- ✅ Zod validators (16 tests passing)
- ✅ Form validation schemas
- ✅ Request/listing data validation

---

## ✅ Implemented Features

### 🔐 Auth & Roles
- [x] User registration with role selection (buyer/supplier)
- [x] Login/logout functionality
- [x] JWT-based sessions with role in token
- [x] Protected routes with middleware
- [x] Role-based navigation

### 🏭 Supplier Features
- [x] Create new listings with all required fields
- [x] Edit existing listings
- [x] View own listings only
- [x] View incoming requests
- [x] Accept/reject requests
- [x] Mark fixed-price orders as paid (mock)

### 🛒 Buyer Features
- [x] Browse all active listings
- [x] Filter by category
- [x] Request purchase (fixed price with total calculation)
- [x] Request quote (RFQ with optional message)
- [x] View own requests with status

### 💾 Data Model
- [x] User with role field
- [x] Listing with all specified fields
- [x] Request with snapshots and payment status

---

## ⚠️ Known Limitations

| Limitation | Description |
|------------|-------------|
| No real-time updates | Pages need refresh to see status changes |
| No pagination | Listing and request tables show all items |
| No search | Only category filter implemented |
| No email notifications | Status changes are not notified |
| SQLite enums | Using strings instead of enums |
| No image uploads | Listings don't support images |

---

## 🚧 Future Improvements

| Priority | Feature | Reason |
|----------|---------|--------|
| 🔴 High | Pagination | Essential for production with many listings |
| 🔴 High | Real-time updates | Use WebSockets for live status updates |
| 🟡 Medium | Email notifications | Notify buyers on status changes |
| 🟡 Medium | Better error handling | More granular user feedback |
| 🟢 Low | Responsive design | Make UI mobile-friendly |
| 🟢 Low | Full-text search | Search across listings |

---

## 📝 Sample Data (Seeded)

The database comes pre-loaded with **10 listings**:

| Product | Category | Country | Pricing |
|---------|----------|---------|---------|
| Steel Bars | Raw Material | China | $450/unit |
| Copper Wire | Raw Material | Germany | RFQ |
| Welding Services | Service | USA | $85/hour |
| Industrial Lubricant | Other | Japan | $120/liter |
| Aluminum Sheets | Raw Material | Canada | $280/sheet |
| Stainless Steel Tubes | Raw Material | South Korea | $350/meter |
| CNC Machining | Service | Taiwan | RFQ |
| Safety Equipment | Other | Australia | $500/set |
| Carbon Fiber Rolls | Raw Material | Germany | RFQ |
| Quality Inspection | Service | Singapore | $200/inspection |

---

## 🤖 AI Usage & Development Process

### How AI Was Used

This project was built with significant assistance from **GitHub Copilot (Claude Opus 4.5)**. AI was used throughout the development process for:

- **Project scaffolding** - Setting up Next.js 16 with App Router, TypeScript, Prisma, and NextAuth v5
- **Code generation** - Creating CRUD operations, form handling, server actions, and API routes
- **Database schema design** - Designing the User, Listing, and Request models with proper relationships
- **Validation schemas** - Writing Zod validators for forms and API inputs
- **Styling** - Implementing gradient designs, card layouts, and responsive components
- **Debugging** - Identifying and fixing TypeScript errors, auth issues, and deployment problems
- **Documentation** - Generating this README with comprehensive setup instructions

### How I Checked for Mistakes

1. **TypeScript strict mode** - The project uses strict TypeScript to catch type errors at compile time
2. **Zod validation** - All user inputs are validated with Zod schemas (16 unit tests passing)
3. **Manual testing** - Each feature was tested manually through the UI after implementation
4. **Error checking** - Used VS Code's error panel and `get_errors` to verify no TypeScript/lint errors
5. **Code review** - All AI-generated code was reviewed for:
   - Correct TypeScript types and null handling
   - Proper authentication checks and ownership verification
   - Following Next.js App Router conventions and best practices
   - Security considerations (password hashing, protected routes, input validation)

### Known Bugs & Limitations

| Bug/Limitation | Description | Severity |
|----------------|-------------|----------|
| No real-time updates | Pages require manual refresh to see status changes | Low |
| No pagination | All listings/requests shown on single page | Medium |
| Category filter requires JS | Auto-submit uses JavaScript (noscript fallback provided) | Low |
| Session delay after register | User must login after registration (no auto-login) | Low |
| No image uploads | Listings don't support product images | Medium |
| No email notifications | Status changes are not emailed to users | Low |
| SQLite in dev, PostgreSQL in prod | Different database providers may cause edge-case differences | Low |

---

## 📜 License

This project is for demonstration purposes.

---

<div align="center">

**Built with ❤️ using Next.js, TypeScript, and Prisma**

</div>
