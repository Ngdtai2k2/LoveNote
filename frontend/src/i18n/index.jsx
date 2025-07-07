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

import FOOTER_EN from '@locales/en/footer.json';
import FOOTER_VI from '@locales/vi/footer.json';

import TEMPLATE_EN from '@locales/en/template.json';
import TEMPLATE_VI from '@locales/vi/template.json';

import PROFILE_EN from '@locales/en/profile.json';
import PROFILE_VI from '@locales/vi/profile.json';

import ABOUT_EN from '@locales/en/about.json';
import ABOUT_VI from '@locales/vi/about.json';

const resources = {
  vi: {
    navbar: NAVBAR_VI,
    form: FORM_VI,
    notfound: NOTFOUND_VI,
    tabbar: TABBAR_VI,
    product: PRODUCT_VI,
    footer: FOOTER_VI,
    template: TEMPLATE_VI,
    profile: PROFILE_VI,
    about: ABOUT_VI,
  },
  en: {
    navbar: NAVBAR_EN,
    form: FORM_EN,
    notfound: NOTFOUND_EN,
    tabbar: TABBAR_EN,
    product: PRODUCT_EN,
    footer: FOOTER_EN,
    template: TEMPLATE_EN,
    profile: PROFILE_EN,
    about: ABOUT_EN,
  },
};

const defaultLanguage = localStorage.getItem('language') || 'vi';

i18n.use(initReactI18next).init({
  resources,
  lng: defaultLanguage,
  ns: ['navbar', 'form', 'notfound', 'tabbar', 'product', 'footer', 'template', 'profile', 'about'],
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
