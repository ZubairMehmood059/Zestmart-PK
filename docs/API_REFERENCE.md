# ZestMart PK — REST API Reference

All endpoints are hosted under `/api/*`.

## 1. Authentication
- `POST /api/auth/customer-login`: Send 4-digit SMS OTP to Pakistani phone (`03XX-XXXXXXX`).
- `POST /api/auth/verify-otp`: Validate token and receive JWT bearer session.
- `POST /api/auth/seller-login`: Seller portal authentication with 2FA requirement.
- `POST /api/auth/admin-login`: Super Admin authentication with RBAC role authorization.

## 2. Products & Catalog
- `GET /api/products`: List products with category, price range, COD eligibility, and seller query filters.
- `GET /api/products/:id`: Fetch single product with specifications, vendor details, and reviews.
- `POST /api/products`: Seller adds new product listing (scoped to seller session).
- `PUT /api/products/:id`: Seller updates price, stock, or description.
- `DELETE /api/products/:id`: Seller or Admin removes product.

## 3. Orders & Courier Dispatch
- `GET /api/orders`: List orders scoped to customer or seller.
- `POST /api/orders`: Place order with COD, JazzCash, Easypaisa, or Raast bank transfer.
- `POST /api/orders/:id/dispatch`: Seller generates courier consignment and printable airway bill (TCS / Leopards).
- `POST /api/orders/:id/cancel`: Customer cancels order before dispatch with reason audit.

## 4. Admin Governance & Moderation
- `GET /api/admin/metrics`: Platform overview metrics (GMV in PKR, commission revenue, active sellers).
- `GET /api/admin/sellers`: Review seller applications.
- `POST /api/admin/sellers/:id/approve`: Approve seller and issue merchant certificate.
- `POST /api/admin/sellers/:id/suspend`: Suspend seller for policy violations.
- `GET /api/admin/audit-logs`: Immutable regulatory and operational audit trails.
- `POST /api/admin/coupons`: Publish nationwide discount coupons.
