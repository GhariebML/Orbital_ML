import React, { type SelectHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, id, ...props }, ref) => {
    const selectId = id || (label ? label.replace(/\s+/g, '-').toLowerCase() : undefined);

    return (
      <div className="w-full flex flex-col gap-1.5 relative">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-[#F9FAFB]">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={clsx(
              'flex h-10 w-full appearance-none rounded-[10px] border border-[#1f2937] bg-[#0b1020] px-3 py-2 pr-8 text-sm text-[#F9FAFB]',
              'transition-colors focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-[#EF4444] focus:ring-[#EF4444]',
              className
            )}
            {...props}
          >
            <option value="" disabled hidden>Select an option</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#0b1020]">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
        </div>
        {error && <p className="text-xs text-[#EF4444] mt-0.5">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';
