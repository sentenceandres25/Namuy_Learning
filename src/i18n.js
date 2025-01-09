// src/i18n.js

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
// import LanguageDetector from 'i18next-browser-languagedetector'; // Descomentar si deseas usarlo

i18n
  // Carga de traducciones desde ficheros JSON de manera asíncrona
  .use(Backend)
  // .use(LanguageDetector) // Descomentar si deseas detectar idioma con querystring, cookies, etc.
  .use(initReactI18next)
  .init({
    fallbackLng: 'es',
    ns: [
      'UserIndex/MyCart/MyCart',
      'UserIndex/AcademicRegulations',
      'UserIndex/AcademicSupport',
      'UserIndex/AdditionalResources',
      'UserIndex/Certifications',
      'UserIndex/DiscussionForum',
      'UserIndex/MyCourses',
      'UserIndex/PersonalizedTutoring',
      'UserIndex/StudentProfile',
      'pageTitles',
      'content',
      'translation',
      'mainCarousel',
      'categoriesData',
      'LanguageCurrencyDropdown',
      'IconLinks',
      'InfoSection',
      'DiscountsAndHighlights',
      'Footer',
      'GeneralInfo',
      'OnlineCourse',
    ],
    defaultNS: 'translation',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    // detection: {
    //   order: ['querystring', 'cookie', 'localStorage', 'navigator'],
    //   caches: ['localStorage', 'cookie'],
    // },
    react: {
      useSuspense: true,
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
