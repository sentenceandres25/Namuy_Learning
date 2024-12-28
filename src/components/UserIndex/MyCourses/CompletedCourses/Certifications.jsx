// Components/CompletedCourses/Certifications.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Certifications.module.css';
import { motion } from 'framer-motion';

const Certifications = ({ course }) => {
  const { t } = useTranslation('UserIndex/MyCourses/CompletedCourses');

  if (!course) {
    return null;
  }

  return (
    <motion.div
      className={styles.certifications}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h3>{t('certifications')}</h3>
      <a href={`/certificates/${course.id}`} className={styles.downloadButton}>
        {t('downloadCertificate')}
      </a>
    </motion.div>
  );
};

export default Certifications;
