import React from 'react';
import PropTypes from 'prop-types';

export function StatCard({ title, value, icon, bgColor = 'bg-white' }) {
  return (
    <div
      className={`${bgColor} rounded-lg shadow-md p-6 flex items-center gap-4 transition-shadow hover:shadow-lg`}
    >
      {icon && (
        <div className="flex-shrink-0 text-3xl text-gray-600">
          {icon}
        </div>
      )}
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          {title}
        </span>
        <span className="text-2xl font-bold text-gray-900 mt-1">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
      </div>
    </div>
  );
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  icon: PropTypes.node,
  bgColor: PropTypes.string,
};