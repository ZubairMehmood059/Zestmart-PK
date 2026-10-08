import React, { useState } from 'react';
import { Product } from '../../types';
import { Modal } from '../ui/Modal';
import { Rating } from '../ui/Rating';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import {
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Store,
  MapPin,
  Check
} from 'lucide-react';
import { PAKISTAN_CITIES } from '../../config/constants';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, color?: string, size?: string) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  selectedCity: string;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  selectedCity
}) => {
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [imageError, setImageError] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState(false);

  // Initialize variant states when product changes
  React.useEffect(() => {
    if (product) {
      setSelectedImage(product.images[0] || product.thumbnail);
      setImageError(false);
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      }
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
      setQuantity(1);
      setIsAdded(false);
    }
  }, [product]);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity, selectedColor, selectedSize);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  const cityInfo =
    PAKISTAN_CITIES.find((c) => c.name.toLowerCase() === selectedCity.toLowerCase()) ||
    PAKISTAN_CITIES[0];

  const formattedPrice = `Rs. ${product.pricePKR.toLocaleString('en-PK')}`;
  const formattedOriginalPrice = product.originalPricePKR
    ? `Rs. ${product.originalPricePKR.toLocaleString('en-PK')}`
    : null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="4xl">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Gallery (5 cols) */}
        <div className="md:col-span-6 space-y-4">
          {/* Main Large Display Image */}
          <div className="aspect-square w-full bg-slate-50 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center relative">
            {!imageError && (selectedImage || product.thumbnail) ? (
              <img
                src={selectedImage || product.thumbnail}
                alt={`${product.brand} ${product.title} - Official Warranty Pakistan`}
                onError={() => setImageError(true)}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-slate-100 text-slate-400 text-center">
                <ShoppingBag className="w-12 h-12 stroke-1 text-slate-300 mb-2" />
                <span className="text-xs font-medium text-slate-600 line-clamp-2 max-w-xs">{product.title}</span>
                <span className="text-[11px] text-slate-400 mt-1">{product.brand}</span>
              </div>
            )}
            {product.discountPercent && product.discountPercent > 0 && (
              <div className="absolute top-3 left-3">
                <Badge variant="rose" size="md">
                  -{product.discountPercent}% OFF
                </Badge>
              </div>
            )}
          </div>

          {/* Thumbnails row */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedImage(img);
                    setImageError(false);
                  }}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedImage === img
                      ? 'border-emerald-600 ring-2 ring-emerald-600/20'
                      : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.title} preview ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Seller Snapshot Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    {product.vendor.name}
                  </h4>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <MapPin className="w-3 h-3 text-emerald-600" />
                    <span>{product.vendor.city}, {product.vendor.province}</span>
                  </div>
                </div>
              </div>
              <Badge variant="emerald" size="sm">
                {product.vendor.badge || 'Verified Seller'}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 text-[11px] text-slate-600">
              <div>
                <span className="text-slate-400 block">Seller Rating:</span>
                <span className="font-bold text-slate-800">★ {product.vendor.rating} / 5.0</span>
              </div>
              <div>
                <span className="text-slate-400 block">On-Time Dispatch:</span>
                <span className="font-bold text-emerald-700">{product.vendor.deliveryPerformance}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module (6 cols) */}
        <div className="md:col-span-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Category and Stock Indicator */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {product.category}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                In Stock ({product.stockQuantity} units in Pakistan)
              </span>
            </div>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              {product.title}
            </h2>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <Rating score={product.rating} reviewCount={product.reviewCount} size="sm" />
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-500 font-medium">
                SKU: ZPK-{product.id.toUpperCase()}
              </span>
            </div>

            {/* Price Block */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-baseline justify-between">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                  {formattedPrice}
                </span>
                {formattedOriginalPrice && (
                  <span className="text-sm text-slate-400 line-through tabular-nums">
                    {formattedOriginalPrice}
                  </span>
                )}
              </div>
              {product.discountPercent && (
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded border border-rose-200">
                  Save {product.discountPercent}%
                </span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Variants: Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-800">
                  Color Option: <span className="font-normal text-slate-600">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer ${
                        selectedColor === color
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold shadow-xs'
                          : 'border-slate-300 hover:border-slate-400 text-slate-700 bg-white'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Variants: Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-800">
                  Select Size: <span className="font-normal text-slate-600">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors cursor-pointer ${
                        selectedSize === size
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold shadow-xs'
                          : 'border-slate-300 hover:border-slate-400 text-slate-700 bg-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Nationwide Delivery Estimate */}
            <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/50 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-800">
                <div className="flex items-center gap-1.5 font-medium">
                  <Truck className="w-4 h-4 text-emerald-700" />
                  <span>Estimated Delivery to <strong>{cityInfo.name}</strong>:</span>
                </div>
                <span className="font-bold text-emerald-800">{cityInfo.deliveryDays}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 text-[11px] pt-1 border-t border-emerald-100/60">
                <span>Shipping Fee: Rs. {cityInfo.shippingFee} (Free over Rs. 2,999)</span>
                <span className="text-emerald-700 font-bold">✓ Cash on Delivery Available</span>
              </div>
            </div>
          </div>

          {/* Action Row: Quantity + Add to Cart + Wishlist */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-3">
              {/* Quantity Stepper */}
              <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 font-bold text-sm cursor-pointer select-none"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-3 py-2 text-sm font-bold text-slate-900 tabular-nums min-w-[2.5rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 font-bold text-sm cursor-pointer select-none"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <Button
                variant="primary"
                size="md"
                onClick={handleAdd}
                className="flex-1 py-2.5"
                leftIcon={isAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
              >
                {isAdded ? 'Added to Cart' : `Add to Cart (${quantity})`}
              </Button>

              {/* Wishlist toggle */}
              <button
                onClick={() => onToggleWishlist(product.id)}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                className={`p-2.5 rounded-lg border transition-colors cursor-pointer ${
                  isWishlisted
                    ? 'bg-rose-50 text-rose-600 border-rose-200'
                    : 'bg-white text-slate-500 border-slate-300 hover:text-rose-600 hover:border-slate-400'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-600' : ''}`} />
              </button>
            </div>

            {/* Quick Guarantees */}
            <div className="flex items-center justify-around text-[11px] text-slate-500 pt-2">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                100% Authentic
              </span>
              <span className="flex items-center gap-1">
                <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
                7-Day Replacement
              </span>
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                Tracked TCS Delivery
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications & Detailed Tab below */}
      <div className="mt-8 pt-6 border-t border-slate-200">
        <h3 className="text-sm font-bold text-slate-900 mb-3">
          Product Specifications
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-xs">
          {Object.entries(product.specifications).map(([key, val]) => (
            <div
              key={key}
              className="flex justify-between py-1.5 border-b border-slate-100"
            >
              <span className="text-slate-500">{key}</span>
              <span className="font-semibold text-slate-800 text-right">{val}</span>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
