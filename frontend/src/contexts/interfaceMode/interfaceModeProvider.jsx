import { useEffect, useState } from 'react';

import PropTypes from 'prop-types';

import { ModeContext } from '../createContext';

export const InterfaceModeProvider = ({ children }) => {
  const [mode, setMode] = useState(localStorage.getItem('mode') || 'light');

  useEffect(() => {
    localStorage.setItem('mode', mode);
    const isDarkMode = mode === 'dark';
    document.body.classList.toggle('dark', isDarkMode);
    document.body.classList.toggle('bg-gray-800', isDarkMode);
  }, [mode]);

  const toggleMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return <ModeContext.Provider value={{ mode, toggleMode }}>{children}</ModeContext.Provider>;
};

InterfaceModeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
