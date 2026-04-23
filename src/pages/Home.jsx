import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import BlogCard from '../components/BlogCard.jsx';
import { getCurrentUser } from '../utils/auth.js';
import { getPosts } from '../utils/storage.js';

function Home() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const allPosts = getPosts();
    const sorted = [...allPosts].sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB - dateA;
    });
    setPosts(sorted);
  }, []);

  const handleNavigate = (postId, isEdit) => {
    if (isEdit) {
      navigate(`/write/${postId}`);
    } else {
      navigate(`/read/${postId}`);
    }
  };

  const handleWriteNew = () => {
    navigate('/write');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
            <p className="mt-1 text-sm text-gray-500">
              Browse the latest posts from the community
            </p>
          </div>
          <button
            type="button"
            onClick={handleWriteNew}
            className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <svg
              className="h-5 w-5 mr-2"
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
        </div>

        {posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-lg shadow-md">
            <svg
              className="h-16 w-16 text-gray-300 mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No posts yet
            </h2>
            <p className="text-sm text-gray-500 mb-6 text-center max-w-md">
              Be the first to share your thoughts with the community. Click the button below to create your first blog post.
            </p>
            <button
              type="button"
              onClick={handleWriteNew}
              className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Write Your First Post
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard
                key={post.id}
                post={post}
                currentUser={currentUser}
                onNavigate={handleNavigate}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;