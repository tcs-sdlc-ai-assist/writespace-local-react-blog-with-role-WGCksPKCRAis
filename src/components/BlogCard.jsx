import React from 'react';
import PropTypes from 'prop-types';
import { getAvatar } from './Avatar';

/**
 * Truncates content to a specified maximum length, appending ellipsis if needed.
 * @param {string} content - The full content string
 * @param {number} maxLength - Maximum character length before truncation
 * @returns {string} The truncated string
 */
function truncateContent(content, maxLength = 150) {
  if (!content) return '';
  if (content.length <= maxLength) return content;
  return content.slice(0, maxLength).trimEnd() + '…';
}

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
 * BlogCard component that renders a blog post preview card.
 * Displays title, excerpt, date, author with avatar, and conditional edit icon.
 *
 * @param {{ post: object, currentUser: object|null, onNavigate: function }} props
 */
function BlogCard({ post, currentUser, onNavigate }) {
  const { id, title, content, createdAt, authorId, authorName } = post;

  const excerpt = truncateContent(content);

  const canEdit =
    currentUser &&
    (currentUser.role === 'admin' || currentUser.userId === authorId);

  const handleCardClick = () => {
    if (onNavigate) {
      onNavigate(id);
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    if (onNavigate) {
      onNavigate(id, true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  const authorRole =
    currentUser && currentUser.userId === authorId
      ? currentUser.role
      : 'user';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      className="bg-white rounded-lg shadow-md border-l-4 border-indigo-500 p-5 flex flex-col gap-3 cursor-pointer transition-shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
          {title}
        </h3>
        {canEdit && (
          <button
            type="button"
            onClick={handleEditClick}
            className="flex-shrink-0 p-1 rounded-md text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label={`Edit post: ${title}`}
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
        )}
      </div>

      {excerpt && (
        <p className="text-sm text-gray-600 leading-relaxed">
          {excerpt}
        </p>
      )}

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
        <div className="flex items-center gap-2">
          {getAvatar(authorRole)}
          <span className="text-sm font-medium text-gray-700">
            {authorName || 'Unknown'}
          </span>
        </div>
        {createdAt && (
          <span className="text-xs text-gray-400">
            {formatDate(createdAt)}
          </span>
        )}
      </div>
    </div>
  );
}

BlogCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string,
    createdAt: PropTypes.string,
    authorId: PropTypes.string,
    authorName: PropTypes.string,
  }).isRequired,
  currentUser: PropTypes.shape({
    userId: PropTypes.string,
    username: PropTypes.string,
    displayName: PropTypes.string,
    role: PropTypes.oneOf(['admin', 'user']),
  }),
  onNavigate: PropTypes.func,
};

export default BlogCard;