import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Truck, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatedTagline } from '../ui/AnimatedTagline';

interface HeroBannerProps {
  onExploreDeals: () => void;
  onExploreSellers: () => void;
}

const FEATURED_TAGLINES = [
  "Precision Sound & Flagship Tech That Moves You.",
  "Pakistan's Ultimate Choice Tech & Electronics Brand.",
  "Certified PTA Approved Devices & Insured Nationwide COD."
];

const HERO_SLIDES = [
  {
    kicker: 'PTA Approved Flagship',
    title: 'Precision Sound & Flagship Tech That Moves You.',
    description: 'Discover certified Apple, Sony, Samsung, and ASUS hardware directly from verified tech importers in Karachi, Lahore, and Islamabad. Official warranty & insured COD.',
    badge: 'Save up to Rs. 40,000',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    productName: 'Sony WH-1000XM5 ANC Studio Edition',
    productPrice: 'Rs. 94,999',
    productOriginalPrice: 'Rs. 104,999',
    tagline: 'Pure Acoustic Clarity'
  },
  {
    kicker: 'Official Local Warranty',
    title: 'Apple iPhone 16 Pro Max in Grade 5 Titanium.',
    description: 'A18 Pro power, 48MP Pro camera system, and ultra-durable titanium chassis. 100% Tax-paid official PTA approval with physical and eSIM capability.',
    badge: 'Official Distributor',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
    productName: 'Apple iPhone 16 Pro Max (256GB)',
    productPrice: 'Rs. 489,999',
    productOriginalPrice: 'Rs. 529,999',
    tagline: 'Titanium Perfection'
  },
  {
    kicker: 'High-Performance Computing',
    title: 'Apple MacBook Pro M3 Max for Creative Masters.',
    description: 'Extreme speed for rendering, AI models, and software engineering. Liquid Retina XDR screen with up to 22 hours of battery performance.',
    badge: 'Pro Performance',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    productName: 'Apple MacBook Pro 16" (M3 Max, 36GB)',
    productPrice: 'Rs. 989,999',
    productOriginalPrice: 'Rs. 1,049,999',
    tagline: 'Pro Computational Power'
  }
];

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExploreDeals,
  onExploreSellers
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
      <div className="relative overflow-hidden bg-white rounded-3xl border border-slate-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-6 sm:p-10 lg:p-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Content Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Tag Kicker: Quiet text metadata without pill encapsulation */}
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>{slide.kicker}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-500 font-medium normal-case tracking-normal">Direct Verified Tech Importer</span>
            </div>

            {/* Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15] font-display min-h-[3.2em] sm:min-h-[2.4em]">
              <AnimatedTagline texts={FEATURED_TAGLINES} />
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed">
              {slide.description}
            </p>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={onExploreDeals}
                className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-sm flex items-center gap-2 transition-all cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
              >
                <span>Explore Tech Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreSellers}
                className="px-5 py-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold text-xs sm:text-sm border border-slate-200 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                Verified Importers
              </button>
            </div>

            {/* Bottom Mini Trust Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
                  <Truck className="w-4 h-4" />
                </div>
                <div className="leading-tight">
                  <p className="font-bold text-slate-900">Express Delivery</p>
                  <p className="text-xs text-slate-500">Across 250+ PK cities</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="leading-tight">
                  <p className="font-bold text-slate-900">100% Tax-Paid</p>
                  <p className="text-xs text-slate-500">Official PTA Approved</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="leading-tight">
                  <p className="font-bold text-slate-900">Cash on Delivery</p>
                  <p className="text-xs text-slate-500">Pay at your doorstep</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Visual Column (5 Cols) - Studio Pedestal Presentation */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center">
            {/* Product Showcase Card */}
            <div className="relative w-full max-w-sm rounded-2xl bg-slate-50/90 p-6 border border-slate-200/90 shadow-sm transition-all">
              {/* Top Badge */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 text-xs">
                <span className="text-emerald-700 font-bold text-xs">
                  {slide.badge}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  In Stock &amp; Ready
                </span>
              </div>

              {/* Product Center Image */}
              <div className="relative my-4 aspect-4/3 rounded-xl overflow-hidden bg-white flex items-center justify-center p-4 border border-slate-200/60 shadow-2xs">
                <img
                  src={slide.image}
                  alt={slide.productName}
                  loading="eager"
                  decoding="async"
                  width={400}
                  height={300}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain mix-blend-multiply hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Product Metadata & Price */}
              <div className="space-y-1">
                <h2 className="text-sm font-bold text-slate-900 line-clamp-1">
                  {slide.productName}
                </h2>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-black text-slate-900 tabular-nums">
                    {slide.productPrice}
                  </span>
                  <span className="text-xs text-slate-400 line-through tabular-nums">
                    {slide.productOriginalPrice}
                  </span>
                </div>
              </div>

              {/* Quick Action */}
              <button
                onClick={onExploreDeals}
                className="mt-3.5 w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-700"
              >
                <span>View Product Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Carousel Controls (Prev/Next Arrows + Dots) */}
            <div className="flex items-center justify-between w-full max-w-sm mt-4 px-2">
              <button
                onClick={prevSlide}
                aria-label="Previous Slide"
                className="w-8.5 h-8.5 rounded-full bg-white text-slate-700 border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:text-emerald-700 transition-colors cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Dots */}
              <div className="flex items-center gap-1.5">
                {HERO_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      currentSlide === i
                        ? 'w-6 bg-emerald-600'
                        : 'w-2 bg-slate-200 hover:bg-slate-300'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                aria-label="Next Slide"
                className="w-8.5 h-8.5 rounded-full bg-white text-slate-700 border border-slate-200 flex items-center justify-center hover:bg-slate-50 hover:text-emerald-700 transition-colors cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
