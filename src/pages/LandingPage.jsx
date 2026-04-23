import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, getCurrentUser } from '../utils/auth.js';
import { getPosts } from '../utils/storage.js';
import PublicNavbar from '../components/PublicNavbar.jsx';
import Navbar from '../components/Navbar.jsx';
import BlogCard from '../components/BlogCard.jsx';

function LandingPage() {
  const navigate = useNavigate();
  const [latestPosts, setLatestPosts] = useState([]);
  const authenticated = isAuthenticated();
  const currentUser = authenticated ? getCurrentUser() : null;

  useEffect(() => {
    const posts = getPosts();
    const sorted = [...posts].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setLatestPosts(sorted.slice(0, 3));
  }, []);

  const handleCtaClick = () => {
    if (authenticated && currentUser) {
      if (currentUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/blogs');
      }
    } else {
      navigate('/register');
    }
  };

  const handlePostNavigate = (id) => {
    navigate(`/blogs/${id}`);
  };

  const features = [
    {
      title: 'Distraction-Free Writing',
      description:
        'Focus on what matters most — your words. Our clean editor removes all distractions so you can write freely.',
      icon: (
        <svg
          className="h-8 w-8 text-indigo-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      ),
    },
    {
      title: 'Instant Publishing',
      description:
        'Write and publish your blog posts instantly. No complicated setup, no waiting — just create and share.',
      icon: (
        <svg
          className="h-8 w-8 text-indigo-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      title: 'Role-Based Access',
      description:
        'Admins manage users and content. Authors focus on writing. Everyone gets the tools they need.',
      icon: (
        <svg
          className="h-8 w-8 text-indigo-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {authenticated ? <Navbar /> : <PublicNavbar />}

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            Your Space to Write
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-indigo-100 leading-relaxed">
            A distraction-free writing platform built for focus and productivity.
            Create, publish, and share your stories with the world.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleCtaClick}
              className="w-full sm:w-auto px-8 py-3 text-base font-medium text-indigo-700 bg-white rounded-md shadow-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
            >
              {authenticated ? 'Go to Dashboard' : 'Get Started'}
            </button>
            {!authenticated && (
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-3 text-base font-medium text-white bg-transparent border-2 border-white rounded-md hover:bg-white hover:text-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 text-center"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Why WriteSpace?
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to write, publish, and manage your blog — all in one place.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-indigo-50 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      {latestPosts.length > 0 && (
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Latest Posts
              </h2>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                Check out what our community has been writing about.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestPosts.map((post) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  currentUser={currentUser}
                  onNavigate={handlePostNavigate}
                />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                to={authenticated ? '/blogs' : '/login'}
                className="inline-block px-6 py-3 text-sm font-medium text-indigo-600 bg-white border border-indigo-600 rounded-md hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                View All Posts
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="mt-auto bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold text-white mb-4">WriteSpace</h3>
              <p className="text-sm leading-relaxed">
                A distraction-free writing platform built for focus and productivity.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    className="text-sm hover:text-white transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="text-sm hover:text-white transition-colors"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="text-sm hover:text-white transition-colors"
                  >
                    Register
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">
                Platform
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to={authenticated ? '/blogs' : '/login'}
                    className="text-sm hover:text-white transition-colors"
                  >
                    Blogs
                  </Link>
                </li>
                <li>
                  <Link
                    to={authenticated ? '/write' : '/login'}
                    className="text-sm hover:text-white transition-colors"
                  >
                    Write
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-8 border-t border-gray-800 text-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} WriteSpace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;