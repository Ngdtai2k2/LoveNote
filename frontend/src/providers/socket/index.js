import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import { useSocket } from '@hooks/useSocket';

const SocketContext = createContext(null);
export function SocketProvider({ children }) {
  const socketRef = useSocket({
    // eslint-disable-next-line no-console
    welcome: data => console.log('From server:', data.message),
    // test
    config_updated: () => {
      // eslint-disable-next-line no-console
      console.log('Config updated!');
    },
  });

  return <SocketContext.Provider value={socketRef}>{children}</SocketContext.Provider>;
}

SocketProvider.propTypes = {
  children: PropTypes.node,
};

export const useSocketContext = () => useContext(SocketContext);
