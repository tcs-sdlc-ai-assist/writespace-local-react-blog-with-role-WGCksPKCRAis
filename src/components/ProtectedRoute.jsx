import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '../utils/auth.js';

/**
 * Route guard component that protects routes based on authentication and role.
 *
 * - If the user is not authenticated, redirects to /login.
 * - If the `role` prop is set to 'admin' and the user is not an admin, redirects to /blogs.
 * - Otherwise, renders the child routes via <Outlet />.
 *
 * @param {{ role?: 'admin' | 'user' }} props
 */
function ProtectedRoute({ role }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'admin' && !isAdmin()) {
    return <Navigate to="/blogs" replace />;
  }

  return <Outlet />;
}

ProtectedRoute.propTypes = {
  role: PropTypes.oneOf(['admin', 'user']),
};

export default ProtectedRoute;