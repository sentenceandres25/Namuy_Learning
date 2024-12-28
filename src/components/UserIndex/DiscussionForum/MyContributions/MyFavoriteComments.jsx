// Components/MyContributions/MyFavoriteComments.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './MyFavoriteComments.module.css';
import { FaStar } from 'react-icons/fa';

const MyFavoriteComments = ({ favorites }) => {
  const { t } = useTranslation('UserIndex/DiscussionForum/MyContributions');

  const handleFavoriteClick = (topicTitle) => {
    // Navigate to the favorite comment details
    alert(`Viewing favorite comment on: ${topicTitle}`);
  };

  return (
    <div className={styles.myFavoriteComments}>
      <h3>
        <FaStar /> {t('myFavoriteComments')}
      </h3>
      {favorites.length > 0 ? (
        favorites.map((favorite) => (
          <div key={favorite.id} className={styles.favoriteItem} onClick={() => handleFavoriteClick(favorite.topicTitle)}>
            <h4>{favorite.topicTitle}</h4>
            <p>
              <strong>{t('date')}:</strong> {favorite.date}
            </p>
            <p>{favorite.content}</p>
          </div>
        ))
      ) : (
        <p>{t('noFavorites')}</p>
      )}
    </div>
  );
};

export default MyFavoriteComments;
