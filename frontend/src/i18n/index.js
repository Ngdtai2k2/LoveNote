import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {},
  vi: {},
};

const defaultLanguage = localStorage.getItem('language') || 'vi';

i18n.use(initReactI18next).init({
  resources,
  lng: defaultLanguage,
  ns: [],
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
