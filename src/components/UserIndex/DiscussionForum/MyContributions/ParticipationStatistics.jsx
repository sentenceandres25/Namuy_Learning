// Components/MyContributions/ParticipationStatistics.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ParticipationStatistics.module.css';
import { FaCommentDots, FaFileAlt, FaReply } from 'react-icons/fa';

const ParticipationStatistics = ({ stats }) => {
  const { t } = useTranslation('UserIndex/DiscussionForum/MyContributions');

  return (
    <div className={styles.participationStatistics}>
      <h3>{t('participationStatistics')}</h3>
      <div className={styles.statsContainer}>
        <div className={styles.statItem}>
          <FaCommentDots className={styles.icon} />
          <p>{t('totalMessages')}</p>
          <h4>{stats.totalMessages}</h4>
        </div>
        <div className={styles.statItem}>
          <FaFileAlt className={styles.icon} />
          <p>{t('topicsIStarted')}</p>
          <h4>{stats.topicsStarted}</h4>
        </div>
        <div className={styles.statItem}>
          <FaReply className={styles.icon} />
          <p>{t('repliesReceived')}</p>
          <h4>{stats.repliesReceived}</h4>
        </div>
      </div>
    </div>
  );
};

export default ParticipationStatistics;
