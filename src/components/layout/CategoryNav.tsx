import React from 'react';
import {
  Grid,
  Headphones,
  Smartphone,
  Laptop,
  Tablet,
  Cpu,
  Monitor,
  Gamepad2,
  Camera,
  Watch,
  Zap,
  Wifi,
  Radio
} from 'lucide-react';
import { CATEGORIES } from '../../config/constants';

interface CategoryNavProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Grid':
        return <Grid className="w-3.5 h-3.5" />;
      case 'Smartphone':
        return <Smartphone className="w-3.5 h-3.5" />;
      case 'Laptop':
        return <Laptop className="w-3.5 h-3.5" />;
      case 'Tablet':
        return <Tablet className="w-3.5 h-3.5" />;
      case 'Cpu':
        return <Cpu className="w-3.5 h-3.5" />;
      case 'Monitor':
        return <Monitor className="w-3.5 h-3.5" />;
      case 'Headphones':
        return <Headphones className="w-3.5 h-3.5" />;
      case 'Gamepad2':
        return <Gamepad2 className="w-3.5 h-3.5" />;
      case 'Camera':
        return <Camera className="w-3.5 h-3.5" />;
      case 'Watch':
        return <Watch className="w-3.5 h-3.5" />;
      case 'Zap':
        return <Zap className="w-3.5 h-3.5" />;
      case 'Wifi':
        return <Wifi className="w-3.5 h-3.5" />;
      case 'Radio':
        return <Radio className="w-3.5 h-3.5" />;
      default:
        return <Grid className="w-3.5 h-3.5" />;
    }
  };

  return (
    <nav aria-label="Electronics categories navigation" className="bg-white border-b border-slate-200/90 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-2 pr-6 sm:pr-8 no-scrollbar scroll-smooth">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                aria-pressed={isActive}
                className={`flex flex-row items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition-all cursor-pointer min-h-[36px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/90'
                }`}
              >
                <span className={`shrink-0 flex items-center ${isActive ? 'text-white' : 'text-slate-500'}`}>
                  {getIcon(cat.icon)}
                </span>
                <span className="whitespace-nowrap">{cat.name}</span>
                {'count' in cat && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-medium tabular-nums shrink-0 ${
                      isActive
                        ? 'bg-emerald-700 text-emerald-100'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
