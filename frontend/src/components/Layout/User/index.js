import React from 'react';
import PropTypes from 'prop-types';
import CONSTANTS from '@constants';
import NavBar from '@components/NavBar';

export default function LayoutUser({ children, className }) {
  const today = new Date();
  const currentYear = today.getFullYear();

  return (
    <div className={`mt-2 px-2 dark:text-white ${className}`}>
      <div>
        <NavBar />
        {children}
      </div>
      <div className="mt-5 text-center font-light text-[13px] text-gray-900 dark:text-gray-200">
        &#169; {currentYear} {CONSTANTS.SITE_NAME}
      </div>
    </div>
  );
}

LayoutUser.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
