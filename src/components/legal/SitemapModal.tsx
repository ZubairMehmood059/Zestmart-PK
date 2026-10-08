import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { AppView } from '../../types';
import { CATEGORIES } from '../../config/constants';
import { VENDORS } from '../../config/data';
import { Map, ExternalLink, ArrowRight, ShieldCheck, ShoppingBag, Store } from 'lucide-react';

interface SitemapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: AppView, category?: string) => void;
}

export const SitemapModal: React.FC<SitemapModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const handleGo = (view: AppView, cat?: string) => {
    onNavigate(view, cat);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      title="ZestMart PK HTML Website Map & Navigation Directory"
      subtitle="Complete index of marketplace categories, verified importers, and customer tools"
    >
      <div className="space-y-6 text-xs max-h-[65vh] overflow-y-auto pr-2">
        {/* Marketplace Core Sections */}
        <div className="space-y-2">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 text-xs">
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
            <span>Storefront &amp; Shopping</span>
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              onClick={() => handleGo('home')}
              className="p-2.5 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-left border border-slate-200 transition-colors font-semibold flex items-center justify-between"
            >
              <span>Home Storefront</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </button>
            <button
              onClick={() => handleGo('shop')}
              className="p-2.5 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-left border border-slate-200 transition-colors font-semibold flex items-center justify-between"
            >
              <span>Full Tech Catalog</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </button>
            <button
              onClick={() => handleGo('cart')}
              className="p-2.5 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-left border border-slate-200 transition-colors font-semibold flex items-center justify-between"
            >
              <span>Shopping Cart</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </button>
            <button
              onClick={() => handleGo('checkout')}
              className="p-2.5 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-left border border-slate-200 transition-colors font-semibold flex items-center justify-between"
            >
              <span>Multi-Step Checkout</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </button>
            <button
              onClick={() => handleGo('account')}
              className="p-2.5 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-left border border-slate-200 transition-colors font-semibold flex items-center justify-between"
            >
              <span>Customer Account</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Categories Directory */}
        <div className="space-y-2">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 text-xs">
            <Map className="w-3.5 h-3.5 text-emerald-600" />
            <span>Electronics Categories</span>
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleGo('shop', cat.id)}
                className="p-2 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-left border border-slate-200 transition-colors font-medium flex items-center justify-between"
              >
                <span>{cat.name}</span>
                <span className="text-[10px] text-slate-400 tabular-nums">({cat.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Verified Importers */}
        <div className="space-y-2">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 text-xs">
            <Store className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified Importer Stores</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {VENDORS.map((v) => (
              <button
                key={v.id}
                onClick={() => {
                  onNavigate('shop');
                  onClose();
                }}
                className="p-2.5 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-left border border-slate-200 transition-colors text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold">{v.name}</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                    {v.city}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 line-clamp-1">{v.description}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>XML Sitemap: <a href="/sitemap.xml" target="_blank" className="text-emerald-700 font-semibold hover:underline">/sitemap.xml</a></span>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Directory
          </Button>
        </div>
      </div>
    </Modal>
  );
};
