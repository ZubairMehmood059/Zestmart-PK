import React, { useState } from 'react';
import { CartItem } from '../../types';
import { Button } from '../ui/Button';
import { PAKISTAN_CITIES, ACTIVE_COUPONS, FREE_SHIPPING_THRESHOLD_PKR } from '../../config/constants';
import {
  ShoppingBag,
  Trash2,
  Heart,
  ArrowRight,
  Truck,
  ShieldCheck,
  Tag,
  ArrowLeft
} from 'lucide-react';

interface CartPageProps {
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, quantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onMoveToWishlist: (cartItemId: string) => void;
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
  appliedCoupon: string | null;
  onApplyCoupon: (code: string) => boolean;
  onRemoveCoupon: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onMoveToWishlist,
  onProceedToCheckout,
  onContinueShopping,
  selectedCity,
  onSelectCity,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [orderNotes, setOrderNotes] = useState('');

  const subtotalPKR = items.reduce(
    (sum, item) => sum + item.product.pricePKR * item.quantity,
    0
  );

  const isFreeDelivery = subtotalPKR >= FREE_SHIPPING_THRESHOLD_PKR;
  const shippingFeePKR = items.length === 0 ? 0 : isFreeDelivery ? 0 : 150;

  let discountPKR = 0;
  if (appliedCoupon && ACTIVE_COUPONS[appliedCoupon]) {
    const info = ACTIVE_COUPONS[appliedCoupon];
    discountPKR = Math.min((subtotalPKR * info.discountPercent) / 100, info.maxDiscountPKR);
  }

