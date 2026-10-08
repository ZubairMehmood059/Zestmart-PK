import React, { useState, useMemo, useEffect } from 'react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { CATEGORIES, POPULAR_BRANDS, CONDITIONS } from '../../config/constants';
import { VENDORS } from '../../config/data';
import { matchProductSearch } from '../../services/search';
import {
  SlidersHorizontal,
  X,
  Search,
  LayoutGrid,
  List,
  RotateCcw,
  CheckCircle2,
  Banknote,
  ShieldCheck,
  Star,
  Smartphone,
  Cpu
} from 'lucide-react';
import { Button } from '../ui/Button';

interface ShopDiscoveryProps {
  products: Product[];
  category?: string;
  initialCategory?: string;
  searchQuery?: string;
  initialSearch?: string;
  onCategoryChange?: (category: string) => void;
  onSearchChange?: (query: string) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
  onBackToHome: () => void;
}

export const ShopDiscovery: React.FC<ShopDiscoveryProps> = ({
  products,
  category: categoryProp,
  initialCategory = 'all',
  searchQuery: searchQueryProp,
  initialSearch = '',
  onCategoryChange,
  onSearchChange,
  onSelectProduct,
  onAddToCart,
  wishlist,
  onToggleWishlist,
  onBackToHome
}) => {
  // Filter States
  const [category, setCategory] = useState<string>(categoryProp ?? initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(searchQueryProp ?? initialSearch);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [onlyCOD, setOnlyCOD] = useState<boolean>(false);
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [onlyPTA, setOnlyPTA] = useState<boolean>(false);
  const [onlyOfficial, setOnlyOfficial] = useState<boolean>(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedVendorId, setSelectedVendorId] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'relevance' | 'price_low' | 'price_high' | 'rating' | 'newest' | 'discount'>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Synchronize when incoming category prop updates
  useEffect(() => {
    if (categoryProp !== undefined) {
      setCategory(categoryProp);
    } else if (initialCategory !== undefined) {
      setCategory(initialCategory);
    }
  }, [categoryProp, initialCategory]);

  // Synchronize when incoming search prop updates
  useEffect(() => {
    if (searchQueryProp !== undefined) {
      setSearchQuery(searchQueryProp);
    } else if (initialSearch !== undefined) {
      setSearchQuery(initialSearch);
    }
  }, [searchQueryProp, initialSearch]);

  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    onCategoryChange?.(newCat);
  };

  const handleSearchChange = (newQ: string) => {
    setSearchQuery(newQ);
    onSearchChange?.(newQ);
  };

  // Filter application
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (selectedBrand !== 'all' && p.brand.toLowerCase() !== selectedBrand.toLowerCase()) return false;
      if (selectedCondition !== 'all' && p.condition !== selectedCondition) return false;
      if (onlyCOD && !p.codAvailable) return false;
      if (onlyVerified && !p.vendor?.isVerified) return false;
      if (onlyInStock && !p.inStock) return false;
      if (onlyOfficial && !p.isOfficial) return false;
      if (onlyPTA) {
        const isPtaApproved =
          p.title.toLowerCase().includes('pta') ||
          p.tags.some((t) => t.toLowerCase().includes('pta')) ||
          p.specifications['PTA Status']?.toLowerCase().includes('approved');
        if (!isPtaApproved) return false;
      }
      if (minRating > 0 && p.rating < minRating) return false;
      if (selectedVendorId !== 'all' && p.vendorId !== selectedVendorId) return false;
      if (minPrice !== '' && p.pricePKR < Number(minPrice)) return false;
      if (maxPrice !== '' && p.pricePKR > Number(maxPrice)) return false;

      // Universal search check (name, brand, category, model, SKU, vendor, specs)
      if (searchQuery.trim() && !matchProductSearch(p, searchQuery)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_low') return a.pricePKR - b.pricePKR;
      if (sortBy === 'price_high') return b.pricePKR - a.pricePKR;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'discount') return (b.discountPercent || 0) - (a.discountPercent || 0);
      if (sortBy === 'newest') return b.id.localeCompare(a.id);
      if (sortBy === 'relevance' && searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const aScore = (a.title.toLowerCase().includes(q) ? 4 : 0) + (a.brand.toLowerCase().includes(q) ? 2 : 0) + (a.isFeatured ? 1 : 0);
        const bScore = (b.title.toLowerCase().includes(q) ? 4 : 0) + (b.brand.toLowerCase().includes(q) ? 2 : 0) + (b.isFeatured ? 1 : 0);
        return bScore - aScore;
      }
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [
    products,
    category,
    selectedBrand,
    selectedCondition,
    searchQuery,
    minPrice,
    maxPrice,
    onlyCOD,
    onlyVerified,
    onlyInStock,
    onlyPTA,
    onlyOfficial,
    minRating,
    selectedVendorId,
    sortBy
  ]);

  const activeFilterCount =
    (category !== 'all' ? 1 : 0) +
    (selectedBrand !== 'all' ? 1 : 0) +
    (selectedCondition !== 'all' ? 1 : 0) +
    (searchQuery ? 1 : 0) +
    (minPrice !== '' ? 1 : 0) +
    (maxPrice !== '' ? 1 : 0) +
    (onlyCOD ? 1 : 0) +
    (onlyVerified ? 1 : 0) +
    (onlyInStock ? 1 : 0) +
    (onlyPTA ? 1 : 0) +
    (onlyOfficial ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (selectedVendorId !== 'all' ? 1 : 0);

  const resetFilters = () => {
    handleCategoryChange('all');
    handleSearchChange('');
    setSelectedBrand('all');
    setSelectedCondition('all');
    setMinPrice('');
    setMaxPrice('');
    setOnlyCOD(false);
    setOnlyVerified(false);
    setOnlyInStock(false);
    setOnlyPTA(false);
    setOnlyOfficial(false);
    setMinRating(0);
    setSelectedVendorId('all');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-1">
          <nav className="flex items-center gap-2 text-xs text-slate-500">
            <button onClick={onBackToHome} className="hover:text-emerald-700 cursor-pointer">
              Home
            </button>
            <span>/</span>
            <span className="text-slate-900 font-medium capitalize">
              {category === 'all' ? 'All Electronics' : category.replace('-', ' ')}
            </span>
            {selectedBrand !== 'all' && (
              <>
                <span>/</span>
                <span className="text-emerald-700 font-semibold">{selectedBrand}</span>
              </>
            )}
            {searchQuery && (
              <>
                <span>/</span>
                <span className="text-slate-600 truncate max-w-xs">
                  &ldquo;{searchQuery}&rdquo;
                </span>
              </>
            )}
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Certified Electronics &amp; Hardware Catalog
          </h1>
          <p className="text-xs text-slate-500">
            Showing <strong className="text-slate-900 tabular-nums">{filteredProducts.length}</strong> verified devices and PC components across Pakistan
          </p>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-3">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg shadow-xs hover:bg-slate-50 cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
            <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              aria-label="Sort products"
              onChange={(e) =>
                setSortBy(
                  e.target.value as 'featured' | 'relevance' | 'price_low' | 'price_high' | 'rating' | 'newest' | 'discount'
                )
              }
              className="bg-white border border-slate-300 text-slate-800 font-semibold px-3 py-2 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600 focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer"
            >
              <option value="featured">Featured Picks</option>
              <option value="relevance">Best Relevance</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Top Customer Rated</option>
              <option value="newest">Newest Arrivals</option>
              <option value="discount">Biggest Discounts</option>
            </select>
          </div>

          {/* View Toggle */}
          <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              aria-label="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
              aria-label="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Sidebar (3 cols) */}
        <aside className="hidden lg:block lg:col-span-3 bg-white border border-slate-200/90 rounded-xl p-5 space-y-6 shadow-2xs sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
              Filter Tech
            </span>
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 rounded"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Search Query within Shop */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">Search Specs or Model</label>
            <div className="relative">
              <input
                type="text"
                name="shop-q"
                aria-label="Search specifications or model"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="e.g. RTX 4080, M3, 144Hz..."
                className="w-full text-xs pl-8 pr-3 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Categories List */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800">Categories</label>
            <div className="space-y-1 max-h-56 overflow-y-auto no-scrollbar pr-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 ${
                    category === cat.id
                      ? 'bg-emerald-50 text-emerald-900 font-bold border border-emerald-200'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span>{cat.name}</span>
                  {'count' in cat && (
                    <span className="text-xs text-slate-500 tabular-nums">{cat.count}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-800">Brand</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
            >
              <option value="all">All Brands</option>
              {POPULAR_BRANDS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Condition Filter */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-800">Condition</label>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedCondition('all')}
                className={`px-2 py-1 text-xs rounded-md border font-medium cursor-pointer transition-colors ${
                  selectedCondition === 'all'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                All
              </button>
              {CONDITIONS.map((cond) => (
                <button
                  key={cond}
                  onClick={() => setSelectedCondition(cond)}
                  className={`px-2 py-1 text-xs rounded-md border font-medium cursor-pointer transition-colors ${
                    selectedCondition === cond
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cond}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter (PKR) */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-800">Price Range (PKR)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min Rs."
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : '')}
                className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
              <input
                type="number"
                placeholder="Max Rs."
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
                className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Quick Checkbox Toggles */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
            <label className="text-xs font-bold text-slate-800 block">Trust &amp; Verification</label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyPTA}
                onChange={(e) => setOnlyPTA(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-slate-700 font-semibold text-emerald-800">PTA Approved Only</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyOfficial}
                onChange={(e) => setOnlyOfficial(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-slate-700">Official Brand Warranty</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyCOD}
                onChange={(e) => setOnlyCOD(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-slate-700">Cash on Delivery (COD)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyVerified}
                onChange={(e) => setOnlyVerified(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-slate-700">Verified Sellers Only</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-slate-700">In Stock Ready to Dispatch</span>
            </label>
          </div>

          {/* Minimum Rating */}
          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <label className="text-xs font-bold text-slate-800 block">Customer Rating</label>
            <div className="space-y-1">
              {[4, 3, 0].map((star) => (
                <button
                  key={star}
                  onClick={() => setMinRating(star)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
                    minRating === star
                      ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {star > 0 ? (
                      <span className="text-amber-500 font-semibold">★ {star}.0 &amp; Above</span>
                    ) : (
                      <span>All Ratings</span>
                    )}
                  </div>
                  {minRating === star && <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Specific Verified Merchant Filter */}
          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
            <label className="text-xs font-bold text-slate-800 block">Filter By Verified Tech Hub</label>
            <select
              value={selectedVendorId}
              onChange={(e) => setSelectedVendorId(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
            >
              <option value="all">All Tech Sellers ({VENDORS.length})</option>
              {VENDORS.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.city})
                </option>
              ))}
            </select>
          </div>
        </aside>

        {/* Mobile Filter Modal/Drawer */}
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end lg:hidden">
            <div className="w-full max-w-sm bg-white h-full p-5 overflow-y-auto space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b">
                  <span className="font-bold text-sm text-slate-900">Filters</span>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800">Category</label>
                  <select
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800">Brand</label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2"
                  >
                    <option value="all">All Brands</option>
                    {POPULAR_BRANDS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800">Price (PKR)</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : '')}
                      className="border border-slate-300 rounded p-1.5"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
                      className="border border-slate-300 rounded p-1.5"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t text-xs">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={onlyPTA}
                      onChange={(e) => setOnlyPTA(e.target.checked)}
                    />
                    <span className="font-semibold text-emerald-800">PTA Approved Only</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={onlyOfficial}
                      onChange={(e) => setOnlyOfficial(e.target.checked)}
                    />
                    <span>Official Brand Warranty</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={onlyCOD}
                      onChange={(e) => setOnlyCOD(e.target.checked)}
                    />
                    <span>COD Available</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={onlyVerified}
                      onChange={(e) => setOnlyVerified(e.target.checked)}
                    />
                    <span>Verified Sellers</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={onlyInStock}
                      onChange={(e) => setOnlyInStock(e.target.checked)}
                    />
                    <span>In Stock Only</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                  className="w-1/2"
                >
                  Reset
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-1/2"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Product Cards Container (9 cols) */}
        <div className="lg:col-span-9 space-y-4">
          {/* Active Filter Tags */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 pb-2">
              <span className="text-xs text-slate-500">Active Filters:</span>
              {category !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 text-slate-800 text-xs px-2.5 py-1 rounded-md">
                  Category: {category}
                  <button onClick={() => handleCategoryChange('all')} className="hover:text-rose-600 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedBrand !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 text-slate-800 text-xs px-2.5 py-1 rounded-md">
                  Brand: {selectedBrand}
                  <button onClick={() => setSelectedBrand('all')} className="hover:text-rose-600 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedCondition !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 text-slate-800 text-xs px-2.5 py-1 rounded-md">
                  Condition: {selectedCondition}
                  <button onClick={() => setSelectedCondition('all')} className="hover:text-rose-600 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {onlyPTA && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs px-2.5 py-1 rounded-md font-semibold">
                  PTA Approved
                  <button onClick={() => setOnlyPTA(false)} className="hover:text-rose-600 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 text-slate-800 text-xs px-2.5 py-1 rounded-md">
                  Query: {searchQuery}
                  <button onClick={() => handleSearchChange('')} className="hover:text-rose-600 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {onlyCOD && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-2.5 py-1 rounded-md">
                  Cash on Delivery
                  <button onClick={() => setOnlyCOD(false)} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {onlyVerified && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-2.5 py-1 rounded-md">
                  Verified Sellers
                  <button onClick={() => setOnlyVerified(false)} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={resetFilters}
                className="text-xs font-semibold text-rose-600 hover:underline ml-2"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Products Render */}
          {filteredProducts.length > 0 ? (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'
                  : 'space-y-4'
              }
            >
              {filteredProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onAddToCart={onAddToCart}
                  onOpenQuickView={onSelectProduct}
                  isWishlisted={wishlist.includes(p.id)}
                  onToggleWishlist={onToggleWishlist}
                />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-white rounded-xl border border-slate-200 p-8 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                No matching electronics found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your price range, clearing search terms, or choosing a different electronics category.
              </p>
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
