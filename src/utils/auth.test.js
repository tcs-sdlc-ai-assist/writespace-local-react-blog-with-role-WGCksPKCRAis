import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('./storage.js', () => ({
  getUsers: vi.fn(),
  saveUsers: vi.fn(),
  getSession: vi.fn(),
  saveSession: vi.fn(),
  clearSession: vi.fn(),
}));

import {
  login,
  logout,
  registerUser,
  isAuthenticated,
  getCurrentUser,
  isAdmin,
} from './auth';

import {
  getUsers,
  saveUsers,
  getSession,
  saveSession,
  clearSession,
} from './storage.js';

describe('auth utility', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    getUsers.mockReturnValue([]);
    getSession.mockReturnValue(null);
  });

  // --- login ---

  describe('login', () => {
    it('returns error when username is empty', () => {
      const result = login('', 'password');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Username and password are required.');
    });

    it('returns error when password is empty', () => {
      const result = login('admin', '');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Username and password are required.');
    });

    it('returns error when both username and password are empty', () => {
      const result = login('', '');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Username and password are required.');
    });

    it('returns error when username is null', () => {
      const result = login(null, 'password');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Username and password are required.');
    });

    it('returns error when password is null', () => {
      const result = login('admin', null);
      expect(result.success).toBe(false);
      expect(result.error).toBe('Username and password are required.');
    });

    it('authenticates the hard-coded admin with correct credentials', () => {
      const result = login('admin', 'admin123');
      expect(result.success).toBe(true);
      expect(result.session).toEqual({
        userId: 'admin-001',
        username: 'admin',
        displayName: 'Administrator',
        role: 'admin',
      });
      expect(saveSession).toHaveBeenCalledWith(result.session);
    });

    it('authenticates admin with case-insensitive username', () => {
      const result = login('Admin', 'admin123');
      expect(result.success).toBe(true);
      expect(result.session.username).toBe('admin');
    });

    it('authenticates admin with leading/trailing whitespace in username', () => {
      const result = login('  admin  ', 'admin123');
      expect(result.success).toBe(true);
      expect(result.session.username).toBe('admin');
    });

    it('rejects admin with wrong password', () => {
      const result = login('admin', 'wrongpassword');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid username or password.');
    });

    it('authenticates a registered localStorage user with correct credentials', () => {
      const users = [
        {
          id: 'user-001',
          displayName: 'Alice',
          username: 'alice',
          password: 'alice123',
          role: 'user',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      getUsers.mockReturnValue(users);

      const result = login('alice', 'alice123');
      expect(result.success).toBe(true);
      expect(result.session).toEqual({
        userId: 'user-001',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      });
      expect(saveSession).toHaveBeenCalledWith(result.session);
    });

    it('authenticates a registered user with case-insensitive username', () => {
      const users = [
        {
          id: 'user-001',
          displayName: 'Alice',
          username: 'alice',
          password: 'alice123',
          role: 'user',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      getUsers.mockReturnValue(users);

      const result = login('ALICE', 'alice123');
      expect(result.success).toBe(true);
      expect(result.session.userId).toBe('user-001');
    });

    it('rejects a registered user with wrong password', () => {
      const users = [
        {
          id: 'user-001',
          displayName: 'Alice',
          username: 'alice',
          password: 'alice123',
          role: 'user',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      getUsers.mockReturnValue(users);

      const result = login('alice', 'wrongpassword');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid username or password.');
    });

    it('rejects a non-existent user', () => {
      getUsers.mockReturnValue([]);

      const result = login('nonexistent', 'password');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid username or password.');
    });

    it('checks admin credentials before localStorage users', () => {
      const users = [
        {
          id: 'user-fake-admin',
          displayName: 'Fake Admin',
          username: 'admin',
          password: 'admin123',
          role: 'user',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      getUsers.mockReturnValue(users);

      const result = login('admin', 'admin123');
      expect(result.success).toBe(true);
      expect(result.session.userId).toBe('admin-001');
      expect(result.session.role).toBe('admin');
    });
  });

  // --- logout ---

  describe('logout', () => {
    it('calls clearSession to remove the session', () => {
      logout();
      expect(clearSession).toHaveBeenCalledTimes(1);
    });
  });

  // --- registerUser ---

  describe('registerUser', () => {
    it('registers a new user successfully', () => {
      getUsers.mockReturnValue([]);

      const result = registerUser({
        displayName: 'Bob',
        username: 'bob',
        password: 'bob123',
      });

      expect(result.success).toBe(true);
      expect(result.session).toBeDefined();
      expect(result.session.username).toBe('bob');
      expect(result.session.displayName).toBe('Bob');
      expect(result.session.role).toBe('user');
      expect(result.session.userId).toBeDefined();
      expect(saveUsers).toHaveBeenCalledTimes(1);
      expect(saveSession).toHaveBeenCalledWith(result.session);
    });

    it('saves the new user to the users array', () => {
      getUsers.mockReturnValue([]);

      registerUser({
        displayName: 'Bob',
        username: 'bob',
        password: 'bob123',
      });

      expect(saveUsers).toHaveBeenCalledTimes(1);
      const savedUsers = saveUsers.mock.calls[0][0];
      expect(savedUsers).toHaveLength(1);
      expect(savedUsers[0].username).toBe('bob');
      expect(savedUsers[0].displayName).toBe('Bob');
      expect(savedUsers[0].password).toBe('bob123');
      expect(savedUsers[0].role).toBe('user');
      expect(savedUsers[0].id).toBeDefined();
      expect(savedUsers[0].createdAt).toBeDefined();
    });

    it('returns error when displayName is empty', () => {
      const result = registerUser({
        displayName: '',
        username: 'bob',
        password: 'bob123',
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe('All fields are required.');
    });

    it('returns error when username is empty', () => {
      const result = registerUser({
        displayName: 'Bob',
        username: '',
        password: 'bob123',
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe('All fields are required.');
    });

    it('returns error when password is empty', () => {
      const result = registerUser({
        displayName: 'Bob',
        username: 'bob',
        password: '',
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe('All fields are required.');
    });

    it('returns error when displayName is null', () => {
      const result = registerUser({
        displayName: null,
        username: 'bob',
        password: 'bob123',
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe('All fields are required.');
    });

    it('returns error when username is only whitespace', () => {
      const result = registerUser({
        displayName: 'Bob',
        username: '   ',
        password: 'bob123',
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Username cannot be empty.');
    });

    it('returns error when displayName is only whitespace', () => {
      const result = registerUser({
        displayName: '   ',
        username: 'bob',
        password: 'bob123',
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Display name cannot be empty.');
    });

    it('rejects registration with the admin username', () => {
      const result = registerUser({
        displayName: 'Fake Admin',
        username: 'admin',
        password: 'password',
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Username is already taken.');
    });

    it('rejects registration with the admin username case-insensitively', () => {
      const result = registerUser({
        displayName: 'Fake Admin',
        username: 'ADMIN',
        password: 'password',
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Username is already taken.');
    });

    it('rejects registration with an existing username', () => {
      const users = [
        {
          id: 'user-001',
          displayName: 'Alice',
          username: 'alice',
          password: 'alice123',
          role: 'user',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      getUsers.mockReturnValue(users);

      const result = registerUser({
        displayName: 'Alice Clone',
        username: 'alice',
        password: 'newpassword',
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Username is already taken.');
    });

    it('rejects registration with an existing username case-insensitively', () => {
      const users = [
        {
          id: 'user-001',
          displayName: 'Alice',
          username: 'alice',
          password: 'alice123',
          role: 'user',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      getUsers.mockReturnValue(users);

      const result = registerUser({
        displayName: 'Alice Clone',
        username: 'ALICE',
        password: 'newpassword',
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe('Username is already taken.');
    });

    it('trims username and stores it in lowercase', () => {
      getUsers.mockReturnValue([]);

      const result = registerUser({
        displayName: 'Bob',
        username: '  Bob  ',
        password: 'bob123',
      });

      expect(result.success).toBe(true);
      expect(result.session.username).toBe('bob');

      const savedUsers = saveUsers.mock.calls[0][0];
      expect(savedUsers[0].username).toBe('bob');
    });

    it('trims displayName', () => {
      getUsers.mockReturnValue([]);

      const result = registerUser({
        displayName: '  Bob Smith  ',
        username: 'bob',
        password: 'bob123',
      });

      expect(result.success).toBe(true);
      expect(result.session.displayName).toBe('Bob Smith');
    });

    it('appends new user to existing users array', () => {
      const existingUsers = [
        {
          id: 'user-001',
          displayName: 'Alice',
          username: 'alice',
          password: 'alice123',
          role: 'user',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      getUsers.mockReturnValue(existingUsers);

      registerUser({
        displayName: 'Bob',
        username: 'bob',
        password: 'bob123',
      });

      const savedUsers = saveUsers.mock.calls[0][0];
      expect(savedUsers).toHaveLength(2);
      expect(savedUsers[0].username).toBe('alice');
      expect(savedUsers[1].username).toBe('bob');
    });
  });

  // --- isAuthenticated ---

  describe('isAuthenticated', () => {
    it('returns true when a valid session exists', () => {
      getSession.mockReturnValue({
        userId: 'user-001',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      });

      expect(isAuthenticated()).toBe(true);
    });

    it('returns false when no session exists', () => {
      getSession.mockReturnValue(null);

      expect(isAuthenticated()).toBe(false);
    });
  });

  // --- getCurrentUser ---

  describe('getCurrentUser', () => {
    it('returns the session object when a session exists', () => {
      const session = {
        userId: 'user-001',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      };
      getSession.mockReturnValue(session);

      expect(getCurrentUser()).toEqual(session);
    });

    it('returns null when no session exists', () => {
      getSession.mockReturnValue(null);

      expect(getCurrentUser()).toBeNull();
    });
  });

  // --- isAdmin ---

  describe('isAdmin', () => {
    it('returns true when the current user has admin role', () => {
      getSession.mockReturnValue({
        userId: 'admin-001',
        username: 'admin',
        displayName: 'Administrator',
        role: 'admin',
      });

      expect(isAdmin()).toBe(true);
    });

    it('returns false when the current user has user role', () => {
      getSession.mockReturnValue({
        userId: 'user-001',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      });

      expect(isAdmin()).toBe(false);
    });

    it('returns false when no session exists', () => {
      getSession.mockReturnValue(null);

      expect(isAdmin()).toBe(false);
    });
  });
});