import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import styles from './AdsPreferences.module.css';

const AdsPreferences = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/Settings');
  const [personalizedAds, setPersonalizedAds] = useState(true);
  const [promoFrequency, setPromoFrequency] = useState('normal');

  const handlePromoFrequencyChange = (e) => {
    setPromoFrequency(e.target.value);
  };

  return (
    <motion.div
      className={styles.adsPreferences}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2>{t('adsPreferences')}</h2>
      <div className={styles.settingItem}>
        <label>{t('personalizedAds')}</label>
        <input
          type="checkbox"
          checked={personalizedAds}
          onChange={() => setPersonalizedAds(!personalizedAds)}
        />
      </div>
      <div className={styles.settingItem}>
        <label>{t('promoFrequency')}</label>
        <motion.select
          className={styles.promoFrequencySelect}
          value={promoFrequency}
          onChange={handlePromoFrequencyChange}
        >
          <option value="more">{t('more')}</option>
          <option value="normal">{t('normal')}</option>
          <option value="less">{t('less')}</option>
        </motion.select>
      </div>
    </motion.div>
  );
};

export default AdsPreferences;
