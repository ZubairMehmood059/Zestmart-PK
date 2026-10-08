import React, { useEffect } from 'react';
import { Order, AppView } from '../../types';
import { Button } from '../ui/Button';
import {
  CheckCircle2,
  Package,
  Truck,
  Printer,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  MapPin,
  Clock,
  PhoneCall,
  Share2,
  MessageSquare
} from 'lucide-react';
import { AnalyticsService } from '../../services/analytics';

interface ThankYouPageProps {
  order: Order | null;
  onNavigate: (view: AppView, category?: string) => void;
  onOpenTrackOrder?: () => void;
}

export const ThankYouPage: React.FC<ThankYouPageProps> = ({
  order,
  onNavigate,
  onOpenTrackOrder
}) => {
  useEffect(() => {
    if (order) {
      AnalyticsService.trackPurchase(order);
    }
  }, [order]);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
        <h1 className="text-2xl font-bold text-slate-900">Thank You for Shopping!</h1>
        <p className="text-sm text-slate-600">Your order has been recorded in ZestMart PK.</p>
        <Button variant="primary" size="md" onClick={() => onNavigate('home')}>
          Return to Home
        </Button>
      </div>
    );
  }

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fade-in">
      {/* Top Confirmation Hero */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            Order Confirmed &amp; Dispatched for Verification
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
            Thank You, {order.shippingAddress.fullName}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            Your consignment <strong>#{order.id}</strong> has been secured with official local warranty. Courier tracking details have been sent to <strong>{order.shippingAddress.phone}</strong>.
          </p>
        </div>

        {/* Action Button Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Printer className="w-4 h-4" />}
            onClick={handlePrint}
          >
            Print Tax Invoice
          </Button>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Truck className="w-4 h-4" />}
            onClick={() => onNavigate('account')}
          >
            View in Order History
          </Button>

          <a
            href={`https://wa.me/923001234567?text=Hi%20ZestMart%20PK,%20I%20would%20like%20updates%20on%20my%20order%20${order.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp Updates</span>
          </a>
        </div>
      </div>

      {/* Main Order Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column: Itemized Products & Tracking (7 Cols) */}
        <div className="md:col-span-7 space-y-6">
          {/* Items Container */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-600" />
              <span>Consignment Contents ({order.items.length} Items)</span>
            </h3>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-3.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.thumbnail}
                      alt={item.product.title}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-lg object-contain bg-slate-50 border border-slate-200 p-1 shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 line-clamp-1">{item.product.title}</h4>
                      <p className="text-[11px] text-slate-500">
                        Qty: {item.quantity} · {item.product.vendor.name}
                        {item.selectedColor ? ` · ${item.selectedColor}` : ''}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 tabular-nums">
                    Rs. {(item.product.pricePKR * item.quantity).toLocaleString('en-PK')}
                  </span>
                </div>
              ))}
            </div>

            {/* Pricing Breakdown */}
            <div className="pt-3 space-y-2 text-xs border-t border-slate-100 text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  Rs. {order.subtotalPKR.toLocaleString('en-PK')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Insured Courier Delivery</span>
                <span className="font-semibold text-emerald-700">
                  {order.shippingFeePKR === 0 ? 'FREE' : `Rs. ${order.shippingFeePKR.toLocaleString('en-PK')}`}
                </span>
              </div>
              {order.discountPKR > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Promotional Discount</span>
                  <span>-Rs. {order.discountPKR.toLocaleString('en-PK')}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-black text-slate-900">
                <span>Total Amount (COD)</span>
                <span className="tabular-nums">Rs. {order.totalPKR.toLocaleString('en-PK')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Courier & Shipping Info (5 Cols) */}
        <div className="md:col-span-5 space-y-6">
          {/* Delivery Details */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Destination Address</span>
            </h3>

            <div className="space-y-1 text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <p className="font-bold text-slate-900">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.streetAddress}</p>
              <p>{order.shippingAddress.areaLandmark}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.province} · {order.shippingAddress.postalCode}</p>
              <p className="text-slate-900 font-semibold pt-1">Phone: {order.shippingAddress.phone}</p>
            </div>

            {/* Courier Dispatch Card */}
            <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
              <div className="flex items-center justify-between font-bold text-emerald-950">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{order.courierProvider}</span>
                </span>
                <span className="text-[10px] bg-emerald-700 text-white px-2 py-0.5 rounded">
                  Tracking Active
                </span>
              </div>
              <p className="text-[11px] text-emerald-800">
                Tracking Number: <strong className="font-mono">{order.trackingNumber}</strong>
              </p>
              <p className="text-[11px] text-slate-600">
                Estimated Delivery: <strong>{order.estimatedDelivery}</strong>
              </p>
            </div>
          </div>

          {/* Guarantee Banner */}
          <div className="bg-slate-900 text-slate-300 rounded-2xl p-5 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Doorstep Inspection Guarantee</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              You are entitled to verify the package condition upon delivery across Pakistan before completing the Cash on Delivery payment.
            </p>
            <div className="pt-2">
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                onClick={() => onNavigate('shop')}
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
