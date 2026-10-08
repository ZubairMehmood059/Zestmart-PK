import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-Memory simulated store matching PostgreSQL & Prisma schema
const state = {
  sellers: [
    {
      id: 'vendor_1',
      name: 'TechHaven Karachi',
      slug: 'techhaven-karachi',
      city: 'Karachi',
      province: 'Sindh',
      status: 'APPROVED',
      isVerified: true,
      joinedYear: 2022,
      rating: 4.9,
      ratingCount: 1420,
      responseRate: '99%',
      deliveryPerformance: '98% on-time',
      commissionRate: 8.5,
      ntnNumber: '7281904-2',
      bankName: 'Meezan Bank Ltd',
      bankAccountTitle: 'TechHaven Enterprise',
      bankIban: 'PK64MEZN0001029384729102',
      grossSalesPKR: 1482900,
      pendingPayoutPKR: 324500,
      activeOrdersCount: 18
    },
    {
      id: 'vendor_2',
      name: 'Khaadi Crafts Multan',
      slug: 'khaadi-crafts-multan',
      city: 'Multan',
      province: 'Punjab',
      status: 'APPROVED',
      isVerified: true,
      joinedYear: 2021,
      rating: 4.8,
      ratingCount: 890,
      responseRate: '97%',
      deliveryPerformance: '96% on-time',
      commissionRate: 8.0,
      ntnNumber: '5829103-9',
      bankName: 'Bank Alfalah',
      bankAccountTitle: 'Khaadi Crafts Multan',
      bankIban: 'PK88ALFH0004928104820194',
      grossSalesPKR: 892000,
      pendingPayoutPKR: 184000,
      activeOrdersCount: 9
    },
    {
      id: 'vendor_3',
      name: 'Lahore Audio Labs',
      slug: 'lahore-audio-labs',
      city: 'Lahore',
      province: 'Punjab',
      status: 'APPROVED',
      isVerified: true,
      joinedYear: 2020,
      rating: 4.9,
      ratingCount: 2150,
      responseRate: '100%',
      deliveryPerformance: '99% on-time',
      commissionRate: 9.0,
      ntnNumber: '8910245-1',
      bankName: 'Habib Bank Ltd (HBL)',
      bankAccountTitle: 'Lahore Audio Labs Pvt Ltd',
      bankIban: 'PK22HABB0009182740192837',
      grossSalesPKR: 2140000,
      pendingPayoutPKR: 490000,
      activeOrdersCount: 24
    },
    {
      id: 'vendor_new_1',
      name: 'Indus Handloom Quetta',
      slug: 'indus-handloom-quetta',
      city: 'Quetta',
      province: 'Balochistan',
      status: 'PENDING_APPROVAL',
      isVerified: false,
      joinedYear: 2026,
      rating: 0,
      ratingCount: 0,
      responseRate: 'New',
      deliveryPerformance: 'Pending dispatch',
      commissionRate: 8.5,
      ntnNumber: '9182736-4',
      bankName: 'Meezan Bank Ltd',
      bankAccountTitle: 'Indus Handloom Quetta',
      bankIban: 'PK64MEZN0009847291028374',
      grossSalesPKR: 0,
      pendingPayoutPKR: 0,
      activeOrdersCount: 0
    }
  ],
  auditLogs: [
    {
      id: 'log_1',
      action: 'USER_LOGIN',
      actor: 'superadmin@zestmart.pk (Admin)',
      ipAddress: '110.39.12.84 (Karachi, PTCL)',
      timestamp: new Date().toISOString(),
      details: 'Superadmin accessed central management portal'
    },
    {
      id: 'log_2',
      action: 'SELLER_APPROVED',
      actor: 'superadmin@zestmart.pk',
      ipAddress: '110.39.12.84',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      details: 'Approved seller TechHaven Karachi after NTN & CNIC verification'
    },
    {
      id: 'log_3',
      action: 'PAYOUT_PROCESSED',
      actor: 'finance_manager@zestmart.pk',
      ipAddress: '39.40.18.22 (Lahore)',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      details: 'Settled Rs. 490,000 to Lahore Audio Labs via 1Link Raast'
    }
  ],
  coupons: [
    { code: 'ZESTPK10', discountPercent: 10, maxDiscountPKR: 1500, active: true, usedCount: 342 },
    { code: 'WELCOMEPK', discountPercent: 15, maxDiscountPKR: 2000, active: true, usedCount: 189 },
    { code: 'AZADI500', discountPercent: 5, maxDiscountPKR: 500, active: true, usedCount: 94 }
  ]
};

