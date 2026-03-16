import React from 'react';
import { Bell, Search, ChevronDown } from 'lucide-react';

export const Topbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#1f2937] bg-[#050816]/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-4 lg:hidden">
        {/* Mobile menu button could go here */}
        <span className="text-lg font-bold text-[#F9FAFB]">Antigravity</span>
      </div>

      <div className="hidden flex-1 items-center gap-4 lg:flex">
        {/* Project Switcher */}
        <button className="flex items-center gap-2 rounded-[6px] border border-[#1f2937] bg-[#0b1020] px-3 py-1.5 text-sm font-medium text-[#F9FAFB] transition-colors hover:border-[#374151]">
          <div className="h-2 w-2 rounded-full bg-[#22C55E]"></div>
          Customer Churn Prediction
          <ChevronDown className="h-4 w-4 text-[#9CA3AF]" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search projects..."
            className="flex h-9 w-64 rounded-[8px] border border-[#1f2937] bg-[#0b1020] pl-9 pr-3 text-sm text-[#F9FAFB] placeholder:text-[#9CA3AF] focus:border-[#6366F1] focus:outline-none focus:ring-1 focus:ring-[#6366F1]"
          />
        </div>
        
        <button className="relative rounded-full p-2 text-[#9CA3AF] transition-colors hover:bg-[#1f2937] hover:text-[#F9FAFB]">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#EF4444] border-2 border-[#050816]"></span>
        </button>
      </div>
    </header>
  );
};
