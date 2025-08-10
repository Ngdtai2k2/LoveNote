import React from 'react';

import Footer from '@components/Footer';
import NavBar from '@components/NavBar';

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
