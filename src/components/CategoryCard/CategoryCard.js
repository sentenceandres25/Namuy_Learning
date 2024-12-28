import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './CategoryCard.css';

const CategoryCard = ({ titleKey, imageUrl }) => {
  const { t } = useTranslation('categoriesData');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );
  
    document.querySelectorAll('.fade-in-section').forEach((section) => {
      observer.observe(section);
    });
  
    return () => observer.disconnect();
  }, []);

  return (
    <div className="category-card fade-in-section">
      <img src={imageUrl} alt={t(titleKey)} className="category-image" />
      <h3>{t(titleKey)}</h3> {/* Traducir el título */}
    </div>
  );
};

export default CategoryCard;