// -------------------------------------------------------------
// REST API ROUTES
// -------------------------------------------------------------

// Healthcheck
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'ZestMart PK Backend REST API',
    database: 'PostgreSQL & Prisma Ready',
    timestamp: new Date().toISOString()
  });
});

// Admin Metrics
app.get('/api/admin/metrics', (_req: Request, res: Response) => {
  const totalGMV = state.sellers.reduce((sum, s) => sum + s.grossSalesPKR, 0);
  const totalSellers = state.sellers.length;
  const pendingApprovals = state.sellers.filter((s) => s.status === 'PENDING_APPROVAL').length;
  const totalCommissionPKR = Math.round(totalGMV * 0.085);

  res.json({
    totalGMV,
    totalSellers,
    pendingApprovals,
    totalCommissionPKR,
    activeOrders: 51,
    nationwideHubs: ['Karachi Hub (KHI-01)', 'Lahore Fulfillment (LHE-02)', 'Islamabad Northern Hub (ISB-01)']
  });
});

// Admin Sellers List & Moderation
app.get('/api/admin/sellers', (_req: Request, res: Response) => {
  res.json(state.sellers);
});

app.post('/api/admin/sellers/:id/approve', (req: Request, res: Response) => {
  const seller = state.sellers.find((s) => s.id === req.params.id);
  if (!seller) return res.status(404).json({ error: 'Seller not found' });

  seller.status = 'APPROVED';
  seller.isVerified = true;

  state.auditLogs.unshift({
    id: `log_${Date.now()}`,
    action: 'SELLER_APPROVED',
    actor: 'admin@zestmart.pk',
    ipAddress: req.ip || '127.0.0.1',
    timestamp: new Date().toISOString(),
    details: `Approved seller ${seller.name} (${seller.city})`
  });

  res.json({ success: true, seller });
});

app.post('/api/admin/sellers/:id/suspend', (req: Request, res: Response) => {
  const seller = state.sellers.find((s) => s.id === req.params.id);
  if (!seller) return res.status(404).json({ error: 'Seller not found' });

  seller.status = 'SUSPENDED';

  state.auditLogs.unshift({
    id: `log_${Date.now()}`,
    action: 'SELLER_SUSPENDED',
    actor: 'admin@zestmart.pk',
    ipAddress: req.ip || '127.0.0.1',
    timestamp: new Date().toISOString(),
    details: `Suspended seller ${seller.name} due to policy review`
  });

  res.json({ success: true, seller });
});

// Audit Logs
app.get('/api/admin/audit-logs', (_req: Request, res: Response) => {
  res.json(state.auditLogs);
});

// Coupons List & Create
app.get('/api/admin/coupons', (_req: Request, res: Response) => {
  res.json(state.coupons);
});

app.post('/api/admin/coupons', (req: Request, res: Response) => {
  const { code, discountPercent, maxDiscountPKR } = req.body;
  if (!code || !discountPercent) {
    return res.status(400).json({ error: 'Code and discount percentage are required' });
  }

  const newCoupon = {
    code: code.toUpperCase().trim(),
    discountPercent: Number(discountPercent),
    maxDiscountPKR: Number(maxDiscountPKR || 1000),
    active: true,
    usedCount: 0
  };

  state.coupons.unshift(newCoupon);

  state.auditLogs.unshift({
    id: `log_${Date.now()}`,
    action: 'COUPON_CREATED',
    actor: 'admin@zestmart.pk',
    ipAddress: req.ip || '127.0.0.1',
    timestamp: new Date().toISOString(),
    details: `Created promo code ${newCoupon.code} (${newCoupon.discountPercent}% off)`
  });

  res.json({ success: true, coupon: newCoupon });
});

// Start Express Listener if run directly
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`[ZestMart PK] Backend API running on port ${PORT}`);
});

export default app;
