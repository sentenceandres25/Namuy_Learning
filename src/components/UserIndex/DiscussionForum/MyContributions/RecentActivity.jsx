// Components/MyContributions/RecentActivity.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './RecentActivity.module.css';
import { FaHistory } from 'react-icons/fa';

const RecentActivity = ({ activities }) => {
  const { t } = useTranslation('UserIndex/DiscussionForum/MyContributions');

  const handleActivityClick = (description) => {
    // Logic to view the activity details
    alert(`Viewing activity: ${description}`);
  };

  return (
    <div className={styles.recentActivity}>
      <h3>
        <FaHistory /> {t('recentActivity')}
      </h3>
      {activities.length > 0 ? (
        activities.map((activity) => (
          <div key={activity.id} className={styles.activityItem} onClick={() => handleActivityClick(activity.description)}>
            <p>{activity.description}</p>
            <p>
              <strong>{t('date')}:</strong> {activity.date}
            </p>
          </div>
        ))
      ) : (
        <p>{t('noRecentActivity')}</p>
      )}
    </div>
  );
};

export default RecentActivity;
