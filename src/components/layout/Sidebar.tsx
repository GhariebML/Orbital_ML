import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, FlaskConical, Rocket, Settings } from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', path: '/projects', icon: FolderKanban },
  { name: 'AutoML Studio', path: '/projects/new', icon: FlaskConical },
  { name: 'Deployments', path: '/deployments', icon: Rocket },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-[#1f2937] bg-[#0b1020] transition-transform">
      {/* Brand area */}
      <div className="flex h-16 items-center px-6 border-b border-[#1f2937]">
        <div className="flex items-center gap-2">
          {/* Logo icon representation */}
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-[#6366F1] to-[#7C3AED] shadow-[0_0_15px_rgba(99,102,241,0.5)]">
            <Rocket className="h-4 w-4 text-white" />
            <div className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-[#22D3EE] animate-pulse"></div>
          </div>
          <span className="text-xl font-bold tracking-tight text-[#F9FAFB]">Antigravity</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto scrollbar-custom">
        <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
          Menu
        </div>
        
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'group flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-[#6366F1]/10 text-[#6366F1] shadow-[inset_3px_0_0_0_#6366F1]'
                  : 'text-[#9CA3AF] hover:bg-[#1f2937] hover:text-[#F9FAFB]'
              )
            }
          >
            {item.icon && <item.icon className="h-5 w-5 flex-shrink-0" />}
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* User area placeholder for now, usually handled by Topbar, but good to have a bottom anchor */}
      <div className="border-t border-[#1f2937] p-4">
        <div className="flex items-center gap-3 rounded-[10px] bg-[#1f2937]/50 p-2 border border-[#1f2937]">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#22D3EE] to-[#6366F1] flex items-center justify-center font-bold text-white text-xs">
            DS
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-[#F9FAFB]">Data Scientist</span>
            <span className="text-xs text-[#9CA3AF]">Pro Plan</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
