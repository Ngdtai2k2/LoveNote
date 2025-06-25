import React from 'react';

import NavBar from '@components/NavBar';
import Footer from '@components/Footer';

export default function LayoutUser({ children, className }) {
  return (
    <div className={`mt-2 px-2 dark:text-white ${className}`}>
      <div>
        <NavBar />
        {children}
      </div>
      <Footer />
    </div>
  );
}

