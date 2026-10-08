import React, { useState } from 'react';
import { AppView } from '../../types';
import { Button } from '../ui/Button';
import { CATEGORIES } from '../../config/constants';
import {
  AlertTriangle,
  Home,
  Search,
  ArrowRight,
  Smartphone,
  Laptop,
  Cpu,
  Headphones,
  Gamepad2
} from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (view: AppView, category?: string) => void;
  onSearch: (query: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  onNavigate,
  onSearch
}) => {
  const [query, setQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query.trim());
    onNavigate('shop');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center space-y-8 animate-fade-in">
      {/* Visual 404 Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-rose-50 text-rose-600 border border-rose-200 shadow-sm mx-auto">
          <AlertTriangle className="w-10 h-10 stroke-[2.2]" />
        </div>
        
        <h1 className="text-6xl sm:text-7xl font-black text-slate-900 tracking-tight font-display">
          404
        </h1>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
          Oops! Hardware Consignment or Page Not Found
        </h2>

        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          The electronics listing, category, or URL you are looking for might have been restocked, moved, or is temporarily unavailable in our Pakistani tech inventory.
        </p>
      </div>

      {/* Interactive Search Bar on 404 */}
      <div className="max-w-md mx-auto">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search flagships, GPUs, MacBooks, accessories..."
            className="w-full text-xs sm:text-sm py-3 pl-4 pr-12 rounded-xl bg-white border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
          />
          <button
            type="submit"
            aria-label="Submit Search"
            className="absolute right-1.5 w-9 h-9 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Suggested Top Categories */}
      <div className="space-y-3 pt-4">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Explore Popular Tech Departments
        </span>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {CATEGORIES.filter((c) => c.id !== 'all').slice(0, 5).map((cat) => (
            <button
              key={cat.id}
              onClick={() => onNavigate('shop', cat.id)}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:border-emerald-300 transition-all cursor-pointer shadow-2xs"
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Return Actions */}
      <div className="pt-6 flex flex-wrap items-center justify-center gap-3">
        <Button
          variant="primary"
          size="md"
          leftIcon={<Home className="w-4 h-4" />}
          onClick={() => onNavigate('home')}
        >
          Return to Marketplace Home
        </Button>

        <Button
          variant="outline"
          size="md"
          rightIcon={<ArrowRight className="w-4 h-4" />}
          onClick={() => onNavigate('shop')}
        >
          Explore All Tech Deals
        </Button>
      </div>
    </div>
  );
};
