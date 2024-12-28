// Components/RecentTopics/TopicList.jsx

import React from 'react';
import styles from './TopicList.module.css';
import { FaComments } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const TopicList = () => {
  const { t } = useTranslation('UserIndex/DiscussionForum/RecentTopics');

  // Sample data for topics
  const topics = [
    {
      id: 1,
      title: 'How to improve study habits?',
      author: 'JaneDoe',
      date: '2023-11-05',
      replies: 5,
    },
    // More topics...
  ];

  return (
    <div className={styles.topicList}>
      <h3>{t('currentTopics')}</h3>
      <ul>
        {topics.map((topic) => (
          <li key={topic.id}>
            <FaComments className={styles.icon} />
            <div>
              <h4>{topic.title}</h4>
              <p>
                {t('by')} {topic.author} {t('on')} {topic.date} - {topic.replies} {t('replies')}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopicList;
