// Components/Certificates/CertificateDetails.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CertificateDetails.module.css';
import { motion } from 'framer-motion';
import DownloadCertificate from './DownloadCertificate';
import ShareCertificate from './ShareCertificate';
import BadgesAndAchievements from './BadgesAndAchievements';
import RenewalInfo from './RenewalInfo';

const CertificateDetails = ({ certificate }) => {
  const { t } = useTranslation('UserIndex/Certifications/Certificates');

  return (
    <motion.div
      className={styles.certificateDetails}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h3>{certificate.courseName}</h3>
      <p><strong>{t('institution')}:</strong> {certificate.institution}</p>
      <p><strong>{t('obtainedDate')}:</strong> {certificate.obtainedDate}</p>
      <p><strong>{t('validUntil')}:</strong> {certificate.validUntil}</p>
      <p><strong>{t('status')}:</strong> {certificate.isValid ? t('valid') : t('expired')}</p>
      <p><strong>{t('topicsCovered')}:</strong> {certificate.topicsCovered.join(', ')}</p>

      <DownloadCertificate certificateId={certificate.id} />
      <ShareCertificate certificateId={certificate.id} />
      <BadgesAndAchievements achievements={certificate.achievements} badgeUrl={certificate.badgeUrl} />
      <RenewalInfo certificate={certificate} />
    </motion.div>
  );
};

export default CertificateDetails;
