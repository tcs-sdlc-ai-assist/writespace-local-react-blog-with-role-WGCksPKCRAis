import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getPosts,
  savePosts,
  getUsers,
  saveUsers,
  getSession,
  saveSession,
  clearSession,
} from './storage';

describe('storage utility', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  // --- getPosts ---

  describe('getPosts', () => {
    it('returns an empty array when no posts exist in localStorage', () => {
      const result = getPosts();
      expect(result).toEqual([]);
    });

    it('returns stored posts when valid data exists', () => {
      const posts = [
        {
          id: '1',
          title: 'Test Post',
          content: 'Hello world',
          createdAt: '2024-01-01T00:00:00.000Z',
          authorId: 'u1',
          authorName: 'Alice',
        },
      ];
      localStorage.setItem('writespace_posts', JSON.stringify(posts));

      const result = getPosts();
      expect(result).toEqual(posts);
    });

    it('returns an empty array when localStorage contains corrupted JSON', () => {
      localStorage.setItem('writespace_posts', '{not valid json!!!');
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const result = getPosts();
      expect(result).toEqual([]);
      expect(warnSpy).toHaveBeenCalled();
    });

    it('returns an empty array when localStorage contains a non-array value', () => {
      localStorage.setItem('writespace_posts', JSON.stringify('not an array'));

      const result = getPosts();
      expect(result).toEqual([]);
    });

    it('returns an empty array when localStorage contains null', () => {
      localStorage.setItem('writespace_posts', JSON.stringify(null));

      const result = getPosts();
      expect(result).toEqual([]);
    });
  });

  // --- savePosts ---

  describe('savePosts', () => {
    it('saves an array of posts to localStorage', () => {
      const posts = [
        {
          id: '2',
          title: 'Another Post',
          content: 'Content here',
          createdAt: '2024-02-01T00:00:00.000Z',
          authorId: 'u2',
          authorName: 'Bob',
        },
      ];
      savePosts(posts);

      const stored = JSON.parse(localStorage.getItem('writespace_posts'));
      expect(stored).toEqual(posts);
    });

    it('saves an empty array when given a non-array value', () => {
      savePosts('invalid');

      const stored = JSON.parse(localStorage.getItem('writespace_posts'));
      expect(stored).toEqual([]);
    });

    it('saves an empty array when given null', () => {
      savePosts(null);

      const stored = JSON.parse(localStorage.getItem('writespace_posts'));
      expect(stored).toEqual([]);
    });
  });

  // --- getUsers ---

  describe('getUsers', () => {
    it('returns an empty array when no users exist in localStorage', () => {
      const result = getUsers();
      expect(result).toEqual([]);
    });

    it('returns stored users when valid data exists', () => {
      const users = [
        {
          id: 'u1',
          displayName: 'Alice',
          username: 'alice',
          password: 'hashed',
          role: 'admin',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(users));

      const result = getUsers();
      expect(result).toEqual(users);
    });

    it('returns an empty array when localStorage contains corrupted JSON', () => {
      localStorage.setItem('writespace_users', '%%%corrupted%%%');
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const result = getUsers();
      expect(result).toEqual([]);
      expect(warnSpy).toHaveBeenCalled();
    });

    it('returns an empty array when localStorage contains a non-array value', () => {
      localStorage.setItem('writespace_users', JSON.stringify({ not: 'array' }));

      const result = getUsers();
      expect(result).toEqual([]);
    });
  });

  // --- saveUsers ---

  describe('saveUsers', () => {
    it('saves an array of users to localStorage', () => {
      const users = [
        {
          id: 'u1',
          displayName: 'Alice',
          username: 'alice',
          password: 'hashed',
          role: 'admin',
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];
      saveUsers(users);

      const stored = JSON.parse(localStorage.getItem('writespace_users'));
      expect(stored).toEqual(users);
    });

    it('saves an empty array when given undefined', () => {
      saveUsers(undefined);

      const stored = JSON.parse(localStorage.getItem('writespace_users'));
      expect(stored).toEqual([]);
    });
  });

  // --- getSession ---

  describe('getSession', () => {
    it('returns null when no session exists in localStorage', () => {
      const result = getSession();
      expect(result).toBeNull();
    });

    it('returns the session object when valid data exists', () => {
      const session = {
        userId: 'u1',
        username: 'alice',
        displayName: 'Alice',
        role: 'admin',
      };
      localStorage.setItem('writespace_session', JSON.stringify(session));

      const result = getSession();
      expect(result).toEqual(session);
    });

    it('returns null when session data is corrupted JSON', () => {
      localStorage.setItem('writespace_session', 'not-json');
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const result = getSession();
      expect(result).toBeNull();
      expect(warnSpy).toHaveBeenCalled();
    });

    it('returns null when session object has no userId', () => {
      const session = { username: 'alice', role: 'admin' };
      localStorage.setItem('writespace_session', JSON.stringify(session));

      const result = getSession();
      expect(result).toBeNull();
    });

    it('returns null when session is a non-object value', () => {
      localStorage.setItem('writespace_session', JSON.stringify('just a string'));

      const result = getSession();
      expect(result).toBeNull();
    });

    it('returns null when session is null in localStorage', () => {
      localStorage.setItem('writespace_session', JSON.stringify(null));

      const result = getSession();
      expect(result).toBeNull();
    });
  });

  // --- saveSession ---

  describe('saveSession', () => {
    it('saves a valid session object to localStorage', () => {
      const session = {
        userId: 'u2',
        username: 'bob',
        displayName: 'Bob',
        role: 'user',
      };
      saveSession(session);

      const stored = JSON.parse(localStorage.getItem('writespace_session'));
      expect(stored).toEqual(session);
    });

    it('does not save when given null', () => {
      saveSession(null);

      const stored = localStorage.getItem('writespace_session');
      expect(stored).toBeNull();
    });

    it('does not save when given a non-object value', () => {
      saveSession('invalid');

      const stored = localStorage.getItem('writespace_session');
      expect(stored).toBeNull();
    });

    it('does not save when given undefined', () => {
      saveSession(undefined);

      const stored = localStorage.getItem('writespace_session');
      expect(stored).toBeNull();
    });
  });

  // --- clearSession ---

  describe('clearSession', () => {
    it('removes the session from localStorage', () => {
      const session = {
        userId: 'u1',
        username: 'alice',
        displayName: 'Alice',
        role: 'admin',
      };
      localStorage.setItem('writespace_session', JSON.stringify(session));

      clearSession();

      const stored = localStorage.getItem('writespace_session');
      expect(stored).toBeNull();
    });

    it('does not throw when no session exists', () => {
      expect(() => clearSession()).not.toThrow();
    });
  });

  // --- localStorage failure handling ---

  describe('graceful fallback on localStorage errors', () => {
    it('getPosts returns empty array when localStorage.getItem throws', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('Storage unavailable');
      });
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const result = getPosts();
      expect(result).toEqual([]);
      expect(warnSpy).toHaveBeenCalled();
    });

    it('savePosts handles localStorage.setItem throwing', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage full');
      });
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      expect(() => savePosts([{ id: '1' }])).not.toThrow();
      expect(warnSpy).toHaveBeenCalled();
    });

    it('getSession returns null when localStorage.getItem throws', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('Storage unavailable');
      });
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const result = getSession();
      expect(result).toBeNull();
      expect(warnSpy).toHaveBeenCalled();
    });

    it('clearSession handles localStorage.removeItem throwing', () => {
      vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('Storage unavailable');
      });
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      expect(() => clearSession()).not.toThrow();
      expect(warnSpy).toHaveBeenCalled();
    });
  });
});