  const grandTotalPKR = Math.max(0, subtotalPKR + shippingFeePKR - discountPKR);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const success = onApplyCoupon(couponInput.trim().toUpperCase());
    if (success) {
      setCouponError('');
      setCouponInput('');
    } else {
      setCouponError('Invalid coupon. Try "ZESTPK10" or "WELCOMEPK"');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <button
            onClick={onContinueShopping}
            className="text-xs text-slate-500 hover:text-emerald-700 flex items-center gap-1 mb-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </button>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Shopping Cart ({items.reduce((acc, i) => acc + i.quantity, 0)} Items)
          </h1>
        </div>

        {/* Free Shipping Alert Banner */}
        <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl px-4 py-2 text-xs flex items-center gap-2 text-emerald-800 font-medium">
          <Truck className="w-4 h-4 text-emerald-600" />
          <span>
            {isFreeDelivery
              ? `You qualified for FREE nationwide delivery to ${selectedCity}!`
              : `Add Rs. ${(FREE_SHIPPING_THRESHOLD_PKR - subtotalPKR).toLocaleString('en-PK')} more for Free Delivery`}
          </span>
        </div>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items Table & Notes (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
              <div className="divide-y divide-slate-100">
                {items.map((item) => {
                  const itemId = item.id || `${item.product.id}::${(item.selectedColor || '').toLowerCase()}::${(item.selectedSize || '').toLowerCase()}`;
                  return (
                    <div key={itemId} className="p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                      <div className="flex items-center gap-4 min-w-0">
                        <img
                          src={item.product.thumbnail}
                          alt={item.product.title}
                          referrerPolicy="no-referrer"
                          className="w-20 h-20 rounded-xl object-cover bg-slate-50 border border-slate-200 shrink-0"
                        />
                        <div className="space-y-1 min-w-0">
                          <span className="text-[11px] text-slate-500 block">
                            Seller: {item.product.vendor.name} ({item.product.vendor.city})
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
                            {item.product.title}
                          </h4>
                          {(item.selectedColor || item.selectedSize) && (
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                              {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                            </div>
                          )}
                          <span className="text-xs font-bold text-slate-900 tabular-nums sm:hidden block">
                            Rs. {item.product.pricePKR.toLocaleString('en-PK')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                          <button
                            onClick={() => onUpdateQuantity(itemId, item.quantity - 1)}
                            className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-xs font-bold text-slate-900 tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(itemId, item.quantity + 1)}
                            className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        {/* Line Total */}
                        <div className="text-right min-w-[5rem]">
                          <span className="text-sm font-extrabold text-slate-900 tabular-nums block">
                            Rs. {(item.product.pricePKR * item.quantity).toLocaleString('en-PK')}
                          </span>
                          {item.quantity > 1 && (
                            <span className="text-[10px] text-slate-400 block tabular-nums">
                              Rs. {item.product.pricePKR.toLocaleString('en-PK')} each
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onMoveToWishlist(itemId)}
                            className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                            title="Save for later"
                          >
                            <Heart className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onRemoveItem(itemId)}
                            className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Courier Rider Instructions */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 space-y-2">
              <label className="text-xs font-bold text-slate-800 block">
                Special Delivery Instructions for Courier Rider (Optional)
              </label>
              <textarea
                rows={2}
                name="order-instructions"
                aria-label="Delivery instructions or order notes"
                placeholder="e.g. Please call before arriving or deliver to guard at gate"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="w-full text-xs p-3 rounded-lg border border-slate-300 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus-visible:ring-2 focus-visible:ring-emerald-500"
              />
            </div>
          </div>

          {/* Summary Card (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-5">
              <h3 className="text-base font-bold text-slate-900">
                Order Summary
              </h3>

              {/* Destination City Selection */}
              <div className="space-y-1.5 text-xs">
                <label htmlFor="cart-city-select" className="font-semibold text-slate-700">Deliver To:</label>
                <select
                  id="cart-city-select"
                  aria-label="Delivery destination city"
                  value={selectedCity}
                  onChange={(e) => onSelectCity(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-600 focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer"
                >
                  {PAKISTAN_CITIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name} ({c.province}) — {c.deliveryDays}
                    </option>
                  ))}
                </select>
              </div>

              {/* Coupon Field */}
              <form onSubmit={handleApplyCoupon} className="space-y-1.5 pt-2 border-t border-slate-100">
                <label htmlFor="cart-promo-input" className="text-xs font-semibold text-slate-700">Promo Code</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      id="cart-promo-input"
                      type="text"
                      name="promo"
                      aria-label="Promotional coupon code"
                      placeholder="e.g. ZESTPK10"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-2 uppercase placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus-visible:ring-2 focus-visible:ring-emerald-500"
                    />
                  </div>
                  <Button type="submit" variant="secondary" size="sm">
                    Apply
                  </Button>
                </div>
                {couponError && (
                  <p className="text-[11px] text-rose-600 font-medium">{couponError}</p>
                )}
                {appliedCoupon && (
                  <div className="flex items-center justify-between text-[11px] bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded border border-emerald-200">
                    <span>Coupon &apos;{appliedCoupon}&apos; active</span>
                    <button
                      type="button"
                      onClick={onRemoveCoupon}
                      className="text-emerald-950 font-bold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </form>

              {/* Price Calculations */}
              <div className="space-y-2 text-xs pt-3 border-t border-slate-100 text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-slate-800 tabular-nums">
                    Rs. {subtotalPKR.toLocaleString('en-PK')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Nationwide Courier Shipping:</span>
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
                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-3 border-t border-slate-200">
                  <span>Total Amount:</span>
                  <span className="text-emerald-700 tabular-nums text-lg">
                    Rs. {grandTotalPKR.toLocaleString('en-PK')}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <Button
                variant="primary"
                size="lg"
                className="w-full py-3"
                onClick={onProceedToCheckout}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Proceed to Checkout
              </Button>

              {/* Trust Badge Strip */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-around text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  COD Protected
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  TCS / Leopards
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-24 text-center bg-white rounded-2xl border border-slate-200 p-8 space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">Your Cart is Empty</h2>
            <p className="text-xs text-slate-500">
              Browse thousands of authentic products across Pakistan and enjoy free delivery over Rs. 2,999.
            </p>
          </div>
          <Button variant="primary" size="md" onClick={onContinueShopping}>
            Explore Trending Products
          </Button>
        </div>
      )}
    </div>
  );
};
