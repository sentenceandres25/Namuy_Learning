import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const useLanguageCurrency = () => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);  // Estado local para el idioma
  const [currency, setCurrency] = useState('USD');  // Para manejar la moneda

  const handleLanguageChange = (language) => {
    // Cambiar el idioma y actualizar el estado local
    if (language !== i18n.language) {  // Solo cambiar si es necesario
      i18n.changeLanguage(language).then(() => {
        setCurrentLanguage(language);  // Actualizar el estado después del cambio
      });
    }
  };

  const handleCurrencyChange = (newCurrency) => setCurrency(newCurrency);

  useEffect(() => {
    // Escuchar los cambios en el idioma de i18next
    const onLanguageChanged = (lng) => {
      console.log("El idioma ha cambiado a:", lng);
      setCurrentLanguage(lng);  // Asegurar sincronización del estado local
    };

    i18n.on('languageChanged', onLanguageChanged);

    // Limpiar el evento cuando el componente se desmonta
    return () => {
      i18n.off('languageChanged', onLanguageChanged);
    };
  }, [i18n]);

  return { currentLanguage, handleLanguageChange, currency, handleCurrencyChange };
};
