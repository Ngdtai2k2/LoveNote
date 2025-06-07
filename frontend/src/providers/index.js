import React from 'react';
import PropTypes from 'prop-types';

import { LanguageProvider } from './language';
import { InterfaceModeProvider } from './interfaceMode';

export const AppProviders = ({ children }) => {
  return (
    <LanguageProvider>
      <InterfaceModeProvider>{children}</InterfaceModeProvider>
    </LanguageProvider>
  );
};

AppProviders.propTypes = {
  children: PropTypes.node.isRequired,
};
