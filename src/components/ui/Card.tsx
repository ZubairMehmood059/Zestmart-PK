import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'flat' | 'outline' | 'interactive';
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'flat',
  className = '',
  ...props
}) => {
  const variantStyles = {
    flat: 'bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)] rounded-xl',
    outline: 'bg-white border border-slate-200 rounded-xl',
    interactive:
      'bg-white border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-md hover:border-slate-300 transition-all duration-200 rounded-xl'
  }[variant];

  return (
    <div className={`${variantStyles} overflow-hidden ${className}`} {...props}>
      {children}
    </div>
  );
};
