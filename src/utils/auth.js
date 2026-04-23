/**
 * Authentication and session utility module for WriteSpace.
 *
 * Exports:
 *   login(username, password) — Authenticates against hard-coded admin or localStorage users.
 *   logout() — Clears the current session.
 *   registerUser({ displayName, username, password }) — Registers a new user with role 'user'.
 *   isAuthenticated() — Returns true if a valid session exists.
 *   getCurrentUser() — Returns the current session object or null.
 *   isAdmin() — Returns true if the current session user has role 'admin'.
 *
 * All data access is delegated to storage.js.
 * Passwords are stored in plain text (MVP trade-off — not for production use).
 */

import { getUsers, saveUsers, getSession, saveSession, clearSession } from './storage.js';

/**
 * Hard-coded admin credentials.
 * The admin account always exists in-memory and cannot be deleted.
 */
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';
const ADMIN_USER = {
  userId: 'admin-001',
  username: ADMIN_USERNAME,
  displayName: 'Administrator',
  role: 'admin',
};

/**
 * Generate a simple UUID v4-like string.
 * @returns {string} A unique identifier string.
 */
function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Authenticate a user by username and password.
 * Checks the hard-coded admin account first, then registered users in localStorage.
 *
 * @param {string} username - The username to authenticate.
 * @param {string} password - The password to verify.
 * @returns {{ success: boolean, error?: string, session?: { userId: string, username: string, displayName: string, role: string } }}
 */
export function login(username, password) {
  if (!username || !password) {
    return { success: false, error: 'Username and password are required.' };
  }

  const trimmedUsername = username.trim().toLowerCase();

  // Check hard-coded admin credentials
  if (trimmedUsername === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const session = { ...ADMIN_USER };
    saveSession(session);
    return { success: true, session };
  }

  // Check registered users in localStorage
  const users = getUsers();
  const user = users.find(
    (u) => u.username.toLowerCase() === trimmedUsername && u.password === password
  );

  if (user) {
    const session = {
      userId: user.id,
      username: user.username,
      displayName: user.displayName,
      role: user.role,
    };
    saveSession(session);
    return { success: true, session };
  }

  return { success: false, error: 'Invalid username or password.' };
}

/**
 * Log out the current user by clearing the session from localStorage.
 */
export function logout() {
  clearSession();
}

/**
 * Register a new user account.
 * Validates that the username is unique (case-insensitive) and not the admin username.
 * On success, saves the user to localStorage and creates a session.
 *
 * @param {{ displayName: string, username: string, password: string }} userData
 * @returns {{ success: boolean, error?: string, session?: { userId: string, username: string, displayName: string, role: string } }}
 */
export function registerUser({ displayName, username, password }) {
  if (!displayName || !username || !password) {
    return { success: false, error: 'All fields are required.' };
  }

  const trimmedUsername = username.trim().toLowerCase();
  const trimmedDisplayName = displayName.trim();

  if (!trimmedUsername) {
    return { success: false, error: 'Username cannot be empty.' };
  }

  if (!trimmedDisplayName) {
    return { success: false, error: 'Display name cannot be empty.' };
  }

  // Check against hard-coded admin username
  if (trimmedUsername === ADMIN_USERNAME) {
    return { success: false, error: 'Username is already taken.' };
  }

  // Check against existing registered users
  const users = getUsers();
  const exists = users.some((u) => u.username.toLowerCase() === trimmedUsername);

  if (exists) {
    return { success: false, error: 'Username is already taken.' };
  }

  const newUser = {
    id: generateId(),
    displayName: trimmedDisplayName,
    username: trimmedUsername,
    password: password, // Plain text — MVP trade-off
    role: 'user',
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  const session = {
    userId: newUser.id,
    username: newUser.username,
    displayName: newUser.displayName,
    role: newUser.role,
  };
  saveSession(session);

  return { success: true, session };
}

/**
 * Check whether a user is currently authenticated.
 * @returns {boolean} True if a valid session exists in localStorage.
 */
export function isAuthenticated() {
  const session = getSession();
  return session !== null;
}

/**
 * Get the current authenticated user's session data.
 * @returns {{ userId: string, username: string, displayName: string, role: string } | null}
 */
export function getCurrentUser() {
  return getSession();
}

/**
 * Check whether the current authenticated user has the admin role.
 * @returns {boolean} True if the current session user's role is 'admin'.
 */
export function isAdmin() {
  const session = getSession();
  return session !== null && session.role === 'admin';
}