const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@components': path.resolve(__dirname, './src/components'),
      '@providers': path.resolve(__dirname, './src/providers'),
      '@i18n': path.resolve(__dirname, './src/i18n'),
      '@locales': path.resolve(__dirname, './src/locales'),
      '@constants': path.resolve(__dirname, './src/constants'),
    },
  },
};
