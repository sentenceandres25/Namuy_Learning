// SessionHistory.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import styles from './SessionHistoryStyles.module.css'; 
import axios from '../../../../axiosConfig'; // Ajusta la ruta si difiere en tu proyecto
import { AuthContext } from '../../../../contexts/AuthContext';

const SessionHistory = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/GeneralInfo');
  const { user, token } = useContext(AuthContext);

  const [lastAccess, setLastAccess] = useState(null);

  // 1. Al montar, obtener last_access del backend
  useEffect(() => {
    if (!user?.user_id) return;

    axios
      .get(`/session/${user.user_id}/last-access`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        // Ej: { "user_id": 11, "last_access": "2024-12-25T10:30:00" }
        if (response.data.last_access) {
          setLastAccess(new Date(response.data.last_access));
        } else {
          setLastAccess(null); // Por si viene nulo
        }
      })
      .catch((err) => {
        console.error('Error fetching last access:', err.response?.data || err.message);
      });
  }, [user, token]);

  // 2. Función para actualizar la hora de último acceso
  const handleUpdateLastAccess = () => {
    if (!user?.user_id) return;

    axios
      .put(`/session/${user.user_id}/last-access`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        /*
          Ej: {
            "message": "Last access updated successfully",
            "last_access": "2024-12-25T12:22:55.12345"
          }
        */
        if (response.data.last_access) {
          setLastAccess(new Date(response.data.last_access));
        }
      })
      .catch((err) => {
        console.error('Error updating last access:', err.response?.data || err.message);
      });
  };

  // 3. Formatear la fecha/hora para mostrarla en la interfaz
  const formattedLastAccess = lastAccess
    ? lastAccess.toLocaleString() // Ejemplo de formateo local
    : t('noSessionData');        // Clave en el archivo de traducción

  return (
    <motion.div
      className={styles.sessionHistoryContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h3 className={styles.sessionTitle}>{t('historial_sesiones')}</h3>
      <Form>
        <Form.Group as={Row}>
          <Form.Label column sm={4} className={styles.sessionFormLabel}>
            {t('ultimo_acceso')}
          </Form.Label>
          <Col sm={8}>
            <Form.Control
              type="text"
              value={formattedLastAccess}
              className={styles.sessionInput}
              disabled
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm={4} className={styles.sessionFormLabel}>
            {t('preferencias_notificaciones')}
          </Form.Label>
          <Col sm={8}>
            <Button className={styles.sessionButton} onClick={handleUpdateLastAccess}>
              <FontAwesomeIcon icon={faBell} /> {t('gestionar_notificaciones')}
            </Button>
          </Col>
        </Form.Group>
      </Form>
    </motion.div>
  );
};

export default SessionHistory;
