import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

interface PromoDealBannerProps {
  onExploreDeals: () => void;
}

export const PromoDealBanner: React.FC<PromoDealBannerProps> = ({ onExploreDeals }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
        {/* Right Asymmetrical Curved Gradient Area inspired by Design Reference */}
        <div className="absolute top-0 right-0 w-full lg:w-[55%] h-full bg-gradient-to-l from-amber-600 via-amber-700 to-slate-900 lg:rounded-l-[100px] pointer-events-none opacity-90 lg:opacity-100" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12">
          {/* Left Text Box (6 Cols) */}
          <div className="lg:col-span-6 space-y-4 text-white">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Limited Stock Flash Campaign</span>
            </div>

            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-white leading-tight">
              Save up to <span className="text-amber-400">30% OFF</span> on Premium Gaming &amp; Rigs
            </h3>

            <p className="text-sm text-slate-300 max-w-md leading-relaxed">
              Equip your battlestation with certified NVIDIA RTX GPUs, PS5 Consoles, and Apple Silicon hardware. Direct importer pricing with official warranty.
            </p>

            <div className="pt-2">
              <button
                onClick={onExploreDeals}
                className="px-6 py-3 rounded-full bg-white text-slate-950 hover:bg-slate-100 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md group"
              >
                <span>Explore Deal Selection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Showcase Imagery (6 Cols) */}
          <div className="lg:col-span-6 relative flex items-center justify-center lg:justify-end gap-4">
            <div className="relative flex items-center gap-3 sm:gap-6">
              {/* Product 1: Console / Headset */}
              <div className="w-36 sm:w-48 aspect-square rounded-2xl bg-white/10 backdrop-blur-md p-3 border border-white/20 shadow-2xl flex items-center justify-center rotate-[-3deg] hover:rotate-0 transition-transform">
                <img
                  src="https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=400&q=80"
                  alt="Sony PlayStation 5 Console"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain drop-shadow-xl"
                />
              </div>

              {/* Product 2: Pro Laptop */}
              <div className="w-44 sm:w-60 aspect-4/3 rounded-2xl bg-white/10 backdrop-blur-md p-3 border border-white/20 shadow-2xl flex items-center justify-center rotate-[3deg] hover:rotate-0 transition-transform">
                <img
                  src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80"
                  alt="MacBook Pro Hardware"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain drop-shadow-xl"
                />
              </div>

              {/* Script Floating Tag */}
              <div className="absolute -bottom-2 right-2 text-white/90 italic font-serif text-sm pointer-events-none hidden sm:block">
                Tech &amp; Performance
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
