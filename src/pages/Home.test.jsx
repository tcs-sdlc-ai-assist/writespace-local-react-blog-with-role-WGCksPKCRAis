import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../utils/auth.js', () => ({
  getCurrentUser: vi.fn(),
  isAuthenticated: vi.fn(),
  isAdmin: vi.fn(),
  logout: vi.fn(),
}));

vi.mock('../utils/storage.js', () => ({
  getPosts: vi.fn(),
  savePosts: vi.fn(),
  getUsers: vi.fn(),
  saveUsers: vi.fn(),
  getSession: vi.fn(),
  saveSession: vi.fn(),
  clearSession: vi.fn(),
}));

import { getCurrentUser, isAuthenticated, isAdmin } from '../utils/auth.js';
import { getPosts } from '../utils/storage.js';
import Home from './Home';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderHome() {
  return render(
    <MemoryRouter initialEntries={['/blogs']}>
      <Home />
    </MemoryRouter>
  );
}

describe('Home', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockNavigate.mockReset();
    getCurrentUser.mockReturnValue({
      userId: 'user-001',
      username: 'alice',
      displayName: 'Alice',
      role: 'user',
    });
    isAuthenticated.mockReturnValue(true);
    isAdmin.mockReturnValue(false);
    getPosts.mockReturnValue([]);
  });

  // --- Empty state ---

  describe('empty state', () => {
    it('renders empty state message when there are no posts', () => {
      getPosts.mockReturnValue([]);

      renderHome();

      expect(screen.getByText('No posts yet')).toBeInTheDocument();
      expect(
        screen.getByText(/Be the first to share your thoughts/)
      ).toBeInTheDocument();
    });

    it('renders "Write Your First Post" button in empty state', () => {
      getPosts.mockReturnValue([]);

      renderHome();

      expect(screen.getByText('Write Your First Post')).toBeInTheDocument();
    });

    it('navigates to /write when "Write Your First Post" button is clicked', async () => {
      getPosts.mockReturnValue([]);
      const user = userEvent.setup();

      renderHome();

      await user.click(screen.getByText('Write Your First Post'));
      expect(mockNavigate).toHaveBeenCalledWith('/write');
    });
  });

  // --- Blog list rendering ---

  describe('blog list rendering', () => {
    it('renders blog post titles when posts exist', () => {
      getPosts.mockReturnValue([
        {
          id: 'post-1',
          title: 'First Post',
          content: 'Content of first post',
          createdAt: '2024-06-01T00:00:00.000Z',
          authorId: 'user-001',
          authorName: 'Alice',
        },
        {
          id: 'post-2',
          title: 'Second Post',
          content: 'Content of second post',
          createdAt: '2024-06-02T00:00:00.000Z',
          authorId: 'user-002',
          authorName: 'Bob',
        },
      ]);

      renderHome();

      expect(screen.getByText('First Post')).toBeInTheDocument();
      expect(screen.getByText('Second Post')).toBeInTheDocument();
    });

    it('renders the page heading and description', () => {
      getPosts.mockReturnValue([]);

      renderHome();

      expect(screen.getByText('Blog Posts')).toBeInTheDocument();
      expect(
        screen.getByText('Browse the latest posts from the community')
      ).toBeInTheDocument();
    });

    it('renders "Write New Post" button in the header', () => {
      getPosts.mockReturnValue([]);

      renderHome();

      expect(screen.getByText('Write New Post')).toBeInTheDocument();
    });

    it('navigates to /write when "Write New Post" button is clicked', async () => {
      getPosts.mockReturnValue([]);
      const user = userEvent.setup();

      renderHome();

      await user.click(screen.getByText('Write New Post'));
      expect(mockNavigate).toHaveBeenCalledWith('/write');
    });

    it('renders author names on blog cards', () => {
      getPosts.mockReturnValue([
        {
          id: 'post-1',
          title: 'Alice Post',
          content: 'Some content',
          createdAt: '2024-06-01T00:00:00.000Z',
          authorId: 'user-001',
          authorName: 'Alice',
        },
      ]);

      renderHome();

      expect(screen.getByText('Alice')).toBeInTheDocument();
    });
  });

  // --- Sort order (newest first) ---

  describe('sort order', () => {
    it('displays posts sorted by newest first', () => {
      getPosts.mockReturnValue([
        {
          id: 'post-old',
          title: 'Old Post',
          content: 'Old content',
          createdAt: '2024-01-01T00:00:00.000Z',
          authorId: 'user-001',
          authorName: 'Alice',
        },
        {
          id: 'post-new',
          title: 'New Post',
          content: 'New content',
          createdAt: '2024-12-01T00:00:00.000Z',
          authorId: 'user-002',
          authorName: 'Bob',
        },
        {
          id: 'post-mid',
          title: 'Mid Post',
          content: 'Mid content',
          createdAt: '2024-06-01T00:00:00.000Z',
          authorId: 'user-001',
          authorName: 'Alice',
        },
      ]);

      renderHome();

      const titles = screen
        .getAllByRole('button')
        .filter((el) => el.querySelector('h3'))
        .map((el) => el.querySelector('h3').textContent);

      expect(titles[0]).toBe('New Post');
      expect(titles[1]).toBe('Mid Post');
      expect(titles[2]).toBe('Old Post');
    });
  });

  // --- Edit icon visibility based on role/ownership ---

  describe('edit icon visibility', () => {
    it('shows edit icon on posts owned by the current user', () => {
      getCurrentUser.mockReturnValue({
        userId: 'user-001',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      });

      getPosts.mockReturnValue([
        {
          id: 'post-1',
          title: 'My Post',
          content: 'My content',
          createdAt: '2024-06-01T00:00:00.000Z',
          authorId: 'user-001',
          authorName: 'Alice',
        },
      ]);

      renderHome();

      expect(screen.getByLabelText('Edit post: My Post')).toBeInTheDocument();
    });

    it('does not show edit icon on posts not owned by the current user', () => {
      getCurrentUser.mockReturnValue({
        userId: 'user-001',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      });

      getPosts.mockReturnValue([
        {
          id: 'post-2',
          title: 'Other Post',
          content: 'Other content',
          createdAt: '2024-06-01T00:00:00.000Z',
          authorId: 'user-002',
          authorName: 'Bob',
        },
      ]);

      renderHome();

      expect(screen.queryByLabelText('Edit post: Other Post')).not.toBeInTheDocument();
    });

    it('shows edit icon on all posts when current user is admin', () => {
      getCurrentUser.mockReturnValue({
        userId: 'admin-001',
        username: 'admin',
        displayName: 'Administrator',
        role: 'admin',
      });
      isAdmin.mockReturnValue(true);

      getPosts.mockReturnValue([
        {
          id: 'post-1',
          title: 'Alice Post',
          content: 'Content',
          createdAt: '2024-06-01T00:00:00.000Z',
          authorId: 'user-001',
          authorName: 'Alice',
        },
        {
          id: 'post-2',
          title: 'Bob Post',
          content: 'Content',
          createdAt: '2024-06-02T00:00:00.000Z',
          authorId: 'user-002',
          authorName: 'Bob',
        },
      ]);

      renderHome();

      expect(screen.getByLabelText('Edit post: Alice Post')).toBeInTheDocument();
      expect(screen.getByLabelText('Edit post: Bob Post')).toBeInTheDocument();
    });

    it('navigates to edit page when edit icon is clicked', async () => {
      getCurrentUser.mockReturnValue({
        userId: 'user-001',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      });

      getPosts.mockReturnValue([
        {
          id: 'post-1',
          title: 'My Post',
          content: 'My content',
          createdAt: '2024-06-01T00:00:00.000Z',
          authorId: 'user-001',
          authorName: 'Alice',
        },
      ]);

      const user = userEvent.setup();

      renderHome();

      await user.click(screen.getByLabelText('Edit post: My Post'));
      expect(mockNavigate).toHaveBeenCalledWith('post-1', true);
    });
  });

  // --- Card click navigation ---

  describe('card click navigation', () => {
    it('navigates to read page when a blog card is clicked', async () => {
      getCurrentUser.mockReturnValue({
        userId: 'user-001',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      });

      getPosts.mockReturnValue([
        {
          id: 'post-1',
          title: 'Clickable Post',
          content: 'Some content here',
          createdAt: '2024-06-01T00:00:00.000Z',
          authorId: 'user-002',
          authorName: 'Bob',
        },
      ]);

      const user = userEvent.setup();

      renderHome();

      await user.click(screen.getByText('Clickable Post'));
      expect(mockNavigate).toHaveBeenCalledWith('post-1');
    });
  });
});