// components/Settings/DeviceSettings.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import styles from './DeviceSettings.module.css';

const DeviceSettings = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/Settings');
  const devices = [
    { id: 1, name: 'iPhone 12', lastSync: '2023-08-15' },
    { id: 2, name: 'MacBook Pro', lastSync: '2023-08-14' },
    // Agrega más dispositivos si es necesario
  ];

  return (
    <motion.div
      className={styles.deviceSettings}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2>{t('deviceSettings')}</h2>
      <div className={styles.devicesList}>
        {devices.map((device) => (
          <div key={device.id} className={styles.deviceItem}>
            <div>
              <strong>{device.name}</strong>
              <p>
                {t('lastSync')}: {device.lastSync}
              </p>
            </div>
            <button>{t('unlink')}</button>
          </div>
        ))}
      </div>
      <div className={styles.settingItem}>
        <label>{t('syncPreferences')}</label>
        <button>{t('manage')}</button>
      </div>
    </motion.div>
  );
};

export default DeviceSettings;
