// Components/CertificatesInProgress/ProgressDetails.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ProgressDetails.module.css';
import { motion } from 'framer-motion';
import PendingRequirements from './PendingRequirements';
import StudyMaterials from './StudyMaterials';
import PerformanceStats from './PerformanceStats';
import SupportSection from './SupportSection';

const ProgressDetails = ({ certificate }) => {
  const { t } = useTranslation('UserIndex/Certifications/CertificatesInProgress');

  return (
    <motion.div
      className={styles.progressDetails}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h3>{certificate.courseName}</h3>
      <p><strong>{t('institution')}:</strong> {certificate.institution}</p>
      <p><strong>{t('startDate')}:</strong> {certificate.startDate}</p>
      <p><strong>{t('estimatedEndDate')}:</strong> {certificate.estimatedEndDate}</p>
      <p><strong>{t('currentProgress')}:</strong> {certificate.progress}%</p>
      <PendingRequirements requirements={certificate.pendingRequirements} />
      <StudyMaterials materials={certificate.studyMaterials} />
      <PerformanceStats stats={certificate.performanceStats} />
      <SupportSection supportContact={certificate.supportContact} />
    </motion.div>
  );
};

export default ProgressDetails;
