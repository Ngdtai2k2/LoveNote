import React, { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';

const ModeContext = createContext();

export const InterfaceModeProvider = ({ children }) => {
  const [mode, setMode] = useState(localStorage.getItem('mode') || 'light');

  useEffect(() => {
    localStorage.setItem('mode', mode);
    const isDarkMode = mode === 'dark';
    document.body.classList.toggle('dark', isDarkMode);
    document.body.classList.toggle('bg-gray-800', isDarkMode);
  }, [mode]);

  const toggleMode = () => {
    setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return <ModeContext.Provider value={{ mode, toggleMode }}>{children}</ModeContext.Provider>;
};

InterfaceModeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useInterfaceMode = () => useContext(ModeContext);
