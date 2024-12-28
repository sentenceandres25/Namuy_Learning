import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import styles from './PreferenciasUbicacion.module.css';

const PreferenciasUbicacion = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/UbicacionesGuardadas');
  const [notificaciones, setNotificaciones] = useState(true);

  const handleToggle = () => {
    setNotificaciones(!notificaciones);
  };

  return (
    <motion.div
      className={styles.preferenciasUbicacion}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2>{t('preferencias_ubicacion')}</h2>
      <Form>
        <Form.Group>
          <Form.Label>{t('ubicaciones_guardadas')}</Form.Label>
          <Form.Check
            type="switch"
            id="ubicaciones-switch"
            label={notificaciones ? t('activadas') : t('desactivadas')}
            checked={notificaciones}
            onChange={handleToggle}
          />
        </Form.Group>
        <Button variant="success" className={styles.submitButton}>
          {t('guardar_preferencias')}
        </Button>
      </Form>
    </motion.div>
  );
};

export default PreferenciasUbicacion;
