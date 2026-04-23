import React from 'react';
import PropTypes from 'prop-types';
import Avatar from './Avatar.jsx';

function UserRow({ user, currentUser, onDelete }) {
  const isCurrentUser = currentUser && currentUser.userId === user.id;
  const isAdmin = user.role === 'admin';
  const deleteDisabled = isAdmin || isCurrentUser;

  const formattedDate = (() => {
    try {
      return new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Unknown';
    }
  })();

  return (
    <div className="flex items-center justify-between bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-4">
        <Avatar role={user.role} />
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900">
            {user.displayName}
          </span>
          <span className="text-xs text-gray-500">@{user.username}</span>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            user.role === 'admin'
              ? 'bg-violet-100 text-violet-800'
              : 'bg-indigo-100 text-indigo-800'
          }`}
        >
          {user.role}
        </span>
        <span className="text-xs text-gray-400">{formattedDate}</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="sm:hidden flex flex-col items-end mr-2">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              user.role === 'admin'
                ? 'bg-violet-100 text-violet-800'
                : 'bg-indigo-100 text-indigo-800'
            }`}
          >
            {user.role}
          </span>
          <span className="text-xs text-gray-400 mt-1">{formattedDate}</span>
        </div>
        <button
          type="button"
          onClick={() => onDelete(user.id)}
          disabled={deleteDisabled}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            deleteDisabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-red-50 text-red-600 border border-red-300 hover:bg-red-100 focus:ring-red-500'
          }`}
          title={
            isAdmin
              ? 'Cannot delete admin user'
              : isCurrentUser
                ? 'Cannot delete your own account'
                : `Delete ${user.displayName}`
          }
        >
          Delete
        </button>
      </div>
    </div>
  );
}

UserRow.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    role: PropTypes.oneOf(['admin', 'user']).isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  currentUser: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    role: PropTypes.oneOf(['admin', 'user']).isRequired,
  }),
  onDelete: PropTypes.func.isRequired,
};

export default UserRow;