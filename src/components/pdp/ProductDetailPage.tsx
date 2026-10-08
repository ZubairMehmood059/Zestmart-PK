import React, { useState, useEffect } from 'react';
import { Product, Review } from '../../types';
import { Rating } from '../ui/Rating';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { ProductCard } from '../storefront/ProductCard';
import { PAKISTAN_CITIES } from '../../config/constants';
import {
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Store,
  MapPin,
  Check,
  Star,
  ThumbsUp,
  MessageSquare,
  ArrowLeft,
  Share2
} from 'lucide-react';
import { ApiService } from '../../services/api';

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  onAddToCart: (product: Product, quantity: number, color?: string, size?: string) => void;
  onBuyNow: (product: Product, quantity: number, color?: string, size?: string) => void;
  isWishlisted: boolean;
  wishlist?: string[];
  onToggleWishlist: (productId: string) => void;
  selectedCity: string;
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onSelectCategory?: (category: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  allProducts,
  onAddToCart,
  onBuyNow,
  isWishlisted,
  wishlist = [],
  onToggleWishlist,
  selectedCity,
  onBack,
  onSelectProduct,
  onSelectCategory
}) => {
  const [selectedImage, setSelectedImage] = useState<string>(
    product.images[0] || product.thumbnail
  );
  const [imageError, setImageError] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors?.[0] || ''
  );
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes?.[0] || ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'reviews' | 'shipping'>('details');

  // Review submission state
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewName, setReviewName] = useState('Muhammad Usman');
  const [reviewCity, setReviewCity] = useState(selectedCity);
  const [reviewsList, setReviewsList] = useState<Review[]>(product.reviews || []);

  // Synchronize and reset all product-dependent local state when product changes
  useEffect(() => {
    setSelectedImage(product.images[0] || product.thumbnail);
    setImageError(false);
    setSelectedColor(product.colors?.[0] || '');
    setSelectedSize(product.sizes?.[0] || '');
    setQuantity(1);
    setIsAdded(false);
    setCopiedLink(false);
    setReviewFormOpen(false);
    setReviewTitle('');
    setReviewComment('');
    const fresh = ApiService.getProductById(product.id) || product;
    setReviewsList(fresh.reviews || []);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id]);

  const cityInfo =
    PAKISTAN_CITIES.find((c) => c.name.toLowerCase() === selectedCity.toLowerCase()) ||
    PAKISTAN_CITIES[0];

  const handleAdd = () => {
    onAddToCart(product, quantity, selectedColor, selectedSize);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewComment.trim()) return;

    const newRev = ApiService.addReview(product.id, {
      productId: product.id,
      userName: reviewName,
      userCity: reviewCity,
      rating: reviewRating,
      title: reviewTitle,
      comment: reviewComment,
      verifiedPurchase: true
    });

    setReviewsList([newRev, ...reviewsList]);
    setReviewTitle('');
    setReviewComment('');
    setReviewFormOpen(false);
  };

  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const formattedPrice = `Rs. ${product.pricePKR.toLocaleString('en-PK')}`;
  const formattedOriginalPrice = product.originalPricePKR
    ? `Rs. ${product.originalPricePKR.toLocaleString('en-PK')}`
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Breadcrumb Header */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button
            onClick={onBack}
            className="hover:text-emerald-700 flex items-center gap-1 cursor-pointer font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Store</span>
          </button>
          <span>/</span>
          {onSelectCategory ? (
            <button
              onClick={() => onSelectCategory(product.category)}
              className="capitalize hover:text-emerald-700 cursor-pointer font-medium transition-colors"
            >
              {product.category.replace('-', ' ')}
            </button>
          ) : (
            <span className="capitalize">{product.category.replace('-', ' ')}</span>
          )}
          <span>/</span>
          <span className="text-slate-900 font-semibold truncate max-w-sm">
            {product.title}
          </span>
        </div>

        <button
          onClick={() => {
            const shareUrl = `${window.location.origin}${window.location.pathname}#product=${product.id}`;
            navigator.clipboard?.writeText(shareUrl);
            setCopiedLink(true);
            setTimeout(() => setCopiedLink(false), 2000);
          }}
          className={`text-xs flex items-center gap-1 cursor-pointer transition-colors ${
            copiedLink ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copiedLink ? 'Link Copied!' : 'Share Product'}</span>
        </button>
      </div>

      {/* Main 2-Column Contiguous Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Gallery & Seller Card (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Visual Display */}
          <div className="relative aspect-4/3 sm:aspect-16/10 w-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs flex items-center justify-center">
            {!imageError && selectedImage ? (
              <img
                src={selectedImage}
                alt={`${product.brand} ${product.title} - Official PTA & Warranty Pakistan`}
                onError={() => setImageError(true)}
                referrerPolicy="no-referrer"
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-slate-100 text-slate-500 text-center">
                <ShoppingBag className="w-12 h-12 stroke-1 text-slate-300 mb-2" />
                <span className="text-xs font-medium text-slate-600 max-w-xs">{product.title}</span>
                <span className="text-[11px] text-slate-500 mt-1">{product.brand}</span>
              </div>
            )}
            {product.discountPercent && (
              <div className="absolute top-4 left-4">
                <Badge variant="rose" size="md">
                  SAVE {product.discountPercent}%
                </Badge>
              </div>
            )}
            {product.isOfficial && (
              <div className="absolute top-4 right-4">
                <Badge variant="emerald" size="md">
                  Official Merchant
                </Badge>
              </div>
            )}
          </div>

          {/* Thumbnail Gallery Row */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1" aria-label="Product image gallery">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  aria-label={`View photo ${i + 1} of ${product.title}`}
                  onClick={() => {
                    setSelectedImage(img);
                    setImageError(false);
                  }}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                    selectedImage === img
                      ? 'border-emerald-600 ring-2 ring-emerald-600/20'
                      : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.title} gallery thumbnail ${i + 1}`}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Seller Verified Box */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center justify-center font-bold">
                  <Store className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">
                      {product.vendor.name}
                    </h3>
                    <Badge variant="emerald" size="sm">
                      {product.vendor.badge || 'Verified Merchant'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{product.vendor.city}, {product.vendor.province}</span>
                    <span aria-hidden="true">·</span>
                    <span>Member since {product.vendor.joinedYear}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-amber-500 font-bold text-sm">★ {product.vendor.rating}</span>
                <p className="text-[11px] text-slate-500">({product.vendor.ratingCount} ratings)</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {product.vendor.description || 'Verified Pakistani seller authorized on ZestMart PK.'}
            </p>

            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-center">
                <span className="text-slate-500 block text-[10px]">Response Rate</span>
                <span className="font-bold text-slate-900">{product.vendor.responseRate}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-center">
                <span className="text-slate-500 block text-[10px]">On-Time Dispatch</span>
                <span className="font-bold text-emerald-700">{product.vendor.deliveryPerformance}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-center">
                <span className="text-slate-500 block text-[10px]">NTN / FBR</span>
                <span className="font-bold text-slate-700 font-mono text-[11px]">
                  {product.vendor.ntnNumber || 'Verified'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module (5 Cols) */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-5">
            {/* Category & Stock */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold uppercase tracking-wider">
                {product.category} {product.subcategory ? `· ${product.subcategory}` : ''}
              </span>
              <span className="text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                In Stock ({product.stockQuantity} ready in PK)
              </span>
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              {product.title}
            </h1>

            {/* Rating Bar */}
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <Rating score={product.rating} reviewCount={product.reviewCount} size="sm" />
              <span className="text-slate-300">·</span>
              <button
                onClick={() => setActiveTab('reviews')}
                className="text-xs text-emerald-700 font-semibold hover:underline"
              >
                Read {reviewsList.length} Customer Reviews
              </button>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-baseline justify-between">
              <div>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
                    {formattedPrice}
                  </span>
                  {formattedOriginalPrice && (
                    <span className="text-sm text-slate-400 line-through tabular-nums">
                      {formattedOriginalPrice}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Inclusive of all federal sales taxes &amp; duties
                </p>
              </div>

              {product.discountPercent && (
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded border border-rose-200">
                  Save {product.discountPercent}%
                </span>
              )}
            </div>

            {/* Color variants */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800">
                  Select Color: <span className="font-normal text-slate-600">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-colors cursor-pointer ${
                        selectedColor === c
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600'
                          : 'border-slate-300 text-slate-700 bg-white hover:border-slate-400'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size variants */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800">
                  Select Size: <span className="font-normal text-slate-600">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-colors cursor-pointer ${
                        selectedSize === s
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600'
                          : 'border-slate-300 text-slate-700 bg-white hover:border-slate-400'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery Estimation Box */}
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-slate-900 font-medium">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-emerald-700" />
                  <span>Delivery to <strong>{cityInfo.name}</strong>:</span>
                </div>
                <span className="font-bold text-emerald-900">{cityInfo.deliveryDays}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 text-[11px] pt-1.5 border-t border-emerald-200/60">
                <span>Shipping: Rs. {cityInfo.shippingFee} (Free over Rs. 2,999)</span>
                <span className="text-emerald-800 font-bold">✓ Cash on Delivery Available</span>
              </div>
            </div>

            {/* Quantity Stepper & Add to Cart */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-sm font-bold text-slate-900 tabular-nums min-w-[2.5rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))}
                    className="px-3 py-2 text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    +
                  </button>
                </div>

                <Button
                  variant="primary"
                  size="md"
                  onClick={handleAdd}
                  className="flex-1 py-2.5"
                  leftIcon={isAdded ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                >
                  {isAdded ? 'Added to Cart' : `Add to Cart (${quantity})`}
                </Button>

                <button
                  onClick={() => onToggleWishlist(product.id)}
                  aria-label="Save to wishlist"
                  className={`p-2.5 rounded-lg border transition-colors cursor-pointer ${
                    isWishlisted
                      ? 'bg-rose-50 text-rose-600 border-rose-200'
                      : 'bg-white text-slate-500 border-slate-300 hover:text-rose-600'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-600' : ''}`} />
                </button>
              </div>

              {/* Direct Buy Now Button */}
              <Button
                variant="secondary"
                size="md"
                className="w-full"
                onClick={() => onBuyNow(product, quantity, selectedColor, selectedSize)}
              >
                Instant Buy with Cash on Delivery &rarr;
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Specifications, Description, Reviews */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-slate-200 overflow-x-auto bg-slate-50/70">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-6 py-3.5 text-xs font-bold transition-colors border-b-2 -mb-px whitespace-nowrap cursor-pointer ${
              activeTab === 'details'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Product Overview
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`px-6 py-3.5 text-xs font-bold transition-colors border-b-2 -mb-px whitespace-nowrap cursor-pointer ${
              activeTab === 'specs'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Full Specifications
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-3.5 text-xs font-bold transition-colors border-b-2 -mb-px whitespace-nowrap cursor-pointer ${
              activeTab === 'reviews'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Customer Reviews ({reviewsList.length})
          </button>
          <button
            onClick={() => setActiveTab('shipping')}
            className={`px-6 py-3.5 text-xs font-bold transition-colors border-b-2 -mb-px whitespace-nowrap cursor-pointer ${
              activeTab === 'shipping'
                ? 'border-emerald-600 text-emerald-800 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Shipping &amp; Return Terms
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8">
          {activeTab === 'details' && (
            <div className="space-y-4 max-w-3xl">
              <h3 className="text-base font-bold text-slate-900">
                Detailed Product Overview
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    100% Genuine Guarantee
                  </h4>
                  <p className="text-xs text-slate-500">
                    Source verified directly with official brand importers and licensed makers in Pakistan.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <RotateCcw className="w-4 h-4 text-emerald-600" />
                    7-Day Doorstep Replacement
                  </h4>
                  <p className="text-xs text-slate-500">
                    If defective or different from description, courier will pick up from your doorstep.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="max-w-2xl space-y-3">
              <h3 className="text-base font-bold text-slate-900 mb-4">
                Technical Specifications &amp; Origin
              </h3>
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key} className="flex justify-between p-3">
                    <span className="text-slate-500 font-medium">{key}</span>
                    <span className="font-semibold text-slate-900 text-right">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {/* Review Header & Rating Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pb-8 border-b border-slate-200">
                <div className="md:col-span-4 text-center md:text-left space-y-2">
                  <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 tabular-nums">
                    {product.rating}
                  </span>
                  <div className="flex items-center justify-center md:justify-start">
                    <Rating score={product.rating} showCount={false} size="md" />
                  </div>
                  <p className="text-xs text-slate-500">
                    Based on {product.reviewCount} verified Pakistani ratings
                  </p>
                </div>

                <div className="md:col-span-5 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="w-12 text-right">5 Star</span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="w-[85%] h-full bg-amber-400 rounded-full" />
                    </div>
                    <span className="w-8 text-right font-medium">85%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-12 text-right">4 Star</span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="w-[12%] h-full bg-amber-400 rounded-full" />
                    </div>
                    <span className="w-8 text-right font-medium">12%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-12 text-right">3 Star</span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="w-[3%] h-full bg-amber-400 rounded-full" />
                    </div>
                    <span className="w-8 text-right font-medium">3%</span>
                  </div>
                </div>

                <div className="md:col-span-3 text-center md:text-right">
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => setReviewFormOpen(!reviewFormOpen)}
                    leftIcon={<MessageSquare className="w-4 h-4" />}
                  >
                    Write a Review
                  </Button>
                </div>
              </div>

              {/* Review Submission Form */}
              {reviewFormOpen && (
                <form
                  onSubmit={handleReviewSubmit}
                  className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4 max-w-xl animate-in fade-in duration-200"
                >
                  <h4 className="text-sm font-bold text-slate-900">
                    Share Your Honest Feedback
                  </h4>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Rating</label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setReviewRating(star)}
                          className="p-1 cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= reviewRating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Your Name"
                      required
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                    />
                    <Input
                      label="City"
                      required
                      value={reviewCity}
                      onChange={(e) => setReviewCity(e.target.value)}
                    />
                  </div>

                  <Input
                    label="Review Headline"
                    required
                    placeholder="e.g. Excellent build quality and fast courier"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                  />

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Review</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Share your experience with product, durability, packaging..."
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-600 bg-white"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" variant="primary" size="sm">
                      Submit Verified Review
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setReviewFormOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-4 divide-y divide-slate-100">
                {reviewsList.map((rev) => (
                  <div key={rev.id} className="pt-4 first:pt-0 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{rev.userName}</span>
                        <span className="text-[11px] text-slate-400">({rev.userCity})</span>
                        {rev.verifiedPurchase && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Buyer
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">{rev.date}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Rating score={rev.rating} showCount={false} size="sm" />
                      <h5 className="text-xs font-bold text-slate-800">{rev.title}</h5>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>

                    <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400">
                      <button className="flex items-center gap-1 hover:text-slate-700 cursor-pointer">
                        <ThumbsUp className="w-3 h-3" />
                        <span>Helpful ({rev.helpfulCount})</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-4 max-w-2xl text-xs text-slate-600 leading-relaxed">
              <h3 className="text-base font-bold text-slate-900">
                Nationwide Courier Dispatch &amp; Return Policies
              </h3>
              <p>
                All orders are dispatched from verified seller hubs using TCS Express, Leopards, or Trax Logistics. Consignments are packed with tamper-proof courier flyers.
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Major Metros (Karachi, Lahore, Islamabad, Rawalpindi): 24 to 48 Hours.</li>
                <li>Punjab &amp; Sindh secondary cities: 2 to 3 Business Days.</li>
                <li>KPK, Balochistan &amp; Northern Areas: 3 to 5 Business Days.</li>
                <li>Cash on Delivery orders require active phone confirmation before dispatch.</li>
                <li>Free nationwide shipping applies to all orders valued at Rs. 2,999 and above.</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="space-y-4 pt-6 border-t border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">
            Similar Products in {product.category}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedProducts.map((rel) => (
              <ProductCard
                key={rel.id}
                product={rel}
                onAddToCart={(p) => onAddToCart(p, 1)}
                onOpenQuickView={onSelectProduct}
                isWishlisted={wishlist.includes(rel.id)}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
