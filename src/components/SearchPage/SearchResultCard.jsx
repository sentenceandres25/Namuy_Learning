// SearchResultCard.jsx
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'; // Importar iconos de estrellas
import styles from './SearchResultCard.module.css';

const SearchResultCard = ({ t, course }) => {
  const { lang } = useParams(); // Obtener el idioma actual desde los parámetros de la ruta

  // Función para renderizar las estrellas según la calificación
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<AiFillStar key={i} color="#FFD700" />);
      } else if (i === fullStars + 1 && halfStar) {
        stars.push(
          <AiFillStar
            key={i}
            color="#FFD700"
            style={{ clipPath: 'inset(0 50% 0 0)' }}
            aria-label="Half Star"
          />
        );
      } else {
        stars.push(<AiOutlineStar key={i} color="#FFD700" />);
      }
    }

    return stars;
  };

  return (
    <Link to={`/user/CoursePage/${lang}/${course.id}`} className={styles.link}>
      <div className={styles.card}>
        <div className={styles.imageSection}>
          <img src={course.image} alt={course.name} />
        </div>

        <div className={styles.contentSection}>
          <div className={styles.textInfo}>
            <div className={styles.topRow}>
              <h4 className={styles.courseName}>{course.name}</h4>
              {course.bestSeller && (
                <span className={styles.bestSeller}>{t('bestSeller')}</span>
              )}
            </div>
            <p className={styles.instructor}>
              {t('instructor')} {course.instructor}
            </p>
            <p className={styles.details}>
              {course.rating} {renderStars(course.rating)} ({t('peopleRated', { count: course.peopleRated })}) • {course.hours} {t('hours')} • {course.classes} {t('classes')}
            </p>
            <p className={styles.levels}>{course.levels.join(', ')}</p>
          </div>
          <div className={styles.priceSection}>
            <span className={styles.price}>${course.price.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default SearchResultCard;
