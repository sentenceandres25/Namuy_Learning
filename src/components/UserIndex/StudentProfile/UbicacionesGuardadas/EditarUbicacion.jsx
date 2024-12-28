import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import styles from './EditarUbicacion.module.css';

const EditarUbicacion = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/UbicacionesGuardadas');
  const [ubicacion, setUbicacion] = useState(t('ubicacion_1'));

  const handleUpdate = (e) => {
    e.preventDefault();
    console.log(`${t('editar_ubicacion')}:`, ubicacion);
  };

  return (
    <motion.div
      className={styles.editarUbicacion}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2>{t('editar_ubicacion')}</h2>
      <Form onSubmit={handleUpdate}>
        <Form.Group>
          <Form.Label>{t('ubicaciones_guardadas')}</Form.Label>
          <Form.Control
            type="text"
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            required
          />
        </Form.Group>
        <Button type="submit" variant="warning" className={styles.submitButton}>
          {t('actualizar_ubicacion')}
        </Button>
      </Form>
    </motion.div>
  );
};

export default EditarUbicacion;
