// Components/TermsAndConditions/UserResponsibilities.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './UserResponsibilities.module.css';

const UserResponsibilities = () => {
  const { t } = useTranslation('UserIndex/AcademicRegulations/TermsAndConditions');
  const userResponsibilities = t('userResponsibilities', { returnObjects: true });

  return (
    <div className={styles.userResponsibilities}>
      <h3 className={styles.mainTitle}>{userResponsibilities.title}</h3>
      <p className={styles.mainText}>{userResponsibilities.text}</p>
      {userResponsibilities.sections.map((section, index) => (
        <div key={index} className={styles.section}>
          <h5 className={styles.subtitle}>
            <strong>{section.subtitle}</strong>
          </h5>
          {section.points.map((point, pIndex) => (
            <div key={pIndex} className={styles.point}>
              <p className={styles.pointText}>
                <span className={styles.bullet}>•</span>{' '}
                <strong>{point.title}:</strong> {point.description}
              </p>
              {point.subpoints && point.subpoints.length > 0 && (
                <ul className={styles.subpoints}>
                  {point.subpoints.map((subpoint, sIndex) => (
                    <li key={sIndex} className={styles.subpoint}>
                      <strong>{subpoint.title}:</strong> {subpoint.description}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default UserResponsibilities;
