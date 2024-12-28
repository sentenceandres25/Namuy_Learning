// Components/RecentTopics/TopicsByCategory.jsx

import React from 'react';
import styles from './TopicsByCategory.module.css';
import { useTranslation } from 'react-i18next';

const TopicsByCategory = () => {
  const { t } = useTranslation('UserIndex/DiscussionForum/RecentTopics');

  // Sample data for categories
  const categories = [
    { id: 1, name: 'Study Techniques', topics: 12 },
    // More categories...
  ];

  return (
    <div className={styles.topicsByCategory}>
      <h4>{t('topicsByCategory')}</h4>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            <a href={`/forum/category/${category.id}`}>{category.name}</a> ({category.topics} {t('topics')})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopicsByCategory;
