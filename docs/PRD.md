# Product Requirements Document (PRD)

## Project Name: ZestMart PK
**Version**: 1.0.0  
**Status**: Approved & Production Ready  
**Target Market**: Pakistan Electronics E-Commerce (`.pk`)  
**Domain**: Multi-Vendor Electronics Marketplace & Technology Importer Hub  

---

## 1. Executive Summary & Product Vision

### 1.1 Brand Identity
**ZestMart PK** is Pakistan's premier multi-vendor electronics marketplace. It bridges certified technology importers located in **Karachi (Saddar)**, **Lahore (Hafeez Centre)**, and **Islamabad (Blue Area)** directly with consumer electronics buyers across 250+ Pakistani cities.

### 1.2 Tagline Sequence
> *"Precision Sound & Flagship Tech That Moves You."*  
> *"Pakistan's Ultimate Choice Tech & Electronics Brand."*  
> *"Certified PTA Approved Devices & Insured Nationwide COD."*  

### 1.3 Core Value Proposition
- **100% Tax-Paid Official PTA Approval**: DIRBS verification for all cellular and flagship mobile hardware.
- **Nationwide Cash on Delivery (COD)**: Doorstep parcel inspection and insured payment via TCS, Leopards, and Trax Express.
- **Official Local Warranty**: Importer tax invoices and 7-day doorstep replacement guarantee.
- **Multi-Tenant Architecture**: Unified platform serving Customers, Importers (Sellers), and Marketplace Operations (Super Admin).

---

## 2. Target Audience & Personas

| Persona | Primary Needs | Key Platform Pain Points Addressed |
| :--- | :--- | :--- |
| **Pakistani Consumer / Professional** | Flagship mobile phones, gaming laptops, and computing gear with genuine PTA clearance. | Eliminates fake non-PTA imports, fraud on prepayment, and unverified warranties. |
| **Verified Tech Importer / Seller** | Scalable digital storefront, automated invoice generation, and courier tracking. | Solves manual inventory updates, fragmented courier bookings, and payment reconciliation. |
| **Marketplace Admin & Operations** | Vendor NTN compliance vetting, catalog governance, and dispute management. | Centralized operations dashboard with role-based access control (RBAC). |

---

## 3. Product Objectives & KPIs

1. **Conversion Optimization**: Frictionless 3-step checkout with address pre-fill and city-based shipping calculation.
2. **Trust & Compliance**: Visible 256-bit SSL encryption indicators, Cloud Spam Shield, FBR POS compliance, and PTA DIRBS badges.
3. **Multi-Device Responsiveness**: Seamless 2-column mobile catalog rendering, slide-over filter drawers, and bottom action bar (`MobileNav.tsx`).
4. **Discoverability**: Dynamic SEO document titles, OpenGraph preview cards, Schema.org JSON-LD rich snippets, and Google Analytics 4 (GA4) event tracking.

---

## 4. Functional Requirements & Feature Specifications

### 4.1 Storefront & Catalog Discovery
- **Hero Presentation**: High-contrast product pedestal slides with sequential reverse-and-forward animated headline taglines (`AnimatedTagline.tsx`).
- **Category Showcase**: Interactive category grid (Smartphones, Laptops, PC Components, Audio, Gaming, Wearables).
- **Product Cards**: High-resolution thumbnails, discount badges, PTA indicators, verified seller tags, and quick-add actions (`ProductCard.tsx`).
- **Quick View Modal**: Slide-over product preview modal with variant option selectors (`ProductDetailModal.tsx`).
- **Shop Discovery**: Comprehensive catalog page with brand, price range, PTA status, COD availability, and vendor filters (`ShopDiscovery.tsx`).

### 4.2 Product Detail Page (PDP)
- **Image Gallery**: Multi-image carousel with zoom thumbnails and responsive column layout (`ProductDetailPage.tsx`).
- **Variant Selectors**: Interactive color and storage/spec option buttons with active ring indicators.
- **Delivery Estimator**: Dynamic city dropdown calculating courier delivery days and shipping fees (e.g. Karachi 1-2 days, Lahore 2-3 days).
- **Ratings & Reviews**: Customer star ratings, verified buyer badges, helpful counters, and review submission form protected by Cloud Shield.

### 4.3 Cart & Multi-Step Checkout
- **Cart Management**: Slide-over drawer (`CartDrawer.tsx`) and full cart page (`CartPage.tsx`) with quantity steppers, coupon codes (e.g. `ZESTPK10`), and subtotal calculations.
- **3-Step Checkout**:
  1. *Step 1: Address Details* — Name, Pakistani mobile number (+92), city, street address, and saved address selection.
  2. *Step 2: Courier Selection* — Choice of TCS, Leopards, or Trax Express with live estimated delivery timeline.
  3. *Step 3: Payment Method* — Cash on Delivery (COD), JazzCash, Easypaisa, Bank Transfer, or Visa/MasterCard.

