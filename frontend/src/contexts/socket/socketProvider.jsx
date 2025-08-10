import React from 'react';

import { useSocket } from '@hooks/useSocket';

import { SocketContext } from '../createContext';

export function SocketProvider({ children }) {
  const { socketRef, isConnected } = useSocket({
    welcome: (data) => console.log(data.message),
    config_updated: () => {},
  });

  return (
    <SocketContext.Provider value={{ socketRef, isConnected }}>{children}</SocketContext.Provider>
  );
}
