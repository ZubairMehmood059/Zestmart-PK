import React, { useState, useEffect } from 'react';
import { CustomerUser, Order, CustomerNotification, Address, Product, AuthSession } from '../../types';
import { ApiService } from '../../services/api';
import { PAKISTAN_CITIES } from '../../config/constants';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import {
  User,
  Package,
  MapPin,
  Heart,
  Bell,
  Settings,
  Truck,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RotateCcw,
  ShieldCheck,
  Check,
  Clock,
  LogOut,
  UserPlus,
  LogIn,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  Search,
  Edit3,
  ArrowRight
} from 'lucide-react';

interface CustomerAccountPageProps {
  onBackToHome: () => void;
  onAddToCart: (product: Product) => void;
  allProducts: Product[];
  onProductsChange?: (products: Product[]) => void;
  authSession?: AuthSession | null;
  onAuthSuccess?: (session: AuthSession) => void;
  onLogout?: () => void;
  onOpenAuthModal?: (target?: 'storefront' | 'seller' | 'admin') => void;
}

export const CustomerAccountPage: React.FC<CustomerAccountPageProps> = ({
  onBackToHome,
  onAddToCart,
  allProducts,
  onProductsChange,
  authSession,
  onAuthSuccess,
  onLogout,
  onOpenAuthModal
}) => {
  const [activeTab, setActiveTab] = useState<
    'orders' | 'profile' | 'addresses' | 'wishlist' | 'notifications' | 'settings'
  >('orders');

  const currentSession = authSession !== undefined ? authSession : ApiService.getAuthSession();
  const isLoggedIn = !!currentSession && currentSession.role === 'CUSTOMER';

  // Guest mode subtab (login vs register vs guest track)
  const [guestAuthMode, setGuestAuthMode] = useState<'login' | 'register' | 'track'>('login');
  const [guestIdentifier, setGuestIdentifier] = useState('');
  const [guestPassword, setGuestPassword] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestCity, setGuestCity] = useState('Karachi');
  const [showPassword, setShowPassword] = useState(false);
  const [guestTrackId, setGuestTrackId] = useState('');
  const [guestTrackPhone, setGuestTrackPhone] = useState('');
  const [guestTrackResult, setGuestTrackResult] = useState<Order | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // Profile Data
  const [user, setUser] = useState<CustomerUser>(() => ApiService.getUser());

  // Edit Profile Modal
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editPhone, setEditPhone] = useState(user.phone);
  const [editCity, setEditCity] = useState(user.city);

  useEffect(() => {
    const updated = ApiService.getUser();
    setUser(updated);
    setEditName(updated.name);
    setEditEmail(updated.email);
    setEditPhone(updated.phone);
    setEditCity(updated.city);
  }, [currentSession]);

  const [orders, setOrders] = useState<Order[]>(ApiService.getOrders());
  const [notifications, setNotifications] = useState<CustomerNotification[]>(
    ApiService.getNotifications()
  );
  const [wishlistIds, setWishlistIds] = useState<string[]>(ApiService.getWishlist());

  // Selected Order for detail inspection
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Cancel order modal
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('Found better price elsewhere');
  const [accountToast, setAccountToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setAccountToast(msg);
    setTimeout(() => setAccountToast(null), 3000);
  };

  // Add Address Modal
  const [addAddressOpen, setAddAddressOpen] = useState(false);
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>({
    label: 'Home',
    fullName: user.name,
    phone: user.phone,
    streetAddress: '',
    areaLandmark: '',
    city: user.city || 'Karachi',
    province: 'Sindh',
    postalCode: '75300',
    isDefault: false
  });

  // Handle Guest Login
  const handleGuestLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const res = ApiService.loginCustomer(guestIdentifier, guestPassword);
    if (!res.success || !res.session) {
      setAuthError(res.message || 'Invalid login details.');
      return;
    }
    setUser(res.user!);
    setOrders(ApiService.getOrders());
    showToast(`Welcome back, ${res.user?.name}!`);
    onAuthSuccess?.(res.session);
  };

  // Handle Guest Register
  const handleGuestRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const res = ApiService.registerCustomer({
      name: guestName,
      email: guestEmail,
      phone: guestPhone,
      city: guestCity,
      password: guestPassword
    });
    if (!res.success || !res.session) {
      setAuthError(res.message || 'Registration failed.');
      return;
    }
    setUser(res.user!);
    setOrders(ApiService.getOrders());
    showToast(`Welcome to ZestMart PK, ${res.user?.name}!`);
    onAuthSuccess?.(res.session);
  };

  // Handle Demo Quick Login
  const handleDemoLogin = () => {
    const res = ApiService.loginCustomer('usman.tech@gmail.com', 'DemoPass123!');
    if (res.success && res.session) {
      setUser(res.user!);
      setOrders(ApiService.getOrders());
      showToast('Logged in as Muhammad Usman (Demo Buyer)');
      onAuthSuccess?.(res.session);
    }
  };

  // Handle Guest Order Tracking
  const handleGuestTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setGuestTrackResult(null);
    const cleanId = guestTrackId.trim().toLowerCase();
    const cleanPhone = guestTrackPhone.trim().replace(/[^0-9]/g, '');

    const found = ApiService.getOrders().find(
      (o) =>
        o.id.toLowerCase() === cleanId ||
        o.trackingNumber.toLowerCase() === cleanId ||
        (cleanPhone && o.shippingAddress.phone.replace(/[^0-9]/g, '').includes(cleanPhone))
    );

    if (found) {
      setGuestTrackResult(found);
    } else {
      setAuthError('No active consignment found matching this Order / Tracking ID and mobile number.');
    }
  };

  // Handle Profile Update
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;
    const updated = ApiService.updateUser({
      name: editName.trim(),
      email: editEmail.trim(),
      phone: editPhone.trim(),
      city: editCity
    });
    setUser(updated);
    setEditProfileOpen(false);
    showToast('Profile details updated successfully.');
  };

  const handleCancelOrder = () => {
    if (!orderToCancel) return;
    const success = ApiService.cancelOrder(orderToCancel.id, cancelReason);
    if (success) {
      setOrders(ApiService.getOrders());
      setNotifications(ApiService.getNotifications());
      onProductsChange?.(ApiService.getProducts());
      setOrderToCancel(null);
      if (selectedOrder?.id === orderToCancel.id) {
        setSelectedOrder(null);
      }
      showToast('Order cancelled and items restored to inventory.');
    } else {
      showToast('This order cannot be cancelled as it is already dispatched or delivered.');
    }
  };

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.streetAddress || !newAddress.areaLandmark) return;
    ApiService.addAddress(newAddress);
    setUser(ApiService.getUser());
    setAddAddressOpen(false);
    setNewAddress({
      label: 'Home',
      fullName: user.name,
      phone: user.phone,
      streetAddress: '',
      areaLandmark: '',
      city: user.city || 'Karachi',
      province: 'Sindh',
      postalCode: '75300',
      isDefault: false
    });
    showToast('New delivery address saved.');
  };

  const handleDeleteAddress = (id?: string) => {
    if (!id) return;
    ApiService.deleteAddress(id);
    setUser(ApiService.getUser());
    showToast('Address removed.');
  };

  const handleSetDefaultAddress = (id?: string) => {
    if (!id) return;
    ApiService.setDefaultAddress(id);
    setUser(ApiService.getUser());
    showToast('Default delivery address updated.');
  };

  const handleMarkAllRead = () => {
    ApiService.markAllNotificationsRead();
    setNotifications(ApiService.getNotifications());
    showToast('All notifications marked as read.');
  };

  const wishlistedProducts = allProducts.filter((p) => wishlistIds.includes(p.id));
  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative">
      {/* Toast Notification */}
      {accountToast && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 border border-emerald-500 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{accountToast}</span>
        </div>
      )}

      {/* ========================================================== */}
      {/* SCENARIO A: GUEST / UNAUTHENTICATED EXPERIENCE */}
      {/* ========================================================== */}
      {!isLoggedIn ? (
        <div className="space-y-8">
          {/* Hero Welcome Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-sm">
            <div className="max-w-2xl space-y-3">
              <span className="text-emerald-400 font-bold tracking-wider uppercase text-xs">
                ZestMart PK Customer Account
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display">
                Sign in to manage your orders, delivery addresses, and tech wishlist.
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Connect your account to access 100% Tax-Paid PTA certification records, track doorstep Cash on Delivery shipments, and enjoy instant express warranty support.
              </p>
            </div>
          </div>

          {/* Guest Main Grid: Sign In / Register Form + Guest Tools */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Cols: Auth Card */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-8 space-y-6">
              {/* Mode Toggle Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                <button
                  type="button"
                  onClick={() => {
                    setGuestAuthMode('login');
                    setAuthError(null);
                  }}
                  className={`pb-2 px-3 text-xs sm:text-sm font-bold border-b-2 cursor-pointer transition-colors ${
                    guestAuthMode === 'login'
                      ? 'border-emerald-600 text-emerald-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGuestAuthMode('register');
                    setAuthError(null);
                  }}
                  className={`pb-2 px-3 text-xs sm:text-sm font-bold border-b-2 cursor-pointer transition-colors ${
                    guestAuthMode === 'register'
                      ? 'border-emerald-600 text-emerald-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Create New Account
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGuestAuthMode('track');
                    setAuthError(null);
                  }}
                  className={`pb-2 px-3 text-xs sm:text-sm font-bold border-b-2 cursor-pointer transition-colors ${
                    guestAuthMode === 'track'
                      ? 'border-emerald-600 text-emerald-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Track Consignment
                </button>
              </div>

              {authError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 flex items-center gap-2 text-xs font-medium animate-fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{authError}</span>
                </div>
              )}

              {/* TAB A1: SIGN IN */}
              {guestAuthMode === 'login' && (
                <form onSubmit={handleGuestLogin} className="space-y-4 text-xs">
                  <Input
                    label="Registered Email or Pakistani Mobile (03XX-XXXXXXX)"
                    placeholder="e.g. usman.tech@gmail.com or 0300-1234567"
                    value={guestIdentifier}
                    onChange={(e) => setGuestIdentifier(e.target.value)}
                    required
                  />

                  <div className="relative">
                    <Input
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your account password"
                      value={guestPassword}
                      onChange={(e) => setGuestPassword(e.target.value)}
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

                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={handleDemoLogin}
                      className="text-emerald-700 font-semibold hover:underline flex items-center gap-1.5 cursor-pointer text-left"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>⚡ Instant Demo Buyer Login (Muhammad Usman)</span>
                    </button>

                    <Button type="submit" variant="primary" size="md">
                      <LogIn className="w-4 h-4 mr-1.5" />
                      <span>Sign In</span>
                    </Button>
                  </div>
                </form>
              )}

              {/* TAB A2: REGISTER */}
              {guestAuthMode === 'register' && (
                <form onSubmit={handleGuestRegister} className="space-y-4 text-xs">
                  <Input
                    label="Full Name"
                    placeholder="e.g. Zain Mehmood Alam"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="zain@example.pk"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      required
                    />
                    <Input
                      label="Pakistani Mobile (03XX-XXXXXXX)"
                      placeholder="0300-9876543"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Primary City in Pakistan</label>
                    <select
                      value={guestCity}
                      onChange={(e) => setGuestCity(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-900"
                    >
                      {PAKISTAN_CITIES.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name} ({c.province}) · Courier Delivery: {c.deliveryDays}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="relative">
                    <Input
                      label="Set Account Password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Minimum 6 characters"
                      value={guestPassword}
                      onChange={(e) => setGuestPassword(e.target.value)}
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

                  <div className="pt-2 flex justify-end">
                    <Button type="submit" variant="primary" size="md">
                      <UserPlus className="w-4 h-4 mr-1.5" />
                      <span>Register Account</span>
                    </Button>
                  </div>
                </form>
              )}

              {/* TAB A3: GUEST ORDER LOOKUP */}
              {guestAuthMode === 'track' && (
                <div className="space-y-4 text-xs">
                  <form onSubmit={handleGuestTrack} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        label="Order Number or Courier Tracking #"
                        placeholder="e.g. ord_101 or TCS-8492019"
                        value={guestTrackId}
                        onChange={(e) => setGuestTrackId(e.target.value)}
                        required
                      />
                      <Input
                        label="Registered Mobile Phone"
                        placeholder="e.g. 0300-1234567"
                        value={guestTrackPhone}
                        onChange={(e) => setGuestTrackPhone(e.target.value)}
                      />
                    </div>
                    <Button type="submit" variant="primary" size="sm">
                      <Search className="w-3.5 h-3.5 mr-1" />
                      <span>Find Consignment</span>
                    </Button>
                  </form>

                  {/* Tracking Result View */}
                  {guestTrackResult && (
                    <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/50 space-y-3 animate-fade-in">
                      <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                        <div>
                          <span className="font-bold text-slate-900 text-sm">
                            Order #{guestTrackResult.id}
                          </span>
                          <p className="text-[11px] text-slate-500">
                            Courier: {guestTrackResult.courierProvider} ({guestTrackResult.trackingNumber})
                          </p>
                        </div>
                        <span className="bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                          {guestTrackResult.status.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {guestTrackResult.timeline.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs">
                            <span className="w-2 h-2 rounded-full bg-emerald-600 mt-1" />
                            <div>
                              <p className="font-semibold text-slate-900">{step.status}</p>
                              <p className="text-slate-500 text-[11px]">{step.description} · {step.timestamp}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right 5 Cols: ZestMart PK Trust Highlights */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Buyer Protection Guaranteed</span>
                </h3>
                <ul className="space-y-3 text-xs text-slate-600">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>100% Tax-Paid Official PTA:</strong> Every flagship smartphone and cellular device is registered with Pakistan Customs and PTA.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Truck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Nationwide Insured COD:</strong> Verify items at your doorstep in 250+ Pakistani cities before payment.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <RotateCcw className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>7-Day Doorstep Replacement:</strong> Full coverage for any hardware manufacturing faults.</span>
                  </li>
                </ul>
              </div>

              {/* Merchant & Admin Portal Access Box */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-2 text-xs">
                <h4 className="font-bold text-slate-900">Are you a Merchant or Administrator?</h4>
                <p className="text-slate-600">
                  Access multi-vendor inventory controls or corporate marketplace tooling.
                </p>
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => onOpenAuthModal?.('seller')}
                    className="text-emerald-700 font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>Seller Centre Sign In</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  <span className="text-slate-300">·</span>
                  <button
                    onClick={() => onOpenAuthModal?.('admin')}
                    className="text-slate-600 font-semibold hover:text-slate-900 hover:underline cursor-pointer"
                  >
                    Admin Portal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================== */
        /* SCENARIO B: AUTHENTICATED CUSTOMER DASHBOARD */
        /* ========================================================== */
        <div className="space-y-8">
          {/* Top Profile Summary Banner */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-200 shadow-xs">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-2xl shadow-xs uppercase tracking-wider shrink-0">
                {(user.name || 'User')
                  .split(' ')
                  .filter(Boolean)
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-bold text-slate-900">{user.name}</h1>
                  <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                    Verified Pakistani Buyer
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  {user.phone} · {user.email} · {user.city}, Pakistan
                </p>
                <p className="text-[11px] text-slate-400">
                  Member of ZestMart PK since {user.joinedDate}
                </p>
              </div>
            </div>

            {/* Header Action Buttons & Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Quick KPI stats */}
              <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-6 text-xs">
                <div className="text-center px-3">
                  <span className="text-lg font-bold text-slate-900 tabular-nums block">
                    {orders.length}
                  </span>
                  <span className="text-slate-500 text-[11px]">Orders</span>
                </div>
                <div className="text-center px-3 border-l border-slate-200">
                  <span className="text-lg font-bold text-slate-900 tabular-nums block">
                    {wishlistIds.length}
                  </span>
                  <span className="text-slate-500 text-[11px]">Wishlist</span>
                </div>
                <div className="text-center px-3 border-l border-slate-200">
                  <span className="text-lg font-bold text-slate-900 tabular-nums block">
                    {user.savedAddresses.length}
                  </span>
                  <span className="text-slate-500 text-[11px]">Addresses</span>
                </div>
              </div>

              {/* Edit Profile & Log Out Buttons */}
              <div className="flex items-center gap-2 pt-2 sm:pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                  onClick={() => setEditProfileOpen(true)}
                >
                  Edit Profile
                </Button>
                {onLogout && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-rose-600 hover:bg-rose-50"
                    leftIcon={<LogOut className="w-3.5 h-3.5" />}
                    onClick={onLogout}
                  >
                    Log Out
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Main Grid: Sidebar Tabs + Content Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Navigation Sidebar (3 Cols) */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-xs p-3 space-y-1">
              <button
                onClick={() => {
                  setActiveTab('orders');
                  setSelectedOrder(null);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'orders'
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4 text-emerald-700" />
                  <span>My Orders</span>
                </div>
                <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-normal tabular-nums">
                  {orders.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'addresses'
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-emerald-700" />
                  <span>Delivery Addresses</span>
                </div>
                <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-normal tabular-nums">
                  {user.savedAddresses.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('wishlist')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'wishlist'
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Heart className="w-4 h-4 text-emerald-700" />
                  <span>Saved Wishlist</span>
                </div>
                <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-normal tabular-nums">
                  {wishlistIds.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'notifications'
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4 text-emerald-700" />
                  <span>Notifications</span>
                </div>
                {unreadNotifsCount > 0 && (
                  <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-bold tabular-nums">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-emerald-700" />
                  <span>Profile &amp; Security</span>
                </div>
              </button>

              <div className="pt-4 border-t border-slate-100">
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                )}
              </div>
            </div>

            {/* Content Area (9 Cols) */}
            <div className="lg:col-span-9 space-y-6">
              {/* TAB 1: ORDERS */}
              {activeTab === 'orders' && (
                <div className="space-y-5">
                  {selectedOrder ? (
                    /* Order Detailed Inspection View */
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
                      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                        <div>
                          <button
                            onClick={() => setSelectedOrder(null)}
                            className="text-xs text-slate-500 hover:text-emerald-700 flex items-center gap-1 mb-1 cursor-pointer font-medium"
                          >
                            &larr; Back to All Orders
                          </button>
                          <h2 className="text-lg font-bold text-slate-900">
                            Order Details #{selectedOrder.id}
                          </h2>
                        </div>

                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded capitalize ${
                            selectedOrder.status === 'delivered'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : selectedOrder.status === 'cancelled'
                              ? 'bg-rose-50 text-rose-800 border border-rose-200'
                              : 'bg-blue-50 text-blue-800 border border-blue-200'
                          }`}
                        >
                          {selectedOrder.status.replace('_', ' ')}
                        </span>
                      </div>

                      {/* Items itemized list */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Consignment Items
                        </h4>
                        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                          {selectedOrder.items.map((item, idx) => (
                            <div key={idx} className="p-4 flex items-center justify-between gap-4 text-xs">
                              <div className="flex items-center gap-3">
                                <img
                                  src={item.product.thumbnail}
                                  alt={item.product.title}
                                  referrerPolicy="no-referrer"
                                  className="w-12 h-12 rounded-lg object-contain bg-slate-50 border border-slate-200 p-1"
                                />
                                <div>
                                  <p className="font-bold text-slate-900">{item.product.title}</p>
                                  <p className="text-slate-500 text-[11px]">
                                    Seller: {item.product.vendor.name} · Qty: {item.quantity}
                                    {item.selectedColor ? ` · Color: ${item.selectedColor}` : ''}
                                  </p>
                                </div>
                              </div>
                              <span className="font-bold text-slate-900 tabular-nums">
                                Rs. {(item.product.pricePKR * item.quantity).toLocaleString('en-PK')}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Timeline status */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Tracking History
                        </h4>
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                          {selectedOrder.timeline.map((step, idx) => (
                            <div key={idx} className="flex items-start gap-3 text-xs">
                              <div className={`w-2.5 h-2.5 rounded-full mt-1 ${step.done ? 'bg-emerald-600' : 'bg-slate-300'}`} />
                              <div>
                                <p className="font-bold text-slate-900">{step.status}</p>
                                <p className="text-slate-500 text-[11px]">{step.description} · {step.timestamp}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Orders List */
                    <div className="space-y-4">
                      {orders.length > 0 ? (
                        orders.map((o) => (
                          <div
                            key={o.id}
                            className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
                              <div>
                                <span className="font-bold text-slate-900">Order #{o.id}</span>
                                <span className="text-slate-500 ml-2">Placed on {o.date}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`font-bold px-2 py-0.5 rounded capitalize text-[11px] ${
                                    o.status === 'delivered'
                                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                      : o.status === 'cancelled'
                                      ? 'bg-rose-50 text-rose-800 border border-rose-200'
                                      : 'bg-blue-50 text-blue-800 border border-blue-200'
                                  }`}
                                >
                                  {o.status.replace('_', ' ')}
                                </span>
                                <span className="text-slate-400">·</span>
                                <span className="text-slate-500 uppercase">{o.paymentMethod}</span>
                              </div>
                            </div>

                            {/* Items row */}
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3 overflow-x-auto">
                                {o.items.map((i) => (
                                  <div key={i.product.id} className="flex items-center gap-2.5 shrink-0">
                                    <img
                                      src={i.product.thumbnail}
                                      alt={i.product.title}
                                      referrerPolicy="no-referrer"
                                      className="w-12 h-12 rounded-lg object-contain bg-slate-50 border border-slate-200 p-1"
                                    />
                                    <div className="text-xs max-w-[12rem] truncate">
                                      <p className="font-semibold text-slate-800 truncate">{i.product.title}</p>
                                      <p className="text-[11px] text-slate-400">Qty: {i.quantity}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <div className="text-right shrink-0">
                                <span className="text-xs text-slate-500 block">Total Amount</span>
                                <span className="text-sm font-bold text-slate-900 tabular-nums">
                                  Rs. {o.totalPKR.toLocaleString('en-PK')}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                              <div className="flex items-center gap-1.5 text-slate-500">
                                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Courier: <strong>{o.courierProvider}</strong> ({o.trackingNumber})</span>
                              </div>

                              <div className="flex items-center gap-2">
                                {(o.status === 'confirmed' || o.status === 'processing') && (
                                  <button
                                    onClick={() => setOrderToCancel(o)}
                                    className="text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
                                  >
                                    Cancel Order
                                  </button>
                                )}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedOrder(o)}
                                >
                                  Track &amp; View Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-16 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
                          <Package className="w-10 h-10 text-slate-300 mx-auto" />
                          <p className="text-xs text-slate-500">No orders placed yet.</p>
                          <Button variant="primary" size="sm" onClick={onBackToHome}>
                            Start Shopping
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: ADDRESSES */}
              {activeTab === 'addresses' && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">Saved Delivery Addresses</h2>
                      <p className="text-xs text-slate-500">
                        Manage destination locations across Pakistan for seamless checkout
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<Plus className="w-4 h-4" />}
                      onClick={() => setAddAddressOpen(true)}
                    >
                      Add New Address
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {user.savedAddresses.map((addr) => (
                      <div
                        key={addr.id}
                        className={`p-4 rounded-xl border space-y-2 text-xs flex flex-col justify-between ${
                          addr.isDefault
                            ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500'
                            : 'border-slate-200 bg-white'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-slate-900">
                              {addr.label || 'Address'}
                            </span>
                            {addr.isDefault && (
                              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="font-semibold text-slate-800">{addr.fullName}</p>
                          <p className="text-slate-600">{addr.streetAddress}</p>
                          <p className="text-slate-500">{addr.areaLandmark}</p>
                          <p className="text-slate-500">{addr.city}, {addr.province}</p>
                          <p className="text-slate-700 font-medium">Phone: {addr.phone}</p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          {!addr.isDefault ? (
                            <button
                              onClick={() => handleSetDefaultAddress(addr.id)}
                              className="text-emerald-700 font-semibold hover:underline cursor-pointer"
                            >
                              Set as Default
                            </button>
                          ) : (
                            <span className="text-slate-400">Default for orders</span>
                          )}

                          {user.savedAddresses.length > 1 && (
                            <button
                              onClick={() => handleDeleteAddress(addr.id)}
                              className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: WISHLIST */}
              {activeTab === 'wishlist' && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900">
                      Saved Wishlist ({wishlistedProducts.length})
                    </h2>
                    <span className="text-xs text-slate-500">Items saved for later</span>
                  </div>

                  {wishlistedProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {wishlistedProducts.map((p) => (
                        <div
                          key={p.id}
                          className="p-4 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3"
                        >
                          <img
                            src={p.thumbnail}
                            alt={p.title}
                            referrerPolicy="no-referrer"
                            className="w-full aspect-4/3 rounded-lg object-contain bg-slate-50 border border-slate-100 p-2"
                          />
                          <div className="space-y-1">
                            <span className="text-[11px] text-slate-400 block">{p.vendor.name}</span>
                            <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{p.title}</h4>
                            <span className="text-sm font-extrabold text-slate-900 tabular-nums block">
                              Rs. {p.pricePKR.toLocaleString('en-PK')}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                            <Button
                              variant="primary"
                              size="sm"
                              className="flex-1"
                              onClick={() => onAddToCart(p)}
                            >
                              Move to Cart
                            </Button>
                            <button
                              onClick={() => {
                                const updated = wishlistIds.filter((id) => id !== p.id);
                                setWishlistIds(updated);
                                ApiService.setWishlist(updated);
                              }}
                              className="p-2 text-slate-400 hover:text-rose-600 cursor-pointer"
                              title="Remove"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-16 text-center space-y-2">
                      <Heart className="w-10 h-10 text-slate-300 mx-auto" />
                      <p className="text-xs text-slate-500">Your wishlist is empty.</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: NOTIFICATIONS */}
              {activeTab === 'notifications' && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900">Notifications</h2>
                    {unreadNotifsCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xs text-emerald-700 font-semibold hover:underline cursor-pointer"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-slate-100 space-y-2">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-3 rounded-xl text-xs space-y-1 ${
                          n.read ? 'bg-white' : 'bg-emerald-50/50 border border-emerald-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-slate-900">{n.title}</h4>
                          <span className="text-[11px] text-slate-400">{n.date}</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: PROFILE & SECURITY SETTINGS */}
              {activeTab === 'profile' && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900">
                      Profile &amp; Account Settings
                    </h2>
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<Edit3 className="w-3.5 h-3.5" />}
                      onClick={() => setEditProfileOpen(true)}
                    >
                      Update Profile
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 font-medium block">Full Name</span>
                      <span className="text-slate-900 font-bold text-sm block mt-0.5">{user.name}</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 font-medium block">Registered Mobile</span>
                      <span className="text-slate-900 font-bold text-sm block mt-0.5">{user.phone}</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 font-medium block">Email Address</span>
                      <span className="text-slate-900 font-bold text-sm block mt-0.5">{user.email}</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-slate-500 font-medium block">Default Delivery City</span>
                      <span className="text-slate-900 font-bold text-sm block mt-0.5">{user.city}, Pakistan</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                    <h4 className="font-bold text-slate-900">Security &amp; 2FA Status</h4>
                    <p className="text-slate-500">
                      Your account is verified for official PTA electronics purchases with Pakistani SMS OTP verification.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {editProfileOpen && (
        <Modal
          isOpen={editProfileOpen}
          onClose={() => setEditProfileOpen(false)}
          title="Update Account Profile"
          subtitle="Modify your personal information and delivery preferences"
        >
          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <Input
              label="Full Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
            />
            <Input
              label="Email Address"
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              required
            />
            <Input
              label="Mobile Number (03XX-XXXXXXX)"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
              required
            />
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Primary Delivery City</label>
              <select
                value={editCity}
                onChange={(e) => setEditCity(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-900"
              >
                {PAKISTAN_CITIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} ({c.province})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" variant="primary" size="sm">
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditProfileOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Cancel Order Reason Modal */}
      {orderToCancel && (
        <Modal
          isOpen={!!orderToCancel}
          onClose={() => setOrderToCancel(null)}
          title={`Cancel Order #${orderToCancel.id}`}
          subtitle="Are you sure you want to cancel this consignment?"
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-600">
              Please choose a reason for cancellation. Once submitted, the seller and courier will be notified immediately.
            </p>

            <div className="space-y-2">
              {[
                'Found better price elsewhere',
                'Ordered by mistake',
                'Need to change delivery address',
                'Delivery taking longer than expected'
              ].map((reason) => (
                <label key={reason} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="reason"
                    checked={cancelReason === reason}
                    onChange={() => setCancelReason(reason)}
                    className="text-rose-600"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="danger" size="sm" onClick={handleCancelOrder}>
                Confirm Cancellation
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOrderToCancel(null)}
              >
                Keep Order
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Address Modal */}
      {addAddressOpen && (
        <Modal
          isOpen={addAddressOpen}
          onClose={() => setAddAddressOpen(false)}
          title="Add New Delivery Address"
          subtitle="Add an address in Pakistan for courier delivery"
        >
          <form onSubmit={handleSaveNewAddress} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Address Label"
                placeholder="e.g. Home, Office, Parents"
                required
                value={newAddress.label}
                onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
              />
              <Input
                label="Recipient Name"
                required
                value={newAddress.fullName}
                onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
              />
            </div>

            <Input
              label="Recipient Mobile (SMS/WhatsApp)"
              placeholder="0300-1234567"
              required
              value={newAddress.phone}
              onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-slate-700">City</label>
                <select
                  value={newAddress.city}
                  onChange={(e) => {
                    const c = PAKISTAN_CITIES.find((city) => city.name === e.target.value);
                    setNewAddress({
                      ...newAddress,
                      city: e.target.value,
                      province: c?.province || newAddress.province
                    });
                  }}
                  className="border border-slate-300 rounded-lg p-2"
                >
                  {PAKISTAN_CITIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Postal Code"
                value={newAddress.postalCode}
                onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
              />
            </div>

            <Input
              label="House / Street Address"
              required
              placeholder="e.g. Flat 302, Al-Rehman Heights"
              value={newAddress.streetAddress}
              onChange={(e) => setNewAddress({ ...newAddress, streetAddress: e.target.value })}
            />

            <Input
              label="Area / Nearby Landmark"
              required
              placeholder="e.g. Near Water Pump"
              value={newAddress.areaLandmark}
              onChange={(e) => setNewAddress({ ...newAddress, areaLandmark: e.target.value })}
            />

            <label className="flex items-center gap-2 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={newAddress.isDefault}
                onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
              />
              <span>Set as default delivery address</span>
            </label>

            <div className="flex gap-2 pt-4">
              <Button type="submit" variant="primary" size="sm">
                Save Address
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAddAddressOpen(false)}
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
