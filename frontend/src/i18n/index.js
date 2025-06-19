import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import NAVBAR_EN from '@locales/en/navbar.json';
import NAVBAR_VI from '@locales/vi/navbar.json';

import TABBAR_EN from '@locales/en/tabbar.json';
import TABBAR_VI from '@locales/vi/tabbar.json';

import FORM_EN from '@locales/en/form.json';
import FORM_VI from '@locales/vi/form.json';

import NOTFOUND_EN from '@locales/en/notfound.json';
import NOTFOUND_VI from '@locales/vi/notfound.json';

import PRODUCT_EN from '@locales/en/product.json';
import PRODUCT_VI from '@locales/vi/product.json';

const resources = {
  vi: {
    navbar: NAVBAR_VI,
    form: FORM_VI,
    notfound: NOTFOUND_VI,
    tabbar: TABBAR_VI,
    product: PRODUCT_VI,
  },
  en: {
    navbar: NAVBAR_EN,
    form: FORM_EN,
    notfound: NOTFOUND_EN,
    tabbar: TABBAR_EN,
    product: PRODUCT_EN,
  },
};

const defaultLanguage = localStorage.getItem('language') || 'vi';

i18n.use(initReactI18next).init({
  resources,
  lng: defaultLanguage,
  ns: ['navbar', 'form', 'notfound', 'tabbar', 'product'],
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
