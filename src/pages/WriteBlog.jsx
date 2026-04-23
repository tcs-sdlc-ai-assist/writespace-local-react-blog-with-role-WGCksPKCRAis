import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { getCurrentUser } from '../utils/auth.js';
import { getPosts, savePosts } from '../utils/storage.js';

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

function WriteBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const isEditMode = Boolean(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);

  const TITLE_MAX_LENGTH = 200;
  const CONTENT_MAX_LENGTH = 10000;

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const posts = getPosts();
    const existingPost = posts.find((p) => p.id === id);

    if (!existingPost) {
      setError('Post not found.');
      setInitialLoading(false);
      return;
    }

    const canEdit =
      currentUser &&
      (currentUser.role === 'admin' || currentUser.userId === existingPost.authorId);

    if (!canEdit) {
      navigate('/blogs', { replace: true });
      return;
    }

    setTitle(existingPost.title || '');
    setContent(existingPost.content || '');
    setInitialLoading(false);
  }, [id, isEditMode, currentUser, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle) {
      setError('Title is required.');
      return;
    }

    if (trimmedTitle.length > TITLE_MAX_LENGTH) {
      setError(`Title must be ${TITLE_MAX_LENGTH} characters or fewer.`);
      return;
    }

    if (!trimmedContent) {
      setError('Content is required.');
      return;
    }

    if (trimmedContent.length > CONTENT_MAX_LENGTH) {
      setError(`Content must be ${CONTENT_MAX_LENGTH} characters or fewer.`);
      return;
    }

    setLoading(true);

    try {
      const posts = getPosts();

      if (isEditMode) {
        const postIndex = posts.findIndex((p) => p.id === id);

        if (postIndex === -1) {
          setError('Post not found. It may have been deleted.');
          setLoading(false);
          return;
        }

        const existingPost = posts[postIndex];

        const canEdit =
          currentUser &&
          (currentUser.role === 'admin' || currentUser.userId === existingPost.authorId);

        if (!canEdit) {
          setError('You do not have permission to edit this post.');
          setLoading(false);
          return;
        }

        posts[postIndex] = {
          ...existingPost,
          title: trimmedTitle,
          content: trimmedContent,
          updatedAt: new Date().toISOString(),
        };

        savePosts(posts);
        navigate(`/blog/${id}`, { replace: true });
      } else {
        const newPost = {
          id: generateId(),
          title: trimmedTitle,
          content: trimmedContent,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          authorId: currentUser ? currentUser.userId : '',
          authorName: currentUser ? currentUser.displayName : 'Unknown',
        };

        posts.push(newPost);
        savePosts(posts);
        navigate(`/blog/${newPost.id}`, { replace: true });
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (isEditMode && id) {
      navigate(`/blog/${id}`);
    } else {
      navigate('/blogs');
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-center text-gray-500">Loading…</p>
        </div>
      </div>
    );
  }

  if (isEditMode && error === 'Post not found.') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Post Not Found</h2>
            <p className="text-sm text-gray-500 mb-6">
              The post you are trying to edit does not exist or has been deleted.
            </p>
            <button
              type="button"
              onClick={() => navigate('/blogs')}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Back to Blogs
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {isEditMode ? 'Edit Post' : 'Create New Post'}
          </h1>

          {error && error !== 'Post not found.' && (
            <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title
                </label>
                <span
                  className={`text-xs ${
                    title.length > TITLE_MAX_LENGTH ? 'text-red-500' : 'text-gray-400'
                  }`}
                >
                  {title.length}/{TITLE_MAX_LENGTH}
                </span>
              </div>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your post title"
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700"
                >
                  Content
                </label>
                <span
                  className={`text-xs ${
                    content.length > CONTENT_MAX_LENGTH ? 'text-red-500' : 'text-gray-400'
                  }`}
                >
                  {content.length}/{CONTENT_MAX_LENGTH}
                </span>
              </div>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your blog post content here…"
                rows={12}
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-y"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 text-sm font-medium text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  loading
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                {loading
                  ? isEditMode
                    ? 'Updating…'
                    : 'Publishing…'
                  : isEditMode
                    ? 'Update Post'
                    : 'Publish Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default WriteBlog;