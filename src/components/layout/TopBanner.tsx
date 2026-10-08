import React from 'react';
import { MapPin, PhoneCall, ShieldCheck, Store, Truck, ShieldAlert } from 'lucide-react';
import { PAKISTAN_CITIES } from '../../config/constants';

interface TopBannerProps {
  selectedCity: string;
  onSelectCity: (city: string) => void;
  onOpenSellerPortal: () => void;
  onOpenAdminPortal?: () => void;
  onOpenTrackOrder: () => void;
}

export const TopBanner: React.FC<TopBannerProps> = ({
  selectedCity,
  onSelectCity,
  onOpenSellerPortal,
  onOpenAdminPortal,
  onOpenTrackOrder
}) => {
  return (
    <div className="text-xs py-2 px-4 hidden sm:block overflow-hidden" style={{ backgroundColor: '#0a121e', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6 whitespace-nowrap">
        {/* Left: Shipping notice & Deliver-to selector */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0 overflow-hidden">
          <div className="flex items-center gap-1.5 font-medium whitespace-nowrap shrink-0" style={{ color: '#00b660' }}>
            <Truck className="w-3.5 h-3.5 shrink-0" style={{ color: '#00b660' }} />
            <span className="whitespace-nowrap">Free Express Delivery over Rs. 2,999 · Cash on Delivery</span>
          </div>

          <span className="shrink-0 hidden lg:inline" aria-hidden="true" style={{ color: 'rgba(255,255,255,0.12)' }}>|</span>

          {/* HTTPS & Cloud Spam Shield Indicator (Visible on lg+) */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs font-medium whitespace-nowrap shrink-0" style={{ color: '#00b660' }}>
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" style={{ color: '#00b660' }} />
            <span className="whitespace-nowrap">256-Bit SSL Encrypted</span>
          </div>

          <span className="shrink-0 hidden md:inline" aria-hidden="true" style={{ color: 'rgba(255,255,255,0.12)' }}>|</span>

          {/* City Selector */}
          <div className="hidden md:flex items-center gap-1.5 whitespace-nowrap shrink-0">
            <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: '#00b660' }} />
            <span className="whitespace-nowrap" style={{ color: '#8b98a5' }}>Deliver to:</span>
            <select
              value={selectedCity}
              aria-label="Select delivery city"
              onChange={(e) => onSelectCity(e.target.value)}
              className="bg-transparent text-white font-semibold focus:outline-none rounded cursor-pointer transition-colors pr-1 whitespace-nowrap"
            >
              {PAKISTAN_CITIES.map((c) => (
                <option key={c.name} value={c.name} className="text-slate-900 bg-white">
                  {c.name} ({c.deliveryDays})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Seller Centre Link, Admin Link, Track Order, Support */}
        <div className="flex items-center gap-2.5 sm:gap-4 whitespace-nowrap shrink-0" style={{ color: '#8b98a5' }}>
          <button
            onClick={onOpenTrackOrder}
            className="transition-colors cursor-pointer flex items-center gap-1.5 focus-visible:outline-none rounded whitespace-nowrap shrink-0 hover:text-white"
            style={{ color: '#8b98a5' }}
          >
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" style={{ color: '#00b660' }} />
            <span className="whitespace-nowrap">Track Order</span>
          </button>

          <span className="shrink-0" aria-hidden="true" style={{ color: 'rgba(255,255,255,0.12)' }}>|</span>

          <button
            onClick={onOpenSellerPortal}
            className="font-semibold transition-colors cursor-pointer flex items-center gap-1.5 focus-visible:outline-none rounded whitespace-nowrap shrink-0 hover:text-white"
            style={{ color: '#00b660' }}
          >
            <Store className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">Sell on ZestMart</span>
          </button>

          {onOpenAdminPortal && (
            <>
              <span className="shrink-0 hidden sm:inline" aria-hidden="true" style={{ color: 'rgba(255,255,255,0.12)' }}>|</span>
              <button
                onClick={onOpenAdminPortal}
                className="transition-colors cursor-pointer flex items-center gap-1 focus-visible:outline-none rounded whitespace-nowrap shrink-0 hidden sm:flex hover:text-white"
                style={{ color: '#8b98a5' }}
              >
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" style={{ color: '#00b660' }} />
                <span className="whitespace-nowrap">Admin</span>
              </button>
            </>
          )}

          <span className="shrink-0" aria-hidden="true" style={{ color: 'rgba(255,255,255,0.12)' }}>|</span>

          <a
            href="tel:080093787"
            aria-label="Call 24/7 support at 0800-ZESTPK"
            className="hover:text-white transition-colors flex items-center gap-1.5 font-medium focus-visible:outline-none rounded whitespace-nowrap shrink-0"
            style={{ color: '#8b98a5' }}
          >
            <PhoneCall className="w-3.5 h-3.5 shrink-0" style={{ color: '#00b660' }} />
            <span className="whitespace-nowrap font-bold text-white">0800-ZESTPK</span>
          </a>
        </div>
      </div>
    </div>
  );
};
