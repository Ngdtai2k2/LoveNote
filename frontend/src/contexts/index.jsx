import React from 'react';
import PropTypes from 'prop-types';

import LanguageProvider from './language/languageProvider';
import { InterfaceModeProvider } from './interfaceMode/interfaceModeProvider';
import { SocketProvider } from './socket/socketProvider';

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
