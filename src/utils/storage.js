/**
 * localStorage utility module for WriteSpace.
 * Provides CRUD operations for posts, users, and session data.
 *
 * Keys:
 *   writespace_posts   — Array of Post objects
 *   writespace_users   — Array of User objects
 *   writespace_session — Session object or null
 *
 * All functions gracefully handle localStorage unavailability or corrupted data.
 */

const KEYS = {
  POSTS: 'writespace_posts',
  USERS: 'writespace_users',
  SESSION: 'writespace_session',
};

/**
 * Safely read and parse a JSON value from localStorage.
 * @param {string} key - The localStorage key to read.
 * @param {*} fallback - The fallback value if read/parse fails.
 * @returns {*} The parsed value or the fallback.
 */
function safeGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === undefined) {
      return fallback;
    }
    const parsed = JSON.parse(raw);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch (error) {
    console.warn(`[WriteSpace] Failed to read "${key}" from localStorage:`, error);
    return fallback;
  }
}

/**
 * Safely write a JSON value to localStorage.
 * @param {string} key - The localStorage key to write.
 * @param {*} value - The value to serialize and store.
 * @returns {boolean} True if write succeeded, false otherwise.
 */
function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`[WriteSpace] Failed to write "${key}" to localStorage:`, error);
    return false;
  }
}

/**
 * Safely remove a key from localStorage.
 * @param {string} key - The localStorage key to remove.
 * @returns {boolean} True if removal succeeded, false otherwise.
 */
function safeRemove(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`[WriteSpace] Failed to remove "${key}" from localStorage:`, error);
    return false;
  }
}

// --- Posts ---

/**
 * Retrieve all blog posts from localStorage.
 * @returns {Array<{id: string, title: string, content: string, createdAt: string, authorId: string, authorName: string}>}
 */
export function getPosts() {
  const posts = safeGet(KEYS.POSTS, []);
  return Array.isArray(posts) ? posts : [];
}

/**
 * Save the full array of blog posts to localStorage.
 * @param {Array<{id: string, title: string, content: string, createdAt: string, authorId: string, authorName: string}>} posts
 */
export function savePosts(posts) {
  const data = Array.isArray(posts) ? posts : [];
  safeSet(KEYS.POSTS, data);
}

// --- Users ---

/**
 * Retrieve all registered users from localStorage.
 * @returns {Array<{id: string, displayName: string, username: string, password: string, role: string, createdAt: string}>}
 */
export function getUsers() {
  const users = safeGet(KEYS.USERS, []);
  return Array.isArray(users) ? users : [];
}

/**
 * Save the full array of users to localStorage.
 * @param {Array<{id: string, displayName: string, username: string, password: string, role: string, createdAt: string}>} users
 */
export function saveUsers(users) {
  const data = Array.isArray(users) ? users : [];
  safeSet(KEYS.USERS, data);
}

// --- Session ---

/**
 * Retrieve the current session from localStorage.
 * @returns {{userId: string, username: string, displayName: string, role: string} | null}
 */
export function getSession() {
  const session = safeGet(KEYS.SESSION, null);
  if (session && typeof session === 'object' && session.userId) {
    return session;
  }
  return null;
}

/**
 * Save a session object to localStorage.
 * @param {{userId: string, username: string, displayName: string, role: string}} session
 */
export function saveSession(session) {
  if (session && typeof session === 'object') {
    safeSet(KEYS.SESSION, session);
  }
}

/**
 * Clear the current session from localStorage.
 */
export function clearSession() {
  safeRemove(KEYS.SESSION);
}