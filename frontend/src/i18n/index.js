import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import NAVBAR_EN from '@locales/en/navbar.json';
import NAVBAR_VI from '@locales/vi/navbar.json';

import FORM_EN from '@locales/en/form.json';
import FORM_VI from '@locales/vi/form.json';

const resources = {
  vi: {
    navbar: NAVBAR_VI,
    form: FORM_VI,
  },
  en: {
    navbar: NAVBAR_EN,
    form: FORM_EN,
  },
};

const defaultLanguage = localStorage.getItem('language') || 'vi';

i18n.use(initReactI18next).init({
  resources,
  lng: defaultLanguage,
  ns: ['navbar', 'form'],
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
