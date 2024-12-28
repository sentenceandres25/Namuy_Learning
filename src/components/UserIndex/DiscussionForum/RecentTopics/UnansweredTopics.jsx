// Components/RecentTopics/UnansweredTopics.jsx

import React from 'react';
import styles from './UnansweredTopics.module.css';
import { FaQuestionCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const UnansweredTopics = () => {
  const { t } = useTranslation('UserIndex/DiscussionForum/RecentTopics');

  // Sample data for unanswered topics
  const topics = [
    { id: 1, title: t('needHelp') },
    // More topics...
  ];

  return (
    <div className={styles.unansweredTopics}>
      <h3>{t('unansweredTopics')}</h3>
      <ul>
        {topics.map((topic) => (
          <li key={topic.id}>
            <FaQuestionCircle className={styles.icon} />
            <a href={`/forum/topic/${topic.id}`}>{topic.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UnansweredTopics;
