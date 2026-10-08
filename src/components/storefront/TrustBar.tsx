import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Headphones } from 'lucide-react';

export const TrustBar: React.FC = () => {
  const trustFeatures = [
    {
      icon: ShieldCheck,
      title: '100% PTA Approved',
      subtitle: 'Official tax-paid brand warranty'
    },
    {
      icon: Truck,
      title: 'Express Delivery',
      subtitle: 'Insured TCS & Leopards shipping'
    },
    {
      icon: RotateCcw,
      title: 'Cash on Delivery',
      subtitle: 'Doorstep inspection & payment'
    },
    {
      icon: Headphones,
      title: 'Dedicated Support',
      subtitle: 'Urdu & English assistance 7 days'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {trustFeatures.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-center gap-4 hover:border-emerald-300 hover:shadow-sm transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 border border-amber-500/20">
                <Icon className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-slate-900 leading-tight">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-500 leading-tight">
                  {feat.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
