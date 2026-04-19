import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  type LangCode,
  type TranslationKeys,
  getSavedLanguage,
  getTranslations,
} from '@/i18n/index';

interface LanguageContextValue {
  lang: LangCode;
  t: TranslationKeys;
  setLang: (code: LangCode) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<LangCode>(() => getSavedLanguage());
  const [t, setT] = useState<TranslationKeys>(() => getTranslations(getSavedLanguage()));

  const setLang = useCallback((code: LangCode) => {
    localStorage.setItem('agri_lang', code);
    setLangState(code);
    setT(getTranslations(code));

    // Set document direction for RTL languages (Urdu)
    const lang = code === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', lang);
    document.documentElement.setAttribute('lang', code);
  }, []);

  // Apply direction on mount
  useEffect(() => {
    document.documentElement.setAttribute('dir', lang === 'ur' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, t, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside LanguageProvider');
  return ctx;
};
