// src/components/Settings/PrivacySettings.jsx

import React, { useState, useEffect, useContext } from 'react';
import { Form, Row, Col, Button, Spinner, Alert, Modal } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import styles from './PrivacySettings.module.css';
import axios from '../../../../axiosConfig';
import { AuthContext } from '../../../../contexts/AuthContext';

const PrivacySettings = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/Settings');
  const { user, token } = useContext(AuthContext);

  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [codeSent, setCodeSent] = useState(false);

  // Al montar, obtener estado actual de 2FA (desde /users/2fa/preferences)
  useEffect(() => {
    const fetch2FASettings = async () => {
      try {
        const response = await axios.get('/users/2fa/preferences', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        setTwoFactorAuth(data.twoFactorEnabled);
        setEmail(data.email || '');
        setLoading(false);
      } catch (err) {
        console.error('Error fetching 2FA settings:', err.response?.data || err.message);
        const errorMessage = err.response?.data?.error || err.message;
        setError(`${t('errorFetching2FASettings')}: ${errorMessage}`);
        setLoading(false);
      }
    };

    if (user && token) {
      fetch2FASettings();
    } else {
      setLoading(false);
    }
  }, [user, token, t]);

  // Handler para el switch de 2FA
  const handleTwoFactorAuthChange = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      if (!twoFactorAuth) {
        // Habilitar 2FA => abrir modal
        setShowVerificationModal(true);
      } else {
        // Deshabilitar 2FA => PUT twoFactorEnabled = false
        await axios.put(
          '/users/2fa/preferences',
          { twoFactorEnabled: false },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        setTwoFactorAuth(false);
        setSuccess(t('twoFactorDisabled'));
      }
    } catch (err) {
      console.error('Error updating 2FA settings:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.error || err.message;
      setError(`${t('errorUpdating2FASettings')}: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  // Enviar código de verificación (al habilitar 2FA)
  const handleSendVerificationCode = async () => {
    if (!email) {
      setError(t('errorNoEmail'));
      return;
    }
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await axios.post(
        '/users/2fa/send-code',
        { email },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setCodeSent(true);
      setSuccess(t('codeSent'));
    } catch (err) {
      console.error('Error sending verification code:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.error || err.message;
      setError(`${t('errorSendingCode')}: ${errorMessage}`);
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
      await axios.post(
        '/users/2fa/verify',
        { code: verificationCode },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setTwoFactorAuth(true);
      setShowVerificationModal(false);
      setSuccess(t('twoFactorEnabled'));
    } catch (err) {
      console.error('Error verifying code:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.error || err.message;
      setError(`${t('errorVerifyingCode')}: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
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
      <h2 className={styles.sectionTitle}>{t('privacy')}</h2>

      {/* Switch 2FA */}
      <div className={styles.settingItem}>
        <Form>
          <Form.Group as={Row} className={styles.formGroup}>
            <Form.Label column sm={4} className={styles.label}>
              {t('twoFactorAuth')}
            </Form.Label>
            <Col sm={8} className={styles.switchCol}>
              <Form.Check
                type="switch"
                id="twoFactorAuthSwitch"
                label={twoFactorAuth ? t('enabled') : t('disabled')}
                checked={twoFactorAuth}
                onChange={handleTwoFactorAuthChange}
                disabled={saving}
                className={styles.toggleSwitch}
              />
            </Col>
          </Form.Group>
        </Form>
      </div>

      {/* Modal para habilitar 2FA */}
      <Modal
        show={showVerificationModal}
        onHide={() => setShowVerificationModal(false)}
        centered
      >
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
                onChange={handleEmailChange}
                placeholder={t('enterEmail')}
                required
              />
            </Form.Group>

            {!codeSent && (
              <Button
                variant="primary"
                onClick={handleSendVerificationCode}
                disabled={saving}
                className={`${styles.sendCodeBtn} mt-3`}
              >
                {saving ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    {' '}
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
                <Button
                  variant="success"
                  onClick={handleVerifyCode}
                  disabled={saving}
                  className="mt-2"
                >
                  {saving ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                      {' '}
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
      <div className={styles.otherSettings}>
        <Form>
          {/* Ejemplo: Sesiones activas */}
          <Form.Group as={Row} className={styles.formGroup}>
            <Form.Label column sm={4} className={styles.label}>
              {t('activeSessions')}
            </Form.Label>
            <Col sm={8}>
              <Button
                variant="outline-primary"
                className={styles.outlineBtn}
                onClick={() => {
                  /* tu lógica */
                }}
              >
                {t('manage')}
              </Button>
            </Col>
          </Form.Group>

          {/* Ejemplo: Registro de actividad */}
          <Form.Group as={Row} className={styles.formGroup}>
            <Form.Label column sm={4} className={styles.label}>
              {t('activityLog')}
            </Form.Label>
            <Col sm={8}>
              <Button
                variant="outline-secondary"
                className={styles.outlineBtn}
                onClick={() => {
                  /* tu lógica */
                }}
              >
                {t('view')}
              </Button>
            </Col>
          </Form.Group>
        </Form>
      </div>

      {/* Mensajes globales de error/éxito */}
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
