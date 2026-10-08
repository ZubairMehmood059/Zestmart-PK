import React, { useState, useEffect } from 'react';
import { Product, Vendor, UserRole, AuthSession } from '../../types';
import { VENDORS } from '../../config/data';
import { ApiService } from '../../services/api';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import {
  ShieldAlert,
  Users,
  Store,
  DollarSign,
  Package,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sliders,
  Tag,
  Lock,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  FileText,
  KeyRound,
  LogOut
} from 'lucide-react';

interface AdminDashboardProps {
  onSwitchPortal: (portal: 'storefront' | 'seller' | 'admin') => void;
  authSession?: AuthSession | null;
  onOpenAuthModal?: (targetPortal?: 'storefront' | 'seller' | 'admin') => void;
  onLogout?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onSwitchPortal,
  authSession,
  onOpenAuthModal,
  onLogout
}) => {
  const isAuthorized = ApiService.canAccessPortal('admin', authSession || null);

  // RBAC active role
  const [currentRole, setCurrentRole] = useState<'ADMIN' | 'MANAGER' | 'STAFF'>(() => {
    if (authSession && (authSession.role === 'ADMIN' || authSession.role === 'MANAGER' || authSession.role === 'STAFF')) {
      return authSession.role;
    }
    return 'ADMIN';
  });

  useEffect(() => {
    if (authSession && (authSession.role === 'ADMIN' || authSession.role === 'MANAGER' || authSession.role === 'STAFF')) {
      setCurrentRole(authSession.role);
    }
  }, [authSession]);

  const [activeTab, setActiveTab] = useState<
    'overview' | 'sellers' | 'moderation' | 'payouts' | 'coupons' | 'rbac' | 'audit'
  >('overview');

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showAdminToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Sellers state with approval simulation
  const [sellersList, setSellersList] = useState<
    (Vendor & { status: 'APPROVED' | 'PENDING_APPROVAL' | 'SUSPENDED'; ntnNumber?: string })[]
  >([
    {
      ...VENDORS[0],
      status: 'APPROVED',
      ntnNumber: '7281904-2'
    },
    {
      ...VENDORS[1],
      status: 'APPROVED',
      ntnNumber: '5829103-9'
    },
    {
      ...VENDORS[2],
      status: 'APPROVED',
      ntnNumber: '8910245-1'
    },
    {
      id: 'vendor_pending_1',
      name: 'Peshawar Silicon & Robotics',
      slug: 'peshawar-silicon-robotics',
      city: 'Peshawar',
      province: 'KPK',
      rating: 0,
      ratingCount: 0,
      isVerified: false,
      joinedYear: 2026,
      responseRate: 'New',
      deliveryPerformance: 'Pending verification',
      badge: 'Electronics Applicant',
      status: 'PENDING_APPROVAL',
      ntnNumber: '9182736-4'
    }
  ]);

  // Coupons state
  const [coupons, setCoupons] = useState([
    { code: 'ZESTPK10', discountPercent: 10, maxDiscountPKR: 1500, usedCount: 342, active: true },
    { code: 'WELCOMEPK', discountPercent: 15, maxDiscountPKR: 2000, usedCount: 189, active: true },
    { code: 'AZADI500', discountPercent: 5, maxDiscountPKR: 500, usedCount: 94, active: true }
  ]);

  // New Coupon modal
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newPercent, setNewPercent] = useState('10');
  const [newMax, setNewMax] = useState('1500');

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState([
    {
      id: 'log_1',
      actor: 'superadmin@zestmart.pk (Admin)',
      action: 'USER_LOGIN',
      ip: '110.39.12.84 (Karachi, PTCL)',
      timestamp: 'Today, 10:14 AM',
      details: 'Superadmin accessed central management portal'
    },
    {
      id: 'log_2',
      actor: 'superadmin@zestmart.pk',
      action: 'SELLER_APPROVED',
      ip: '110.39.12.84',
      timestamp: 'Yesterday, 04:30 PM',
      details: 'Approved seller TechHaven Karachi after NTN & CNIC verification'
    },
    {
      id: 'log_3',
      actor: 'operations_mgr@zestmart.pk (Manager)',
      action: 'COUPON_CREATED',
      ip: '39.40.18.22 (Lahore)',
      timestamp: '2 days ago',
      details: 'Published nationwide campaign code ZESTPK10 (10% off)'
    },
    {
      id: 'log_4',
      actor: 'finance_officer@zestmart.pk (Staff)',
      action: 'PAYOUT_PROCESSED',
      ip: '115.186.14.90 (Islamabad)',
      timestamp: '3 days ago',
      details: 'Released Rs. 490,000 settlement to Lahore Audio Labs via Meezan Bank'
    }
  ]);

  const handleApproveSeller = (sellerId: string) => {
    setSellersList((prev) =>
      prev.map((s) => (s.id === sellerId ? { ...s, status: 'APPROVED', isVerified: true } : s))
    );

    setAuditLogs([
      {
        id: `log_${Date.now()}`,
        actor: `${currentRole.toLowerCase()}@zestmart.pk`,
        action: 'SELLER_APPROVED',
        ip: '110.39.12.84',
        timestamp: 'Just now',
        details: `Approved seller #${sellerId} after tax compliance check`
      },
      ...auditLogs
    ]);

    showAdminToast('Seller application approved! Merchant notified via SMS & Email.');
  };

  const handleSuspendSeller = (sellerId: string) => {
    setSellersList((prev) =>
      prev.map((s) => (s.id === sellerId ? { ...s, status: 'SUSPENDED' } : s))
    );

    setAuditLogs([
      {
        id: `log_${Date.now()}`,
        actor: `${currentRole.toLowerCase()}@zestmart.pk`,
        action: 'SELLER_SUSPENDED',
        ip: '110.39.12.84',
        timestamp: 'Just now',
        details: `Suspended seller #${sellerId}`
      },
      ...auditLogs
    ]);

    showAdminToast('Seller account status updated to suspended.');
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode) return;

    const newCoupon = {
      code: newCode.toUpperCase().trim(),
      discountPercent: Number(newPercent),
      maxDiscountPKR: Number(newMax),
      usedCount: 0,
      active: true
    };

    setCoupons([newCoupon, ...coupons]);
    setAuditLogs([
      {
        id: `log_${Date.now()}`,
        actor: `${currentRole.toLowerCase()}@zestmart.pk`,
        action: 'COUPON_CREATED',
        ip: '110.39.12.84',
        timestamp: 'Just now',
        details: `Created campaign code ${newCoupon.code} (${newCoupon.discountPercent}% off)`
      },
      ...auditLogs
    ]);

    setCouponModalOpen(false);
    setNewCode('');
    showAdminToast(`Coupon "${newCoupon.code}" published nationwide!`);
  };

  // RBAC Permission checks
  const canApproveSellers = currentRole === 'ADMIN' || currentRole === 'MANAGER';
  const canManageFinances = currentRole === 'ADMIN';
  const canManageCoupons = currentRole === 'ADMIN' || currentRole === 'MANAGER';
  const canManageStaff = currentRole === 'ADMIN';

  // Protect view if unauthorized
  if (!isAuthorized) {
    return (
      <div className="min-h-[80vh] bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <Badge variant="amber" size="sm">
              403 Forbidden
            </Badge>
            <h2 className="text-xl font-bold text-slate-900">Administrative Portal Restricted</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Access to this central marketplace management console requires an authenticated Super Admin, Operations Manager, or Compliance Staff session.
            </p>
          </div>
          <div className="pt-3 flex flex-col gap-2">
            {onOpenAuthModal && (
              <Button
                variant="primary"
                size="md"
                onClick={() => onOpenAuthModal('admin')}
                className="w-full flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Authenticate as Administrator</span>
              </Button>
            )}
            <Button
              variant="outline"
              size="md"
              onClick={() => onSwitchPortal('storefront')}
              className="w-full"
            >
              Return to Customer Storefront
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-16">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in border border-amber-500/50">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Admin Top Header */}
      <header className="sticky top-0 z-40 bg-slate-950 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => onSwitchPortal('storefront')}
                className="flex items-baseline gap-1 cursor-pointer focus:outline-none text-left"
              >
                <span className="text-xl font-black tracking-tight text-white hover:text-emerald-400 transition-colors">
                  Zest<span className="text-emerald-500">Mart</span>
                </span>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-800 uppercase">
                  Super Admin
                </span>
              </button>

              <span className="text-slate-800 hidden sm:inline">|</span>

              {/* RBAC Role Selector Switcher */}
              <div className="flex items-center gap-2 text-xs">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-slate-400 hidden sm:inline">Active Role:</span>
                <select
                  value={currentRole}
                  onChange={(e) =>
                    setCurrentRole(e.target.value as 'ADMIN' | 'MANAGER' | 'STAFF')
                  }
                  className="bg-slate-900 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                >
                  <option value="ADMIN">Super Admin (Full Access)</option>
                  <option value="MANAGER">Operations Manager</option>
                  <option value="STAFF">Support Staff (Restricted)</option>
                </select>
              </div>
            </div>

            {/* Portal Switcher */}
            <div className="flex items-center gap-2 sm:gap-3 text-xs">
              <button
                onClick={() => onSwitchPortal('seller')}
                className="text-slate-300 hover:text-white font-medium cursor-pointer hidden md:inline"
              >
                Seller Centre &rarr;
              </button>
              <button
                onClick={() => onSwitchPortal('storefront')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Storefront</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              {onLogout && (
                <button
                  onClick={onLogout}
                  className="bg-slate-900 hover:bg-rose-950/80 text-slate-300 hover:text-rose-300 font-semibold px-2.5 py-1.5 rounded-lg border border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Role Warning / Context Banner */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white">
                  Marketplace Governance &amp; Central Operations
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 uppercase">
                  {currentRole} Access
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {currentRole === 'ADMIN' && 'Full authority over FBR compliance, seller onboarding, bank settlements, and security audit trails.'}
                {currentRole === 'MANAGER' && 'Operations authority: Review sellers, approve products, and manage nationwide discount campaigns.'}
                {currentRole === 'STAFF' && 'Support mode: Read-only access to customer consignments and dispute resolution.'}
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-400">
            FBR POS: <span className="text-emerald-400 font-bold">Online (Active)</span>
          </div>
        </div>

        {/* Tab Headers */}
        <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 px-4 border-b-2 -mb-px whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'overview'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Platform Overview
          </button>
          <button
            onClick={() => setActiveTab('sellers')}
            className={`py-3.5 px-4 border-b-2 -mb-px whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'sellers'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Sellers &amp; Approvals ({sellersList.filter((s) => s.status === 'PENDING_APPROVAL').length} Pending)
          </button>
          <button
            onClick={() => setActiveTab('payouts')}
            className={`py-3.5 px-4 border-b-2 -mb-px whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'payouts'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Commissions &amp; Payouts
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`py-3.5 px-4 border-b-2 -mb-px whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'coupons'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Coupons &amp; Campaigns ({coupons.length})
          </button>
          <button
            onClick={() => setActiveTab('rbac')}
            className={`py-3.5 px-4 border-b-2 -mb-px whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'rbac'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Staff &amp; RBAC Matrix
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`py-3.5 px-4 border-b-2 -mb-px whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'audit'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Security Audit Trail
          </button>
        </div>

        {/* TAB 1: PLATFORM OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-2">
                <span className="text-xs text-slate-500 font-medium">Total Marketplace GMV (PKR)</span>
                <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
                  Rs. 4,514,900
                </div>
                <span className="text-[11px] text-emerald-700 font-semibold block">
                  +24.1% MoM nationwide
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-2">
                <span className="text-xs text-slate-500 font-medium">Active Pakistani Sellers</span>
                <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
                  {sellersList.filter((s) => s.status === 'APPROVED').length} Stores
                </div>
                <span className="text-[11px] text-amber-700 font-semibold block">
                  1 application awaiting review
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-2">
                <span className="text-xs text-slate-500 font-medium">Marketplace Commission (8.5%)</span>
                <div className="text-2xl font-extrabold text-emerald-700 tabular-nums">
                  Rs. 383,766
                </div>
                <span className="text-[11px] text-slate-400 block">
                  Net platform revenue collected
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-2">
                <span className="text-xs text-slate-500 font-medium">Nationwide Logistics Hubs</span>
                <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
                  3 Hubs
                </div>
                <span className="text-[11px] text-slate-500 block">
                  Karachi (KHI), Lahore (LHE), Islamabad (ISB)
                </span>
              </div>
            </div>

            {/* Courier Performance Split */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Nationwide Courier Partner Routing Breakdown
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>TCS Express Pakistan</span>
                    <span className="text-emerald-700">62% Volume</span>
                  </div>
                  <p className="text-slate-500 text-[11px]">Primary express route for Metros (KHI, LHE, ISB)</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Leopards Courier</span>
                    <span className="text-blue-700">26% Volume</span>
                  </div>
                  <p className="text-slate-500 text-[11px]">Heavy goods &amp; secondary Punjab / Sindh cities</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Trax Logistics</span>
                    <span className="text-amber-700">12% Volume</span>
                  </div>
                  <p className="text-slate-500 text-[11px]">Northern areas, KPK &amp; Balochistan reach</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SELLERS & VERIFICATION */}
        {activeTab === 'sellers' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Seller Approvals &amp; Compliance Moderation
                </h2>
                <p className="text-xs text-slate-500">
                  Review Pakistani CNIC, FBR NTN tax certificates, and verified bank details
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Store &amp; City</th>
                    <th className="px-4 py-3">FBR NTN</th>
                    <th className="px-4 py-3">Performance</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sellersList.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3.5">
                        <span className="font-bold text-slate-900 block">{s.name}</span>
                        <span className="text-[11px] text-slate-500">{s.city}, {s.province}</span>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-slate-700">
                        {s.ntnNumber || 'Pending Filing'}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-slate-800 font-semibold block">{s.deliveryPerformance}</span>
                        <span className="text-[11px] text-slate-400">Response: {s.responseRate}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            s.status === 'APPROVED'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : s.status === 'PENDING_APPROVAL'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {s.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right space-x-2">
                        {s.status === 'PENDING_APPROVAL' ? (
                          <button
                            disabled={!canApproveSellers}
                            onClick={() => handleApproveSeller(s.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-colors"
                          >
                            Approve Seller
                          </button>
                        ) : s.status === 'APPROVED' ? (
                          <button
                            disabled={!canApproveSellers}
                            onClick={() => handleSuspendSeller(s.id)}
                            className="text-rose-600 hover:text-rose-800 disabled:opacity-40 font-semibold cursor-pointer"
                          >
                            Suspend
                          </button>
                        ) : (
                          <button
                            disabled={!canApproveSellers}
                            onClick={() => handleApproveSeller(s.id)}
                            className="text-emerald-700 font-semibold hover:underline"
                          >
                            Reactivate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: COMMISSIONS & PAYOUTS */}
        {activeTab === 'payouts' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Commissions Reconciliation &amp; Bank Transfers
                </h2>
                <p className="text-xs text-slate-500">
                  Automated marketplace fee collection (8.5%) and Meezan Bank / 1Link escrow payouts
                </p>
              </div>

              <span className="text-xs bg-slate-100 text-slate-800 px-3 py-1 rounded-md font-semibold">
                Settlement Cycle: Every Friday 06:00 PM
              </span>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div className="p-4 flex items-center justify-between bg-white">
                <div>
                  <h4 className="font-bold text-slate-900">TechHaven Karachi</h4>
                  <p className="text-slate-500">IBAN: PK64 MEZN 0001 0293 8472 9102 (Meezan Bank)</p>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-sm text-slate-900 block tabular-nums">
                    Rs. 324,500
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold">
                    Net after 8.5% Commission (Rs. 27,582)
                  </span>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={!canManageFinances}
                  onClick={() => showAdminToast('Payout authorized via 1Link Raast.')}
                >
                  Release Settlement
                </Button>
              </div>

              <div className="p-4 flex items-center justify-between bg-white">
                <div>
                  <h4 className="font-bold text-slate-900">Hafeez Centre Tech Hub</h4>
                  <p className="text-slate-500">IBAN: PK88 ALFH 0004 9281 0482 0194 (Bank Alfalah Gulberg)</p>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-sm text-slate-900 block tabular-nums">
                    Rs. 484,000
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold">
                    Net after 7.0% Commission (Rs. 33,880)
                  </span>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={!canManageFinances}
                  onClick={() => showAdminToast('Payout authorized via 1Link Raast.')}
                >
                  Release Settlement
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: COUPONS & CAMPAIGNS */}
        {activeTab === 'coupons' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Promotional Campaigns &amp; Coupons
                </h2>
                <p className="text-xs text-slate-500">
                  Manage nationwide promo codes and discount ceilings
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                leftIcon={<Tag className="w-4 h-4" />}
                disabled={!canManageCoupons}
                onClick={() => setCouponModalOpen(true)}
              >
                Create Promo Code
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {coupons.map((c) => (
                <div
                  key={c.code}
                  className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-extrabold text-sm text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {c.code}
                    </span>
                    <span className="text-emerald-700 font-bold">Active</span>
                  </div>
                  <p className="font-bold text-slate-900">{c.discountPercent}% Off Nationwide</p>
                  <p className="text-slate-500">Max Cap: Rs. {c.maxDiscountPKR.toLocaleString('en-PK')}</p>
                  <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                    Redeemed: {c.usedCount} orders
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: STAFF & RBAC MATRIX */}
        {activeTab === 'rbac' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Role-Based Access Control (RBAC) Matrix
                </h2>
                <p className="text-xs text-slate-500">
                  Strict enforcement of operational permissions across Admin, Manager, and Staff
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Permission Scope</th>
                    <th className="px-4 py-3 text-center">Super Admin</th>
                    <th className="px-4 py-3 text-center">Operations Manager</th>
                    <th className="px-4 py-3 text-center">Support Staff</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-900">Seller Approval &amp; Suspension</td>
                    <td className="px-4 py-3 text-center text-emerald-600 font-bold">✓ Granted</td>
                    <td className="px-4 py-3 text-center text-emerald-600 font-bold">✓ Granted</td>
                    <td className="px-4 py-3 text-center text-slate-400">✗ Denied</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-900">Bank Payout Authorization</td>
                    <td className="px-4 py-3 text-center text-emerald-600 font-bold">✓ Granted</td>
                    <td className="px-4 py-3 text-center text-slate-400">✗ Denied</td>
                    <td className="px-4 py-3 text-center text-slate-400">✗ Denied</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-900">Campaign / Coupon Creation</td>
                    <td className="px-4 py-3 text-center text-emerald-600 font-bold">✓ Granted</td>
                    <td className="px-4 py-3 text-center text-emerald-600 font-bold">✓ Granted</td>
                    <td className="px-4 py-3 text-center text-slate-400">✗ Denied</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-900">Order Tracking &amp; Customer Support</td>
                    <td className="px-4 py-3 text-center text-emerald-600 font-bold">✓ Granted</td>
                    <td className="px-4 py-3 text-center text-emerald-600 font-bold">✓ Granted</td>
                    <td className="px-4 py-3 text-center text-emerald-600 font-bold">✓ Granted</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-900">Security Audit Logs Access</td>
                    <td className="px-4 py-3 text-center text-emerald-600 font-bold">✓ Granted</td>
                    <td className="px-4 py-3 text-center text-slate-400">✗ Denied</td>
                    <td className="px-4 py-3 text-center text-slate-400">✗ Denied</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: SECURITY AUDIT TRAIL */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Security &amp; Compliance Audit Logs
                </h2>
                <p className="text-xs text-slate-500">
                  Immutable event trail for regulatory, tax, and administrative actions
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {auditLogs.map((log) => (
                <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{log.action}</span>
                      <span className="text-[11px] text-slate-400">by {log.actor}</span>
                    </div>
                    <p className="text-slate-600">{log.details}</p>
                  </div>
                  <div className="text-right text-[11px] text-slate-400 shrink-0">
                    <p>{log.timestamp}</p>
                    <p className="font-mono">{log.ip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Create Coupon Modal */}
      {couponModalOpen && (
        <Modal
          isOpen={couponModalOpen}
          onClose={() => setCouponModalOpen(false)}
          title="Create Nationwide Coupon"
          subtitle="Generate discount code for ZestMart PK buyers"
        >
          <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
            <Input
              label="Coupon Code"
              required
              placeholder="e.g. EIDMUBARAK"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Discount Percentage (%)"
                required
                type="number"
                value={newPercent}
                onChange={(e) => setNewPercent(e.target.value)}
              />
              <Input
                label="Maximum Discount Cap (PKR)"
                required
                type="number"
                value={newMax}
                onChange={(e) => setNewMax(e.target.value)}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="submit" variant="primary" size="sm">
                Publish Coupon
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCouponModalOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
