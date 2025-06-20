import React from 'react';
import PropTypes from 'prop-types';

import { LanguageProvider } from './language';
import { InterfaceModeProvider } from './interfaceMode';
import { SocketProvider } from './socket';

export const AppProviders = ({ children }) => {
  return (
    <SocketProvider>
      <LanguageProvider>
        <InterfaceModeProvider>{children}</InterfaceModeProvider>
      </LanguageProvider>
    </SocketProvider>
  );
};

AppProviders.propTypes = {
  children: PropTypes.node.isRequired,
};
