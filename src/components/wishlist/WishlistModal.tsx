import React from 'react';
import { Modal } from '../ui/Modal';
import { Product } from '../../types';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistedProducts: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlistedProducts,
  onRemoveFromWishlist,
  onAddToCart
}) => {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title={`Saved Wishlist (${wishlistedProducts.length})`}
      subtitle="Items you are considering for your next order"
    >
      <div className="space-y-4">
        {wishlistedProducts.length > 0 ? (
          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto pr-1">
            {wishlistedProducts.map((p) => (
              <div key={p.id} className="py-3 flex items-center gap-3">
                <img
                  src={p.thumbnail}
                  alt={p.title}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-lg object-cover bg-slate-50 border border-slate-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-slate-900 truncate">
                    {p.title}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Seller: {p.vendor.name} ({p.vendor.city})
                  </p>
                  <p className="text-xs font-bold text-slate-900 mt-1 tabular-nums">
                    Rs. {p.pricePKR.toLocaleString('en-PK')}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onAddToCart(p);
                      onRemoveFromWishlist(p.id);
                    }}
                    className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
                    title="Move to Cart"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onRemoveFromWishlist(p.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center space-y-2">
            <Heart className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">
              No saved items yet
            </h4>
            <p className="text-xs text-slate-500">
              Click the heart icon on any product to save it here.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};
