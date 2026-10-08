import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Check, ShieldCheck, Truck, RotateCcw, Award, CreditCard, Banknote, Building2 } from 'lucide-react';
import { AppView } from '../../types';
import { PortalMode } from './PortalBar';

interface FooterProps {
  onNavigate?: (view: AppView, category?: string) => void;
  onOpenTrackOrder?: () => void;
  onSwitchPortal?: (portal: PortalMode) => void;
  onOpenPrivacyPolicy?: () => void;
  onOpenSitemap?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenTrackOrder,
  onSwitchPortal,
  onOpenPrivacyPolicy,
  onOpenSitemap
}) => {
  const [email, setEmail] = useState('');
  const [botHoneypot, setBotHoneypot] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (botHoneypot) return; // Anti-bot honeypot caught
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="relative pt-16 pb-12 overflow-hidden" style={{ backgroundColor: '#060b13', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Marketplace Trust Features Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-12" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3.5 p-4 rounded-2xl transition-all group" style={{ backgroundColor: '#0a121e', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform" style={{ backgroundColor: 'rgba(0,182,96,0.1)', color: '#00b660', border: '1px solid rgba(0,182,96,0.2)' }}>
              <Truck className="w-5 h-5 stroke-[1.8]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white tracking-tight">Nationwide COD</h4>
              <p className="text-xs leading-snug" style={{ color: '#8b98a5' }}>Insured delivery in 250+ PK cities</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl transition-all group" style={{ backgroundColor: '#0a121e', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform" style={{ backgroundColor: 'rgba(0,182,96,0.1)', color: '#00b660', border: '1px solid rgba(0,182,96,0.2)' }}>
              <ShieldCheck className="w-5 h-5 stroke-[1.8]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white tracking-tight">PTA Approved</h4>
              <p className="text-xs leading-snug" style={{ color: '#8b98a5' }}>100% Tax-paid official devices</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl transition-all group" style={{ backgroundColor: '#0a121e', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform" style={{ backgroundColor: 'rgba(0,182,96,0.1)', color: '#00b660', border: '1px solid rgba(0,182,96,0.2)' }}>
              <RotateCcw className="w-5 h-5 stroke-[1.8]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white tracking-tight">7-Day Replacement</h4>
              <p className="text-xs leading-snug" style={{ color: '#8b98a5' }}>Hassle-free courier pickup warranty</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl transition-all group" style={{ backgroundColor: '#0a121e', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform" style={{ backgroundColor: 'rgba(0,182,96,0.1)', color: '#00b660', border: '1px solid rgba(0,182,96,0.2)' }}>
              <Award className="w-5 h-5 stroke-[1.8]" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white tracking-tight">Verified Merchants</h4>
              <p className="text-xs leading-snug" style={{ color: '#8b98a5' }}>Direct importers & authorized stores</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {/* Column 1: Brand & Bio (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <button
              onClick={() => onNavigate?.('home')}
              className="flex items-center gap-2.5 text-left cursor-pointer focus:outline-none group"
            >
              <div className="w-8.5 h-8.5 rounded-xl flex items-center justify-center text-white font-black text-sm group-hover:scale-105 transition-transform" style={{ backgroundColor: '#00b660' }}>
                <span>Z</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black tracking-tight text-white group-hover:opacity-80 transition-opacity font-display">
                  Zest<span style={{ color: '#00b660' }}>Mart</span>
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md" style={{ color: '#00b660', backgroundColor: 'rgba(0,182,96,0.1)', border: '1px solid rgba(0,182,96,0.2)' }}>
                  PK
                </span>
              </div>
            </button>

            <p className="text-xs sm:text-sm max-w-sm leading-relaxed" style={{ color: '#8b98a5' }}>
              Pakistan&apos;s trusted electronics marketplace connecting verified distributors, hardware importers, and flagship brand stores across Karachi, Lahore, and Islamabad.
            </p>

            <div className="space-y-2.5 text-xs pt-1" style={{ color: '#8b98a5' }}>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 shrink-0" style={{ color: '#00b660' }} />
                <span>Shahrah-e-Faisal, Karachi · Gulberg, Lahore · Blue Area, Islamabad</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 shrink-0" style={{ color: '#00b660' }} />
                <span>UAN: +92 (21) 111-937-875 · Toll-free: <strong className="text-white">0800-ZESTPK</strong></span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 shrink-0" style={{ color: '#00b660' }} />
                <span>support@zestmart.pk</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm" style={{ color: '#8b98a5' }}>
              <li>
                <button
                  onClick={() => onNavigate?.('home')}
                  className="hover:text-white hover:translate-x-0.5 transition-all cursor-pointer text-left inline-block"
                >
                  Home Storefront
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('shop')}
                  className="hover:text-white hover:translate-x-0.5 transition-all cursor-pointer text-left inline-block"
                >
                  Explore Tech Catalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenTrackOrder?.()}
                  className="hover:text-white hover:translate-x-0.5 transition-all cursor-pointer text-left inline-flex items-center gap-1.5"
                >
                  <span>Track Consignment</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('account')}
                  className="hover:text-white hover:translate-x-0.5 transition-all cursor-pointer text-left inline-block"
                >
                  My Account &amp; Orders
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSwitchPortal?.('seller')}
                  className="font-medium cursor-pointer text-left inline-block"
                  style={{ color: '#00b660' }}
                >
                  Sell on ZestMart PK &rarr;
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Tech Categories */}
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight mb-4">
              Top Categories
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm" style={{ color: '#8b98a5' }}>
              <li>
                <button
                  onClick={() => onNavigate?.('shop', 'smartphones')}
                  className="hover:text-white hover:translate-x-0.5 transition-all cursor-pointer text-left inline-block"
                >
                  Smartphones (PTA Approved)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('shop', 'laptops')}
                  className="hover:text-white hover:translate-x-0.5 transition-all cursor-pointer text-left inline-block"
                >
                  Laptops &amp; MacBooks
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('shop', 'pc-components')}
                  className="hover:text-white hover:translate-x-0.5 transition-all cursor-pointer text-left inline-block"
                >
                  PC Components &amp; GPUs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('shop', 'audio')}
                  className="hover:text-white hover:translate-x-0.5 transition-all cursor-pointer text-left inline-block"
                >
                  Audio &amp; ANC Studio
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate?.('shop', 'gaming')}
                  className="hover:text-white hover:translate-x-0.5 transition-all cursor-pointer text-left inline-block"
                >
                  Gaming Gear &amp; Consoles
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter Box */}
          <div className="space-y-3.5">
            <div>
              <h4 className="text-sm font-bold text-white tracking-tight">
                Newsletter &amp; Deals
              </h4>
              <p className="text-xs leading-relaxed mt-1" style={{ color: '#8b98a5' }}>
                Get notified on exclusive flash drops, price reductions, and new authentic hardware releases in Pakistan.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="relative flex items-center">
              {/* Anti-bot hidden honeypot field */}
              <input
                type="text"
                name="bot_protection_field"
                value={botHoneypot}
                onChange={(e) => setBotHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                className="hidden opacity-0 pointer-events-none absolute"
                aria-hidden="true"
              />

              <input
                type="email"
                required
                aria-label="Email address for discount alerts"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full text-xs py-2.5 pl-3.5 pr-11 rounded-xl text-white focus:outline-none transition-colors"
                style={{ backgroundColor: '#0a121e', border: '1px solid rgba(255,255,255,0.08)' }}
              />
              <button
                type="submit"
                aria-label="Subscribe to newsletter"
                className="absolute right-1 w-8 h-8 rounded-lg text-white flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none"
                style={{ backgroundColor: '#00b660' }}
              >
                {subscribed ? (
                  <Check className="w-4 h-4 stroke-[2.5]" />
                ) : (
                  <Send className="w-3.5 h-3.5 fill-current" />
                )}
              </button>
            </form>

            {subscribed && (
              <p className="text-xs font-semibold animate-fade-in flex items-center gap-1.5" style={{ color: '#00b660' }}>
                <Check className="w-3.5 h-3.5" />
                <span>Subscribed successfully to Pakistani tech drops!</span>
              </p>
            )}

            <div className="pt-1 flex items-center justify-between text-xs" style={{ color: '#8b98a5' }}>
              <span className="flex items-center gap-1">
                <span style={{ color: '#00b660' }}>✓</span> 100% Spam-free
              </span>
              <span className="font-semibold flex items-center gap-1" style={{ color: '#00b660' }}>
                <span>🛡️</span> Cloud Shield Active
              </span>
            </div>
          </div>
        </div>

        {/* Payment & Logistics Badges */}
        <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', color: '#8b98a5' }}>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium" style={{ color: '#8b98a5' }}>Payment Methods:</span>
            {['Cash on Delivery (COD)', 'JazzCash', 'Easypaisa', 'Visa / MasterCard', '1LINK Raast'].map((method) => (
              <span key={method} className="px-2.5 py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: '#0a121e', border: '1px solid rgba(255,255,255,0.06)', color: '#8b98a5' }}>
                {method}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs" style={{ color: '#8b98a5' }}>
            <span>Logistics Partners:</span>
            <span className="font-semibold text-white">TCS · Leopards · Trax Express</span>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Sitemap, Privacy & Compliance */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs" style={{ color: '#8b98a5' }}>
          <p>© {new Date().getFullYear()} ZestMart PK. All rights reserved. Registered under Pakistan Electronic Transactions Ordinance.</p>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4" style={{ color: '#8b98a5' }}>
            <button
              onClick={() => {
                const el = document.getElementById('faq');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else onNavigate?.('faq');
              }}
              className="hover:text-white transition-colors cursor-pointer"
            >
              FAQs &amp; Help
            </button>
            <span aria-hidden="true" style={{ color: 'rgba(255,255,255,0.12)' }}>·</span>
            <button
              onClick={onOpenPrivacyPolicy}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span aria-hidden="true" style={{ color: 'rgba(255,255,255,0.12)' }}>·</span>
            <button
              onClick={onOpenSitemap}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Site Map Directory
            </button>
            <span aria-hidden="true" style={{ color: 'rgba(255,255,255,0.12)' }}>·</span>
            <span className="font-medium" style={{ color: '#00b660' }}>FBR POS Registered</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
