// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  // Carga traducciones desde archivos JSON de manera asíncrona
  .use(Backend)
  // Detecta el idioma a través de querystring, cookie, localStorage, o el navegador
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
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
    detection: {
      // Se buscará el idioma en la query string (ej. ?lng=es), luego en cookies, localStorage y finalmente en el navegador
      order: ['querystring', 'cookie', 'localStorage', 'navigator'],
      lookupQuerystring: 'lng',
      caches: ['localStorage', 'cookie'],
    },
    react: {
      useSuspense: true,
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
