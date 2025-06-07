import React from 'react';
import PropTypes from 'prop-types';

export default function LayoutUser({ children, className }) {
  const today = new Date();
  const currentYear = today.getFullYear();

  return (
    <div className={`mt-2 px-2 dark:text-white ${className}`}>
      <div>{children}</div>
      <div className="mt-5 text-center font-light text-[13px]">&#169; {currentYear} LoveNote</div>
    </div>
  );
}

LayoutUser.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
