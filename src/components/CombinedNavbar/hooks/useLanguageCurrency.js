// src/hooks/useLanguageCurrency.js
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from '../../../axiosConfig'; // Ajusta la ruta si tu axiosConfig está en otro sitio

export const useLanguageCurrency = () => {
  const { i18n } = useTranslation();

  // Idioma y moneda iniciales
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    const token = localStorage.getItem('token');

    // 1) Cargar la moneda desde localStorage si existe
    const storedCurrency = localStorage.getItem('preferredCurrency');
    if (storedCurrency) {
      setCurrency(storedCurrency);
    }

    // 2) Función para obtener el idioma preferido, ya sea de backend (si hay token) o localStorage
    const fetchPreferredLanguage = async () => {
      try {
        if (token) {
          // Llamamos a "/users/preferred-language" 
          // baseURL: 'http://localhost:3001/api' => final => http://localhost:3001/api/users/preferred-language
          const response = await axios.get('/users/preferred-language', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const preferredLanguage = response.data?.preferredLanguage;
          if (preferredLanguage) {
            setCurrentLanguage(preferredLanguage);
            i18n.changeLanguage(preferredLanguage);
            localStorage.setItem('selectedLanguage', preferredLanguage);
            return; // Terminamos si ya lo obtuvimos del backend
          }
        }
        // Si no hay token o no hay preferencia en backend, usar localStorage
        const storedLang = localStorage.getItem('selectedLanguage') || 'en';
        setCurrentLanguage(storedLang);
        i18n.changeLanguage(storedLang);
      } catch (error) {
        console.error('Error al obtener el idioma preferido:', error);
        // Si algo falla, fallback a localStorage o 'en'
        const storedLang = localStorage.getItem('selectedLanguage') || 'en';
        setCurrentLanguage(storedLang);
        i18n.changeLanguage(storedLang);
      }
    };

    fetchPreferredLanguage();
  }, [i18n]);

  // Handler para cambiar el idioma
  const handleLanguageChange = async (language) => {
    console.log('Cambiando idioma a:', language);
    setCurrentLanguage(language);
    i18n.changeLanguage(language);
    localStorage.setItem('selectedLanguage', language);

    const token = localStorage.getItem('token');
    if (token) {
      try {
        console.log('Enviando PUT con idioma:', language);
        await axios.put(
          '/users/preferred-language',
          { preferredLanguage: language },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error('Error al cambiar idioma en backend:', error);
      }
    }
  };

  // Handler para cambiar la moneda
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
