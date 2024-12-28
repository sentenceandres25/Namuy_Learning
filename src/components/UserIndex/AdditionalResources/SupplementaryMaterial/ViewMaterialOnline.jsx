// Components/SupplementaryMaterial/ViewMaterialOnline.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ViewMaterialOnline.module.css';

const ViewMaterialOnline = () => {
  const { t } = useTranslation('UserIndex/AdditionalResources/SupplementaryMaterial');

  return (
    <div className={styles.viewMaterialOnline}>
      <h4>{t('viewMaterialOnline')}</h4>
      <p>{t('viewMaterialOnlineInfo')}</p>
    </div>
  );
};

export default ViewMaterialOnline;
