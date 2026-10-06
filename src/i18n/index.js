import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en/translation.json';
import bn from './locales/bn/translation.json';

const STORAGE_KEY = 'tdpb_lang';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    bn: { translation: bn },
  },
  lng: localStorage.getItem(STORAGE_KEY) || 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export function setLanguage(lang) {
  i18n.changeLanguage(lang);
  localStorage.setItem(STORAGE_KEY, lang);
  document.documentElement.lang = lang;
}

export default i18n;
