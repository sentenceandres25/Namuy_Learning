// components/UbicacionesGuardadas/MisUbicaciones.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import styles from './MisUbicaciones.module.css';

const MisUbicaciones = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/UbicacionesGuardadas');

  return (
    <motion.div
      className={styles.misUbicaciones}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2>{t('mis_ubicaciones')}</h2>
      <p>{t('descripcion_mis_ubicaciones')}</p>
      <ul className={styles.locationList}>
        <li>{t('ubicacion_1')}</li>
        <li>{t('ubicacion_2')}</li>
      </ul>
    </motion.div>
  );
};

export default MisUbicaciones;
