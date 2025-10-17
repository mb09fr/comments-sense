import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useTranslation();

  const switchLanguage = (lang: 'fr' | 'ar') => {
    setLanguage(lang);
  };

  return (
    <div className="absolute top-4 right-4 md:top-8 md:right-8 flex items-center bg-gray-800 border border-gray-700 rounded-full p-1 text-sm z-10">
      <button
        onClick={() => switchLanguage('fr')}
        className={`px-3 py-1 rounded-full transition-colors ${language === 'fr' ? 'bg-brand-red text-white' : 'text-gray-300'}`}
        aria-pressed={language === 'fr'}
      >
        FR
      </button>
      <button
        onClick={() => switchLanguage('ar')}
        className={`px-3 py-1 rounded-full transition-colors ${language === 'ar' ? 'bg-brand-red text-white' : 'text-gray-300'}`}
        aria-pressed={language === 'ar'}
      >
        AR
      </button>
    </div>
  );
};
