// Components/RecentTopics/PopularTopics.jsx

import React from 'react';
import styles from './PopularTopics.module.css';
import { useTranslation } from 'react-i18next';

const PopularTopics = () => {
  const { t } = useTranslation('UserIndex/DiscussionForum/RecentTopics');

  // Sample data for popular topics
  const popularTopics = [
    { id: 1, title: 'Best programming practices', replies: 25 },
    // More topics...
  ];

  return (
    <div className={styles.popularTopics}>
      <h4>{t('popularTopics')}</h4>
      <ul>
        {popularTopics.map((topic) => (
          <li key={topic.id}>
            <a href={`/forum/topic/${topic.id}`}>{topic.title}</a> ({topic.replies} {t('replies')})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PopularTopics;
