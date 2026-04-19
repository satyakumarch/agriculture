import en from './en';
import hi from './hi';
import pa from './pa';
import ne from './ne';
import bn from './bn';
import mr from './mr';
import gu from './gu';
import ta from './ta';
import te from './te';
import kn from './kn';
import ml from './ml';
import ur from './ur';
import es from './es';
import type { TranslationKeys } from './en';

export type LangCode = 'en'|'hi'|'pa'|'ne'|'bn'|'mr'|'gu'|'ta'|'te'|'kn'|'ml'|'ur'|'es';

export interface Language {
  code: LangCode;
  name: string;       // English name
  nativeName: string; // Name in that language
  flag: string;
  dir: 'ltr' | 'rtl';
}

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English',    nativeName: 'English',     flag: '🇬🇧', dir: 'ltr' },
  { code: 'hi', name: 'Hindi',      nativeName: 'हिंदी',        flag: '🇮🇳', dir: 'ltr' },
  { code: 'pa', name: 'Punjabi',    nativeName: 'ਪੰਜਾਬੀ',       flag: '🇮🇳', dir: 'ltr' },
  { code: 'ne', name: 'Nepali',     nativeName: 'नेपाली',       flag: '🇳🇵', dir: 'ltr' },
  { code: 'bn', name: 'Bengali',    nativeName: 'বাংলা',        flag: '🇧🇩', dir: 'ltr' },
  { code: 'mr', name: 'Marathi',    nativeName: 'मराठी',        flag: '🇮🇳', dir: 'ltr' },
  { code: 'gu', name: 'Gujarati',   nativeName: 'ગુજરાતી',      flag: '🇮🇳', dir: 'ltr' },
  { code: 'ta', name: 'Tamil',      nativeName: 'தமிழ்',        flag: '🇮🇳', dir: 'ltr' },
  { code: 'te', name: 'Telugu',     nativeName: 'తెలుగు',       flag: '🇮🇳', dir: 'ltr' },
  { code: 'kn', name: 'Kannada',    nativeName: 'ಕನ್ನಡ',        flag: '🇮🇳', dir: 'ltr' },
  { code: 'ml', name: 'Malayalam',  nativeName: 'മലയാളം',       flag: '🇮🇳', dir: 'ltr' },
  { code: 'ur', name: 'Urdu',       nativeName: 'اردو',         flag: '🇵🇰', dir: 'rtl' },
  { code: 'es', name: 'Spanish',    nativeName: 'Español',      flag: '🇪🇸', dir: 'ltr' },
];

const translations: Record<LangCode, TranslationKeys> = {
  en, hi, pa, ne, bn, mr, gu, ta, te, kn, ml, ur, es,
};

/** Detect browser language and return best matching LangCode */
export function detectBrowserLanguage(): LangCode {
  const browserLang = navigator.language?.split('-')[0]?.toLowerCase();
  const match = LANGUAGES.find(l => l.code === browserLang);
  return match ? match.code : 'en';
}

/** Get saved language from localStorage, fallback to browser detection */
export function getSavedLanguage(): LangCode {
  const saved = localStorage.getItem('agri_lang') as LangCode | null;
  if (saved && translations[saved]) return saved;
  return detectBrowserLanguage();
}

/** Deep merge: fill missing keys from English fallback */
function deepMerge(base: any, override: any): any {
  const result = { ...base };
  for (const key of Object.keys(override)) {
    if (
      override[key] !== null &&
      typeof override[key] === 'object' &&
      !Array.isArray(override[key]) &&
      typeof base[key] === 'object'
    ) {
      result[key] = deepMerge(base[key], override[key]);
    } else {
      result[key] = override[key];
    }
  }
  return result;
}

/** Get translation object for a language, fallback to English for missing keys */
export function getTranslations(lang: LangCode): TranslationKeys {
  if (lang === 'en') return translations.en;
  return deepMerge(translations.en, translations[lang] ?? {}) as TranslationKeys;
}

export { type TranslationKeys };
export default translations;
