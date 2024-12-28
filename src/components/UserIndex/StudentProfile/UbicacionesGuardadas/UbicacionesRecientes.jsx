import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import styles from './UbicacionesRecientes.module.css';

const UbicacionesRecientes = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/UbicacionesGuardadas');

  return (
    <motion.div
      className={styles.ubicacionesRecientes}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2>{t('ubicaciones_recientes')}</h2>
      <ul className={styles.recientesList}>
        <li>{t('ubicacion_1')}</li>
        <li>{t('ubicacion_2')}</li>
      </ul>
    </motion.div>
  );
};

export default UbicacionesRecientes;
