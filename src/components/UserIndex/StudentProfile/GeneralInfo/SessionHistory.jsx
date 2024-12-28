// SessionHistory.jsx
import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import styles from './SessionHistoryStyles.module.css'; // Importamos el módulo CSS con nombres únicos

const SessionHistory = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/GeneralInfo');

  return (
    <motion.div
      className={styles.sessionHistoryContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h3 className={styles.sessionTitle}>{t('historial_sesiones')}</h3> {/* Título traducido */}
      <Form>
        <Form.Group as={Row} >
          <Form.Label column sm={4} className={styles.sessionFormLabel}>
            {t('ultimo_acceso')}
          </Form.Label>
          <Col sm={8}>
            <Form.Control
              type="text"
              placeholder="20 de Octubre, 2024 - 10:30 AM"
              className={styles.sessionInput}
              disabled
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} >
          <Form.Label column sm={4} className={styles.sessionFormLabel}>
            {t('preferencias_notificaciones')}
          </Form.Label>
          <Col sm={8}>
            <Button className={styles.sessionButton}>
              <FontAwesomeIcon icon={faBell} /> {t('gestionar_notificaciones')}
            </Button>
          </Col>
        </Form.Group>
      </Form>
    </motion.div>
  );
};

export default SessionHistory;
