import React from 'react';
import { VENDORS } from '../../config/data';
import { MapPin, ShieldCheck, CheckCircle2, ArrowRight, Store, Star } from 'lucide-react';
import { Vendor } from '../../types';

interface VendorSpotlightProps {
  onSelectVendor: (vendor: Vendor) => void;
}

export const VendorSpotlight: React.FC<VendorSpotlightProps> = ({ onSelectVendor }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-slate-50/80 rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Importer Network</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 font-display">
              Direct Importers &amp; Hardware Hubs
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5 max-w-2xl">
              Distributor pricing, official local warranty, and fast dispatch from Saddar Karachi, Hafeez Centre Lahore, and Blue Area Islamabad.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 hidden sm:inline">Are you a tech importer?</span>
            <button
              onClick={() => onSelectVendor(VENDORS[0])}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs hover:border-emerald-300 transition-colors"
            >
              <span>Explore All Importers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Vendors Clean Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          {VENDORS.slice(0, 4).map((vendor) => (
            <div
              key={vendor.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectVendor(vendor)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSelectVendor(vendor);
              }}
              className="p-5 rounded-xl bg-white border border-slate-200/90 hover:border-emerald-500/70 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm border border-emerald-100 group-hover:scale-105 transition-transform">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight">
                        {vendor.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        <span>{vendor.city}, {vendor.province}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-1">
                  <span className="inline-block bg-emerald-50 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded border border-emerald-200/60">
                    {vendor.badge}
                  </span>
                </div>

                <div className="flex items-center gap-3 pt-1 text-xs">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-slate-900 font-bold tabular-nums">{vendor.rating}</span>
                    <span className="text-slate-500 text-xs">({vendor.ratingCount})</span>
                  </div>
                  <span className="text-slate-300">·</span>
                  <div className="flex items-center gap-1 text-xs text-emerald-700 font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{vendor.deliveryPerformance}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="text-xs">Response: <strong className="text-slate-700">{vendor.responseRate}</strong></span>
                <span className="text-emerald-700 font-semibold group-hover:translate-x-0.5 transition-transform">
                  View Store &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
