import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { StatCard } from '../components/StatCard.jsx';
import { getAvatar } from '../components/Avatar.jsx';
import { getCurrentUser } from '../utils/auth.js';
import { getPosts, savePosts, getUsers } from '../utils/storage.js';

/**
 * Formats an ISO date string into a human-readable format.
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
function formatDate(dateString) {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

/**
 * Truncates content to a specified maximum length, appending ellipsis if needed.
 * @param {string} content - The full content string
 * @param {number} maxLength - Maximum character length before truncation
 * @returns {string} The truncated string
 */
function truncateContent(content, maxLength = 100) {
  if (!content) return '';
  if (content.length <= maxLength) return content;
  return content.slice(0, maxLength).trimEnd() + '…';
}

function AdminDashboard() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    setPosts(getPosts());
    setUsers(getUsers());
  }, []);

  const totalPosts = posts.length;
  const totalUsers = users.length;
  const totalAdmins = users.filter((u) => u.role === 'admin').length;
  const totalAuthors = users.filter((u) => u.role === 'user').length;

  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const handleWriteNew = () => {
    navigate('/write');
  };

  const handleManageUsers = () => {
    navigate('/admin/users');
  };

  const handleEditPost = (postId) => {
    navigate(`/write/${postId}`);
  };

  const handleDeletePost = (postId) => {
    if (deleteConfirmId === postId) {
      const updatedPosts = posts.filter((p) => p.id !== postId);
      savePosts(updatedPosts);
      setPosts(updatedPosts);
      setDeleteConfirmId(null);
    } else {
      setDeleteConfirmId(postId);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmId(null);
  };

  const handleViewPost = (postId) => {
    navigate(`/read/${postId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            {currentUser && getAvatar(currentUser.role)}
            <div>
              <h1 className="text-3xl font-bold text-white">
                Admin Dashboard
              </h1>
              <p className="text-indigo-100 mt-1 text-sm">
                Welcome back, {currentUser ? currentUser.displayName : 'Administrator'}. Here&apos;s your platform overview.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Posts"
            value={totalPosts}
            icon="📝"
            bgColor="bg-white"
          />
          <StatCard
            title="Total Users"
            value={totalUsers}
            icon="👥"
            bgColor="bg-white"
          />
          <StatCard
            title="Total Admins"
            value={totalAdmins}
            icon="👑"
            bgColor="bg-white"
          />
          <StatCard
            title="Total Authors"
            value={totalAuthors}
            icon="📖"
            bgColor="bg-white"
          />
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
          <button
            type="button"
            onClick={handleWriteNew}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Write New Post
          </button>
          <button
            type="button"
            onClick={handleManageUsers}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-indigo-600 bg-white border border-indigo-600 rounded-md hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Manage Users
          </button>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Posts
          </h2>

          {recentPosts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500 text-sm">
                No posts yet. Click &quot;Write New Post&quot; to create your first blog post.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-lg shadow-md p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:shadow-lg transition-shadow"
                >
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => handleViewPost(post.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleViewPost(post.id);
                      }
                    }}
                    className="flex-1 cursor-pointer min-w-0"
                  >
                    <h3 className="text-base font-semibold text-gray-900 line-clamp-1">
                      {post.title}
                    </h3>
                    {post.content && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                        {truncateContent(post.content)}
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-gray-400">
                        by {post.authorName || 'Unknown'}
                      </span>
                      {post.createdAt && (
                        <span className="text-xs text-gray-400">
                          {formatDate(post.createdAt)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEditPost(post.id)}
                      className="px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-md hover:bg-indigo-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      aria-label={`Edit post: ${post.title}`}
                    >
                      Edit
                    </button>
                    {deleteConfirmId === post.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleDeletePost(post.id)}
                          className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          aria-label={`Confirm delete post: ${post.title}`}
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelDelete}
                          className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                          aria-label="Cancel delete"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleDeletePost(post.id)}
                        className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        aria-label={`Delete post: ${post.title}`}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;