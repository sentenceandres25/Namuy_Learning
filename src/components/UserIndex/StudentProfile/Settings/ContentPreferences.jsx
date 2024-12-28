// components/Settings/ContentPreferences.jsx

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import styles from './ContentPreferences.module.css';

const ContentPreferences = () => {
const { t, i18n } = useTranslation('UserIndex/StudentProfile/Settings');  const [preferredLanguage, setPreferredLanguage] = useState(i18n.language);
  const [contentTypes, setContentTypes] = useState({
    articles: true,
    videos: true,
    podcasts: false,
  });

  const handleLanguageChange = (e) => {
    setPreferredLanguage(e.target.value);
    // Actualizar la preferencia en el estado global o en el backend
  };

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
      <div className={styles.settingItem}>
        <label>{t('preferredContentLanguage')}</label>
        <select className={`${styles.languageSelect}`} value={preferredLanguage} onChange={handleLanguageChange}>
          <option value="es">Español</option>
          <option value="en">English</option>
          {/* Agrega más opciones si es necesario */}
        </select>
      </div>
      <div className={styles.settingItem}>
        <label>{t('contentTypes')}</label>
        <div className={styles.checkboxGroup}>
          <label>
            <input
              type="checkbox"
              checked={contentTypes.articles}
              onChange={() => handleContentTypeChange('articles')}
            />
            {t('articles')}
          </label>
          <label>
            <input
              type="checkbox"
              checked={contentTypes.videos}
              onChange={() => handleContentTypeChange('videos')}
            />
            {t('videos')}
          </label>
          <label>
            <input
              type="checkbox"
              checked={contentTypes.podcasts}
              onChange={() => handleContentTypeChange('podcasts')}
            />
            {t('podcasts')}
          </label>
        </div>
      </div>
    </motion.div>
  );
};

export default ContentPreferences;
