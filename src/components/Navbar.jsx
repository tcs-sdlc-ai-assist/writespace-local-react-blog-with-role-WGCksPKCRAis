import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser, logout } from '../utils/auth.js';
import { getAvatar } from './Avatar.jsx';

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = getCurrentUser();

  const isAdmin = currentUser && currentUser.role === 'admin';

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinkClass = (path) => {
    const base =
      'px-3 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2';
    if (isActive(path)) {
      return `${base} text-indigo-700 bg-indigo-50`;
    }
    return `${base} text-gray-600 hover:text-indigo-600 hover:bg-gray-50`;
  };

  const mobileNavLinkClass = (path) => {
    const base =
      'block w-full text-left px-4 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2';
    if (isActive(path)) {
      return `${base} text-indigo-700 bg-indigo-50`;
    }
    return `${base} text-gray-600 hover:text-indigo-600 hover:bg-gray-50`;
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0">
              <Link
                to="/blogs"
                className="text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                WriteSpace
              </Link>
            </div>

            <div className="hidden sm:flex sm:items-center sm:space-x-2">
              <Link to="/blogs" className={navLinkClass('/blogs')}>
                Blogs
              </Link>
              <Link to="/write" className={navLinkClass('/write')}>
                Write
              </Link>
              {isAdmin && (
                <Link to="/admin" className={navLinkClass('/admin')}>
                  Admin Dashboard
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin/users" className={navLinkClass('/admin/users')}>
                  User Management
                </Link>
              )}
            </div>
          </div>

          <div className="hidden sm:flex sm:items-center sm:gap-4">
            {currentUser && (
              <div className="flex items-center gap-2">
                {getAvatar(currentUser.role)}
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 leading-tight">
                    {currentUser.displayName}
                  </span>
                  <span
                    className={`text-xs font-medium leading-tight ${
                      currentUser.role === 'admin'
                        ? 'text-violet-600'
                        : 'text-indigo-600'
                    }`}
                  >
                    {currentUser.role}
                  </span>
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Logout
            </button>
          </div>

          <div className="sm:hidden">
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-indigo-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-gray-200">
          <div className="px-4 py-3 space-y-1">
            {currentUser && (
              <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 mb-2">
                {getAvatar(currentUser.role)}
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700 leading-tight">
                    {currentUser.displayName}
                  </span>
                  <span
                    className={`text-xs font-medium leading-tight ${
                      currentUser.role === 'admin'
                        ? 'text-violet-600'
                        : 'text-indigo-600'
                    }`}
                  >
                    {currentUser.role}
                  </span>
                </div>
              </div>
            )}

            <Link
              to="/blogs"
              onClick={() => setMobileMenuOpen(false)}
              className={mobileNavLinkClass('/blogs')}
            >
              Blogs
            </Link>
            <Link
              to="/write"
              onClick={() => setMobileMenuOpen(false)}
              className={mobileNavLinkClass('/write')}
            >
              Write
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={mobileNavLinkClass('/admin')}
              >
                Admin Dashboard
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin/users"
                onClick={() => setMobileMenuOpen(false)}
                className={mobileNavLinkClass('/admin/users')}
              >
                User Management
              </Link>
            )}

            <div className="pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={handleLogout}
                className="block w-full text-center px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;