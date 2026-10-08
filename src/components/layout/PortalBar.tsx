import React from 'react';
import { Store, ShieldCheck, ShoppingBag, Lock, LogOut, KeyRound, User } from 'lucide-react';
import { AuthSession } from '../../types';
import { ApiService } from '../../services/api';

export type PortalMode = 'storefront' | 'seller' | 'admin';

interface PortalBarProps {
  currentPortal: PortalMode;
  onSwitchPortal: (portal: PortalMode) => void;
  authSession?: AuthSession | null;
  onOpenAuthModal?: (targetPortal?: PortalMode) => void;
  onLogout?: () => void;
}

export const PortalBar: React.FC<PortalBarProps> = ({
  currentPortal,
  onSwitchPortal,
  authSession,
  onOpenAuthModal,
  onLogout
}) => {
  const isSellerAllowed = ApiService.canAccessPortal('seller', authSession || null);
  const isAdminAllowed = ApiService.canAccessPortal('admin', authSession || null);

  return (
    <div className="bg-slate-950 text-slate-300 text-xs py-1.5 px-4 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Current Active Environment Label & Auth Identity */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium hidden sm:inline">
              ZestMart PK Multi-Tenant:
            </span>
            <span className="font-bold text-white uppercase text-[11px] tracking-wide">
              {currentPortal === 'storefront' && '🛒 Customer Storefront (zestmart.pk)'}
              {currentPortal === 'seller' && '🏪 Seller Centre (seller.zestmart.pk)'}
              {currentPortal === 'admin' && '🛡️ Super Admin Portal (admin.zestmart.pk)'}
            </span>
          </div>

          {/* Active Auth Session Pill */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-800">
            {authSession ? (
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                    authSession.role === 'ADMIN'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : authSession.role === 'MANAGER' || authSession.role === 'STAFF'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : authSession.role === 'SELLER'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  {authSession.role}
                </span>
                <span className="text-slate-300 text-[11px] font-medium hidden md:inline truncate max-w-[150px]">
                  {authSession.name}
                </span>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    title="Sign Out of Portal"
                    className="ml-1 text-slate-400 hover:text-rose-400 p-1 rounded hover:bg-slate-900 transition-colors cursor-pointer flex items-center gap-1 text-[10px]"
                  >
                    <LogOut className="w-3 h-3" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={() => onOpenAuthModal?.('seller')}
                className="text-[11px] font-medium text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer bg-slate-900 hover:bg-slate-850 px-2 py-0.5 rounded border border-slate-800"
              >
                <KeyRound className="w-3 h-3 text-amber-400" />
                <span>Sign In / Switch Role</span>
              </button>
            )}
          </div>
        </div>

        {/* Right: Quick Portal Tabs with Access Status */}
        <nav aria-label="Portal switcher" className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
          <button
            onClick={() => onSwitchPortal('storefront')}
            aria-current={currentPortal === 'storefront' ? 'page' : undefined}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 ${
              currentPortal === 'storefront'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3 h-3" />
            <span>Storefront</span>
          </button>

          <button
            onClick={() => onSwitchPortal('seller')}
            aria-current={currentPortal === 'seller' ? 'page' : undefined}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-400 ${
              currentPortal === 'seller'
                ? 'bg-emerald-600 text-white'
                : !isSellerAllowed
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Store className="w-3 h-3" />
            <span>Seller Centre</span>
            {!isSellerAllowed && <Lock className="w-2.5 h-2.5 text-slate-400" />}
          </button>

          <button
            onClick={() => onSwitchPortal('admin')}
            aria-current={currentPortal === 'admin' ? 'page' : undefined}
            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 ${
              currentPortal === 'admin'
                ? 'bg-amber-600 text-white'
                : !isAdminAllowed
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            <span>Admin (RBAC)</span>
            {!isAdminAllowed && <Lock className="w-2.5 h-2.5 text-slate-400" />}
          </button>
        </nav>
      </div>
    </div>
  );
};

