import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../utils/auth.js', () => ({
  isAuthenticated: vi.fn(),
  getCurrentUser: vi.fn(),
}));

vi.mock('../utils/storage.js', () => ({
  getPosts: vi.fn(),
  getUsers: vi.fn(),
  getSession: vi.fn(),
  saveSession: vi.fn(),
  clearSession: vi.fn(),
  savePosts: vi.fn(),
  saveUsers: vi.fn(),
}));

import { isAuthenticated, getCurrentUser } from '../utils/auth.js';
import { getPosts } from '../utils/storage.js';
import LandingPage from './LandingPage';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderLandingPage() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <LandingPage />
    </MemoryRouter>
  );
}

describe('LandingPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    isAuthenticated.mockReturnValue(false);
    getCurrentUser.mockReturnValue(null);
    getPosts.mockReturnValue([]);
    mockNavigate.mockClear();
  });

  // --- Hero Section ---

  describe('hero section', () => {
    it('renders the hero heading', () => {
      renderLandingPage();

      expect(screen.getByText('Your Space to Write')).toBeInTheDocument();
    });

    it('renders the hero description text', () => {
      renderLandingPage();

      expect(
        screen.getByText(/A distraction-free writing platform built for focus and productivity/)
      ).toBeInTheDocument();
    });
  });

  // --- CTA Buttons for Guests ---

  describe('CTA buttons for unauthenticated users', () => {
    it('renders "Get Started" button when user is not authenticated', () => {
      isAuthenticated.mockReturnValue(false);
      getCurrentUser.mockReturnValue(null);

      renderLandingPage();

      expect(screen.getByRole('button', { name: 'Get Started' })).toBeInTheDocument();
    });

    it('renders "Sign In" link when user is not authenticated', () => {
      isAuthenticated.mockReturnValue(false);
      getCurrentUser.mockReturnValue(null);

      renderLandingPage();

      expect(screen.getByRole('link', { name: 'Sign In' })).toBeInTheDocument();
    });

    it('navigates to /register when "Get Started" is clicked by a guest', async () => {
      isAuthenticated.mockReturnValue(false);
      getCurrentUser.mockReturnValue(null);

      renderLandingPage();

      const user = userEvent.setup();
      await user.click(screen.getByRole('button', { name: 'Get Started' }));

      expect(mockNavigate).toHaveBeenCalledWith('/register');
    });
  });

  // --- CTA Buttons for Authenticated Users ---

  describe('CTA buttons for authenticated users', () => {
    it('renders "Go to Dashboard" button when user is authenticated', () => {
      isAuthenticated.mockReturnValue(true);
      getCurrentUser.mockReturnValue({
        userId: 'user-001',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      });

      renderLandingPage();

      expect(screen.getByRole('button', { name: 'Go to Dashboard' })).toBeInTheDocument();
    });

    it('does not render "Sign In" link when user is authenticated', () => {
      isAuthenticated.mockReturnValue(true);
      getCurrentUser.mockReturnValue({
        userId: 'user-001',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      });

      renderLandingPage();

      expect(screen.queryByRole('link', { name: 'Sign In' })).not.toBeInTheDocument();
    });

    it('navigates to /blogs when authenticated non-admin clicks "Go to Dashboard"', async () => {
      isAuthenticated.mockReturnValue(true);
      getCurrentUser.mockReturnValue({
        userId: 'user-001',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      });

      renderLandingPage();

      const user = userEvent.setup();
      await user.click(screen.getByRole('button', { name: 'Go to Dashboard' }));

      expect(mockNavigate).toHaveBeenCalledWith('/blogs');
    });

    it('navigates to /admin when authenticated admin clicks "Go to Dashboard"', async () => {
      isAuthenticated.mockReturnValue(true);
      getCurrentUser.mockReturnValue({
        userId: 'admin-001',
        username: 'admin',
        displayName: 'Administrator',
        role: 'admin',
      });

      renderLandingPage();

      const user = userEvent.setup();
      await user.click(screen.getByRole('button', { name: 'Go to Dashboard' }));

      expect(mockNavigate).toHaveBeenCalledWith('/admin');
    });
  });

  // --- Features Section ---

  describe('features section', () => {
    it('renders the "Why WriteSpace?" heading', () => {
      renderLandingPage();

      expect(screen.getByText('Why WriteSpace?')).toBeInTheDocument();
    });

    it('renders the "Distraction-Free Writing" feature card', () => {
      renderLandingPage();

      expect(screen.getByText('Distraction-Free Writing')).toBeInTheDocument();
      expect(
        screen.getByText(/Focus on what matters most/)
      ).toBeInTheDocument();
    });

    it('renders the "Instant Publishing" feature card', () => {
      renderLandingPage();

      expect(screen.getByText('Instant Publishing')).toBeInTheDocument();
      expect(
        screen.getByText(/Write and publish your blog posts instantly/)
      ).toBeInTheDocument();
    });

    it('renders the "Role-Based Access" feature card', () => {
      renderLandingPage();

      expect(screen.getByText('Role-Based Access')).toBeInTheDocument();
      expect(
        screen.getByText(/Admins manage users and content/)
      ).toBeInTheDocument();
    });

    it('renders exactly three feature cards', () => {
      renderLandingPage();

      expect(screen.getByText('Distraction-Free Writing')).toBeInTheDocument();
      expect(screen.getByText('Instant Publishing')).toBeInTheDocument();
      expect(screen.getByText('Role-Based Access')).toBeInTheDocument();
    });
  });

  // --- Latest Posts Section ---

  describe('latest posts section', () => {
    it('does not render the latest posts section when there are no posts', () => {
      getPosts.mockReturnValue([]);

      renderLandingPage();

      expect(screen.queryByText('Latest Posts')).not.toBeInTheDocument();
    });

    it('renders the latest posts section when posts exist', () => {
      const posts = [
        {
          id: 'post-1',
          title: 'First Post',
          content: 'Content of the first post',
          createdAt: '2024-06-01T00:00:00.000Z',
          authorId: 'user-001',
          authorName: 'Alice',
        },
      ];
      getPosts.mockReturnValue(posts);

      renderLandingPage();

      expect(screen.getByText('Latest Posts')).toBeInTheDocument();
      expect(screen.getByText('First Post')).toBeInTheDocument();
    });

    it('renders up to three latest posts sorted by date descending', () => {
      const posts = [
        {
          id: 'post-1',
          title: 'Oldest Post',
          content: 'Content 1',
          createdAt: '2024-01-01T00:00:00.000Z',
          authorId: 'user-001',
          authorName: 'Alice',
        },
        {
          id: 'post-2',
          title: 'Middle Post',
          content: 'Content 2',
          createdAt: '2024-06-01T00:00:00.000Z',
          authorId: 'user-001',
          authorName: 'Alice',
        },
        {
          id: 'post-3',
          title: 'Newest Post',
          content: 'Content 3',
          createdAt: '2024-12-01T00:00:00.000Z',
          authorId: 'user-001',
          authorName: 'Alice',
        },
        {
          id: 'post-4',
          title: 'Fourth Post Should Not Appear',
          content: 'Content 4',
          createdAt: '2023-01-01T00:00:00.000Z',
          authorId: 'user-001',
          authorName: 'Alice',
        },
      ];
      getPosts.mockReturnValue(posts);

      renderLandingPage();

      expect(screen.getByText('Newest Post')).toBeInTheDocument();
      expect(screen.getByText('Middle Post')).toBeInTheDocument();
      expect(screen.getByText('Oldest Post')).toBeInTheDocument();
      expect(screen.queryByText('Fourth Post Should Not Appear')).not.toBeInTheDocument();
    });

    it('renders "View All Posts" link when posts exist', () => {
      const posts = [
        {
          id: 'post-1',
          title: 'A Post',
          content: 'Content',
          createdAt: '2024-06-01T00:00:00.000Z',
          authorId: 'user-001',
          authorName: 'Alice',
        },
      ];
      getPosts.mockReturnValue(posts);

      renderLandingPage();

      expect(screen.getByRole('link', { name: 'View All Posts' })).toBeInTheDocument();
    });

    it('"View All Posts" links to /login for unauthenticated users', () => {
      isAuthenticated.mockReturnValue(false);
      getCurrentUser.mockReturnValue(null);

      const posts = [
        {
          id: 'post-1',
          title: 'A Post',
          content: 'Content',
          createdAt: '2024-06-01T00:00:00.000Z',
          authorId: 'user-001',
          authorName: 'Alice',
        },
      ];
      getPosts.mockReturnValue(posts);

      renderLandingPage();

      const link = screen.getByRole('link', { name: 'View All Posts' });
      expect(link).toHaveAttribute('href', '/login');
    });

    it('"View All Posts" links to /blogs for authenticated users', () => {
      isAuthenticated.mockReturnValue(true);
      getCurrentUser.mockReturnValue({
        userId: 'user-001',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      });

      const posts = [
        {
          id: 'post-1',
          title: 'A Post',
          content: 'Content',
          createdAt: '2024-06-01T00:00:00.000Z',
          authorId: 'user-001',
          authorName: 'Alice',
        },
      ];
      getPosts.mockReturnValue(posts);

      renderLandingPage();

      const link = screen.getByRole('link', { name: 'View All Posts' });
      expect(link).toHaveAttribute('href', '/blogs');
    });
  });

  // --- Navbar ---

  describe('navbar rendering', () => {
    it('renders PublicNavbar with Login and Register links for unauthenticated users', () => {
      isAuthenticated.mockReturnValue(false);
      getCurrentUser.mockReturnValue(null);

      renderLandingPage();

      expect(screen.getByRole('link', { name: 'Login' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Register' })).toBeInTheDocument();
    });

    it('renders authenticated Navbar with WriteSpace brand link for authenticated users', () => {
      isAuthenticated.mockReturnValue(true);
      getCurrentUser.mockReturnValue({
        userId: 'user-001',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      });

      renderLandingPage();

      expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
    });
  });

  // --- Footer ---

  describe('footer section', () => {
    it('renders the footer with WriteSpace branding', () => {
      renderLandingPage();

      const footerHeadings = screen.getAllByText('WriteSpace');
      expect(footerHeadings.length).toBeGreaterThanOrEqual(1);
    });

    it('renders the copyright text with current year', () => {
      renderLandingPage();

      const currentYear = new Date().getFullYear().toString();
      expect(
        screen.getByText(new RegExp(`© ${currentYear} WriteSpace`))
      ).toBeInTheDocument();
    });

    it('renders Quick Links section in footer', () => {
      renderLandingPage();

      expect(screen.getByText('Quick Links')).toBeInTheDocument();
    });

    it('renders Platform section in footer', () => {
      renderLandingPage();

      expect(screen.getByText('Platform')).toBeInTheDocument();
    });

    it('renders Home link in footer', () => {
      renderLandingPage();

      const homeLinks = screen.getAllByRole('link', { name: 'Home' });
      expect(homeLinks.length).toBeGreaterThanOrEqual(1);
    });
  });
});