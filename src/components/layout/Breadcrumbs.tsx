
import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';


export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Skip rendering on dashboard or root
  if (pathnames.length === 0 || (pathnames.length === 1 && pathnames[0] === 'dashboard')) {
    return null;
  }

  return (
    <nav className="mb-6 flex items-center text-sm font-medium text-[#9CA3AF]">
      <Link to="/dashboard" className="flex items-center transition-colors hover:text-[#F9FAFB]">
        <Home className="h-4 w-4" />
      </Link>
      
      {pathnames.map((name, index) => {
        const isLast = index === pathnames.length - 1;
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        // capitalize name
        const displayName = name.charAt(0).toUpperCase() + name.slice(1);

        return (
          <React.Fragment key={name}>
            <ChevronRight className="mx-2 h-4 w-4 shrink-0 text-[#374151]" />
            {isLast ? (
              <span className="text-[#F9FAFB]" aria-current="page">
                {displayName}
              </span>
            ) : (
              <Link to={routeTo} className="transition-colors hover:text-[#F9FAFB]">
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
