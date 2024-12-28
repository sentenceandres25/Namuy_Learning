// Components/TermsAndConditions/ServicesDescription.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ServicesDescription.module.css';

const ServicesDescription = () => {
  const { t } = useTranslation('UserIndex/AcademicRegulations/TermsAndConditions');
  const services = t('servicesDescription', { returnObjects: true });

  return (
    <div className={styles.servicesDescription}>
      <h3 className={styles.title}>{services.title}</h3>
      <p className={styles.text}>{services.text}</p>
    </div>
  );
};

export default ServicesDescription;
