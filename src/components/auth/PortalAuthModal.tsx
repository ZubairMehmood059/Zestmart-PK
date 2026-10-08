import React, { useState } from 'react';
import { AuthSession, UserRole, Vendor } from '../../types';
import { VENDORS } from '../../config/data';
import { PAKISTAN_CITIES } from '../../config/constants';
import { ApiService } from '../../services/api';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import {
  ShieldCheck,
  Store,
  User,
  KeyRound,
  CheckCircle2,
  Lock,
  Building2,
  AlertCircle,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface PortalAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetPortal?: 'storefront' | 'seller' | 'admin' | 'customer';
  onLoginSuccess: (session: AuthSession) => void;
}

export const PortalAuthModal: React.FC<PortalAuthModalProps> = ({
  isOpen,
  onClose,
  targetPortal = 'seller',
  onLoginSuccess
}) => {
  const [selectedRoleType, setSelectedRoleType] = useState<'customer' | 'seller' | 'admin'>(
    targetPortal === 'admin' ? 'admin' : targetPortal === 'seller' ? 'seller' : 'customer'
  );

  // Sub-modes
  const [customerMode, setCustomerMode] = useState<'login' | 'register'>('login');
  const [sellerMode, setSellerMode] = useState<'login' | 'register'>('login');
  const [adminRole, setAdminRole] = useState<'ADMIN' | 'MANAGER' | 'STAFF'>('ADMIN');

  // Customer Form Fields
  const [customerIdentifier, setCustomerIdentifier] = useState('');
  const [customerPassword, setCustomerPassword] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCity, setCustomerCity] = useState('Karachi');

  // Seller Form Fields
  const [sellerStoreId, setSellerStoreId] = useState<string>(VENDORS[0].id);
  const [sellerEmail, setSellerEmail] = useState('');
  const [sellerPassword, setSellerPassword] = useState('');
  const [newStoreName, setNewStoreName] = useState('');
  const [newOwnerName, setNewOwnerName] = useState('');
  const [newStoreEmail, setNewStoreEmail] = useState('');
  const [newStorePhone, setNewStorePhone] = useState('');
  const [newStoreCity, setNewStoreCity] = useState('Karachi');
  const [newStoreNTN, setNewStoreNTN] = useState('');

  // Admin Form Fields
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (customerMode === 'login') {
      const res = ApiService.loginCustomer(customerIdentifier, customerPassword);
      if (!res.success || !res.session) {
        setErrorMsg(res.message || 'Invalid credentials. Please verify your email or phone.');
        return;
      }
      setSuccessMsg(`Signed in successfully as ${res.user?.name}!`);
      setTimeout(() => {
        onLoginSuccess(res.session!);
        onClose();
      }, 400);
    } else {
      const res = ApiService.registerCustomer({
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        city: customerCity,
        password: customerPassword
      });
      if (!res.success || !res.session) {
        setErrorMsg(res.message || 'Registration failed. Please check your information.');
        return;
      }
      setSuccessMsg(`Welcome to ZestMart PK, ${res.user?.name}!`);
      setTimeout(() => {
        onLoginSuccess(res.session!);
        onClose();
      }, 400);
    }
  };

  const handleSellerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (sellerMode === 'login') {
      const res = ApiService.loginSeller(sellerEmail || sellerStoreId, sellerPassword);
      if (!res.success || !res.session) {
        setErrorMsg(res.message || 'Could not verify merchant credentials.');
        return;
      }
      setSuccessMsg('Authenticated as verified Pakistani merchant!');
      setTimeout(() => {
        onLoginSuccess(res.session!);
        onClose();
      }, 400);
    } else {
      const res = ApiService.registerSeller({
        storeName: newStoreName,
        ownerName: newOwnerName,
        email: newStoreEmail,
        phone: newStorePhone,
        city: newStoreCity,
        ntn: newStoreNTN
      });
      if (!res.success || !res.session) {
        setErrorMsg(res.message || 'Could not register merchant store.');
        return;
      }
      setSuccessMsg(`Merchant store "${res.vendor?.name}" registered successfully!`);
      setTimeout(() => {
        onLoginSuccess(res.session!);
        onClose();
      }, 400);
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const res = ApiService.loginAdmin(adminEmail, adminPassword, adminRole);
    if (!res.success || !res.session) {
      setErrorMsg(res.message || 'Admin authentication failed.');
      return;
    }
    setSuccessMsg(`Logged in with ${adminRole} privileges.`);
    setTimeout(() => {
      onLoginSuccess(res.session!);
      onClose();
    }, 400);
  };

  // Quick fill helper for testing demo customer
  const fillDemoCustomer = () => {
    setCustomerMode('login');
    setCustomerIdentifier('usman.tech@gmail.com');
    setCustomerPassword('DemoPass123!');
    setErrorMsg(null);
  };

  // Quick fill helper for testing demo seller
  const fillDemoSeller = (vendorId: string) => {
    setSellerMode('login');
    const v = VENDORS.find((item) => item.id === vendorId) || VENDORS[0];
    setSellerStoreId(v.id);
    setSellerEmail(`seller@${v.slug}.pk`);
    setSellerPassword('SellerPass123!');
    setErrorMsg(null);
  };

  // Quick fill helper for testing demo admin
  const fillDemoAdmin = (role: 'ADMIN' | 'MANAGER' | 'STAFF') => {
    setAdminRole(role);
    setAdminEmail(`${role.toLowerCase()}@zestmart.pk`);
    setAdminPassword('AdminSecretKey2026!');
    setErrorMsg(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title="ZestMart PK Identity & Access"
      subtitle="Secure authentication across customer storefront, merchant centre, and admin portal"
    >
      <div className="space-y-4 text-xs">
        {/* Portal Type Selector */}
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setSelectedRoleType('customer');
              setErrorMsg(null);
            }}
            className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              selectedRoleType === 'customer'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Customer</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedRoleType('seller');
              setErrorMsg(null);
            }}
            className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              selectedRoleType === 'seller'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Seller Centre</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedRoleType('admin');
              setErrorMsg(null);
            }}
            className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              selectedRoleType === 'admin'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Portal</span>
          </button>
        </div>

        {/* Feedback Alert Messages */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 flex items-center gap-2 font-medium animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 flex items-center gap-2 font-medium animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ========================================================== */}
        {/* 1. CUSTOMER AUTHENTICATION & REGISTRATION */}
        {/* ========================================================== */}
        {selectedRoleType === 'customer' && (
          <div className="space-y-3.5">
            {/* Login vs Register Sub-Tab */}
            <div className="flex border-b border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setCustomerMode('login');
                  setErrorMsg(null);
                }}
                className={`pb-2 px-4 text-xs font-bold border-b-2 cursor-pointer transition-colors ${
                  customerMode === 'login'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setCustomerMode('register');
                  setErrorMsg(null);
                }}
                className={`pb-2 px-4 text-xs font-bold border-b-2 cursor-pointer transition-colors ${
                  customerMode === 'register'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Create Account
              </button>
            </div>

            <form onSubmit={handleCustomerSubmit} className="space-y-3">
              {customerMode === 'login' ? (
                <>
                  <Input
                    label="Email Address or Pakistani Mobile (03XX-XXXXXXX)"
                    placeholder="e.g. usman.tech@gmail.com or 0300-1234567"
                    value={customerIdentifier}
                    onChange={(e) => setCustomerIdentifier(e.target.value)}
                    required
                  />

                  <div className="relative">
                    <Input
                      label="Account Password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={customerPassword}
                      onChange={(e) => setCustomerPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-7 text-slate-400 hover:text-slate-600 cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Quick Demo Pre-fill */}
                  <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
                    <button
                      type="button"
                      onClick={fillDemoCustomer}
                      className="text-emerald-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>Quick Demo Buyer: Muhammad Usman</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Input
                    label="Full Name"
                    placeholder="e.g. Zain Mehmood Alam"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="e.g. zain@example.pk"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      required
                    />
                    <Input
                      label="Pakistani Mobile (03XX-XXXXXXX)"
                      placeholder="0300-9876543"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Primary Delivery City</label>
                    <select
                      value={customerCity}
                      onChange={(e) => setCustomerCity(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-900"
                    >
                      {PAKISTAN_CITIES.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name} ({c.province}) · Delivery {c.deliveryDays}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="relative">
                    <Input
                      label="Choose Password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Minimum 6 characters"
                      value={customerPassword}
                      onChange={(e) => setCustomerPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-7 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  {customerMode === 'login' ? (
                    <>
                      <LogIn className="w-3.5 h-3.5 mr-1" />
                      <span>Sign In as Customer</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5 mr-1" />
                      <span>Register &amp; Sign In</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================== */}
        {/* 2. SELLER CENTRE AUTHENTICATION */}
        {/* ========================================================== */}
        {selectedRoleType === 'seller' && (
          <div className="space-y-3.5">
            {/* Merchant Login vs Register Sub-Tab */}
            <div className="flex border-b border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setSellerMode('login');
                  setErrorMsg(null);
                }}
                className={`pb-2 px-4 text-xs font-bold border-b-2 cursor-pointer transition-colors ${
                  sellerMode === 'login'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Merchant Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setSellerMode('register');
                  setErrorMsg(null);
                }}
                className={`pb-2 px-4 text-xs font-bold border-b-2 cursor-pointer transition-colors ${
                  sellerMode === 'register'
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Register New Store
              </button>
            </div>

            <form onSubmit={handleSellerSubmit} className="space-y-3">
              {sellerMode === 'login' ? (
                <>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Select Verified Vendor Store</label>
                    <select
                      value={sellerStoreId}
                      onChange={(e) => {
                        setSellerStoreId(e.target.value);
                        const v = VENDORS.find((item) => item.id === e.target.value);
                        if (v) setSellerEmail(`seller@${v.slug}.pk`);
                      }}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-900"
                    >
                      {VENDORS.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name} ({v.city}, Pakistan) · Rating: {v.rating}★
                        </option>
                      ))}
                    </select>
                  </div>

                  <Input
                    label="Merchant Business Email / NTN"
                    placeholder="seller@techhaven.pk"
                    value={sellerEmail}
                    onChange={(e) => setSellerEmail(e.target.value)}
                    required
                  />

                  <div className="relative">
                    <Input
                      label="Merchant Access PIN / Password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••••••"
                      value={sellerPassword}
                      onChange={(e) => setSellerPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-7 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Quick Pre-fills */}
                  <div className="pt-1 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                    <span className="font-medium">Quick Stores:</span>
                    <button
                      type="button"
                      onClick={() => fillDemoSeller('vendor_1')}
                      className="text-emerald-700 font-semibold hover:underline cursor-pointer"
                    >
                      TechHaven (Karachi)
                    </button>
                    <span>·</span>
                    <button
                      type="button"
                      onClick={() => fillDemoSeller('vendor_2')}
                      className="text-emerald-700 font-semibold hover:underline cursor-pointer"
                    >
                      Silicon Valley (Lahore)
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Input
                    label="Store / Business Name"
                    placeholder="e.g. Apex Hardware Islamabad"
                    value={newStoreName}
                    onChange={(e) => setNewStoreName(e.target.value)}
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Proprietor / Owner Name"
                      placeholder="e.g. Tariq Mehmood"
                      value={newOwnerName}
                      onChange={(e) => setNewOwnerName(e.target.value)}
                      required
                    />
                    <Input
                      label="Business Email"
                      type="email"
                      placeholder="sales@apexhardware.pk"
                      value={newStoreEmail}
                      onChange={(e) => setNewStoreEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Merchant Contact SIM"
                      placeholder="0300-8765432"
                      value={newStorePhone}
                      onChange={(e) => setNewStorePhone(e.target.value)}
                      required
                    />
                    <Input
                      label="FBR NTN or CNIC Number (Optional)"
                      placeholder="NTN-7492018 or 42101-XXXXXXX-X"
                      value={newStoreNTN}
                      onChange={(e) => setNewStoreNTN(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Hub / Warehouse City</label>
                    <select
                      value={newStoreCity}
                      onChange={(e) => setNewStoreCity(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-900"
                    >
                      {PAKISTAN_CITIES.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name} ({c.province})
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  <Store className="w-3.5 h-3.5 mr-1" />
                  <span>
                    {sellerMode === 'login' ? 'Launch Seller Centre' : 'Register & Enter Dashboard'}
                  </span>
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================== */}
        {/* 3. ADMIN PORTAL AUTHENTICATION */}
        {/* ========================================================== */}
        {selectedRoleType === 'admin' && (
          <div className="space-y-3.5">
            <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl space-y-1">
              <span className="font-bold text-amber-950 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-amber-700" />
                ZestMart PK Internal Administration
              </span>
              <p className="text-[11px] text-amber-800">
                Authorized for staff, operations managers, and platform administrators only.
              </p>
            </div>

            <form onSubmit={handleAdminSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Administrative Role Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['ADMIN', 'MANAGER', 'STAFF'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        setAdminRole(r);
                        if (!adminEmail) setAdminEmail(`${r.toLowerCase()}@zestmart.pk`);
                      }}
                      className={`p-2 rounded-lg text-center font-bold text-[11px] border transition-all cursor-pointer ${
                        adminRole === r
                          ? 'border-amber-600 bg-amber-600 text-white shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {r === 'ADMIN' ? '👑 Super Admin' : r === 'MANAGER' ? '👔 Operations' : '📋 Compliance'}
                    </button>
                  ))}
                </div>
              </div>

              <Input
                label="Corporate ZestMart Email"
                placeholder="admin@zestmart.pk"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                required
              />

              <div className="relative">
                <Input
                  label="Master Key / 2FA Access Token"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-7 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Quick Demo Fill */}
              <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
                <button
                  type="button"
                  onClick={() => fillDemoAdmin('ADMIN')}
                  className="text-amber-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Instant Super Admin Login</span>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <Button type="button" variant="outline" size="sm" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" variant="secondary" size="sm">
                  <KeyRound className="w-3.5 h-3.5 mr-1" />
                  <span>Authenticate as {adminRole}</span>
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Modal>
  );
};
