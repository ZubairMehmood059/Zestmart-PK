import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck, Truck, RotateCcw, Building2 } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: 'PTA & Tax' | 'Shipping & COD' | 'Warranty & Returns' | 'Sellers';
}

const FAQS: FAQItem[] = [
  {
    category: 'PTA & Tax',
    question: 'Are all smartphones and cellular devices 100% PTA approved?',
    answer: 'Yes. Every flagship smartphone (Apple iPhone, Samsung Galaxy, Google Pixel, OnePlus) listed on ZestMart PK is 100% tax-paid and officially approved by the Pakistan Telecommunication Authority (PTA). Both physical SIM and eSIM slots are fully functional across Jazz, Telenor, Zong, and Ufone networks with official DIRBS verification.'
  },
  {
    category: 'Shipping & COD',
    question: 'How does Cash on Delivery (COD) and doorstep inspection work?',
    answer: 'We provide insured Cash on Delivery across 250+ cities in Pakistan (including Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Peshawar, and Multan). Orders are delivered via premium couriers (TCS, Leopards, Trax Express). You can inspect the tamper-evident packaging at your doorstep before completing payment.'
  },
  {
    category: 'Shipping & COD',
    question: 'What are the delivery timelines for major Pakistani cities?',
    answer: 'Major metropolitan hubs (Karachi, Lahore, Rawalpindi/Islamabad) receive express delivery within 1 to 2 business days. Other regional cities across Punjab, Sindh, KPK, and Balochistan typically take 2 to 3 business days with active SMS/WhatsApp tracking.'
  },
  {
    category: 'Warranty & Returns',
    question: 'What warranty is provided on laptops, GPUs, and gadgets?',
    answer: 'Products come with official brand importer warranties ranging from 1 to 3 years. Additionally, ZestMart PK provides a 7-day doorstep replacement policy for any hardware defects or transit discrepancies.'
  },
  {
    category: 'Sellers',
    question: 'How can verified Pakistani electronics distributors sell on ZestMart?',
    answer: 'Verified tech importers and official brand distributors with active FBR NTN and Pakistani commercial registrations can sign up via our Seller Centre. Once vetted by our catalog compliance team in Karachi, merchants gain access to nationwide logistics and payment gateways.'
  }
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = ['all', 'PTA & Tax', 'Shipping & COD', 'Warranty & Returns', 'Sellers'];

  const filteredFaqs = FAQS.filter(
    (f) => activeCategory === 'all' || f.category === activeCategory
  );

  return (
    <section id="faq" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-14">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-10 lg:p-12 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
              <HelpCircle className="w-4 h-4" />
              <span>Customer Help &amp; FAQs</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Everything you need to know about purchasing certified electronics in Pakistan.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat === 'all' ? 'All Questions' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-emerald-300 bg-emerald-50/20 shadow-2xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80 hidden sm:inline">
                      {faq.category}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      {faq.question}
                    </h3>
                  </div>

                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-emerald-600' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100/80">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
