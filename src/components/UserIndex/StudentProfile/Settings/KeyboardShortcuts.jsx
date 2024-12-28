// components/Settings/KeyboardShortcuts.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import styles from './KeyboardShortcuts.module.css';

const KeyboardShortcuts = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/Settings');
  const shortcuts = [
    { action: t('shortcutOpenSettings'), keys: 'Ctrl + ,' },
    { action: t('shortcutSearch'), keys: 'Ctrl + F' },
    // Agrega más atajos según sea necesario
  ];

  return (
    <motion.div
      className={styles.keyboardShortcuts}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2>{t('keyboardShortcuts')}</h2>
      <div className={styles.shortcutsList}>
        {shortcuts.map((shortcut, index) => (
          <div key={index} className={styles.shortcutItem}>
            <span>{shortcut.action}</span>
            <span className={styles.shortcutKeys}>{shortcut.keys}</span>
          </div>
        ))}
      </div>
      <button className={styles.manageButton}>{t('customizeShortcuts')}</button>
    </motion.div>
  );
};

export default KeyboardShortcuts;
