import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend) // Cargar recursos de traducción de manera asíncrona
  .use(LanguageDetector) // Detecta el idioma del navegador
  .use(initReactI18next) // Integra i18n con React
  .init({
    fallbackLng: 'es', // Idioma predeterminado
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
      'OnlineCourse'
    ], // Lista de namespaces
    defaultNS: 'translation', // Namespace por defecto
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json', // Ruta para cargar los archivos de traducción
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator'], // Orden de detección del idioma
      caches: ['localStorage', 'cookie'], // Dónde almacenar el idioma detectado
    },
    react: {
      useSuspense: true, // Suspense para la carga de recursos
    },
    interpolation: {
      escapeValue: false, // React ya maneja el escape de XSS
    },
  });

export default i18n;
