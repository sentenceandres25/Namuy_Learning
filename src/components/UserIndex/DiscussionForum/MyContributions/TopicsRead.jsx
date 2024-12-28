// Components/MyContributions/TopicsRead.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './TopicsRead.module.css';
import { FaBookOpen } from 'react-icons/fa';

const TopicsRead = ({ topics }) => {
  const { t } = useTranslation('UserIndex/DiscussionForum/MyContributions');

  const handleReadClick = (topicTitle) => {
    // Navigate to the topic details page
    alert(`Viewing topic: ${topicTitle}`);
  };

  return (
    <div className={styles.topicsRead}>
      <h3>
        <FaBookOpen /> {t('topicsRead')}
      </h3>
      {topics.length > 0 ? (
        topics.map((topic) => (
          <div key={topic.id} className={styles.topicItem} onClick={() => handleReadClick(topic.title)}>
            <h4>{topic.title}</h4>
            <p>
              <strong>{t('dateRead')}:</strong> {topic.date}
            </p>
          </div>
        ))
      ) : (
        <p>{t('noTopicsRead')}</p>
      )}
    </div>
  );
};

export default TopicsRead;
