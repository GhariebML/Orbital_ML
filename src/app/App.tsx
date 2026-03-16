import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { routes } from './routes';

export const App: React.FC = () => {
  return (
    <div className="antialiased min-h-screen bg-[#050816] text-[#F9FAFB] font-sans">
      <RouterProvider router={routes} />
    </div>
  );
};
