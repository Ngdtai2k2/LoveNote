/* eslint-disable no-console */
import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import { useSocket } from '@hooks/useSocket';

const SocketContext = createContext(null);
export function SocketProvider({ children }) {
  const { socketRef, isConnected } = useSocket({
    welcome: data => console.log(data.message),
    config_updated: () => {},
  });

  return (
    <SocketContext.Provider value={{ socketRef, isConnected }}>{children}</SocketContext.Provider>
  );
}

SocketProvider.propTypes = {
  children: PropTypes.node,
};

export const useSocketContext = () => useContext(SocketContext);
