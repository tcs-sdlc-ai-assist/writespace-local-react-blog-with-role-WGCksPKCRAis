import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import UserRow from '../components/UserRow.jsx';
import { getCurrentUser } from '../utils/auth.js';
import { getUsers, saveUsers } from '../utils/storage.js';

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
 * Hard-coded admin user object for display purposes.
 */
const ADMIN_USER = {
  id: 'admin-001',
  displayName: 'Administrator',
  username: 'admin',
  role: 'admin',
  createdAt: '2024-01-01T00:00:00.000Z',
};

function UserManagement() {
  const currentUser = getCurrentUser();
  const [users, setUsers] = useState([]);
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const storedUsers = getUsers();
    setUsers(storedUsers);
  };

  /**
   * All users to display, including the hard-coded admin.
   * @returns {Array} Combined array of admin + registered users.
   */
  const getAllDisplayUsers = () => {
    return [ADMIN_USER, ...users];
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const trimmedDisplayName = displayName.trim();
    const trimmedUsername = username.trim().toLowerCase();

    if (!trimmedDisplayName || !trimmedUsername || !password) {
      setError('All fields are required.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (trimmedUsername === 'admin') {
      setError('Username is already taken.');
      return;
    }

    const existingUsers = getUsers();
    const exists = existingUsers.some(
      (u) => u.username.toLowerCase() === trimmedUsername
    );

    if (exists) {
      setError('Username is already taken.');
      return;
    }

    const newUser = {
      id: generateId(),
      displayName: trimmedDisplayName,
      username: trimmedUsername,
      password: password,
      role: role,
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...existingUsers, newUser];
    saveUsers(updatedUsers);
    setUsers(updatedUsers);

    setDisplayName('');
    setUsername('');
    setPassword('');
    setRole('user');
    setSuccess(`User "${newUser.displayName}" created successfully.`);
  };

  const handleDeleteUser = (userId) => {
    if (userId === 'admin-001') {
      return;
    }

    if (currentUser && currentUser.userId === userId) {
      return;
    }

    const userToDelete = users.find((u) => u.id === userId);
    if (!userToDelete) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete user "${userToDelete.displayName}"?`
    );

    if (!confirmed) {
      return;
    }

    const updatedUsers = users.filter((u) => u.id !== userId);
    saveUsers(updatedUsers);
    setUsers(updatedUsers);
    setSuccess(`User "${userToDelete.displayName}" has been deleted.`);
    setError('');
  };

  const allDisplayUsers = getAllDisplayUsers();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="mt-2 text-sm text-gray-600">
            Create new users and manage existing accounts.
          </p>
        </div>

        {/* Create User Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Create New User
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-md bg-green-50 border border-green-200">
              <p className="text-sm text-green-600">{success}</p>
            </div>
          )}

          <form onSubmit={handleCreateUser} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="create-displayName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Display Name
                </label>
                <input
                  id="create-displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Full name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="create-username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <input
                  id="create-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="create-password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="create-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="create-role"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Role
                </label>
                <select
                  id="create-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Create User
              </button>
            </div>
          </form>
        </div>

        {/* Users List */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            All Users ({allDisplayUsers.length})
          </h2>

          {allDisplayUsers.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">No users found.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {allDisplayUsers.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  currentUser={currentUser}
                  onDelete={handleDeleteUser}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default UserManagement;