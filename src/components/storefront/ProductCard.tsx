import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, Check, Star, ShieldCheck } from 'lucide-react';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onOpenQuickView: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onOpenQuickView,
  isWishlisted,
  onToggleWishlist
}) => {
  const [isAddedRecently, setIsAddedRecently] = useState(false);
  const [imageError, setImageError] = useState(false);

  React.useEffect(() => {
    setImageError(false);
  }, [product.id, product.thumbnail]);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1400);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist(product.id);
  };

  // Format Pakistani Rupee currency
  const formattedPrice = `Rs. ${product.pricePKR.toLocaleString('en-PK')}`;
  const formattedOriginalPrice = product.originalPricePKR
    ? `Rs. ${product.originalPricePKR.toLocaleString('en-PK')}`
    : null;

  const cardImageSrc = product.thumbnail || product.images?.[0];

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpenQuickView(product)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onOpenQuickView(product);
      }}
      className="group relative bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      {/* Top Image Container with Soft Neutral Background */}
      <div className="relative aspect-square w-full bg-[#f8fafc] overflow-hidden flex items-center justify-center p-4">
        {!imageError && cardImageSrc ? (
          <img
            src={cardImageSrc}
            alt={product.title}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            loading="lazy"
            decoding="async"
            width={300}
            height={300}
            className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-slate-500 text-center">
            <ShoppingBag className="w-8 h-8 stroke-1 text-slate-300 mb-1" />
            <span className="text-xs font-medium text-slate-600 line-clamp-1">{product.title}</span>
          </div>
        )}

        {/* Top Badges (Discount Tag Top-Left) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start z-10 pointer-events-none">
          {product.discountPercent && product.discountPercent > 0 ? (
            <span className="bg-rose-600 text-white font-bold text-xs px-2 py-0.5 rounded shadow-2xs tracking-tight">
              -{product.discountPercent}%
            </span>
          ) : null}
          {product.isOfficial ? (
            <span className="bg-emerald-700 text-white font-semibold text-xs px-2 py-0.5 rounded uppercase tracking-wider shadow-2xs">
              Official
            </span>
          ) : null}
        </div>

        {/* Wishlist Button Top-Right */}
        <button
          onClick={handleWishlist}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 cursor-pointer z-10 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 border border-rose-200'
              : 'bg-white/95 text-slate-400 hover:text-rose-600 hover:bg-white border border-slate-200/80'
          }`}
        >
          <Heart
            className={`w-3.5 h-3.5 ${
              isWishlisted ? 'fill-rose-600 text-rose-600' : ''
            }`}
          />
        </button>

        {/* Quick View Indicator on Hover */}
        <div className="absolute inset-x-4 bottom-3 hidden group-hover:flex items-center justify-center gap-1.5 bg-slate-900/90 text-white text-xs font-semibold py-1.5 px-3 rounded-lg shadow-md transition-opacity">
          <Eye className="w-3.5 h-3.5" />
          <span>Quick View</span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between space-y-2.5 sm:space-y-3">
        {/* Vendor & Title */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium flex-wrap">
            <span className="text-slate-700 font-semibold" title={product.vendor.name}>
              {product.vendor.name}
            </span>
            <span aria-hidden="true">·</span>
            <span className="shrink-0">{product.vendor.city}</span>
          </div>

          <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-emerald-700 transition-colors">
            {product.title}
          </h3>
        </div>

        {/* Rating & COD Badges */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating)
                      ? 'fill-amber-400 text-amber-400'
                      : i < product.rating
                      ? 'fill-amber-400/50 text-amber-400'
                      : 'text-slate-200 fill-slate-100'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-slate-600 tabular-nums">
              ({product.reviewCount})
            </span>
          </div>

          {product.codAvailable && (
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              COD Available
            </span>
          )}
        </div>

        {/* Price & Action Button */}
        <div className="pt-2.5 border-t border-slate-100 space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-black text-slate-900 tabular-nums">
              {formattedPrice}
            </span>
            {formattedOriginalPrice && (
              <span className="text-xs text-slate-400 line-through tabular-nums font-medium">
                {formattedOriginalPrice}
              </span>
            )}
          </div>

          {/* Full-width Add to Cart Button */}
          <button
            onClick={handleAdd}
            aria-label={`Add ${product.title} to cart`}
            className={`w-full py-2.5 px-4 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer select-none shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
              isAddedRecently
                ? 'bg-slate-900 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white hover:shadow-xs'
            }`}
          >
            {isAddedRecently ? (
              <>
                <Check className="w-4 h-4 text-emerald-300 stroke-[2.5]" />
                <span>Added to Cart</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
