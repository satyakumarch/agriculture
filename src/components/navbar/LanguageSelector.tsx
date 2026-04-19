import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { LANGUAGES, type LangCode } from '@/i18n/index';
import { useLanguage } from '@/hooks/use-language';

const LanguageSelector: React.FC = () => {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find(l => l.code === lang) ?? LANGUAGES[0];

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (code: LangCode) => {
    setLang(code);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium
          hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200
          dark:border-gray-700 bg-white dark:bg-gray-900"
        aria-label="Select language"
      >
        <Globe className="h-4 w-4 text-green-600" />
        <span className="text-base leading-none">{current.flag}</span>
        <span className="hidden sm:block max-w-[60px] truncate">{current.nativeName}</span>
        <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 rounded-xl shadow-xl bg-white dark:bg-gray-800
          border border-gray-100 dark:border-gray-700 z-50 overflow-hidden">
          <div className="py-1 max-h-80 overflow-y-auto">
            {LANGUAGES.map(language => (
              <button
                key={language.code}
                onClick={() => handleSelect(language.code)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50
                  dark:hover:bg-gray-700 transition-colors text-left
                  ${lang === language.code ? 'bg-green-50 dark:bg-green-900/20' : ''}`}
              >
                <span className="text-xl shrink-0">{language.flag}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{language.nativeName}</p>
                  <p className="text-xs text-gray-400 truncate">{language.name}</p>
                </div>
                {lang === language.code && (
                  <Check className="h-4 w-4 text-green-600 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
