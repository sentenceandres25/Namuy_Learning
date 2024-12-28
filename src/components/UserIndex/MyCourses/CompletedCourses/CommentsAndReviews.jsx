// Components/CompletedCourses/CommentsAndReviews.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './CommentsAndReviews.module.css';
import { motion } from 'framer-motion';

const CommentsAndReviews = ({ course }) => {
  const { t } = useTranslation('UserIndex/MyCourses/CompletedCourses');

  if (!course) {
    return null;
  }

  // Datos simulados de comentarios
  const comments = [
    {
      id: 1,
      comment: 'Excelente curso, muy recomendado.',
      rating: 5,
    },
    // Agrega más comentarios si es necesario
  ];

  return (
    <motion.div
      className={styles.comments}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h3>{t('commentsAndReviews')}</h3>
      {comments.map((item) => (
        <div key={item.id} className={styles.commentItem}>
          <p>{item.comment}</p>
          <p>{t('rating')}: {item.rating}/5</p>
        </div>
      ))}
    </motion.div>
  );
};

export default CommentsAndReviews;
