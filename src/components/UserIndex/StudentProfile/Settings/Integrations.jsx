// components/Settings/Integrations.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import styles from './Integrations.module.css';

const Integrations = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/Settings');
  const integrations = [
    { id: 1, name: 'Google Calendar', connected: true },
    { id: 2, name: 'Slack', connected: false },
    // Agrega más integraciones si es necesario
  ];

  return (
    <motion.div
      className={styles.integrations}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2>{t('integrations')}</h2>
      <div className={styles.integrationsList}>
        {integrations.map((integration) => (
          <div key={integration.id} className={styles.integrationItem}>
            <div>
              <strong>{integration.name}</strong>
            </div>
            <button>
              {integration.connected ? t('disconnect') : t('connect')}
            </button>
          </div>
        ))}
      </div>
      <div className={styles.apiKeySection}>
        <label>{t('apiKeyManagement')}</label>
        <button>{t('manage')}</button>
      </div>
    </motion.div>
  );
};

export default Integrations;
