// components/Settings/ContentPreferences.jsx

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import axios from '../../../../axiosConfig'; // <-- Ajusta la ruta si tu axiosConfig está en otro sitio
import styles from './ContentPreferences.module.css';

const ContentPreferences = () => {
  // Usamos i18n para cambiar de idioma "al vuelo"
  const { t, i18n } = useTranslation('UserIndex/StudentProfile/Settings');

  // Iniciamos el "preferredLanguage" con el idioma actual de i18n
  const [preferredLanguage, setPreferredLanguage] = useState(i18n.language);

  const [contentTypes, setContentTypes] = useState({
    articles: true,
    videos: true,
    podcasts: false,
  });

  // Handler para cambiar el idioma
  const handleLanguageChange = async (e) => {
    const newLang = e.target.value;
    setPreferredLanguage(newLang);

    // 1) Cambiar inmediatamente el idioma en i18n
    i18n.changeLanguage(newLang);

    // 2) Guardar la preferencia en localStorage para que persista
    localStorage.setItem('selectedLanguage', newLang);

    // 3) (Opcional) Actualizar en backend si el usuario está logueado
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await axios.put(
          '/users/preferred-language',
          { preferredLanguage: newLang }
        );
        console.log('Idioma actualizado en backend:', newLang);
      } catch (error) {
        console.error('Error al cambiar idioma en backend:', error);
      }
    }
  };

  // Handler para alternar qué tipos de contenido se prefieren
  const handleContentTypeChange = (type) => {
    setContentTypes({
      ...contentTypes,
      [type]: !contentTypes[type],
    });
  };

  return (
    <motion.div
      className={styles.contentPreferences}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2>{t('contentPreferences')}</h2>

      {/* Selector de idioma preferido */}
      <div className={styles.settingItem}>
        <label>{t('preferredContentLanguage')}</label>
        <select
          className={styles.languageSelect}
          value={preferredLanguage}
          onChange={handleLanguageChange}
        >
          <option value="es">Español</option>
          <option value="en">English</option>
          {/* Agrega más opciones si es necesario */}
        </select>
      </div>
    </motion.div>
  );
};

export default ContentPreferences;
