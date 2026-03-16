import React from 'react';
import { Outlet } from 'react-router-dom';
import { Rocket } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-[#050816]">
      {/* Left side: Branding & Hero */}
      <div className="hidden w-1/2 flex-col justify-between bg-[#0b1020] p-12 lg:flex border-r border-[#1f2937]">
        <div className="flex items-center gap-2">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#7C3AED] shadow-[0_0_20px_rgba(99,102,241,0.5)]">
            <Rocket className="h-5 w-5 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-[#F9FAFB]">Antigravity</span>
        </div>
        
        <div className="max-w-md">
          <h1 className="mb-6 text-4xl font-bold leading-tight text-[#F9FAFB]">
            Launch your <br />
            <span className="bg-gradient-to-r from-[#6366F1] via-[#7C3AED] to-[#22D3EE] bg-clip-text text-transparent">
              ML Pipeline
            </span>{' '}
            in minutes.
          </h1>
          <p className="text-[#9CA3AF] text-lg">
            Upload your dataset and let our Auto-ML engine handle cleaning, EDA, modeling, and deployment autonomously.
          </p>
        </div>
        
        <div className="text-sm text-[#9CA3AF]">
          &copy; {new Date().getFullYear()} Antigravity Inc. All rights reserved.
        </div>
      </div>

      {/* Right side: Auth Form Content */}
      <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 lg:px-24 xl:px-32">
        <div className="mb-10 lg:hidden flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-[#6366F1] to-[#7C3AED]">
            <Rocket className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold text-[#F9FAFB]">Antigravity</span>
        </div>
        <Outlet />
      </div>
    </div>
  );
};
