# ZestMart PK — Design System Specification

## 1. Core Principles
1. **Minimalist UI + Flat UI 2.0 + Emerald Identity**: Built on a crisp neutral canvas with purposeful emerald green interactive anchors.
2. **Zero-Pill Discipline**: Metadata (categories, tags, ratings, prices) are rendered as clean, unboxed text with subtle typographic separators (`·` or `/`). Rounded pill enclosures are banned for static metadata.
3. **Typography Hierarchy**: Primary typeface `Plus Jakarta Sans` with `Cabinet Grotesk` display accents. Tabular figures (`tabular-nums`) for all Pakistani Rupee pricing and metrics.
4. **Single-Elevation Depth**: Clean hairline borders (`1px solid rgba(0,0,0,0.08)`) with soft, low-blur shadows. No stacked cards within cards.
5. **Mobile-First & 15% Sticky Budget**: Fixed headers and mobile bottom navigation strictly stay under 15% of mobile viewport height.

---

## 2. Color Tokens
- **Canvas (60%):** `#F8FAFC` (Slate-50) & `#FFFFFF` (Pure White).
- **Structural Surfaces (30%):** Slate-100 borders, Slate-800/900 contrast containers, Slate-700 text.
- **Accent Budget (10%):**
  - Primary Action / Emerald Brand: `#059669` (Emerald 600) / `#047857` (Emerald 700)
  - Subtle Emerald Tint: `#ECFDF5` (Emerald 50)
  - Discount / Alert: `#E11D48` (Rose 600)
  - Star Rating: `#F59E0B` (Amber 500)

---

## 3. Component Contract
- **Top Bar Contract**: Exactly 3 zones (Zone 1: Brand Wordmark "ZestMart.pk", Zone 2: Category + Search input, Zone 3: Wishlist, Cart Drawer, Customer Account).
- **Product Card**: High-contrast product imagery (aspect 4:3), verified seller label, 2-line clamped title, PKR tabular pricing with strike-through original, subtle discount badge, quick Add-to-Cart button with responsive touch target ($\ge 44px$).
- **Vendor Dashboard**: Bento Grid composition balancing 4 high-density metric cards, pending dispatch alerts, and live fulfillment order tables.
