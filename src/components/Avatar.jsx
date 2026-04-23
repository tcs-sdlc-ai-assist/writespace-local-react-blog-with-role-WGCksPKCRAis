import React from 'react';
import PropTypes from 'prop-types';

/**
 * Returns a styled avatar JSX element based on user role.
 * @param {'admin' | 'user'} role - The role of the user
 * @returns {JSX.Element} A circular badge with role-appropriate emoji and colors
 */
export function getAvatar(role) {
  if (role === 'admin') {
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-violet-100 text-violet-700 text-sm font-semibold select-none">
        👑
      </span>
    );
  }

  return (
    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold select-none">
      📖
    </span>
  );
}

/**
 * Avatar component that renders a role-based circular badge.
 * @param {{ role: 'admin' | 'user' }} props
 */
function Avatar({ role }) {
  return getAvatar(role);
}

Avatar.propTypes = {
  role: PropTypes.oneOf(['admin', 'user']).isRequired,
};

export default Avatar;