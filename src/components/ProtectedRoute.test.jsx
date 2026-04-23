import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

vi.mock('../utils/auth.js', () => ({
  isAuthenticated: vi.fn(),
  isAdmin: vi.fn(),
}));

import { isAuthenticated, isAdmin } from '../utils/auth.js';
import ProtectedRoute from './ProtectedRoute';

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    isAuthenticated.mockReturnValue(false);
    isAdmin.mockReturnValue(false);
  });

  // --- Unauthenticated users ---

  describe('unauthenticated users', () => {
    it('redirects to /login when user is not authenticated', () => {
      isAuthenticated.mockReturnValue(false);

      render(
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/protected" element={<div>Protected Content</div>} />
            </Route>
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Login Page')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    it('redirects to /login when user is not authenticated on admin route', () => {
      isAuthenticated.mockReturnValue(false);

      render(
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route element={<ProtectedRoute role="admin" />}>
              <Route path="/admin" element={<div>Admin Dashboard</div>} />
            </Route>
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Login Page')).toBeInTheDocument();
      expect(screen.queryByText('Admin Dashboard')).not.toBeInTheDocument();
    });
  });

  // --- Authenticated non-admin users ---

  describe('authenticated non-admin users', () => {
    it('renders child route for authenticated user on unprotected route', () => {
      isAuthenticated.mockReturnValue(true);
      isAdmin.mockReturnValue(false);

      render(
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/protected" element={<div>Protected Content</div>} />
            </Route>
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
      expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
    });

    it('redirects to /blogs when non-admin user accesses admin route', () => {
      isAuthenticated.mockReturnValue(true);
      isAdmin.mockReturnValue(false);

      render(
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route element={<ProtectedRoute role="admin" />}>
              <Route path="/admin" element={<div>Admin Dashboard</div>} />
            </Route>
            <Route path="/blogs" element={<div>Blogs Page</div>} />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Blogs Page')).toBeInTheDocument();
      expect(screen.queryByText('Admin Dashboard')).not.toBeInTheDocument();
      expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
    });
  });

  // --- Authenticated admin users ---

  describe('authenticated admin users', () => {
    it('renders child route for admin user on admin route', () => {
      isAuthenticated.mockReturnValue(true);
      isAdmin.mockReturnValue(true);

      render(
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route element={<ProtectedRoute role="admin" />}>
              <Route path="/admin" element={<div>Admin Dashboard</div>} />
            </Route>
            <Route path="/blogs" element={<div>Blogs Page</div>} />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
      expect(screen.queryByText('Blogs Page')).not.toBeInTheDocument();
      expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
    });

    it('renders child route for admin user on regular protected route', () => {
      isAuthenticated.mockReturnValue(true);
      isAdmin.mockReturnValue(true);

      render(
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/protected" element={<div>Protected Content</div>} />
            </Route>
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
      expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
    });
  });

  // --- Role prop edge cases ---

  describe('role prop edge cases', () => {
    it('renders child route when role prop is not provided and user is authenticated', () => {
      isAuthenticated.mockReturnValue(true);
      isAdmin.mockReturnValue(false);

      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<div>Dashboard</div>} />
            </Route>
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('renders child route when role prop is "user" and user is authenticated', () => {
      isAuthenticated.mockReturnValue(true);
      isAdmin.mockReturnValue(false);

      render(
        <MemoryRouter initialEntries={['/profile']}>
          <Routes>
            <Route element={<ProtectedRoute role="user" />}>
              <Route path="/profile" element={<div>User Profile</div>} />
            </Route>
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('User Profile')).toBeInTheDocument();
    });
  });
});