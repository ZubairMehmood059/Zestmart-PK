# ZestMart PK — Production Security Architecture

## 1. Authentication & Session Security
- **Customer Auth**: Phone-based authentication with 5-minute expiring SMS OTP tokens to prevent credential stuffing.
- **Seller & Staff Auth**: Email and bcrypt-hashed passwords combined with mandatory SMS/Authenticator 2FA.
- **Stateless Bearer Tokens**: HMAC SHA-256 JWT tokens with 7-day expiration and strict payload verification.

## 2. Multi-Vendor Isolation & Authorization (RBAC)
- All seller operations (updating inventory, viewing customer orders, editing bank details) are strictly scoped to the authenticated seller's ID.
- RBAC tiers:
  - **`Admin`**: Unrestricted platform access including financial settlements, audit logs, and staff assignments.
  - **`Manager`**: Catalog moderation, seller applications approval, promotional campaigns.
  - **`Staff`**: Read-only consignment tracking and dispute support.
  - **`Seller`**: Store-scoped catalog and order fulfillment only.
  - **`Customer`**: Self-service profile, orders, and addresses.

## 3. Data Protection & FBR Compliance
- **FBR Digital POS Compliance**: Prepared for real-time digital invoice transmission via FBR POS APIs with unique fiscal QR codes.
- **Input Validation**: Strict schema validation to prevent SQL injection (enforced via Prisma parameterized queries) and XSS protection on all user inputs.
- **Audit Logging**: Every administrative action (approvals, role modifications, payout releases) is logged with actor identity, timestamp, IP address, and details.
