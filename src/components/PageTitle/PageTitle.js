import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const PageTitle = ({ titleKey }) => {
  const { t, i18n } = useTranslation('pageTitles'); // Usamos el namespace 'pageTitles'

  useEffect(() => {
    // Verificamos si el idioma ha cambiado y actualizamos el título
    const translatedTitle = t(titleKey);
    
    if (translatedTitle) {
      document.title = translatedTitle; // Establecemos el título de la página con la traducción
    }
  }, [t, titleKey, i18n.language]); // Añadimos i18n.language como dependencia para que se actualice al cambiar el idioma

  return null;
};

export default PageTitle;
