import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';

export const MainLayout: React.FC = () => {
  return (
    <div className="flex h-screen w-full bg-[#050816] overflow-hidden">
      {/* Sidebar navigation */}
      <Sidebar />
      
      {/* Main content wrapper */}
      <div className="flex flex-1 flex-col lg:pl-64">
        <Topbar />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-custom p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
