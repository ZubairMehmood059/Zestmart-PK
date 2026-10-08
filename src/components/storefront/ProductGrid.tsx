import React from 'react';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { SearchX, SlidersHorizontal, ArrowRight } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  sortBy: string;
  onSortChange: (sort: 'featured' | 'price_low' | 'price_high' | 'rating') => void;
  onAddToCart: (product: Product) => void;
  onOpenQuickView: (product: Product) => void;
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
  onClearFilters: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  activeFilter,
  onFilterChange,
  sortBy,
  onSortChange,
  onAddToCart,
  onOpenQuickView,
  wishlist,
  onToggleWishlist,
  onClearFilters
}) => {
  const filterTabs = [
    { id: 'all', label: 'All Electronics' },
    { id: 'deals', label: 'Hot Deals' },
    { id: 'smartphones', label: 'Smartphones' },
    { id: 'laptops', label: 'Laptops' },
    { id: 'pc-components', label: 'PC Components' },
    { id: 'audio', label: 'Audio & ANC' },
    { id: 'gaming', label: 'Gaming' }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Grid Header & Filters with Design Reference Kicker */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
            <span className="w-4 h-0.5 bg-amber-500 rounded-full" />
            <span>Featured Selection</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
            Best Selling Tech &amp; Hardware
          </h2>
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Segmented Filter Buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-full overflow-x-auto no-scrollbar shadow-2xs">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onFilterChange(tab.id)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-all whitespace-nowrap cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) =>
                onSortChange(
                  e.target.value as 'featured' | 'price_low' | 'price_high' | 'rating'
                )
              }
              aria-label="Sort products by"
              className="bg-white border border-slate-200 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-full focus:outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer hover:border-slate-300 shadow-2xs"
            >
              <option value="featured">Featured First</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Top Customer Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onOpenQuickView={onOpenQuickView}
              isWishlisted={wishlist.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 text-center max-w-md mx-auto space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <SearchX className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              No products found
            </h3>
            <p className="text-xs text-slate-500">
              We couldn&apos;t find any items matching your active category or search query.
            </p>
          </div>
          <button
            onClick={onClearFilters}
            className="text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-5 py-2.5 rounded-full transition-colors cursor-pointer"
          >
            Clear All Filters &amp; Search
          </button>
        </div>
      )}
    </section>
  );
};
