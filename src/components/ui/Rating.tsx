import React from 'react';
import { Star } from 'lucide-react';

interface RatingProps {
  score: number;
  maxScore?: number;
  reviewCount?: number;
  size?: 'sm' | 'md';
  showCount?: boolean;
}

export const Rating: React.FC<RatingProps> = ({
  score,
  maxScore = 5,
  reviewCount,
  size = 'sm',
  showCount = true
}) => {
  const starSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className="flex items-center gap-1.5 select-none">
      <div className="flex items-center text-amber-500">
        {Array.from({ length: maxScore }).map((_, i) => {
          const filled = i < Math.floor(score);
          return (
            <Star
              key={i}
              className={`${starSize} ${
                filled
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-slate-100 text-slate-300'
              }`}
            />
          );
        })}
      </div>
      <span className={`font-semibold text-slate-700 tabular-nums ${textSize}`}>
        {score.toFixed(1)}
      </span>
      {showCount && reviewCount !== undefined && (
        <span className={`text-slate-400 tabular-nums ${textSize}`}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
};
