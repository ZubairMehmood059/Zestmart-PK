# ZestMart PK — Architectural Blueprint & Roadmap

## 1. Executive Overview
- **Product:** ZestMart PK
- **Tagline:** Pakistan's Ultimate Choice Marketplace.
- **Coverage:** Nationwide Pakistan (250+ cities via TCS, Leopards, Trax).
- **Core Currency:** PKR (Rs.).
- **Payment Rails:** Cash on Delivery (COD), JazzCash, Easypaisa, 1Link/Raast, Card.

---

## 2. Three-Phase Execution Strategy

### Phase 1: Design Intelligence & Project Foundation (Completed & Validated)
- Synthesis of 5 design references (Minimalist Storefront, Flat UI 2.0 Product Cards, Emerald Brand Identity, Bento Grid Dashboard, Complete Commercial Storefront).
- Implementation of comprehensive frontend design tokens and anti-slop rules (Zero-Pill discipline, 60-30-10 color balance, tabular numbers, single elevation).
- Complete modular storefront shell (Header with Top Bar contract, Top announcement with Pakistan city picker, Category navigation, Mobile bottom bar, Footer with regional Pakistani hubs).
- Representative visual components for Homepage, Product Detail Modal, Cart Drawer with free shipping threshold, Pakistani Checkout flow with COD, and Bento Grid Seller Centre Preview.

### Phase 2: Complete Customer Storefront & Catalog Integration (Completed & Validated)
- Full routing with dedicated views for Home, Shop/Discovery with faceted filters, Product Detail Page (PDP), Cart, Multi-Step Checkout, and Customer Account Portal.
- Faceted discovery sidebar: Price Range slider in PKR, Verified Pakistani Sellers toggle, COD toggle, In-Stock filter, Customer Rating filter, Specific Vendor dropdown, and Grid/List view toggle.
- Dedicated Product Detail Page (PDP): Breadcrumb trail, sticky purchase module, color and size variant selectors, nationwide Pakistan city shipping calculator with courier transit times, specifications table, and reviews module with star breakdown bars and interactive review submission.
- Dedicated Shopping Cart: Quantity steppers, coupon validation (`ZESTPK10`, `WELCOMEPK`), dynamic Free Shipping progress indicator, special rider delivery instructions, and itemized subtotal.
- Multi-Step Checkout: Saved address selection or new Pakistani address form, Courier method selection (TCS Express, Leopards, Trax), Multi-rail payment (Cash on Delivery, JazzCash Mobile Wallet with MPIN prompt, Easypaisa, Raast/1Link IBAN transfer, Credit Card), and order confirmation receipt.
- Customer Account Portal: Order history with live courier tracking milestones, order cancellation workflow with reason dialog, address book management (add, edit, delete, set default), saved wishlist, notifications center with unread count, and profile settings.
- Backend Service Layer: Centralized asynchronous `ApiService` handling persistent client state (`localStorage`) for products, reviews, orders, addresses, and notifications.

### Phase 3: Seller Centre + Admin Dashboard + Full-Stack Production Readiness (Completed & Validated)
- Separate Seller Portal (`seller.zestmart.pk`) with Bento Grid layout (Ref 04) for financial KPIs, inventory, order fulfillment, airway bill printing (TCS/Leopards), and Meezan/HBL bank payouts.
- Separate Super Admin Portal (`admin.zestmart.pk`) with role-based access control (`Admin`, `Manager`, `Staff`), seller application moderation, FBR compliance monitoring, commission reconciliation, and immutable audit logs.
- Universal Multi-Tenant Portal Switcher Bar (`PortalBar.tsx`) allowing instantaneous switching between Storefront, Seller Centre, and Admin Portal.
- Production PostgreSQL database schema defined via Prisma ORM (`prisma/schema.prisma`) with 3NF normalized relational models, enums, indexes, and cascades.
- Express REST API backend (`server.ts`) with endpoints for authentication, products, sellers, admin metrics, courier dispatch, and coupons.
- Security hardening: RBAC authorization, token verification, FBR digital POS modeling, input validation, and audit logging.
- Containerization: Multi-service `docker-compose.yml` supporting PostgreSQL 16, Redis 7, and Node application.

---

## 3. Technology Stack
- **Customer Storefront:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons.
- **Backend (Upcoming in Phase 2/3):** Node.js, Express, PostgreSQL, Prisma.
- **Containerization:** Docker & Docker Compose.
