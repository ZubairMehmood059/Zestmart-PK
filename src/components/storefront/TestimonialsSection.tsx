import React from 'react';
import { Star, ShieldCheck, CheckCircle2, Quote, MapPin } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  city: string;
  role: string;
  productPurchased: string;
  rating: number;
  date: string;
  review: string;
  avatarUrl: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test_1',
    name: 'Hamza Farooq',
    city: 'Karachi (DHA Phase 6)',
    role: 'Software Architect',
    productPurchased: 'Apple MacBook Pro 16" (M3 Max)',
    rating: 5,
    date: 'March 2026',
    review: 'Ordered my M3 Max MacBook for mobile development. Arrived in Karachi within 24 hours via TCS express. Box was sealed with Apple warranty active and original importer slip. Best tech purchasing experience in Pakistan!',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'test_2',
    name: 'Dr. Ayesha Tariq',
    city: 'Lahore (Gulberg III)',
    role: 'Consultant Radiologist',
    productPurchased: 'Apple iPhone 16 Pro Max (PTA Approved)',
    rating: 5,
    date: 'February 2026',
    review: 'Verified the IMEI directly on PTA DIRBS portal before paying the courier on Cash on Delivery. 100% official tax-paid device with physical SIM and eSIM ready. Very trustworthy platform.',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'test_3',
    name: 'Bilal Siddiqui',
    city: 'Islamabad (F-7/2)',
    role: 'AI Researcher',
    productPurchased: 'ASUS ROG RTX 4090 OC 24GB GPU',
    rating: 5,
    date: 'March 2026',
    review: 'Building a local LLM workstation. Got genuine ASUS distributor warranty card, tamper-proof packaging, and zero coil whine. ZestMart PK is the real deal for high-end computing components in Islamabad.',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80'
  }
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-14">
      <div className="space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Pakistani Buyers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Real Reviews from Tech Enthusiasts Across Pakistan
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Trusted by software engineers, content creators, and professionals in Karachi, Lahore, and Islamabad.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="font-bold text-slate-900">4.92 / 5.0</span>
            <span>(2,400+ Orders Delivered)</span>
          </div>
        </div>

        {/* Testimonials Grid (3 cols) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-300 hover:shadow-md transition-all duration-200"
            >
              <div className="space-y-3">
                {/* Rating & Product Tag */}
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80">
                    Verified Buyer
                  </span>
                </div>

                {/* Review Quote */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  &ldquo;{t.review}&rdquo;
                </p>

                {/* Product Tag */}
                <div className="text-xs font-semibold text-emerald-700 bg-slate-50 p-2 rounded-lg border border-slate-200 line-clamp-1">
                  📦 Purchased: {t.productPurchased}
                </div>
              </div>

              {/* Author Footer */}
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <img
                  src={t.avatarUrl}
                  alt={`${t.name} - Verified Electronics Buyer in ${t.city}`}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-emerald-300 shrink-0"
                />
                <div className="text-xs">
                  <h3 className="font-bold text-slate-900">{t.name}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{t.city}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
