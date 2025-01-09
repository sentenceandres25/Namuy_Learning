// src/components/UserIndex/StudentProfile/GeneralInfo/SessionHistory.jsx

import React, { useState, useEffect, useContext } from 'react';
import { Form, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import styles from './SessionHistoryStyles.module.css'; 
import axios from '../../../../axiosConfig'; // Asegúrate de tener la ruta correcta
import { AuthContext } from '../../../../contexts/AuthContext';

const SessionHistory = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/GeneralInfo');
  const { user, login } = useContext(AuthContext); // Eliminamos token ya que se maneja en axiosConfig

  const [lastAccess, setLastAccess] = useState(null);
  const [notificationPreferences, setNotificationPreferences] = useState({
    email: false,
    sms: false,
    whatsapp: false
  });
  const [loading, setLoading] = useState(true); // Para cargar datos iniciales
  const [saving, setSaving] = useState(false); // Para guardar preferencias o actualizar last_access
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 1. Al montar, actualizar last_access solo una vez al iniciar sesión y obtener preferencias de notificación
  useEffect(() => {
    const updateAndFetchData = async () => {
      try {
        // Verificar si ya se actualizó last_access en esta sesión
        const hasUpdatedAccess = sessionStorage.getItem('hasUpdatedAccess');

        if (!hasUpdatedAccess) {
          // Actualizar la última hora de acceso
          const updateResponse = await axios.put('/session/last-access');

          if (updateResponse.data.last_access) {
            const utcDate = new Date(updateResponse.data.last_access);
            setLastAccess(utcDate.toLocaleString());
            // Marcar que ya se actualizó last_access en esta sesión
            sessionStorage.setItem('hasUpdatedAccess', 'true');
          }
        } else {
          // Obtener la última hora de acceso sin actualizar
          const accessResponse = await axios.get('/session/last-access');

          if (accessResponse.data.last_access) {
            const utcDate = new Date(accessResponse.data.last_access);
            setLastAccess(utcDate.toLocaleString());
          } else {
            setLastAccess(null);
          }
        }

        // Obtener las preferencias de notificación
        const preferencesResponse = await axios.get('/notifications/preferences');

        if (preferencesResponse.data.preferences) {
          setNotificationPreferences({
            email: preferencesResponse.data.preferences.email || false,
            sms: preferencesResponse.data.preferences.sms || false,
            whatsapp: preferencesResponse.data.preferences.whatsapp || false
          });
        } else {
          setNotificationPreferences({
            email: false,
            sms: false,
            whatsapp: false
          });
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching or updating data:', err.response?.data || err.message);
        setError(t('errorFetchingData'));
        setLoading(false);
      }
    };

    updateAndFetchData();
  }, [t]);

  // 2. Función para actualizar la hora de último acceso manualmente
  const handleUpdateLastAccess = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.put('/session/last-access');

      if (response.data.last_access) {
        const utcDate = new Date(response.data.last_access);
        setLastAccess(utcDate.toLocaleString());
        setSuccess(t('lastAccessUpdated'));
        // Opcional: Actualizar el contexto de usuario si quieres reflejar el nuevo last_access
        login({ ...user, last_access: response.data.last_access });
      }
    } catch (err) {
      console.error('Error updating last access:', err.response?.data || err.message);
      setError(t('errorUpdatingLastAccess'));
    } finally {
      setSaving(false);
    }
  };

  // 3. Manejar cambios en las casillas de verificación
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setNotificationPreferences(prevState => ({
      ...prevState,
      [name]: checked
    }));
  };

  // 4. Guardar preferencias de notificación
  const handleSavePreferences = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.put('/notifications/preferences', {
        preferences: notificationPreferences
      });

      if (response.data.message) {
        setSuccess(t('preferencesUpdated'));
      }
    } catch (err) {
      console.error('Error saving preferences:', err.response?.data || err.message);
      setError(t('errorSavingPreferences'));
    } finally {
      setSaving(false);
    }
  };

  // 5. Formatear la fecha/hora para mostrarla en la interfaz
  const formattedLastAccess = lastAccess
    ? lastAccess
    : t('noSessionData');

  if (loading) {
    return (
      <motion.div
        className={styles.sessionHistoryContainer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Spinner animation="border" role="status" className={styles.spinner}>
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={styles.sessionHistoryContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h3 className={styles.sessionTitle}>{t('session_history')}</h3>
      <Form>
        {/* Último Acceso */}
        <Form.Group as={Row} className={styles.formGroup}>
          <Form.Label column sm={4} className={styles.sessionFormLabel}>
            {t('last_access')}
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

        {/* Botón para actualizar último acceso */}
        <Form.Group as={Row} className={styles.formGroup}>
          <Col sm={{ span: 8, offset: 4 }}>
            <Button
              className={styles.sessionButton}
              onClick={handleUpdateLastAccess}
              disabled={saving}
            >
              <FontAwesomeIcon icon={faBell} /> {t('update_last_access')}
            </Button>
          </Col>
        </Form.Group>

        {/* Preferencias de Notificaciones */}
        <Form.Group as={Row} className={styles.formGroup}>
          <Form.Label column sm={4} className={styles.sessionFormLabel}>
            {t('notification_preferences')}
          </Form.Label>
          <Col sm={8}>
            <Form.Check
              type="checkbox"
              id="email-notifications"
              name="email"
              label={t('email')}
              checked={notificationPreferences.email}
              onChange={handleCheckboxChange}
              className={styles.notificationCheckbox}
            />
            <Form.Check
              type="checkbox"
              id="sms-notifications"
              name="sms"
              label={t('sms')}
              checked={notificationPreferences.sms}
              onChange={handleCheckboxChange}
              className={styles.notificationCheckbox}
            />
            <Form.Check
              type="checkbox"
              id="whatsapp-notifications"
              name="whatsapp"
              label={t('whatsapp')}
              checked={notificationPreferences.whatsapp}
              onChange={handleCheckboxChange}
              className={styles.notificationCheckbox}
            />
          </Col>
        </Form.Group>

        {/* Botón para guardar preferencias */}
        <Form.Group as={Row} className={styles.formGroup}>
          <Col sm={{ span: 8, offset: 4 }}>
            <Button
              className={styles.sessionButton}
              onClick={handleSavePreferences}
              disabled={saving}
            >
              {saving ? t('saving') : t('save_preferences')}
            </Button>
          </Col>
        </Form.Group>

        {/* Mensajes de Éxito o Error */}
        {error && (
          <Form.Group as={Row} className={styles.formGroup}>
            <Col sm={{ span: 8, offset: 4 }}>
              <Alert variant="danger">{error}</Alert>
            </Col>
          </Form.Group>
        )}
        {success && (
          <Form.Group as={Row} className={styles.formGroup}>
            <Col sm={{ span: 8, offset: 4 }}>
              <Alert variant="success">{success}</Alert>
            </Col>
          </Form.Group>
        )}
      </Form>
    </motion.div>
  );
};

export default SessionHistory;
