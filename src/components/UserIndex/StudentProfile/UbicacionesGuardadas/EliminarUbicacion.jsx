import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import styles from './EliminarUbicacion.module.css';

const EliminarUbicacion = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/UbicacionesGuardadas');
  const [ubicacion, setUbicacion] = useState(t('ubicacion_1'));

  const handleDelete = (e) => {
    e.preventDefault();
    console.log(`${t('eliminar_ubicacion')}:`, ubicacion);
  };

  return (
    <motion.div
      className={styles.eliminarUbicacion}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2>{t('eliminar_ubicacion')}</h2>
      <Form onSubmit={handleDelete}>
        <Form.Group>
          <Form.Label>{t('ubicaciones_guardadas')}</Form.Label>
          <Form.Control
            as="select"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
          >
            <option>{t('ubicacion_1')}</option>
            <option>{t('ubicacion_2')}</option>
          </Form.Control>
        </Form.Group>
        <Button type="submit" variant="danger" className={styles.submitButton}>
          {t('eliminar_ubicacion')}
        </Button>
      </Form>
    </motion.div>
  );
};

export default EliminarUbicacion;
