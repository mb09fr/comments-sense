// FIX: Replaced corrupted file content with a functional i18n implementation.
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define the available languages and a type for them
export type Language = 'fr' | 'ar';

// Define the structure of our translation keys
// This provides type safety when using the `t` function
const translations = {
  fr: {
    errorUrl: "Veuillez entrer une URL YouTube valide.",
    errorUnexpected: "Une erreur inattendue est survenue. Veuillez réessayer.",
    appName: "Analyseur de Commentaires YouTube",
    appDescription: "Collez l'URL d'une vidéo YouTube pour analyser les commentaires grâce à l'IA.",
    loadingMessage: "Analyse en cours... cela peut prendre un moment.",
    loadingStep2: "Analyse des commentaires avec l'IA Gemini...",
    loadingStep1: "Récupération des données et des commentaires de la vidéo...",
    analyzeAnotherVideo: "Analyser une autre vidéo",
    footerText: "Tous droits réservés.",
    urlInputPlaceholder: "Collez l'URL de la vidéo YouTube ici...",
    analyzingButton: "Analyse...",
    analyzeButton: "Analyser",
    translationFailed: "La traduction a échoué.",
    translating: "Traduction...",
    translate: "Traduire",
    extractedCommentsTitle: "{count} Commentaires Extraits",
    locale: 'fr-FR',
    analysisTitle: "Rapport d'Analyse",
    views: "Vues",
    comments: "Commentaires",
    positive: "Positifs",
    negative: "Négatifs",
    summaryTitle: "Résumé par l'IA",
    sentimentAnalysisTitle: "Sentiment Général :",
    keyTopicsTitle: "Sujets Clés",
    commentLimitLabel: "Nombre de commentaires à analyser :",
  },
  ar: {
    errorUrl: "يرجى إدخال رابط يوتيوب صالح.",
    errorUnexpected: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
    appName: "محلل تعليقات يوتيوب",
    appDescription: "الصق رابط فيديو يوتيوب لتحليل تعليقاته باستخدام الذكاء الاصطناعي.",
    loadingMessage: "جاري التحليل... قد يستغرق هذا بعض الوقت.",
    loadingStep2: "تحليل التعليقات باستخدام Gemini AI...",
    loadingStep1: "جلب بيانات الفيديو والتعليقات...",
    analyzeAnotherVideo: "تحليل فيديو آخر",
    footerText: "جميع الحقوق محفوظة.",
    urlInputPlaceholder: "الصق رابط فيديو يوتيوب هنا...",
    analyzingButton: "جاري التحليل...",
    analyzeButton: "تحليل",
    translationFailed: "فشلت الترجمة.",
    translating: "جاري الترجمة...",
    translate: "ترجمة",
    extractedCommentsTitle: "{count} تعليقات مستخرجة",
    locale: 'ar-EG',
    analysisTitle: "تقرير التحليل",
    views: "المشاهدات",
    comments: "التعليقات",
    positive: "إيجابي",
    negative: "سلبي",
    summaryTitle: "ملخص الذكاء الاصطناعي",
    sentimentAnalysisTitle: "الشعور العام:",
    keyTopicsTitle: "المواضيع الرئيسية",
    commentLimitLabel: "عدد التعليقات المراد تحليلها:",
  }
};

type TranslationKey = keyof typeof translations.fr;

// Define the context type
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, options?: Record<string, string | number>) => string;
}

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Create the provider component
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fr');

  // Effect to update document language and direction
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  // Translation function
  const t = (key: TranslationKey, options?: Record<string, string | number>): string => {
    let text = translations[language][key] || key;
    if (options) {
      Object.entries(options).forEach(([k, value]) => {
        // Use a regex to replace all occurrences
        const regex = new RegExp(`{${k}}`, 'g');
        text = text.replace(regex, String(value));
      });
    }
    return text;
  };

  const value = { language, setLanguage, t };

  // FIX: Replaced JSX with React.createElement to prevent parsing errors in a .ts file.
  // The original JSX syntax was causing compilation errors because the file is not a .tsx file.
  return React.createElement(LanguageContext.Provider, { value: value }, children);
};

// Create the custom hook
export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
