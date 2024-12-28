// Components/SupplementaryMaterial/DownloadMaterials.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './DownloadMaterials.module.css';

const DownloadMaterials = () => {
  const { t } = useTranslation('UserIndex/AdditionalResources/SupplementaryMaterial');

  return (
    <div className={styles.downloadMaterials}>
      <h4>{t('downloadMaterials')}</h4>
      <p>{t('downloadMaterialsInfo')}</p>
    </div>
  );
};

export default DownloadMaterials;
