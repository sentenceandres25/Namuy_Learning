import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import styles from './AgregarUbicacion.module.css';

const AgregarUbicacion = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/UbicacionesGuardadas');
  const [ubicacion, setUbicacion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`${t('ubicaciones_guardadas')}:`, ubicacion);
    setUbicacion('');
  };

  return (
    <motion.div
      className={styles.agregarUbicacion}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2>{t('agregar_ubicacion')}</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>{t('ubicaciones_guardadas')}</Form.Label>
          <Form.Control
            type="text"
            placeholder={t('ubicacion_1')}
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            required
          />
        </Form.Group>
        <Button type="submit" variant="primary" className={styles.submitButton}>
          {t('agregar_ubicacion')}
        </Button>
      </Form>
    </motion.div>
  );
};

export default AgregarUbicacion;