### 4.4 Post-Purchase & Thank You Experience
- **Order Confirmation Page**: Dedicated `#thank-you` view displaying order summary, delivery details, and tracking number (`ThankYouPage.tsx`).
- **Printable Tax Invoice**: One-click printable tax receipt formatted for consumer records and warranty claims.
- **Courier Tracking Link**: WhatsApp customer updates button (`wa.me`) pre-populated with order ID and courier provider.

### 4.5 Customer Account & History Portal
- **Authentication**: Email/phone sign-in and registration with session persistence in `localStorage`.
- **Order Timeline**: Active consignment timeline with status tracking (Confirmed → Processing → Dispatched → Delivered).
- **Address Book**: Saved default and secondary delivery addresses.
- **Order Cancellation**: Self-service order cancellation before dispatch with reason selection.

### 4.6 Seller Centre (Importer Dashboard)
- **Portal Access**: Role-based access control (`SELLER` role required).
- **KPI Overview**: Real-time gross revenue, total orders fulfilled, active listings, and response rate.
- **Inventory Management**: Add new tech hardware listings with custom titles, categories, prices, stock quantities, and specifications (`SellerDashboard.tsx`).
- **Order Dispatch**: Print airway courier bills and update parcel shipment status.

### 4.7 Super Admin Gateway
- **Operations Console**: Marketplace oversight for `ADMIN`, `MANAGER`, and `STAFF` roles (`AdminDashboard.tsx`).
- **Vendor Compliance**: Merchant verification, NTN audit, and catalog governance.
- **Global Order Desk**: System-wide order status overrides and customer support dispute resolution.

### 4.8 SEO, Analytics & Compliance Tools
- **Dynamic SEO**: Real-time document title and meta description updates (`SEOService.ts`).
- **Google Analytics 4**: Virtual pageview tracking, `view_item`, `add_to_cart`, and `purchase` events (`AnalyticsService.ts`).
- **Schema.org JSON-LD**: Embedded graph containing `WebSite`, `Organization`, `PostalAddress`, `ContactPoint`, and `FAQPage`.
- **Public SEO Assets**: `public/robots.txt` and `public/sitemap.xml`.
- **HTML Site Map Directory**: Interactive full-page site map modal (`SitemapModal.tsx`).
- **Privacy Policy**: Consumer data protection agreement (`PrivacyPolicyModal.tsx`) compliant with PECA 2016 Ordinance.
- **Custom 404 Page**: Interactive Not Found page with product search and popular department links (`NotFoundPage.tsx`).

---

## 5. Technical Architecture & Data Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                          ZestMart PK Frontend                          │
│                   (React 18 + TypeScript + Vite 8)                    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
          ┌─────────────────────────┼─────────────────────────┐
          ▼                         ▼                         ▼
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│   ApiService     │      │   SEOService     │      │ AnalyticsService │
│ (LocalStorage /  │      │ (Dynamic Head /  │      │   (GA4 Engine /  │
│ Auth / Catalog)  │      │ OpenGraph Cards) │      │ Virtual Routing) │
└──────────────────┘      └──────────────────┘      └──────────────────┘
```

---

## 6. Non-Functional Requirements

### 6.1 Performance
- **Build Target**: Modern ES Modules via Vite 8 and esbuild `^0.28.0`.
- **Bundle Optimization**: Minified CSS and JavaScript chunks built in `< 1.5s`.

### 6.2 Accessibility & Mobile First
- **Zero Horizontal Scroll**: Strict `overflow-x: hidden` on viewport.
- **Keyboard Navigation**: Universal `:focus-visible` emerald focus rings on all interactive buttons and inputs.
- **Touch Targets**: Minimum 44px touch targets on mobile bottom nav (`MobileNav.tsx`) and category strips.

### 6.3 Security
- **No Hardcoded Secrets**: Client-side environment variables prefixed with `VITE_`.
- **Cloud Spam Shield**: Honeypot bot protection fields on forms.
- **HTTPS Enforcement**: `upgrade-insecure-requests` Content-Security-Policy header in `index.html`.

---

## 7. Approval & Sign-Off

| Role | Name / Title | Status | Date |
| :--- | :--- | :--- | :--- |
| Lead Software Architect | ZestMart Engineering | Approved | October 2026 |
| Product Manager | ZestMart Product Team | Approved | October 2026 |
