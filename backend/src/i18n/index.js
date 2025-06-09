const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const i18nextMiddleware = require('i18next-http-middleware');
const path = require('path');

i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    backend: {
      loadPath: path.join(__dirname, '../locales/{{lng}}/{{ns}}.json'),
    },
    fallbackLng: 'en',
    preload: ['en', 'vi'],
    ns: ['auth', 'message', 'user', 'validate', 'notfound'],
  });

module.exports = i18next;
