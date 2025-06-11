import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import NAVBAR_EN from '@locales/en/navbar.json';
import NAVBAR_VI from '@locales/vi/navbar.json';

import FORM_EN from '@locales/en/form.json';
import FORM_VI from '@locales/vi/form.json';

import NOTFOUND_EN from '@locales/en/notfound.json';
import NOTFOUND_VI from '@locales/vi/notfound.json';

const resources = {
  vi: {
    navbar: NAVBAR_VI,
    form: FORM_VI,
    notfound: NOTFOUND_VI,
  },
  en: {
    navbar: NAVBAR_EN,
    form: FORM_EN,
    notfound: NOTFOUND_EN,
  },
};

const defaultLanguage = localStorage.getItem('language') || 'vi';

i18n.use(initReactI18next).init({
  resources,
  lng: defaultLanguage,
  ns: ['navbar', 'form', 'notfound'],
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
