// Components/RecentTopics/Acknowledgements.jsx

import React from 'react';
import styles from './Acknowledgements.module.css';
import { useTranslation } from 'react-i18next';

const Acknowledgements = () => {
  const { t } = useTranslation('UserIndex/DiscussionForum/RecentTopics');

  // Sample data for top contributors
  const contributors = [
    { id: 1, name: 'JohnDoe', contributions: 50 },
    // More contributors...
  ];

  return (
    <div className={styles.acknowledgements}>
      <h4>{t('acknowledgements')}</h4>
      <ul>
        {contributors.map((user) => (
          <li key={user.id}>
            {user.name} ({user.contributions} {t('contributions')})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Acknowledgements;
