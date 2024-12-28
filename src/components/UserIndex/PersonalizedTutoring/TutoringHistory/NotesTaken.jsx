// Components/TutoringHistory/NotesTaken.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './NotesTaken.module.css';
import { FaBookOpen } from 'react-icons/fa';

const NotesTaken = ({ notes, materials }) => {
  const { t } = useTranslation('UserIndex/PersonalizedTutoring/TutoringHistory');

  return (
    <div className={styles.notesTaken}>
      <h4><FaBookOpen /> {t('notesTaken')}</h4>
      <p>{notes}</p>
      {materials && materials.length > 0 && (
        <div className={styles.materials}>
          <h5>{t('materialsUsed')}:</h5>
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
      )}
    </div>
  );
};

export default NotesTaken;
