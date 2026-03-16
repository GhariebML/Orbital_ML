import React, { HTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
}

export const Badge: React.FC<BadgeProps> = ({ 
  className, 
  variant = 'default', 
  children, 
  ...props 
}) => {
  const variants = {
    default: 'bg-[#1f2937] text-[#F9FAFB] border border-[#374151]',
    success: 'bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20',
    error: 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20',
    warning: 'bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20',
    info: 'bg-[#22D3EE]/10 text-[#22D3EE] border border-[#22D3EE]/20',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
