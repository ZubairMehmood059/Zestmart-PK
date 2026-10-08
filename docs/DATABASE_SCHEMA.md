# ZestMart PK — Database Architecture & Schema Specification

## 1. Overview
The database layer for ZestMart PK is architected in PostgreSQL and defined using Prisma ORM in `prisma/schema.prisma`. It is normalized to 3NF and designed for high throughput nationwide marketplace operations.

---

## 2. Core Relational Entities

### A. Authentication & RBAC
- **`User`**: Base identity for Customers, Sellers, Staff, Managers, and Super Admins.
- **`UserRole` Enum**: `CUSTOMER`, `SELLER`, `STAFF`, `MANAGER`, `ADMIN`.
- **`Address`**: Normalized Pakistani delivery addresses with Phone, City, Province, and Street landmarks.

### B. Multi-Vendor Model
- **`Seller`**:
  - Scoped to user id.
  - Legal business name, FBR NTN (`ntnNumber`), and CNIC.
  - City and registered pickup hub.
  - Meezan / HBL / Bank Alfalah IBAN.
  - Commission rate (default 8.5%).
  - Status enum: `PENDING_APPROVAL`, `APPROVED`, `SUSPENDED`, `REJECTED`.
- **`SellerPayout`**: Weekly settlement records with 1Link / Raast reference numbers.

### C. Catalog & Inventory
- **`Category`**: Hierarchical category tree with category-specific commission rates.
- **`Product`**: Product title, SKU, Pakistani Rupee pricing (`Decimal(10,2)`), stock quantity, and moderation approval status.
- **`ProductImage`**: Multi-asset URLs with primary display flags.
- **`ProductVariantOption`**: Color and size options with price delta adjustments.

### D. Orders & Courier Logistics
- **`Order`**: Order header with Pakistani tracking number (e.g., `TCS-PK-XXXXXX`), destination city, subtotal, and payment status.
- **`OrderItem`**: Line items scoped to specific sellers, containing unit price, quantity, and marketplace commission calculated at purchase time.
- **`ShipmentMilestone`**: Real-time event log populated by courier webhooks (TCS, Leopards, Trax).

### E. Regulatory & Compliance
- **`AuditLog`**: Immutable audit logs capturing administrative actions, IP address, user agent, and payload.
