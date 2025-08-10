import React from 'react';

import CONSTANTS from '@constants';

import NavBar from '@components/NavBar';

export default function LayoutAdmin({ children, className }) {
  const today = new Date();
  const currentYear = today.getFullYear();

  return (
    <div className={`mt-2 px-2 dark:text-white ${className}`}>
      <div>
        <NavBar isAdmin={true} />
        {children}
      </div>
      <div className="mt-5 text-center text-[13px] font-light text-gray-900 dark:text-gray-200">
        &#169; {currentYear} {CONSTANTS.SITE_NAME}
      </div>
    </div>
  );
}
