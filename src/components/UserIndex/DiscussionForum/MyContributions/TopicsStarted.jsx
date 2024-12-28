// Components/MyContributions/TopicsStarted.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './TopicsStarted.module.css';
import { FaLightbulb } from 'react-icons/fa';

const TopicsStarted = ({ topics }) => {
  const { t } = useTranslation('UserIndex/DiscussionForum/MyContributions');

  const handleTopicClick = (topicId) => {
    // Navigate to the topic details page
    alert(`Navigating to topic with ID: ${topicId}`);
  };

  return (
    <div className={styles.topicsStarted}>
      <h3>
        <FaLightbulb /> {t('topicsStarted')}
      </h3>
      {topics.length > 0 ? (
        topics.map((topic) => (
          <div key={topic.id} className={styles.topicItem} onClick={() => handleTopicClick(topic.id)}>
            <h4>{topic.title}</h4>
            <p>
              <strong>{t('date')}:</strong> {topic.date}
            </p>
            <p>
              <strong>{t('replies')}:</strong> {topic.replies}
            </p>
          </div>
        ))
      ) : (
        <p>{t('noTopics')}</p>
      )}
    </div>
  );
};

export default TopicsStarted;
