// src/components/Settings/NotificationSettings.jsx

import React, { useState, useEffect, useContext } from 'react';
import { Form, Row, Col, Button, Spinner, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import styles from './NotificationSettings.module.css';
import axios from '../../../../axiosConfig'; // Usar la instancia correcta de Axios
import { AuthContext } from '../../../../contexts/AuthContext';

const NotificationSettings = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/Settings');
  const { user } = useContext(AuthContext); // Eliminamos token ya que se maneja en axiosConfig

  const [notificationPreferences, setNotificationPreferences] = useState({
    email: false,
    sms: false,
    whatsapp: false,
  });
  const [loading, setLoading] = useState(true); // Para cargar datos iniciales
  const [saving, setSaving] = useState(false); // Para guardar preferencias
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 1. Al montar, obtener preferencias de notificación
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await axios.get('/notifications/preferences'); // Ruta sin user_id

        if (response.data.preferences) {
          setNotificationPreferences({
            email: response.data.preferences.email || false,
            sms: response.data.preferences.sms || false,
            whatsapp: response.data.preferences.whatsapp || false,
          });
        } else {
          setNotificationPreferences({
            email: false,
            sms: false,
            whatsapp: false,
          });
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching preferences:', err.response?.data || err.message);
        setError(t('errorFetchingPreferences'));
        setLoading(false);
      }
    };

    if (user) {
      fetchPreferences();
    } else {
      setLoading(false);
    }
  }, [user, t]);

  // 2. Manejar cambios en las casillas de verificación
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setNotificationPreferences((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  // 3. Guardar preferencias de notificación
  const handleSavePreferences = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.put(
        '/notifications/preferences',
        {
          preferences: notificationPreferences,
        }
      );

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

  if (loading) {
    return (
      <motion.div
        className={styles.notificationSettings}
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
      className={styles.notificationSettings}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2>{t('notifications')}</h2>
      <Form>
        {/* Preferencias de Notificaciones */}
        <Form.Group as={Row} className={styles.formGroup}>
          <Form.Label column sm={4} className={styles.formLabel}>
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
              className={styles.saveButton}
              onClick={handleSavePreferences}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />{' '}
                  {t('saving')}
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faBell} /> {t('save_preferences')}
                </>
              )}
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

export default NotificationSettings;
