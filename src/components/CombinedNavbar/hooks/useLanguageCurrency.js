// src/hooks/useLanguageCurrency.js

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from '../../../axiosConfig'; // Ajusta la ruta si es necesario

export const useLanguageCurrency = () => {
  const { i18n } = useTranslation();
  
  // Idioma por defecto 'en' (puedes usar 'es' si prefieres)
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    /**
     * Verificar si hay token en localStorage (o si tu AuthContext indica user logueado).
     * Si NO hay token => no llamar a /users/preferred-language para evitar 401.
     */
    const token = localStorage.getItem('token');

    // Función para cargar idioma desde backend o localStorage
    const fetchPreferredLanguage = async () => {
      try {
        if (token) {
          // Hay token => podemos intentar obtener el idioma preferido del backend
          const response = await axios.get('/users/preferred-language');
          const preferredLanguage = response.data?.preferredLanguage;
          if (preferredLanguage) {
            setCurrentLanguage(preferredLanguage);
            i18n.changeLanguage(preferredLanguage);
            localStorage.setItem('selectedLanguage', preferredLanguage);
            return; // Salimos de la función
          }
        }
        // Si no hay token o no se obtuvo preferencia, fallback a localStorage o 'en'
        const storedLang = localStorage.getItem('selectedLanguage') || 'en';
        setCurrentLanguage(storedLang);
        i18n.changeLanguage(storedLang);
      } catch (error) {
        console.error('Error al obtener el idioma preferido:', error);
        // Fallback a localStorage o 'en'
        const storedLang = localStorage.getItem('selectedLanguage') || 'en';
        setCurrentLanguage(storedLang);
        i18n.changeLanguage(storedLang);
      }
    };

    fetchPreferredLanguage();
  }, [i18n]);

  // Cambiar el idioma (si el usuario está logueado, también actualiza en backend)
  const handleLanguageChange = async (language) => {
    // Actualizamos state y localStorage
    setCurrentLanguage(language);
    i18n.changeLanguage(language);
    localStorage.setItem('selectedLanguage', language);
    console.log('El idioma ha cambiado a:', language);

    // Comprobamos si hay token => si no lo hay, no llamamos al backend
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await axios.put('/users/preferred-language', {
          preferredLanguage: language,
        });
      } catch (error) {
        console.error('Error al cambiar el idioma en backend:', error);
      }
    }
  };

  // Cambiar la moneda (opcional)
  const handleCurrencyChange = (newCurrency) => {
    if (newCurrency) {
      setCurrency(newCurrency);
      localStorage.setItem('preferredCurrency', newCurrency);
      console.log('La moneda ha cambiado a:', newCurrency);
      // Si deseas, envía al backend /users/preferred-currency
    }
  };

  return {
    currentLanguage,
    handleLanguageChange,
    currency,
    handleCurrencyChange,
  };
};
