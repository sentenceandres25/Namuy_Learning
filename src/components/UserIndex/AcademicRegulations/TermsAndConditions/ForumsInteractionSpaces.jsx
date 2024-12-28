// Components/TermsAndConditions/ForumsInteractionSpaces.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ForumsInteractionSpaces.module.css';

const ForumsInteractionSpaces = () => {
  const { t } = useTranslation('UserIndex/AcademicRegulations/TermsAndConditions');

  return (
    <div className={styles.forumsInteractionSpaces}>
      <h3>{t('forumsInteractionSpacesTitle')}</h3>
      <p>{t('forumsInteractionSpacesText')}</p>
    </div>
  );
};

export default ForumsInteractionSpaces;
