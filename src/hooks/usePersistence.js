import { useEffect } from 'react';
import i18n from '../i18n/index.js';

export function usePersistence() {
  useEffect(() => {
    const stored = localStorage.getItem('tdpb_lang') || 'en';
    document.documentElement.lang = stored;
    document.body.dataset.lang = stored;
    const obs = (lang) => {
      document.body.dataset.lang = lang;
      document.documentElement.lang = lang;
    };
    i18n.on('languageChanged', obs);
    return () => i18n.off('languageChanged', obs);
  }, []);
}
