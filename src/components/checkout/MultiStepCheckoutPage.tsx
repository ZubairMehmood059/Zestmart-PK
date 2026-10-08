import React, { useState } from 'react';
import { CartItem, Address, PaymentMethod, Order } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { PAKISTAN_CITIES, COURIER_PARTNERS, ACTIVE_COUPONS, FREE_SHIPPING_THRESHOLD_PKR } from '../../config/constants';
import { ApiService } from '../../services/api';
import { CloudSpamProtection } from '../common/CloudSpamProtection';
import {
  Banknote,
  Smartphone,
  Building2,
  CreditCard,
  Truck,
  CheckCircle2,
  PackageCheck,
  ArrowLeft,
  Printer,
  ShieldCheck,
  MapPin
} from 'lucide-react';

interface MultiStepCheckoutPageProps {
  items: CartItem[];
  selectedCity: string;
  appliedCoupon: string | null;
  onOrderComplete: (order: Order) => void;
  onBackToCart: () => void;
  onViewAccountOrders: () => void;
}

export const MultiStepCheckoutPage: React.FC<MultiStepCheckoutPageProps> = ({
  items,
  selectedCity,
  appliedCoupon,
  onOrderComplete,
  onBackToCart,
  onViewAccountOrders
}) => {
  const user = ApiService.getUser();

  // Step state (1: Address, 2: Courier, 3: Payment, 4: Confirmed)
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Address form
  const [address, setAddress] = useState<Address>(
    user.savedAddresses.find((a) => a.isDefault) || {
      fullName: user.name,
      phone: user.phone,
      streetAddress: 'House 42, Street 7, Block 4',
      areaLandmark: 'Gulshan-e-Iqbal',
      city: selectedCity,
      province: 'Sindh',
      postalCode: '75300'
    }
  );

  // Courier method
  const [courier, setCourier] = useState<string>('tcs');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [jazzCashPhone, setJazzCashPhone] = useState(user.phone);
  const [easypaisaPhone, setEasypaisaPhone] = useState(user.phone);
  const [cardHolder, setCardHolder] = useState(user.name);
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');

  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);

  // Price calculations
  const subtotalPKR = items.reduce(
    (sum, item) => sum + item.product.pricePKR * item.quantity,
    0
  );
  const isFreeDelivery = subtotalPKR >= FREE_SHIPPING_THRESHOLD_PKR;
  const shippingFeePKR = isFreeDelivery ? 0 : 150;

  let discountPKR = 0;
  if (appliedCoupon && ACTIVE_COUPONS[appliedCoupon]) {
    const info = ACTIVE_COUPONS[appliedCoupon];
    discountPKR = Math.min((subtotalPKR * info.discountPercent) / 100, info.maxDiscountPKR);
  }

  const grandTotalPKR = Math.max(0, subtotalPKR + shippingFeePKR - discountPKR);

  const selectedCourierInfo =
    COURIER_PARTNERS.find((c) => c.id === courier) || COURIER_PARTNERS[0];

  const handlePlaceOrder = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const trackingCode = `${selectedCourierInfo.trackingPrefix}-PK-${Math.floor(
        100000 + Math.random() * 900000
      )}`;

      const newOrder = ApiService.createOrder({
        items: [...items],
        subtotalPKR,
        shippingFeePKR,
        discountPKR,
        totalPKR: grandTotalPKR,
        shippingAddress: { ...address },
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending_cod' : 'paid',
        trackingNumber: trackingCode,
        courierProvider: selectedCourierInfo.name,
        estimatedDelivery: '2-3 Business Days'
      });

      setCompletedOrder(newOrder);
      setIsProcessing(false);
      onOrderComplete(newOrder);
    }, 1400);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Steps */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <button
            onClick={onBackToCart}
            className="text-xs text-slate-500 hover:text-emerald-700 flex items-center gap-1 mb-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Shopping Cart</span>
          </button>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Checkout &amp; Order Placement
          </h1>
        </div>

        {/* Step Progress Indicators */}
        {!completedOrder && (
          <nav aria-label="Checkout progress" className="flex flex-wrap items-center gap-1.5 text-xs">
            <span
              aria-current={step === 1 ? 'step' : undefined}
              className={`px-2.5 py-1 rounded-md font-semibold text-[11px] sm:text-xs ${
                step >= 1 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              1. Address
            </span>
            <span className="text-slate-400 text-xs" aria-hidden="true">&rarr;</span>
            <span
              aria-current={step === 2 ? 'step' : undefined}
              className={`px-2.5 py-1 rounded-md font-semibold text-[11px] sm:text-xs ${
                step >= 2 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              2. Courier
            </span>
            <span className="text-slate-400 text-xs" aria-hidden="true">&rarr;</span>
            <span
              aria-current={step === 3 ? 'step' : undefined}
              className={`px-2.5 py-1 rounded-md font-semibold text-[11px] sm:text-xs ${
                step >= 3 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              3. Payment
            </span>
          </nav>
        )}
      </div>

      {completedOrder ? (
        /* Order Confirmed Success Screen */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-8 text-center space-y-6 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <PackageCheck className="w-9 h-9" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Shukriya! Order #{completedOrder.id} Confirmed
            </h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Your parcel is booked with <strong>{completedOrder.courierProvider}</strong>. A verification SMS has been sent to <strong>{completedOrder.shippingAddress.phone}</strong>.
            </p>
          </div>

          {/* Consignment card */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-3 text-xs">
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-200">
              <span className="text-slate-500">Tracking Code:</span>
              <span className="font-mono font-bold text-sm text-emerald-800">
                {completedOrder.trackingNumber}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Courier Partner:</span>
              <span className="font-bold text-slate-800">{completedOrder.courierProvider}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Delivery Destination:</span>
              <span className="font-medium text-slate-800 text-right">
                {completedOrder.shippingAddress.streetAddress}, {completedOrder.shippingAddress.city}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Payment Status:</span>
              <span className="font-bold text-emerald-800 uppercase">
                {completedOrder.paymentMethod === 'cod' ? 'Cash on Delivery (Pending)' : 'Paid Online'}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2.5 border-t border-slate-200">
              <span className="font-bold text-slate-900">Total Payable at Doorstep:</span>
              <span className="font-extrabold text-base text-emerald-700 tabular-nums">
                Rs. {completedOrder.totalPKR.toLocaleString('en-PK')}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              variant="outline"
              size="md"
              leftIcon={<Printer className="w-4 h-4" />}
              onClick={() => window.print()}
            >
              Print Receipt
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={onViewAccountOrders}
            >
              View Order in Account &rarr;
            </Button>
          </div>
        </div>
      ) : (
        /* Multi-Step Checkout Form */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Steps Form (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Step 1: Address Details */}
            {step === 1 && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    Step 1: Pakistani Delivery Address
                  </h3>
                  <span className="text-xs text-slate-400">Step 1 of 3</span>
                </div>

                {/* Quick saved addresses selection */}
                {user.savedAddresses.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700">
                      Choose from Saved Addresses:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {user.savedAddresses.map((addr) => (
                        <button
                          type="button"
                          key={addr.id}
                          onClick={() => setAddress(addr)}
                          className={`p-3 text-left rounded-xl border text-xs cursor-pointer transition-colors ${
                            address.id === addr.id
                              ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <span className="font-bold block truncate">{addr.label || addr.fullName}</span>
                          <span className="text-[11px] text-slate-500 block truncate">{addr.streetAddress}</span>
                          <span className="text-[11px] text-slate-400 block">{addr.city}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name (Recipient)"
                    required
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  />
                  <Input
                    label="Mobile Number (SMS Updates)"
                    required
                    placeholder="0300-1234567"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    helperText="Active WhatsApp / SMS number for courier OTP"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-700">Destination City</label>
                    <select
                      value={address.city}
                      onChange={(e) => {
                        const chosen = PAKISTAN_CITIES.find((c) => c.name === e.target.value);
                        setAddress({
                          ...address,
                          city: e.target.value,
                          province: chosen?.province || address.province
                        });
                      }}
                      className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    >
                      {PAKISTAN_CITIES.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name} ({c.province})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <Input
                      label="House / Apartment / Street Address"
                      required
                      value={address.streetAddress}
                      onChange={(e) => setAddress({ ...address, streetAddress: e.target.value })}
                    />
                  </div>
                </div>

                <Input
                  label="Area / Sector / Nearest Landmark"
                  required
                  placeholder="e.g. Near Shell Pump / Block 4"
                  value={address.areaLandmark}
                  onChange={(e) => setAddress({ ...address, areaLandmark: e.target.value })}
                />

                {addressError && (
                  <p className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 px-3 py-2 rounded-lg">
                    {addressError}
                  </p>
                )}

                <div className="pt-2 flex justify-end">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => {
                      if (!address.fullName || !address.phone || !address.streetAddress) {
                        setAddressError('Please fill out all required address fields (Full Name, Phone, and Street Address).');
                        return;
                      }
                      setAddressError(null);
                      setStep(2);
                    }}
                  >
                    Continue to Courier Selection &rarr;
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Courier Method */}
            {step === 2 && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    Step 2: Choose Courier Service
                  </h3>
                  <span className="text-xs text-slate-400">Step 2 of 3</span>
                </div>

                <div className="space-y-3">
                  {COURIER_PARTNERS.map((c) => (
                    <label
                      key={c.id}
                      className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                        courier === c.id
                          ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="courier"
                          value={c.id}
                          checked={courier === c.id}
                          onChange={() => setCourier(c.id)}
                          className="text-emerald-600 focus:ring-emerald-500"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{c.name}</h4>
                          <p className="text-[11px] text-slate-500">{c.eta}</p>
                        </div>
                      </div>

                      <span className="text-xs font-bold text-slate-900">
                        {isFreeDelivery ? 'FREE' : 'Rs. 150'}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="pt-4 flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => setStep(1)}>
                    &larr; Back to Address
                  </Button>
                  <Button variant="primary" size="md" onClick={() => setStep(3)}>
                    Continue to Payment &rarr;
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Payment Method */}
            {step === 3 && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Step 3: Select Payment Method
                  </h3>
                  <span className="text-xs text-slate-400">Step 3 of 3</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Cash on Delivery */}
                  <label
                    className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                      paymentMethod === 'cod'
                        ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_rail"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                        <Banknote className="w-4 h-4 text-emerald-700" />
                        <span>Cash on Delivery (COD)</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Pay cash directly to TCS/Leopards rider upon parcel delivery.
                      </p>
                    </div>
                  </label>

                  {/* JazzCash */}
                  <label
                    className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                      paymentMethod === 'jazzcash'
                        ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_rail"
                      value="jazzcash"
                      checked={paymentMethod === 'jazzcash'}
                      onChange={() => setPaymentMethod('jazzcash')}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                        <Smartphone className="w-4 h-4 text-red-600" />
                        <span>JazzCash Mobile Wallet</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Instant push notification on your Jazz phone for MPIN authorization.
                      </p>
                    </div>
                  </label>

                  {/* Easypaisa */}
                  <label
                    className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                      paymentMethod === 'easypaisa'
                        ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_rail"
                      value="easypaisa"
                      checked={paymentMethod === 'easypaisa'}
                      onChange={() => setPaymentMethod('easypaisa')}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                        <Smartphone className="w-4 h-4 text-emerald-600" />
                        <span>Easypaisa Wallet</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Approve via your Easypaisa app or USSD prompt.
                      </p>
                    </div>
                  </label>

                  {/* Raast / 1Link */}
                  <label
                    className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                      paymentMethod === 'bank_transfer'
                        ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_rail"
                      value="bank_transfer"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={() => setPaymentMethod('bank_transfer')}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                        <Building2 className="w-4 h-4 text-blue-600" />
                        <span>Raast / 1Link Bank Transfer</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Zero transfer fees. Pay to Meezan Bank / HBL escrow account.
                      </p>
                    </div>
                  </label>
                </div>

                {/* Sub-form based on payment */}
                {paymentMethod === 'jazzcash' && (
                  <div className="p-4 rounded-xl bg-red-50/50 border border-red-200 space-y-2 text-xs">
                    <label className="font-bold text-slate-800">JazzCash Account Number</label>
                    <Input
                      value={jazzCashPhone}
                      onChange={(e) => setJazzCashPhone(e.target.value)}
                      placeholder="030X-XXXXXXX"
                    />
                    <p className="text-[11px] text-slate-500">
                      You will receive an MPIN confirmation prompt on this mobile.
                    </p>
                  </div>
                )}

                {paymentMethod === 'bank_transfer' && (
                  <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2 text-xs">
                    <h5 className="font-bold text-slate-900">ZestMart Official Escrow Account</h5>
                    <div className="space-y-1 font-mono text-[11px] text-slate-700">
                      <p>Bank: Meezan Bank Ltd.</p>
                      <p>Account Title: ZestMart PK (Pvt) Ltd</p>
                      <p>IBAN: PK64 MEZN 0001 0293 8472 9102</p>
                      <p>Raast ID: 03001234567</p>
                    </div>
                  </div>
                )}

                <CloudSpamProtection status="verified" className="mt-4" />

                <div className="pt-4 flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => setStep(2)}>
                    &larr; Back to Courier
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    isLoading={isProcessing}
                    onClick={handlePlaceOrder}
                    leftIcon={<CheckCircle2 className="w-4 h-4" />}
                  >
                    Confirm &amp; Place Order (Rs. {grandTotalPKR.toLocaleString('en-PK')})
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Right Summary Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                Consignment Items ({items.length})
              </h3>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((i) => {
                  const itemId = i.id || `${i.product.id}::${(i.selectedColor || '').toLowerCase()}::${(i.selectedSize || '').toLowerCase()}`;
                  return (
                    <div key={itemId} className="flex items-center gap-3 text-xs">
                      <img
                        src={i.product.thumbnail}
                        alt={i.product.title}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-lg object-cover bg-slate-50 border border-slate-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-800 truncate">{i.product.title}</h4>
                        {(i.selectedColor || i.selectedSize) && (
                          <p className="text-[10px] text-slate-500 truncate">
                            {[i.selectedColor && `Color: ${i.selectedColor}`, i.selectedSize && `Size: ${i.selectedSize}`].filter(Boolean).join(' · ')}
                          </p>
                        )}
                        <p className="text-[11px] text-slate-400">Qty: {i.quantity}</p>
                      </div>
                      <span className="font-bold text-slate-900 tabular-nums">
                        Rs. {(i.product.pricePKR * i.quantity).toLocaleString('en-PK')}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Price Calculations */}
              <div className="space-y-1.5 text-xs pt-3 border-t border-slate-100 text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-slate-800 tabular-nums">
                    Rs. {subtotalPKR.toLocaleString('en-PK')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Courier Delivery ({selectedCourierInfo.name}):</span>
                  <span className="font-semibold text-slate-800 tabular-nums">
                    {isFreeDelivery ? <span className="text-emerald-700">FREE</span> : `Rs. ${shippingFeePKR}`}
                  </span>
                </div>
                {discountPKR > 0 && (
                  <div className="flex justify-between text-rose-600 font-semibold">
                    <span>Coupon Savings:</span>
                    <span className="tabular-nums">-Rs. {discountPKR.toLocaleString('en-PK')}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Payable Amount:</span>
                  <span className="text-emerald-700 text-lg tabular-nums">
                    Rs. {grandTotalPKR.toLocaleString('en-PK')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
