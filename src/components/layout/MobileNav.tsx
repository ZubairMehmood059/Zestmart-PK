import React from 'react';
import { Home, Compass, Heart, ShoppingBag, User } from 'lucide-react';

interface MobileNavProps {
  activeTab: 'home' | 'categories' | 'wishlist' | 'cart' | 'account';
  onSelectTab: (tab: 'home' | 'categories' | 'wishlist' | 'cart' | 'account') => void;
  cartCount: number;
  wishlistCount: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  onSelectTab,
  cartCount,
  wishlistCount
}) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-3 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-around">
        {/* Home */}
        <button
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'home' ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className="w-4.5 h-4.5" />
          <span className="text-[10px] font-semibold tracking-tight">Home</span>
        </button>

        {/* Categories */}
        <button
          onClick={() => onSelectTab('categories')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'categories' ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Compass className="w-4.5 h-4.5" />
          <span className="text-[10px] font-semibold tracking-tight">Browse</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => onSelectTab('cart')}
          className={`relative flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'cart' ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-4.5 h-4.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-emerald-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold tracking-tight">Cart</span>
        </button>

        {/* Wishlist */}
        <button
          onClick={() => onSelectTab('wishlist')}
          className={`relative flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'wishlist' ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Heart className="w-4.5 h-4.5" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-rose-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold tracking-tight">Saved</span>
        </button>

        {/* Account */}
        <button
          onClick={() => onSelectTab('account')}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
            activeTab === 'account' ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-4.5 h-4.5" />
          <span className="text-[10px] font-semibold tracking-tight">Account</span>
        </button>
      </div>
    </div>
  );
};
