// src/components/Settings/PrivacySettings.jsx

import React, { useState, useEffect, useContext } from 'react';
import { Form, Row, Col, Button, Spinner, Alert, Modal } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import styles from './PrivacySettings.module.css';
import axios from '../../../../axiosConfig'; // Usar la instancia correcta de Axios
import { AuthContext } from '../../../../contexts/AuthContext';

const PrivacySettings = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/Settings');
  const { user } = useContext(AuthContext); // Asumiendo que AuthContext provee la info del usuario

  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [codeSent, setCodeSent] = useState(false);

  // Obtener preferencias de 2FA al montar
  useEffect(() => {
    const fetch2FASettings = async () => {
      try {
        const response = await axios.get('/users/2fa/preferences');
        const data = response.data;
        setTwoFactorAuth(data.twoFactorEnabled);
        setEmail(data.email || '');
        setPhoneNumber(data.contactNumber || '');
        setLoading(false);
      } catch (err) {
        console.error('Error fetching 2FA settings:', err.response?.data || err.message);
        setError(t('errorFetching2FASettings'));
        setLoading(false);
      }
    };

    if (user) {
      fetch2FASettings();
    } else {
      setLoading(false);
    }
  }, [user, t]);

  // Manejar cambios en 2FA
  const handleTwoFactorAuthChange = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      if (!twoFactorAuth) {
        // Habilitar 2FA: abrir modal para ingresar email y teléfono
        setShowVerificationModal(true);
      } else {
        // Deshabilitar 2FA
        await axios.put('/users/2fa/preferences', { twoFactorEnabled: false });
        setTwoFactorAuth(false);
        setSuccess(t('twoFactorDisabled'));
      }
    } catch (err) {
      console.error('Error updating 2FA settings:', err.response?.data || err.message);
      setError(t('errorUpdating2FASettings'));
    } finally {
      setSaving(false);
    }
  };

  // Enviar código de verificación
  const handleSendVerificationCode = async () => {
    if (!email && !phoneNumber) {
      setError(t('errorNoContactMethod'));
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await axios.post('/users/2fa/send-code', { email, phoneNumber });
      setCodeSent(true);
      setSuccess(t('codeSent'));
    } catch (err) {
      console.error('Error sending verification code:', err.response?.data || err.message);
      setError(t('errorSendingCode'));
    } finally {
      setSaving(false);
    }
  };

  // Verificar código y habilitar 2FA
  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setError(t('errorNoCode'));
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Determinar el método utilizado para recibir el código
      let method = '';
      if (email) method = 'email';
      if (phoneNumber) method = 'sms'; // Ajusta según la lógica de tu aplicación

      await axios.post('/users/2fa/verify', { code: verificationCode, method });
      setTwoFactorAuth(true);
      setShowVerificationModal(false);
      setSuccess(t('twoFactorEnabled'));
    } catch (err) {
      console.error('Error verifying code:', err.response?.data || err.message);
      setError(t('errorVerifyingCode'));
    } finally {
      setSaving(false);
    }
  };

  // Manejar cambios en las casillas de contacto
  const handleContactChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'phoneNumber') {
      setPhoneNumber(value);
    }
  };

  if (loading) {
    return (
      <motion.div
        className={styles.privacySettings}
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
      className={styles.privacySettings}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2>{t('privacy')}</h2>

      {/* Configuración de 2FA */}
      <div className={styles.settingItem}>
        <Form>
          <Form.Group as={Row} className={styles.formGroup}>
            <Form.Label column sm={4} className={styles.label}>
              {t('twoFactorAuth')}
            </Form.Label>
            <Col sm={8}>
              <Form.Check
                type="switch"
                id="twoFactorAuthSwitch"
                label={twoFactorAuth ? t('enabled') : t('disabled')}
                checked={twoFactorAuth}
                onChange={handleTwoFactorAuthChange}
              />
            </Col>
          </Form.Group>
        </Form>
      </div>

      {/* Modal de Verificación de 2FA */}
      <Modal show={showVerificationModal} onHide={() => setShowVerificationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t('enableTwoFactorAuth')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form>
            <Form.Group controlId="formEmail">
              <Form.Label>{t('email')}</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={email}
                onChange={handleContactChange}
                placeholder={t('enterEmail')}
                required
              />
            </Form.Group>

            <Form.Group controlId="formPhoneNumber" className="mt-3">
              <Form.Label>{t('phoneNumber')}</Form.Label>
              <Form.Control
                type="tel"
                name="phoneNumber"
                value={phoneNumber}
                onChange={handleContactChange}
                placeholder={t('enterPhoneNumber')}
                required
              />
            </Form.Group>

            {!codeSent && (
              <Button variant="primary" onClick={handleSendVerificationCode} disabled={saving} className="mt-3">
                {saving ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />{' '}
                    {t('sendingCode')}
                  </>
                ) : (
                  t('sendVerificationCode')
                )}
              </Button>
            )}

            {codeSent && (
              <>
                <Form.Group controlId="formVerificationCode" className="mt-3">
                  <Form.Label>{t('verificationCode')}</Form.Label>
                  <Form.Control
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder={t('enterVerificationCode')}
                    required
                  />
                </Form.Group>
                <Button variant="success" onClick={handleVerifyCode} disabled={saving} className="mt-2">
                  {saving ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />{' '}
                      {t('verifying')}
                    </>
                  ) : (
                    t('verifyCode')
                  )}
                </Button>
              </>
            )}
          </Form>
        </Modal.Body>
      </Modal>

      {/* Otras configuraciones de privacidad */}
      <div className={styles.settingItem}>
        <Form>
          {/* Ejemplo de configuración adicional: Gestión de sesiones activas */}
          <Form.Group as={Row} className={styles.formGroup}>
            <Form.Label column sm={4} className={styles.label}>
              {t('activeSessions')}
            </Form.Label>
            <Col sm={8}>
              <Button variant="outline-primary" onClick={() => {/* Implementar lógica de gestión */}}>
                {t('manage')}
              </Button>
            </Col>
          </Form.Group>

          {/* Ejemplo de configuración adicional: Registro de actividad */}
          <Form.Group as={Row} className={styles.formGroup}>
            <Form.Label column sm={4} className={styles.label}>
              {t('activityLog')}
            </Form.Label>
            <Col sm={8}>
              <Button variant="outline-secondary" onClick={() => {/* Implementar lógica de visualización */}}>
                {t('view')}
              </Button>
            </Col>
          </Form.Group>
        </Form>
      </div>

      {/* Mensajes de Éxito o Error */}
      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" className="mt-3">
          {success}
        </Alert>
      )}
    </motion.div>
  );
};

export default PrivacySettings;
