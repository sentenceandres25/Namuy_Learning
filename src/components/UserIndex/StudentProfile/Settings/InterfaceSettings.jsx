import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../../../../contexts/ThemeContext';
import { motion } from 'framer-motion';
import styles from './InterfaceSettings.module.css';

const InterfaceSettings = () => {
  const { t, i18n } = useTranslation('UserIndex/StudentProfile/Settings');
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleThemeChange = (e) => {
    toggleTheme(e.target.value);
  };

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <motion.div
      className={styles.interfaceSettings}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2>{t('interface')}</h2>
      <div className={styles.settingItem}>
        <label>{t('theme')}</label>
        <select value={theme} onChange={handleThemeChange}>
          <option value="light">{t('light')}</option>
          <option value="dark">{t('dark')}</option>
        </select>
      </div>
      <div className={styles.settingItem}>
        <label>{t('fontSize')}</label>
        <input type="range" min="12" max="24" />
      </div>
      <div className={styles.settingItem}>
        <label>{t('language')}</label>
        <select value={i18n.language} onChange={handleLanguageChange}>
          <option value="es">Español</option>
          <option value="en">English</option>
          {/* Agrega más idiomas si es necesario */}
        </select>
      </div>
    </motion.div>
  );
};

export default InterfaceSettings;
