# ZestMart PK — Pakistan's Ultimate Electronics Marketplace

**ZestMart PK** is a production-grade, multi-vendor electronics e-commerce platform and multi-tenant portal designed specifically for the Pakistani consumer and technology import market.

It connects verified technology importers in **Karachi (Saddar)**, **Lahore (Hafeez Centre)**, and **Islamabad (Blue Area)** directly with tech enthusiasts, professionals, and businesses across 250+ Pakistani cities.

---

## 🚀 Key Features & Highlights

### 🛍️ Storefront & Customer Experience
- **PTA Approved Flagship Verification**: 100% tax-paid smartphones (Apple iPhone, Samsung Galaxy, Google Pixel) verified via DIRBS.
- **Nationwide Cash on Delivery (COD)**: Doorstep parcel inspection and insured cash on delivery across 250+ cities.
- **Express Courier Integration**: Logistics dispatch tracking via TCS, Leopards, and Trax Express.
- **Dynamic Sequential Animated Taglines**: Letter-by-letter typing animation with reverse and forward cycling across brand taglines.
- **Interactive Multi-Step Checkout**: 3-step checkout with address validation, courier partner selection, and payment options (COD, JazzCash, Easypaisa, Card, Bank Transfer).
- **Dedicated Thank You Page**: Post-purchase confirmation with printable tax invoice, live courier tracking link, and WhatsApp updates.
- **Customer Account Portal**: Profile management, saved delivery addresses, active shipment timelines, and order cancellation.

### 🛡️ SEO, Security & Performance
- **Dynamic Title & Meta Synchronizer**: Real-time document title, meta description, and OpenGraph/Twitter social cards synced per route/view via `SEOService`.
- **Schema.org Structured Data**: Embedded JSON-LD rich snippets for `WebSite`, `Organization`, `Store`, and `FAQPage`.
- **Google Analytics 4 (GA4)**: Dynamic tracking service measuring page views, product views, cart additions, and order purchases (`AnalyticsService`).
- **Cloud Spam Shield**: Bot filtering and honeypot protection integrated into checkout, registration, newsletter, and review forms.
- **256-Bit SSL Indicator**: Visual HTTPS encryption indicators and CSP security context.
- **Comprehensive Image Alt Text**: Accessible, SEO-enhanced `alt` descriptions on all product cards, hero banners, galleries, and avatars.
- **HTML Site Map Directory & XML Sitemap**: Crawlable `/public/sitemap.xml` and interactive `SitemapModal` directory.
- **Robots.txt Configuration**: Configured crawler directives and sitemap URL location.
- **Custom 404 Not Found Page**: Friendly 404 page featuring interactive tech search, popular department links, and quick returns.

### 🏢 Multi-Tenant Portals (RBAC)
1. **Customer Storefront**: Interactive product catalog, search, wishlist, cart drawer, PDP, and order placement.
2. **Seller Centre**: Merchant portal for tech importers to manage product listings, track seller KPIs, and fulfill customer orders.
3. **Super Admin Gateway**: Centralized management portal for marketplace governance, vendor compliance, and order status updates.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide React Icons
- **Fonts**: Plus Jakarta Sans, Cabinet Grotesk
- **State & Data**: React State, Context, LocalStorage Persistence (`ApiService`)
- **Analytics & SEO**: Custom `SEOService` & `AnalyticsService` (GA4 `G-ZESTMARTPK`)

---

## 📦 Directory Structure

```
├── public/
│   ├── favicon.svg          # Marketplace brand favicon
│   ├── og-image.svg         # OpenGraph preview card image
│   ├── robots.txt           # Search engine crawler directives
│   └── sitemap.xml          # XML Sitemap index
├── src/
│   ├── components/
│   │   ├── account/         # Customer Account & Track Order Modals
│   │   ├── admin/           # Super Admin Console & Operations
│   │   ├── auth/            # Multi-Role Portal Authentication Hub
│   │   ├── cart/            # Cart Page & Slide-over Drawer
│   │   ├── checkout/        # Multi-Step Checkout & Thank You Page
│   │   ├── common/          # Cloud Spam Protection & 404 Page
│   │   ├── layout/          # Header, TopBanner, Footer, MobileNav
│   │   ├── legal/           # Privacy Policy & Sitemap Modals
│   │   ├── pdp/             # Product Detail Page & Quick View Modal
│   │   ├── seller/          # Seller Centre Dashboard
│   │   ├── storefront/      # Hero Banner, Grids, FAQs, Testimonials
│   │   └── ui/              # Buttons, Badges, Modals, AnimatedTagline
│   ├── config/              # Constant data, cities, coupons
│   ├── services/            # ApiService, SEOService, AnalyticsService
│   ├── types/               # TypeScript interfaces & types
│   ├── App.tsx              # Root App Component & Route Synchronization
│   ├── main.tsx             # Entry point
│   └── index.css            # Global Tailwind CSS import
├── index.html               # Entry HTML with Schema.org JSON-LD
├── metadata.json            # AI Studio applet metadata
└── package.json             # Dependencies and scripts
```

---

## 🏁 Getting Started

### Prerequisites
- Node.js 18+
- npm or bun

### Local Development

```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev
```

### Build & Type Check

```bash
# Type check and lint
npm run lint

# Production build
npm run build
```

---

## 📄 License & Compliance

© 2026 ZestMart PK. Registered under the **Pakistan Electronic Transactions Ordinance**.
All devices sold on ZestMart PK come with official importer warranty and 100% PTA DIRBS approval.
