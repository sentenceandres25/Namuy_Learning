// Components/CertificatesInProgress/StudyMaterials.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './StudyMaterials.module.css';
import { FaBookOpen } from 'react-icons/fa';

const StudyMaterials = ({ materials }) => {
  const { t } = useTranslation('UserIndex/Certifications/CertificatesInProgress');

  if (!materials || materials.length === 0) {
    return null;
  }

  return (
    <div className={styles.studyMaterials}>
      <h4><FaBookOpen /> {t('studyMaterials')}</h4>
      <ul>
        {materials.map((material) => (
          <li key={material.id}>
            <a href={material.url} target="_blank" rel="noopener noreferrer">
              {material.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudyMaterials;
