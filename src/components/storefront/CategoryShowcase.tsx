import React from 'react';
import {
  Smartphone,
  Laptop,
  Tablet,
  Cpu,
  Monitor,
  Headphones,
  Gamepad2,
  Camera,
  Watch,
  Zap,
  Wifi,
  Radio,
  ArrowRight
} from 'lucide-react';
import { CATEGORIES } from '../../config/constants';

interface CategoryShowcaseProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  const [imageErrors, setImageErrors] = React.useState<Record<string, boolean>>({});

  const handleImageError = (catId: string) => {
    setImageErrors((prev) => ({ ...prev, [catId]: true }));
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Smartphone':
        return <Smartphone className="w-5 h-5" />;
      case 'Laptop':
        return <Laptop className="w-5 h-5" />;
      case 'Tablet':
        return <Tablet className="w-5 h-5" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5" />;
      case 'Monitor':
        return <Monitor className="w-5 h-5" />;
      case 'Headphones':
        return <Headphones className="w-5 h-5" />;
      case 'Gamepad2':
        return <Gamepad2 className="w-5 h-5" />;
      case 'Camera':
        return <Camera className="w-5 h-5" />;
      case 'Watch':
        return <Watch className="w-5 h-5" />;
      case 'Zap':
        return <Zap className="w-5 h-5" />;
      case 'Wifi':
        return <Wifi className="w-5 h-5" />;
      case 'Radio':
        return <Radio className="w-5 h-5" />;
      default:
        return <Smartphone className="w-5 h-5" />;
    }
  };

  const showcaseCategories = CATEGORIES.filter((c) => c.id !== 'all');

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
            <span className="w-3.5 h-1 bg-emerald-600 rounded-full" />
            <span>Marketplace Catalog</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
            Explore Hardware Universes
          </h2>
        </div>
        <button
          onClick={() => onSelectCategory('all')}
          className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 transition-colors cursor-pointer group shrink-0"
        >
          <span>View All Categories</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4.5">
        {showcaseCategories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          const hasImage = 'image' in cat && cat.image && !imageErrors[cat.id];
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              aria-label={`Explore ${cat.name} (${cat.count} items)`}
              className={`p-3.5 rounded-2xl transition-all duration-300 cursor-pointer flex flex-col items-center justify-between gap-3 group text-center bg-white border shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                isActive
                  ? 'border-emerald-600 ring-2 ring-emerald-600/20 bg-emerald-50/40'
                  : 'border-slate-200/90 hover:border-slate-300'
              }`}
            >
              {/* Image / Icon container */}
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#f8fafc] flex items-center justify-center p-3 group-hover:scale-105 transition-transform duration-300">
                {hasImage ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    decoding="async"
                    width={120}
                    height={120}
                    onError={() => handleImageError(cat.id)}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain mix-blend-multiply drop-shadow-xs"
                  />
                ) : (
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                      isActive
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-700 group-hover:bg-emerald-50 group-hover:text-emerald-700'
                    }`}
                  >
                    {getCategoryIcon(cat.icon)}
                  </div>
                )}
              </div>

              {/* Title & Count */}
              <div className="space-y-0.5 w-full">
                <p className="text-xs sm:text-sm font-bold text-slate-800 leading-tight truncate group-hover:text-emerald-700 transition-colors">
                  {cat.name}
                </p>
                <p className="text-xs text-slate-500 font-medium tabular-nums">
                  {cat.count} Items
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
