// components/Settings/AccessibilitySettings.jsx

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import styles from './AccessibilitySettings.module.css';

const AccessibilitySettings = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/Settings');
  const [textToSpeech, setTextToSpeech] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [keyboardNavigation, setKeyboardNavigation] = useState(true);

  return (
    <motion.div
      className={styles.accessibilitySettings}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2>{t('accessibility')}</h2>
      <div className={styles.settingItem}>
        <label>{t('textToSpeech')}</label>
        <input
          type="checkbox"
          checked={textToSpeech}
          onChange={() => setTextToSpeech(!textToSpeech)}
        />
      </div>
      <div className={styles.settingItem}>
        <label>{t('highContrast')}</label>
        <input
          type="checkbox"
          checked={highContrast}
          onChange={() => setHighContrast(!highContrast)}
        />
      </div>
      <div className={styles.settingItem}>
        <label>{t('keyboardNavigation')}</label>
        <input
          type="checkbox"
          checked={keyboardNavigation}
          onChange={() => setKeyboardNavigation(!keyboardNavigation)}
        />
      </div>
    </motion.div>
  );
};

export default AccessibilitySettings;
