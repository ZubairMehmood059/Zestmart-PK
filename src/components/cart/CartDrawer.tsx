import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Truck, Tag, Check, Heart } from 'lucide-react';
import { CartItem } from '../../types';
import { Button } from '../ui/Button';
import { ACTIVE_COUPONS, FREE_SHIPPING_THRESHOLD_PKR } from '../../config/constants';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, quantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onMoveToWishlist: (cartItemId: string) => void;
  onProceedToCheckout: () => void;
  selectedCity: string;
  appliedCoupon: string | null;
  onApplyCoupon: (code: string) => boolean;
  onRemoveCoupon: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onMoveToWishlist,
  onProceedToCheckout,
  selectedCity,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  // Calculate Subtotal
  const subtotalPKR = items.reduce(
    (sum, item) => sum + item.product.pricePKR * item.quantity,
    0
  );

  // Delivery calculation
  const isFreeDelivery = subtotalPKR >= FREE_SHIPPING_THRESHOLD_PKR;
  const shippingFeePKR = items.length === 0 ? 0 : isFreeDelivery ? 0 : 150;

  // Coupon discount calculation
  let discountPKR = 0;
  if (appliedCoupon && ACTIVE_COUPONS[appliedCoupon]) {
    const couponInfo = ACTIVE_COUPONS[appliedCoupon];
    const rawDiscount = (subtotalPKR * couponInfo.discountPercent) / 100;
    discountPKR = Math.min(rawDiscount, couponInfo.maxDiscountPKR);
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
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-drawer-heading"
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs transition-opacity"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden transform transition-transform">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <h3 id="cart-drawer-heading" className="text-base font-bold text-slate-900">
              Your Shopping Cart ({items.reduce((acc, i) => acc + i.quantity, 0)})
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close cart"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-emerald-50 px-6 py-2.5 border-b border-emerald-100 text-xs">
          {isFreeDelivery ? (
            <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>You have unlocked FREE nationwide shipping to {selectedCity}!</span>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex justify-between text-slate-700">
                <span>Add <strong>Rs. {(FREE_SHIPPING_THRESHOLD_PKR - subtotalPKR).toLocaleString('en-PK')}</strong> more for Free Shipping</span>
                <Truck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="w-full h-1.5 bg-emerald-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      100,
                      (subtotalPKR / FREE_SHIPPING_THRESHOLD_PKR) * 100
                    )}%`
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Item List / Scroll area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length > 0 ? (
            items.map((item) => {
              const itemId = item.id || `${item.product.id}::${(item.selectedColor || '').toLowerCase()}::${(item.selectedSize || '').toLowerCase()}`;
              return (
                <div
                  key={itemId}
                  className="flex gap-4 pb-4 border-b border-slate-100"
                >
                  {/* Product thumbnail */}
                  <img
                    src={item.product.thumbnail}
                    alt={item.product.title}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-lg object-cover bg-slate-50 border border-slate-200 shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="space-y-0.5">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-slate-900 line-clamp-2">
                          {item.product.title}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(itemId)}
                          className="text-slate-400 hover:text-rose-600 p-0.5 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-[11px] text-slate-500">
                        Seller: {item.product.vendor.name}
                      </div>

                      {(item.selectedColor || item.selectedSize) && (
                        <div className="flex items-center gap-2 text-[11px] text-slate-600">
                          {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                          {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                        </div>
                      )}
                    </div>

                    {/* Quantity and Price */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-slate-200 rounded-md bg-white">
                        <button
                          onClick={() => onUpdateQuantity(itemId, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 text-xs font-semibold tabular-nums text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(itemId, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onMoveToWishlist(itemId)}
                          className="text-[11px] text-slate-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
                          title="Save to wishlist"
                        >
                          <Heart className="w-3 h-3" />
                          <span className="hidden sm:inline">Save</span>
                        </button>

                        <span className="text-xs font-bold text-slate-900 tabular-nums">
                          Rs. {(item.product.pricePKR * item.quantity).toLocaleString('en-PK')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-20 text-center space-y-3">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-slate-800">
                Your cart is empty
              </h4>
              <p className="text-xs text-slate-500">
                Looks like you haven&apos;t added any Pakistani products yet.
              </p>
              <Button variant="outline" size="sm" onClick={onClose}>
                Continue Shopping
              </Button>
            </div>
          )}
        </div>

        {/* Drawer Footer & Checkout Action */}
        {items.length > 0 && (
          <div className="p-6 border-t border-slate-200 bg-slate-50/50 space-y-4">
            {/* Coupon Code Input */}
            <form onSubmit={handleApplyCoupon} className="space-y-1">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    name="coupon"
                    aria-label="Coupon code"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Coupon (e.g. ZESTPK10)"
                    className="w-full text-xs bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-2 text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-600 focus-visible:ring-2 focus-visible:ring-emerald-500 uppercase"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-700"
                >
                  Apply
                </button>
              </div>

              {couponError && (
                <p className="text-[11px] text-rose-600 font-medium">{couponError}</p>
              )}

              {appliedCoupon && (
                <div className="flex items-center justify-between text-[11px] bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded border border-emerald-200">
                  <span>Coupon &apos;{appliedCoupon}&apos; active ({ACTIVE_COUPONS[appliedCoupon]?.label})</span>
                  <button
                    type="button"
                    onClick={onRemoveCoupon}
                    className="text-emerald-900 font-bold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </form>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-200/80 pt-3">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-slate-800 tabular-nums">
                  Rs. {subtotalPKR.toLocaleString('en-PK')}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Shipping to {selectedCity}:</span>
                <span className="font-semibold tabular-nums text-slate-800">
                  {isFreeDelivery ? (
                    <span className="text-emerald-700">FREE</span>
                  ) : (
                    `Rs. ${shippingFeePKR}`
                  )}
                </span>
              </div>

              {discountPKR > 0 && (
                <div className="flex justify-between text-rose-600 font-semibold">
                  <span>Coupon Savings:</span>
                  <span className="tabular-nums">-Rs. {discountPKR.toLocaleString('en-PK')}</span>
                </div>
              )}

              <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount:</span>
                <span className="text-base text-emerald-700 tabular-nums">
                  Rs. {grandTotalPKR.toLocaleString('en-PK')}
                </span>
              </div>
            </div>

            {/* Proceed Button */}
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={onProceedToCheckout}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Proceed to Checkout
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
