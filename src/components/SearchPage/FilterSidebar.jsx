// FilterSidebar.jsx
import React, { useState } from 'react';
import styles from './FilterSidebar.module.css';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'; // Importar iconos de estrellas

const FilterSidebar = ({ t }) => {
  const [showVideoDuration, setShowVideoDuration] = useState(false);
  const [showSubject, setShowSubject] = useState(false);
  const [showLevel, setShowLevel] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(false);
  const [showPrice, setShowPrice] = useState(false);
  const [selectedRatings, setSelectedRatings] = useState([]);

  const toggleSection = (sectionSetter, current) => {
    sectionSetter(!current);
  };

  const handleRatingClick = (rating) => {
    if (selectedRatings.includes(rating)) {
      setSelectedRatings(selectedRatings.filter((r) => r !== rating));
    } else {
      setSelectedRatings([...selectedRatings, rating]);
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<AiFillStar key={i} color="#FFD700" />);
      } else if (i === fullStars + 1 && halfStar) {
        stars.push(<AiFillStar key={i} color="#FFD700" style={{ clipPath: 'inset(0 50% 0 0)' }} />);
      } else {
        stars.push(<AiOutlineStar key={i} color="#FFD700" />);
      }
    }

    return stars;
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.topOptions}>
        <a href="#certprep" className={styles.topLink}>{t('prepCoursesLink')}</a>
        <div className={styles.sortBy}>
          <span>{t('sortBy')}: </span>
          <select>
            <option>{t('sortByPopularity')}</option>
            <option>{t('sortByNewest')}</option>
            <option>{t('sortByRating')}</option>
          </select>
        </div>
      </div>

      {/* Sección Valoraciones */}
      <div className={styles.section}>
        <h3>{t('ratings')}</h3>
        <div className={styles.ratingOptions}>
          {[5, 4, 3, 2, 1].map((rating) => (
            <label key={rating} className={styles.ratingLabel}>
              <input
                type="checkbox"
                checked={selectedRatings.includes(rating)}
                onChange={() => handleRatingClick(rating)}
              />
              <div className={styles.stars}>
                {renderStars(rating)}
              </div>
              <span className={styles.ratingText}>{rating} {t('stars')}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Idioma */}
      <div className={styles.section}>
        <h3>{t('language')}</h3>
        <label><input type="checkbox" /> English</label><br />
        <label><input type="checkbox" /> Español</label><br />
      </div>

      {/* Experiencia práctica */}
      <div className={styles.section}>
        <h3>{t('practicalExperience')}</h3>
        <label><input type="checkbox" /> {t('certificationPrep')}</label><br />
        <label><input type="checkbox" /> Projects included</label><br />
      </div>

      {/* Duración del video */}
      <div className={styles.section}>
        <h3 onClick={() => toggleSection(setShowVideoDuration, showVideoDuration)} className={styles.toggleTitle}>
          {t('videoDuration')} {showVideoDuration ? '-' : '+'}
        </h3>
        {showVideoDuration && (
          <div className={styles.subOptions}>
            <label><input type="checkbox" /> 1-3 {t('hours')}</label><br />
            <label><input type="checkbox" /> 3-6 {t('hours')}</label><br />
          </div>
        )}
      </div>

      {/* Tema */}
      <div className={styles.section}>
        <h3 onClick={() => toggleSection(setShowSubject, showSubject)} className={styles.toggleTitle}>
          {t('subject')} {showSubject ? '-' : '+'}
        </h3>
        {showSubject && (
          <div className={styles.subOptions}>
            <label><input type="checkbox" /> Web Development</label><br />
            <label><input type="checkbox" /> Data Science</label><br />
          </div>
        )}
      </div>

      {/* Nivel */}
      <div className={styles.section}>
        <h3 onClick={() => toggleSection(setShowLevel, showLevel)} className={styles.toggleTitle}>
          {t('level')} {showLevel ? '-' : '+'}
        </h3>
        {showLevel && (
          <div className={styles.subOptions}>
            <label><input type="checkbox" /> Beginner</label><br />
            <label><input type="checkbox" /> Intermediate</label><br />
            <label><input type="checkbox" /> Advanced</label><br />
          </div>
        )}
      </div>

      {/* Subtítulos */}
      <div className={styles.section}>
        <h3 onClick={() => toggleSection(setShowSubtitles, showSubtitles)} className={styles.toggleTitle}>
          {t('subtitles')} {showSubtitles ? '-' : '+'}
        </h3>
        {showSubtitles && (
          <div className={styles.subOptions}>
            <label><input type="checkbox" /> English</label><br />
            <label><input type="checkbox" /> Español</label><br />
          </div>
        )}
      </div>

      {/* Precio */}
      <div className={styles.section}>
        <h3 onClick={() => toggleSection(setShowPrice, showPrice)} className={styles.toggleTitle}>
          {t('price')} {showPrice ? '-' : '+'}
        </h3>
        {showPrice && (
          <div className={styles.subOptions}>
            <label><input type="checkbox" /> Gratis</label><br />
            <label><input type="checkbox" /> Pago</label><br />
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterSidebar;
