import React, { type InputHTMLAttributes } from 'react';
import { clsx } from 'clsx';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined);
    
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[#F9FAFB]">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={clsx(
            'flex h-10 w-full rounded-[10px] border border-[#1f2937] bg-[#0b1020] px-3 py-2 text-sm text-[#F9FAFB] placeholder:text-[#9CA3AF]',
            'transition-colors focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-[#EF4444] focus:ring-[#EF4444]',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-[#EF4444] mt-0.5">{error}</p>}
        {helperText && !error && <p className="text-xs text-[#9CA3AF] mt-0.5">{helperText}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
