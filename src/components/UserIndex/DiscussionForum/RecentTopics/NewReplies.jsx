// Components/RecentTopics/NewReplies.jsx

import React from 'react';
import styles from './NewReplies.module.css';
import { FaReply } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const NewReplies = () => {
  const { t } = useTranslation('UserIndex/DiscussionForum/RecentTopics');

  // Sample data for topics with new replies
  const topics = [
    { id: 1, title: 'Understanding calculus', replies: 3 },
    // More topics...
  ];

  return (
    <div className={styles.newReplies}>
      <h3>{t('newReplies')}</h3>
      <ul>
        {topics.map((topic) => (
          <li key={topic.id}>
            <FaReply className={styles.icon} />
            <a href={`/forum/topic/${topic.id}`}>{topic.title}</a> ({topic.replies} {t('newRepliesCount')})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewReplies;
