import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { getAvatar } from '../components/Avatar.jsx';
import { getCurrentUser } from '../utils/auth.js';
import { getPosts, savePosts } from '../utils/storage.js';

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
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

function ReadBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const currentUser = getCurrentUser();

  useEffect(() => {
    const posts = getPosts();
    const found = posts.find((p) => p.id === id);
    if (found) {
      setPost(found);
      setNotFound(false);
    } else {
      setPost(null);
      setNotFound(true);
    }
  }, [id]);

  const canEditOrDelete =
    currentUser &&
    post &&
    (currentUser.role === 'admin' || currentUser.userId === post.authorId);

  const handleEdit = () => {
    navigate(`/edit/${post.id}`);
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this post? This action cannot be undone.'
    );
    if (!confirmed) return;

    const posts = getPosts();
    const updated = posts.filter((p) => p.id !== post.id);
    savePosts(updated);
    navigate('/blogs', { replace: true });
  };

  const authorRole =
    currentUser && post && currentUser.userId === post.authorId
      ? currentUser.role
      : 'user';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {notFound && (
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Post not found
            </h2>
            <p className="text-gray-500 mb-6">
              The blog post you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <button
              type="button"
              onClick={() => navigate('/blogs')}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Back to Blogs
            </button>
          </div>
        )}

        {post && (
          <article className="bg-white rounded-lg shadow-md p-6 sm:p-8">
            <header className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {post.title}
              </h1>

              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  {getAvatar(authorRole)}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">
                      {post.authorName || 'Unknown'}
                    </span>
                    {post.createdAt && (
                      <span className="text-xs text-gray-400">
                        {formatDate(post.createdAt)}
                      </span>
                    )}
                  </div>
                </div>

                {canEditOrDelete && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-300 rounded-md hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </header>

            <div className="border-t border-gray-100 pt-6">
              <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </div>
            </div>

            <footer className="mt-8 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate('/blogs')}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-md px-2 py-1"
              >
                ← Back to Blogs
              </button>
            </footer>
          </article>
        )}
      </main>
    </div>
  );
}

export default ReadBlog;