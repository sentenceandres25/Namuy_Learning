// Components/CompletedCourses/StudyMaterials.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './StudyMaterials.module.css';
import { motion } from 'framer-motion';

const StudyMaterials = ({ course }) => {
  const { t } = useTranslation('UserIndex/MyCourses/CompletedCourses');

  if (!course) {
    return null;
  }

  // Datos simulados de materiales
  const materials = [
    {
      id: 1,
      title: 'Presentación del curso',
      url: '/materials/presentation.pdf',
    },
    // Agrega más materiales si es necesario
  ];

  return (
    <motion.div
      className={styles.materials}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h3>{t('studyMaterials')}</h3>
      <ul>
        {materials.map((item) => (
          <li key={item.id}>
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </motion.div>
  );
};

export default StudyMaterials;
