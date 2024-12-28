// Evaluations.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import styles from './EvaluationsStyles.module.css'; // Importa el CSS Module con nombres únicos

const Evaluations = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/AcademicHistory');

  const evaluations = [
    {
      nombre: 'Examen Final de Matemáticas',
      fecha: '22/05/2021',
      calificacion: 'Aprobado',
      estado: 'Aprobado',
    },
    {
      nombre: 'Proyecto React',
      fecha: '16/08/2021',
      calificacion: 'Sobresaliente',
      estado: 'Aprobado',
    },
  ];

  return (
    <div className={styles.evaluationsContainer}>
      <h2 className={styles.evaluationsTitle}>{t('evaluations')}</h2>
      {evaluations.map((evaluation, index) => (
        <motion.div
          key={index}
          className={styles.evaluationCard} // Usamos la clase del CSS Module
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.2 }}
        >
          <h3 className={styles.evaluationCardTitle}>{evaluation.nombre}</h3>
          <p className={styles.evaluationCardContent}>
            {t('evaluationDate')}: {evaluation.fecha}
          </p>
          <p className={styles.evaluationCardContent}>
            {t('obtainedGrade')}: {evaluation.calificacion}
          </p>
          <p
            className={`${styles.evaluationCardContent} ${
              evaluation.estado === 'Aprobado'
                ? styles.evaluationStatusApproved
                : styles.evaluationStatusFailed
            }`}
          >
            {t('status')}: {evaluation.estado}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default Evaluations;
