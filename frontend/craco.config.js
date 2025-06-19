const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@components': path.resolve(__dirname, './src/components'),
      '@providers': path.resolve(__dirname, './src/providers'),
      '@i18n': path.resolve(__dirname, './src/i18n'),
      '@locales': path.resolve(__dirname, './src/locales'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@redux': path.resolve(__dirname, './src/redux'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@api': path.resolve(__dirname, './src/api'),
      '@helpers': path.resolve(__dirname, './src/helpers'),
      '@routes': path.resolve(__dirname, './src/routes'),
    },
  },
};
