// Components/PendingTutoringSessions/PreSessionMaterials.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './PreSessionMaterials.module.css';
import { FaFileAlt } from 'react-icons/fa';

const PreSessionMaterials = ({ materials }) => {
  const { t } = useTranslation('UserIndex/PersonalizedTutoring/PendingTutoringSessions');

  const handleUploadMaterial = () => {
    // Logic to upload materials
    alert(t('uploadMaterial'));
  };

  return (
    <div className={styles.preSessionMaterials}>
      <h4>
        <FaFileAlt /> {t('preSessionMaterials')}
      </h4>
      {materials && materials.length > 0 ? (
        <ul>
          {materials.map((material) => (
            <li key={material.id}>
              <a href={material.url} target="_blank" rel="noopener noreferrer">
                {material.title}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>{t('noMaterials')}</p>
      )}
      <button className={styles.uploadButton} onClick={handleUploadMaterial}>
        {t('upload')}
      </button>
    </div>
  );
};

export default PreSessionMaterials;
