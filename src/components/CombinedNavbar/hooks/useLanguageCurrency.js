// src/hooks/useLanguageCurrency.js

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from '../../../axiosConfig'; // Ruta corregida

export const useLanguageCurrency = () => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState('es'); // Idioma por defecto
  const [currency, setCurrency] = useState('USD'); // Moneda por defecto

  useEffect(() => {
    // Función para obtener el idioma preferido desde el backend
    const fetchPreferredLanguage = async () => {
      try {
        const response = await axios.get('/users/preferred-language'); // Ruta corregida
        const preferredLanguage = response.data.preferredLanguage;
        if (preferredLanguage) {
          setCurrentLanguage(preferredLanguage);
          i18n.changeLanguage(preferredLanguage);
          localStorage.setItem('selectedLanguage', preferredLanguage);
        } else {
          setCurrentLanguage('es');
          i18n.changeLanguage('es');
          localStorage.setItem('selectedLanguage', 'es');
        }
      } catch (error) {
        console.error('Error al obtener el idioma preferido:', error);
        // Fallback a localStorage o al idioma por defecto
        const storedLanguage = localStorage.getItem('selectedLanguage') || 'es';
        setCurrentLanguage(storedLanguage);
        i18n.changeLanguage(storedLanguage);
      }
    };

    fetchPreferredLanguage();
  }, [i18n]);

  const handleLanguageChange = async (language) => {
    try {
      await axios.put('/users/preferred-language', {
        preferredLanguage: language,
      });
      setCurrentLanguage(language);
      i18n.changeLanguage(language);
      localStorage.setItem('selectedLanguage', language);
      console.log('El idioma ha cambiado a:', language);
    } catch (error) {
      console.error('Error al cambiar el idioma:', error);
    }
  };

  const handleCurrencyChange = (newCurrency) => {
    if (newCurrency) {
      setCurrency(newCurrency);
      localStorage.setItem('preferredCurrency', newCurrency);
      console.log('La moneda ha cambiado a:', newCurrency);
      // Si deseas, puedes enviar una solicitud al backend para guardar la moneda
      // await axios.put('/users/preferred-currency', { preferredCurrency: newCurrency });
    }
  };

  return {
    currentLanguage,
    handleLanguageChange,
    currency,
    handleCurrencyChange,
  };
};
