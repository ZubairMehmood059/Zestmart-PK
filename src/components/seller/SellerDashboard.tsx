import React, { useState, useEffect } from 'react';
import { Product, Vendor, Order, AuthSession } from '../../types';
import { VENDORS } from '../../config/data';
import { ApiService } from '../../services/api';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import {
  TrendingUp,
  Package,
  Clock,
  Building2,
  Store,
  Plus,
  Truck,
  CheckCircle2,
  Printer,
  Edit3,
  Search,
  ArrowUpRight,
  ShieldCheck,
  MapPin,
  ExternalLink,
  ChevronRight,
  DollarSign,
  Lock,
  LogOut
} from 'lucide-react';

interface SellerDashboardProps {
  onSwitchPortal: (portal: 'storefront' | 'seller' | 'admin') => void;
  products?: Product[];
  onProductCreated?: (newProduct: Product) => void;
  authSession?: AuthSession | null;
  onOpenAuthModal?: (targetPortal?: 'storefront' | 'seller' | 'admin') => void;
  onLogout?: () => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({
  onSwitchPortal,
  products: incomingProducts,
  onProductCreated,
  authSession,
  onOpenAuthModal,
  onLogout
}) => {
  const isAuthorized = ApiService.canAccessPortal('seller', authSession || null);

  // Scoped to active authenticated seller
  const [selectedVendorId, setSelectedVendorId] = useState<string>(() => {
    if (authSession?.vendorId) return authSession.vendorId;
    return 'vendor_1';
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'payouts' | 'settings'>('overview');

  const [productsList, setProductsList] = useState<Product[]>(() => incomingProducts || ApiService.getProducts());

  useEffect(() => {
    if (incomingProducts) {
      setProductsList(incomingProducts);
    }
  }, [incomingProducts]);

  useEffect(() => {
    if (authSession?.vendorId) {
      setSelectedVendorId(authSession.vendorId);
    }
  }, [authSession]);

  const currentVendor = VENDORS.find((v) => v.id === selectedVendorId) || VENDORS[0];
  const allProducts = incomingProducts || productsList;
  const sellerProducts = allProducts.filter((p) => p.vendorId === currentVendor.id);
  const allOrders = ApiService.getOrders();

  // New Product Modal state
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('smartphones');
  const [newStock, setNewStock] = useState('25');
  const [newDesc, setNewDesc] = useState('');

  // Airway Bill Modal
  const [airwayBillOrder, setAirwayBillOrder] = useState<Order | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showSellerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = newTitle.trim();
    const priceNum = Number(newPrice);
    const stockNum = Number(newStock);
    const trimmedDesc = newDesc.trim();

    if (!trimmedTitle) {
      showSellerToast('Please provide a valid product title.');
      return;
    }
    if (isNaN(priceNum) || priceNum <= 0) {
      showSellerToast('Please enter a valid price in PKR.');
      return;
    }
    if (isNaN(stockNum) || stockNum < 0) {
      showSellerToast('Please enter a valid stock quantity.');
      return;
    }
    if (!trimmedDesc) {
      showSellerToast('Please provide a product description.');
      return;
    }

    const categoryImageMap: Record<string, string> = {
      smartphones: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
      laptops: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
      tablets: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80',
      'pc-components': 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80',
      monitors: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
      audio: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
      gaming: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80',
      cameras: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80',
      'smart-watches': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
      accessories: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=600&q=80',
      networking: 'https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=600&q=80',
      'smart-home': 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=600&q=80'
    };

    const assignedImage = categoryImageMap[newCategory] || categoryImageMap.smartphones;

    const newProd: Product = {
      id: `prod_${Date.now()}`,
      title: trimmedTitle,
      slug: trimmedTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `prod-${Date.now()}`,
      brand: currentVendor.name || 'Genuine Hardware',
      vendorId: currentVendor.id,
      vendor: currentVendor,
      category: newCategory,
      condition: 'Brand New',
      pricePKR: priceNum,
      images: [assignedImage],
      thumbnail: assignedImage,
      rating: 5.0,
      reviewCount: 0,
      inStock: stockNum > 0,
      stockQuantity: stockNum,
      codAvailable: true,
      estimatedDeliveryDays: '1-2 Days',
      shortDescription: trimmedDesc.slice(0, 80),
      description: trimmedDesc,
      specifications: {
        'Origin': `${currentVendor.city}, Pakistan`,
        'Warranty': '1 Year Official Warranty',
        'Condition': 'Brand New'
      },
      tags: [newCategory, currentVendor.city, 'Electronics']
    };

    ApiService.addProduct(newProd);
    setProductsList((prev) => [newProd, ...prev.filter((p) => p.id !== newProd.id)]);
    onProductCreated?.(newProd);
    setAddProductOpen(false);
    setNewTitle('');
    setNewPrice('');
    setNewStock('25');
    setNewDesc('');
    showSellerToast(`Product "${newProd.title}" listed successfully in Pakistan catalog!`);
  };

  // Protect view if unauthorized
  if (!isAuthorized) {
    return (
      <div className="min-h-[80vh] bg-[#F8FAFC] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-rose-600">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <Badge variant="rose" size="sm">
              403 Forbidden
            </Badge>
            <h2 className="text-xl font-bold text-slate-900">Seller Centre Access Restricted</h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              This merchant management dashboard requires an authenticated Pakistani Seller or Super Administrator account.
            </p>
          </div>
          <div className="pt-3 flex flex-col gap-2">
            {onOpenAuthModal && (
              <Button
                variant="primary"
                size="md"
                onClick={() => onOpenAuthModal('seller')}
                className="w-full flex items-center justify-center gap-2"
              >
                <Store className="w-4 h-4" />
                <span>Sign In as Verified Merchant</span>
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
        <div className="fixed top-20 right-6 z-50 bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in border border-emerald-500">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Seller Top Bar */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800">
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
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800 uppercase">
                  Seller Centre
                </span>
              </button>

              <span className="text-slate-700 hidden sm:inline">|</span>

              {/* Scoped Seller Selector */}
              <div className="flex items-center gap-2 text-xs">
                <Store className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-400 hidden sm:inline">Logged In As:</span>
                <select
                  value={selectedVendorId}
                  onChange={(e) => setSelectedVendorId(e.target.value)}
                  className="bg-slate-800 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                >
                  {VENDORS.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.city})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Portal Switcher & 2FA Status */}
            <div className="flex items-center gap-2 sm:gap-3 text-xs">
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/70 border border-emerald-800/80 px-2 py-0.5 rounded">
                <ShieldCheck className="w-3.5 h-3.5" /> 2FA Active (SMS OTP)
              </span>

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
                  className="bg-slate-800 hover:bg-rose-950/80 text-slate-300 hover:text-rose-300 font-semibold px-2.5 py-1.5 rounded-lg border border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
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
        {/* Store Snapshot Header */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xl">
              <Store className="w-7 h-7" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">{currentVendor.name}</h1>
                <Badge variant="emerald" size="sm">
                  {currentVendor.badge || 'Verified Merchant'}
                </Badge>
              </div>
              <p className="text-xs text-slate-500">
                Hub: {currentVendor.city}, {currentVendor.province} · Joined {currentVendor.joinedYear} · NTN: {currentVendor.ntnNumber || '7281904-2'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setAddProductOpen(true)}
            >
              Add New Product
            </Button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 px-4 border-b-2 -mb-px whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'overview'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Dashboard Overview
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3.5 px-4 border-b-2 -mb-px whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'orders'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Orders &amp; TCS Dispatch
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`py-3.5 px-4 border-b-2 -mb-px whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'products'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Catalog &amp; Inventory ({sellerProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('payouts')}
            className={`py-3.5 px-4 border-b-2 -mb-px whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'payouts'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Bank Payouts &amp; Settlements
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3.5 px-4 border-b-2 -mb-px whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'settings'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Store Settings &amp; Hub
          </button>
        </div>

        {/* TAB 1: BENTO GRID DASHBOARD (Reference 04) */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Bento Grid 4 Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: 30-Day GMV */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Gross Sales (30 Days)</span>
                  <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
                  Rs. 1,482,900
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>+18.4% vs previous cycle</span>
                </div>
              </div>

              {/* Card 2: Orders to Dispatch */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Pending Couriers Pickup</span>
                  <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
                  18 Orders
                </div>
                <div className="text-[11px] text-amber-800 font-medium">
                  14 TCS / 4 Leopards bookings
                </div>
              </div>

              {/* Card 3: Dispatch SLA */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>On-Time Fulfillment Rate</span>
                  <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
                  {currentVendor.deliveryPerformance}
                </div>
                <div className="text-[11px] text-slate-500">
                  Average pack time: 4.2 hours
                </div>
              </div>

              {/* Card 4: Net Payout Ready */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Pending Bank Settlement</span>
                  <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                    <Building2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
                  Rs. 324,500
                </div>
                <div className="text-[11px] text-slate-500">
                  Meezan Bank payout (Friday cycle)
                </div>
              </div>
            </div>

            {/* Bento Bottom Section: Live Pickups & Catalog Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Pending Fulfillment Orders Table (8 cols) */}
              <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Orders Awaiting TCS / Leopards Pickup
                    </h3>
                    <p className="text-xs text-slate-500">
                      Pack items and print courier consignment slips for daily courier collection
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
                  >
                    View All Orders &rarr;
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200">
                      <tr>
                        <th className="px-3 py-2.5">Order</th>
                        <th className="px-3 py-2.5">Buyer &amp; City</th>
                        <th className="px-3 py-2.5">Payment</th>
                        <th className="px-3 py-2.5">Amount</th>
                        <th className="px-3 py-2.5 text-right">Airway Bill</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {allOrders.slice(0, 3).map((o) => (
                        <tr key={o.id} className="hover:bg-slate-50/70">
                          <td className="px-3 py-3 font-mono font-bold text-slate-900">
                            #{o.id}
                          </td>
                          <td className="px-3 py-3">
                            <span className="font-semibold block">{o.shippingAddress.fullName}</span>
                            <span className="text-[11px] text-slate-500">{o.shippingAddress.city}</span>
                          </td>
                          <td className="px-3 py-3">
                            <span className="uppercase text-[11px] font-semibold text-slate-700">
                              {o.paymentMethod}
                            </span>
                          </td>
                          <td className="px-3 py-3 font-bold tabular-nums">
                            Rs. {o.totalPKR.toLocaleString('en-PK')}
                          </td>
                          <td className="px-3 py-3 text-right">
                            <button
                              onClick={() => setAirwayBillOrder(o)}
                              className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 ml-auto cursor-pointer"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>Print Slip</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right: Seller Health & Quick Stats (4 cols) */}
              <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-6 space-y-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Seller Health &amp; SLAs
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex justify-between font-semibold">
                      <span>Response Rate</span>
                      <span className="text-emerald-700">{currentVendor.responseRate}</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full w-[99%]" />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex justify-between font-semibold">
                      <span>Fulfillment SLA (24h)</span>
                      <span className="text-emerald-700">{currentVendor.deliveryPerformance}</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full w-[98%]" />
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex justify-between font-semibold">
                      <span>Customer Reviews</span>
                      <span className="text-amber-600">★ {currentVendor.rating} ({currentVendor.ratingCount})</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 text-xs text-slate-500">
                  <p>
                    Daily TCS pickup scheduled between <strong>04:00 PM – 05:30 PM</strong> at your registered address.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">
                Orders Fulfillment &amp; Consignments
              </h2>
              <span className="text-xs text-slate-500">
                {allOrders.length} total orders recorded
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-y border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Order Number</th>
                    <th className="px-4 py-3">Customer Details</th>
                    <th className="px-4 py-3">Courier &amp; Tracking</th>
                    <th className="px-4 py-3">Total (PKR)</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">
                        #{o.id}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold block">{o.shippingAddress.fullName}</span>
                        <span className="text-[11px] text-slate-500">
                          {o.shippingAddress.city} · {o.shippingAddress.phone}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold block">{o.courierProvider}</span>
                        <span className="font-mono text-[11px] text-emerald-800">
                          {o.trackingNumber}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold tabular-nums">
                        Rs. {o.totalPKR.toLocaleString('en-PK')}
                      </td>
                      <td className="px-4 py-3">
                        <span className="capitalize px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">
                          {o.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setAirwayBillOrder(o)}
                          className="text-emerald-700 hover:text-emerald-900 font-bold px-2 py-1 rounded bg-emerald-50 border border-emerald-200"
                        >
                          Print Airway Bill
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCTS & INVENTORY */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Store Product Catalog ({sellerProducts.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Products listed and managed under {currentVendor.name}
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() => setAddProductOpen(true)}
              >
                Add Product
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sellerProducts.map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white space-y-3 flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 rounded-lg object-cover bg-slate-50 border border-slate-200 shrink-0"
                    />
                    <div className="space-y-1 min-w-0">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        {p.category}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 truncate">{p.title}</h4>
                      <span className="text-sm font-extrabold text-slate-900 tabular-nums block">
                        Rs. {p.pricePKR.toLocaleString('en-PK')}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100 text-slate-600">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Stock Qty:</span>
                      <span className="font-bold text-slate-800">{p.stockQuantity} units</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Status:</span>
                      <span className="font-bold text-emerald-700">Active Listing</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PAYOUTS */}
        {activeTab === 'payouts' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Bank Payouts &amp; Settlements
                </h2>
                <p className="text-xs text-slate-500">
                  Weekly automated settlements to your Pakistani bank account
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block">Next Settlement</span>
                <span className="text-sm font-bold text-emerald-700">This Friday (Rs. 324,500)</span>
              </div>
            </div>

            {/* Bank Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-900 block text-sm">Designated Settlement Account</span>
              <p className="text-slate-600">Bank: <strong>Meezan Bank Ltd</strong></p>
              <p className="text-slate-600">Account Title: <strong>{currentVendor.name}</strong></p>
              <p className="font-mono text-slate-800">IBAN: PK64 MEZN 0001 0293 8472 9102</p>
            </div>

            {/* Historical Settlements */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Recent Settlements History
              </h3>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                <div className="p-3.5 flex justify-between items-center bg-white">
                  <div>
                    <span className="font-bold text-slate-900 block">Cycle #49 (15 Mar - 21 Mar)</span>
                    <span className="text-[11px] text-slate-400">Ref: 1LINK-RAAST-882910</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-700 block">Rs. 418,200</span>
                    <span className="text-[10px] text-slate-400">Credited on 22 Mar</span>
                  </div>
                </div>

                <div className="p-3.5 flex justify-between items-center bg-white">
                  <div>
                    <span className="font-bold text-slate-900 block">Cycle #48 (08 Mar - 14 Mar)</span>
                    <span className="text-[11px] text-slate-400">Ref: 1LINK-RAAST-773019</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-700 block">Rs. 389,000</span>
                    <span className="text-[10px] text-slate-400">Credited on 15 Mar</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-6 space-y-6">
            <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
              Store &amp; Dispatch Hub Settings
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Store Display Name" value={currentVendor.name} disabled />
              <Input label="Registered City" value={currentVendor.city} disabled />
              <Input label="FBR NTN Number" value={currentVendor.ntnNumber || '7281904-2'} disabled />
              <Input label="Courier Pickup Hub" value={`${currentVendor.city} Main Logistics Center`} disabled />
            </div>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {addProductOpen && (
        <Modal
          isOpen={addProductOpen}
          onClose={() => setAddProductOpen(false)}
          title="List New Product"
          subtitle={`Scoped to seller: ${currentVendor.name}`}
        >
          <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
            <Input
              label="Product Title"
              required
              placeholder="e.g. Wireless Pro Studio Earbuds"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Price (PKR)"
                required
                type="number"
                placeholder="4999"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
              />
              <Input
                label="Initial Stock Quantity"
                required
                type="number"
                value={newStock}
                onChange={(e) => setNewStock(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
              >
                <option value="smartphones">Smartphones</option>
                <option value="laptops">Laptops</option>
                <option value="tablets">Tablets</option>
                <option value="pc-components">PC Components</option>
                <option value="monitors">Monitors</option>
                <option value="audio">Audio</option>
                <option value="gaming">Gaming</option>
                <option value="cameras">Cameras</option>
                <option value="smart-watches">Smart Watches</option>
                <option value="accessories">Accessories</option>
                <option value="networking">Networking</option>
                <option value="smart-home">Smart Home</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700">Product Description</label>
              <textarea
                required
                rows={3}
                placeholder="Detailed description, origin, specs..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full text-xs p-3 rounded-lg border border-slate-300"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button type="submit" variant="primary" size="sm">
                Publish Product Listing
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAddProductOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Airway Bill Printable Modal */}
      {airwayBillOrder && (
        <Modal
          isOpen={!!airwayBillOrder}
          onClose={() => setAirwayBillOrder(null)}
          title={`Consignment Airway Bill — ${airwayBillOrder.trackingNumber}`}
          subtitle={`Courier Service: ${airwayBillOrder.courierProvider}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 border-2 border-dashed border-slate-300 rounded-xl space-y-3 bg-white">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="font-black text-base text-slate-900">ZESTMART PK EXPRESS</span>
                <span className="font-mono font-bold text-sm text-emerald-800">
                  {airwayBillOrder.trackingNumber}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Shipper (Seller)</span>
                  <p className="font-bold text-slate-900">{currentVendor.name}</p>
                  <p className="text-slate-500">{currentVendor.city}, Pakistan</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">Consignee (Buyer)</span>
                  <p className="font-bold text-slate-900">{airwayBillOrder.shippingAddress.fullName}</p>
                  <p className="text-slate-500">{airwayBillOrder.shippingAddress.streetAddress}, {airwayBillOrder.shippingAddress.city}</p>
                  <p className="text-slate-500">Phone: {airwayBillOrder.shippingAddress.phone}</p>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 flex justify-between items-center font-bold">
                <span>Payment Mode:</span>
                <span className="text-emerald-800 uppercase">
                  {airwayBillOrder.paymentMethod === 'cod'
                    ? `CASH ON DELIVERY (COLLECT RS. ${airwayBillOrder.totalPKR.toLocaleString('en-PK')})`
                    : 'PAID ONLINE (DO NOT COLLECT CASH)'}
                </span>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Printer className="w-4 h-4" />}
                onClick={() => window.print()}
              >
                Print Airway Slip
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setAirwayBillOrder(null)}
              >
                Done
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
