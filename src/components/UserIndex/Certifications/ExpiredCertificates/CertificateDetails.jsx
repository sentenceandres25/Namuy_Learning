// Components/ExpiredCertificates/CertificateDetails.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CertificateDetails.module.css';
import { motion } from 'framer-motion';
import RenewalOptions from './RenewalOptions';
import SuggestedCourses from './SuggestedCourses';
import DownloadExpiredCertificate from './DownloadExpiredCertificate';
import RenewalReminder from './RenewalReminder';

const CertificateDetails = ({ certificate }) => {
  const { t } = useTranslation('UserIndex/Certifications/ExpiredCertificates');

  return (
    <motion.div
      className={styles.certificateDetails}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h3>{certificate.courseName}</h3>
      <p>
        <strong>{t('institution')}:</strong> {certificate.institution}
      </p>
      <p>
        <strong>{t('obtainedDate')}:</strong> {certificate.obtainedDate}
      </p>
      <p>
        <strong>{t('expiredDate')}:</strong> {certificate.expiredDate}
      </p>
      <p>
        <strong>{t('reasonForExpiration')}:</strong> {certificate.reason}
      </p>
      <p>
        <strong>{t('certificationHistory')}:</strong> {certificate.history}
      </p>

      <DownloadExpiredCertificate downloadUrl={certificate.downloadUrl} />
      <RenewalOptions renewalUrl={certificate.renewalOptions} />
      <SuggestedCourses courses={certificate.suggestedCourses} />
      <RenewalReminder certificateId={certificate.id} />
    </motion.div>
  );
};

export default CertificateDetails;
