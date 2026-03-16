import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { ProjectsListPage } from '../pages/projects/ProjectsListPage';
import { NewProjectPage } from '../pages/projects/NewProjectPage';
import { ProjectDetailsPage } from '../pages/projects/ProjectDetailsPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';

// For simplicity, defining routes here directly
const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <LoginPage />, // Default to login
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'projects',
        element: <ProjectsListPage />,
      },
      {
        path: 'projects/new',
        element: <NewProjectPage />,
      },
      {
        path: 'projects/:id',
        element: <ProjectDetailsPage />,
      },
      // Feature specific pages or placeholders for missing routes handling
      {
        path: 'deployments',
        element: <div className="p-8 text-white animate-in fade-in">Deployments Page Placeholder</div>,
      },
      {
        path: 'settings',
        element: <div className="p-8 text-white animate-in fade-in">Settings Page Placeholder</div>,
      },
      {
        path: '*',
        element: <div className="p-8 text-white">404 - Page Not Found</div>,
      }
    ],
  },
]);

export const routes = router;
