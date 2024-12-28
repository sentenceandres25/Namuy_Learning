// Components/MyContributions/RelatedTopicsLinks.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './RelatedTopicsLinks.module.css';
import { FaLink } from 'react-icons/fa';

const RelatedTopicsLinks = ({ topics }) => {
  const { t } = useTranslation('UserIndex/DiscussionForum/MyContributions');

  const handleRelatedTopicClick = (topicTitle) => {
    // Navigate to the related topic details
    alert(`Navigating to related topic: ${topicTitle}`);
  };

  return (
    <div className={styles.relatedTopicsLinks}>
      <h3>
        <FaLink /> {t('relatedTopics')}
      </h3>
      {topics.length > 0 ? (
        topics.map((topic) => (
          <div key={topic.id} className={styles.topicItem} onClick={() => handleRelatedTopicClick(topic.title)}>
            <h4>{topic.title}</h4>
            <p>
              <strong>{t('date')}:</strong> {topic.date}
            </p>
          </div>
        ))
      ) : (
        <p>{t('noRelatedTopics')}</p>
      )}
    </div>
  );
};

export default RelatedTopicsLinks;
