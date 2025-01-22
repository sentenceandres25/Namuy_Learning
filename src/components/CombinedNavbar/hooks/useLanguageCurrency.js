// src/hooks/useLanguageCurrency.js
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from '../../../axiosConfig'; // Ajusta la ruta si tu axiosConfig está en otro sitio

export const useLanguageCurrency = () => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchPreferredLanguage = async () => {
      try {
        if (token) {
          const response = await axios.get('/users/preferred-language');
          const preferredLanguage = response.data?.preferredLanguage;
          if (preferredLanguage) {
            setCurrentLanguage(preferredLanguage);
            i18n.changeLanguage(preferredLanguage);
            localStorage.setItem('selectedLanguage', preferredLanguage);
            return;
          }
        }
        const storedLang = localStorage.getItem('selectedLanguage') || 'en';
        setCurrentLanguage(storedLang);
        i18n.changeLanguage(storedLang);
      } catch (error) {
        console.error('Error al obtener el idioma preferido:', error);
        const storedLang = localStorage.getItem('selectedLanguage') || 'en';
        setCurrentLanguage(storedLang);
        i18n.changeLanguage(storedLang);
      }
    };
    fetchPreferredLanguage();
  }, [i18n]);

  const handleLanguageChange = async (language) => {
    setCurrentLanguage(language);
    i18n.changeLanguage(language);
    localStorage.setItem('selectedLanguage', language);

    const token = localStorage.getItem('token');
    if (token) {
      try {
        await axios.put('/users/preferred-language', {
          preferredLanguage: language,
        });
      } catch (error) {
        console.error('Error al cambiar idioma en backend:', error);
      }
    }
  };

  const handleCurrencyChange = (newCurrency) => {
    if (newCurrency) {
      setCurrency(newCurrency);
      localStorage.setItem('preferredCurrency', newCurrency);
      console.log('La moneda ha cambiado a:', newCurrency);
    }
  };

  return {
    currentLanguage,
    handleLanguageChange,
    currency,
    handleCurrencyChange,
  };
};
