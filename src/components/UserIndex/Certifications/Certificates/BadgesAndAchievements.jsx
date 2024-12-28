// Components/Certificates/BadgesAndAchievements.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './BadgesAndAchievements.module.css';

const BadgesAndAchievements = ({ achievements, badgeUrl }) => {
  const { t } = useTranslation('UserIndex/Certifications/Certificates');

  return (
    <div className={styles.badges}>
      <h4>{t('badgesAndAchievements')}</h4>
      <div className={styles.badgeContainer}>
        <img src={badgeUrl} alt="Badge" className={styles.badgeImage} />
        <ul>
          {achievements.map((achievement, index) => (
            <li key={index}>{achievement}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BadgesAndAchievements;
