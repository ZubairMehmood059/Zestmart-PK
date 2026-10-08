import React from 'react';
import { Search, ShoppingBag, Heart, User, X, SlidersHorizontal, ChevronDown, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../../config/constants';
import { AppView, AuthSession } from '../../types';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAccount: () => void;
  onNavigate: (view: AppView) => void;
  activeView: AppView;
  onOpenFilterDrawer?: () => void;
  authSession?: AuthSession | null;
  onLogout?: () => void;
  onOpenAuthModal?: (target?: 'storefront' | 'seller' | 'admin') => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenAccount,
  onNavigate,
  activeView,
  onOpenFilterDrawer,
  authSession,
  onLogout,
  onOpenAuthModal
}) => {
  return (
    <header className="sticky top-0 z-40 border-b transition-all" style={{ backgroundColor: '#060b13', borderColor: 'rgba(255,255,255,0.07)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4 sm:gap-6">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-8 shrink-0">
            <button
              onClick={() => onNavigate('home')}
              className="group flex flex-col items-start focus:outline-none cursor-pointer text-left"
              aria-label="ZestMart PK Home"
            >
              <div className="flex items-center gap-2">
                <div className="w-8.5 h-8.5 rounded-xl flex items-center justify-center text-white font-black text-sm group-hover:scale-105 transition-transform" style={{ backgroundColor: '#00b660' }}>
                  <span>Z</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black tracking-tight text-white group-hover:opacity-80 transition-opacity">
                    Zest<span style={{ color: '#00b660' }}>Mart</span>
                  </span>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider" style={{ color: '#00b660', backgroundColor: 'rgba(0,182,96,0.1)', border: '1px solid rgba(0,182,96,0.25)' }}>
                    PK
                  </span>
                </div>
              </div>
              <span className="text-xs font-medium tracking-tight -mt-0.5 ml-10.5 hidden sm:block" style={{ color: '#8b98a5' }}>
                Certified Electronics · Nationwide COD
              </span>
            </button>

            {/* Quick Desktop Nav Links */}
            <nav aria-label="Main Navigation" className="hidden xl:flex items-center gap-6 text-sm font-semibold" style={{ color: '#8b98a5' }}>
              <button
                onClick={() => onNavigate('home')}
                className={`relative py-2 transition-colors cursor-pointer focus-visible:outline-none rounded ${
                  activeView === 'home'
                    ? 'font-bold'
                    : 'hover:text-white'
                }`}
                style={activeView === 'home' ? { color: '#00b660' } : undefined}
              >
                Home
                {activeView === 'home' && <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ backgroundColor: '#00b660' }} />}
              </button>
              <button
                onClick={() => onNavigate('shop')}
                className={`relative py-2 transition-colors cursor-pointer focus-visible:outline-none rounded ${
                  activeView === 'shop' && selectedCategory === 'all'
                    ? 'font-bold'
                    : 'hover:text-white'
                }`}
                style={activeView === 'shop' && selectedCategory === 'all' ? { color: '#00b660' } : undefined}
              >
                Catalog
                {activeView === 'shop' && selectedCategory === 'all' && <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ backgroundColor: '#00b660' }} />}
              </button>
              <button
                onClick={() => {
                  onSelectCategory('smartphones');
                  onNavigate('shop');
                }}
                className={`relative py-2 transition-colors cursor-pointer focus-visible:outline-none rounded ${
                  activeView === 'shop' && selectedCategory === 'smartphones'
                    ? 'font-bold'
                    : 'hover:text-white'
                }`}
                style={activeView === 'shop' && selectedCategory === 'smartphones' ? { color: '#00b660' } : undefined}
              >
                Smartphones
                {activeView === 'shop' && selectedCategory === 'smartphones' && <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ backgroundColor: '#00b660' }} />}
              </button>
              <button
                onClick={() => {
                  onSelectCategory('laptops');
                  onNavigate('shop');
                }}
                className={`relative py-2 transition-colors cursor-pointer focus-visible:outline-none rounded ${
                  activeView === 'shop' && selectedCategory === 'laptops'
                    ? 'font-bold'
                    : 'hover:text-white'
                }`}
                style={activeView === 'shop' && selectedCategory === 'laptops' ? { color: '#00b660' } : undefined}
              >
                Laptops
                {activeView === 'shop' && selectedCategory === 'laptops' && <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ backgroundColor: '#00b660' }} />}
              </button>
              <button
                onClick={() => {
                  onSelectCategory('audio');
                  onNavigate('shop');
                }}
                className={`relative py-2 transition-colors cursor-pointer focus-visible:outline-none rounded ${
                  activeView === 'shop' && selectedCategory === 'audio'
                    ? 'font-bold'
                    : 'hover:text-white'
                }`}
                style={activeView === 'shop' && selectedCategory === 'audio' ? { color: '#00b660' } : undefined}
              >
                Audio &amp; ANC
                {activeView === 'shop' && selectedCategory === 'audio' && <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ backgroundColor: '#00b660' }} />}
              </button>
            </nav>
          </div>

          {/* Zone 2: Aesthetic Search Bar with Integrated Category Selector */}
          <div className="flex-1 max-w-lg hidden md:flex items-center">
            <div className="relative w-full flex items-center rounded-xl transition-all overflow-hidden p-1" style={{ backgroundColor: '#0a121e', border: '1px solid rgba(255,255,255,0.1)' }}>
              {/* Category dropdown inside search */}
              <div className="relative flex items-center shrink-0 pr-1" style={{ borderRight: '1px solid rgba(255,255,255,0.08)' }}>
                <select
                  value={selectedCategory}
                  aria-label="Filter search category"
                  onChange={(e) => {
                    onSelectCategory(e.target.value);
                    if (activeView !== 'shop') onNavigate('shop');
                  }}
                  className="h-8.5 pl-2.5 pr-6 text-xs font-semibold bg-transparent focus:outline-none cursor-pointer transition-colors appearance-none"
                  style={{ color: '#8b98a5' }}
                >
                  <option value="all">All Categories</option>
                  {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-1.5 pointer-events-none" style={{ color: '#8b98a5' }} />
              </div>

              {/* Main input */}
              <div className="relative flex-1 flex items-center">
                <input
                  type="text"
                  name="q"
                  aria-label="Search products, brands, model, SKU"
                  value={searchQuery}
                  onChange={(e) => {
                    onSearchChange(e.target.value);
                    if (activeView !== 'shop' && e.target.value.length > 1) {
                      onNavigate('shop');
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && activeView !== 'shop') {
                      onNavigate('shop');
                    }
                  }}
                  placeholder="Search flagships, GPUs, specs, model..."
                  className="w-full h-8.5 pl-3 pr-8 text-xs bg-transparent focus:outline-none font-medium"
                  style={{ color: '#ffffff', }}
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-2 p-1 cursor-pointer"
                    title="Clear search"
                    aria-label="Clear search"
                    style={{ color: '#8b98a5' }}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Search Submit Button */}
              <button
                onClick={() => onNavigate('shop')}
                aria-label="Submit Search"
                className="w-8.5 h-8.5 rounded-lg text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 focus-visible:outline-none"
                style={{ backgroundColor: '#00b660' }}
              >
                <Search className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Zone 3: User Actions Cluster */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Mobile Filter Toggle */}
            {onOpenFilterDrawer && (
              <button
                onClick={onOpenFilterDrawer}
                aria-label="Open Filters"
                className="md:hidden p-2 rounded-lg transition-colors cursor-pointer focus-visible:outline-none"
                style={{ color: '#8b98a5' }}
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            )}

            {/* Account Action */}
            <button
              onClick={onOpenAccount}
              aria-label={authSession ? `${authSession.name}'s Account` : 'Sign In or View Account'}
              title={authSession ? `${authSession.name} (${authSession.role})` : 'Sign In'}
              className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all cursor-pointer focus-visible:outline-none"
              style={
                activeView === 'account'
                  ? { backgroundColor: 'rgba(0,182,96,0.1)', color: '#00b660', boxShadow: 'inset 0 0 0 1px rgba(0,182,96,0.25)' }
                  : { color: '#8b98a5' }
              }
            >
              {authSession ? (
                <div className="w-5 h-5 rounded-full text-white flex items-center justify-center text-[10px] font-bold uppercase" style={{ backgroundColor: '#00b660' }}>
                  {authSession.name ? authSession.name.charAt(0).toUpperCase() : 'U'}
                </div>
              ) : (
                <User className="w-4.5 h-4.5" />
              )}
              <span className="text-xs font-semibold hidden md:inline truncate max-w-[110px]">
                {authSession ? authSession.name.split(' ')[0] : 'Sign In'}
              </span>
            </button>

            {/* Wishlist Action */}
            <button
              onClick={onOpenWishlist}
              aria-label="Saved Wishlist"
              title="Saved Wishlist"
              className="relative flex items-center gap-2 px-2.5 py-2 rounded-lg transition-all cursor-pointer focus-visible:outline-none"
              style={{ color: '#8b98a5' }}
            >
              <div className="relative">
                <Heart className="w-4.5 h-4.5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center tabular-nums" style={{ backgroundColor: '#00b660' }}>
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-semibold hidden lg:inline">Wishlist</span>
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              aria-label="Shopping Cart"
              className="relative flex items-center gap-2 px-3.5 py-2 text-white rounded-lg font-bold text-xs transition-all cursor-pointer group focus-visible:outline-none"
              style={{ backgroundColor: '#00b660' }}
            >
              <div className="relative">
                <ShoppingBag className="w-4.5 h-4.5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 text-[10px] font-black min-w-4 h-4 px-1 rounded-full flex items-center justify-center tabular-nums" style={{ backgroundColor: '#ffffff', color: '#060b13' }}>
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Cart</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="pb-3 md:hidden">
          <div className="relative flex items-center rounded-lg px-3.5 py-1.5 min-h-[44px]" style={{ backgroundColor: '#0a121e', border: '1px solid rgba(255,255,255,0.08)' }}>
            <input
              type="text"
              name="mobile-q"
              aria-label="Search electronics products in Pakistan"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onNavigate('shop');
              }}
              placeholder="Search products, brands, model..."
              className="w-full text-xs py-1 pr-8 bg-transparent focus:outline-none font-medium"
              style={{ color: '#ffffff' }}
            />
            {searchQuery ? (
              <button
                onClick={() => onSearchChange('')}
                aria-label="Clear search"
                className="absolute right-3 p-1"
                style={{ color: '#8b98a5' }}
              >
              <X className="w-4 h-4" />
              </button>
            ) : (
              <Search className="absolute right-3.5 w-4 h-4 pointer-events-none" style={{ color: '#8b98a5' }} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
