import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Crop } from '../types';
import { TRANSLATIONS, LANGUAGE_METADATA } from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  getCropLocalizedName: (crop: Crop) => string;
  availableLanguages: typeof LANGUAGE_METADATA;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const VALID_LANGUAGES: Language[] = [
  'en', 'hi', 'kn', 'ta', 'ml', 'te', 'mr', 'bn', 'gu', 'pa', 'or', 'as'
];

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('kissan_adda_lang') as Language;
      if (saved && VALID_LANGUAGES.includes(saved)) {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('kissan_adda_lang', lang);
    } catch {
      // ignore
    }
  };

  const t = (key: string, fallback?: string): string => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
    if (dict && dict[key]) {
      return dict[key];
    }
    if (TRANSLATIONS.en[key]) {
      return TRANSLATIONS.en[key];
    }
    return fallback || key;
  };

  // Helper to get localized crop name in current language
  const getCropLocalizedName = (crop: Crop): string => {
    if (!crop) return '';
    if (language === 'en') return crop.name;
    if (language === 'hi' && crop.hindiName) return crop.hindiName;
    if (language === 'te' && crop.teluguName) return crop.teluguName;
    if (crop.regionalNames && crop.regionalNames[language as keyof typeof crop.regionalNames]) {
      return crop.regionalNames[language as keyof typeof crop.regionalNames] || crop.name;
    }
    // Fallback to Hindi if regional is missing, or English
    return crop.hindiName || crop.name;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getCropLocalizedName, availableLanguages: LANGUAGE_METADATA }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
