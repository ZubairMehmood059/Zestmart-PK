import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'slate' | 'amber' | 'rose' | 'outline' | 'subtle';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'slate',
  size = 'sm',
  className = ''
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium tracking-wide',
    md: 'text-xs px-2.5 py-1 font-medium'
  }[size];

  // Adhering to Zero-Pill: clean crisp rounded-md or micro border, never pill capsules
  const variantStyles = {
    emerald: 'bg-emerald-50 text-emerald-800 border border-emerald-200/80',
    slate: 'bg-slate-100 text-slate-700 border border-slate-200',
    amber: 'bg-amber-50 text-amber-800 border border-amber-200',
    rose: 'bg-rose-50 text-rose-700 border border-rose-200',
    outline: 'border border-slate-300 text-slate-700 bg-white',
    subtle: 'text-slate-600 bg-slate-50 border border-slate-150'
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded font-medium whitespace-nowrap ${sizeStyles} ${variantStyles} ${className}`}
    >
      {children}
    </span>
  );
};
