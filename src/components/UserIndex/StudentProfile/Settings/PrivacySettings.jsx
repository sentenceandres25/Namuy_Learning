import React, { useState, useEffect, useContext } from 'react';
import { Form, Row, Col, Button, Spinner, Alert, Modal, Table, Collapse } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import styles from './PrivacySettings.module.css';
import axios from '../../../../axiosConfig';
import { AuthContext } from '../../../../contexts/AuthContext';

const PrivacySettings = () => {
  // ---------------------------
  // Contextos y traducción
  // ---------------------------
  const { t } = useTranslation('UserIndex/StudentProfile/Settings');
  const { user, token } = useContext(AuthContext);

  // ---------------------------
  // Estados para 2FA
  // ---------------------------
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  // ---------------------------
  // Estados generales
  // ---------------------------
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ---------------------------
  // Estados para la gestión de sesiones
  // ---------------------------
  const [showSessionsInline, setShowSessionsInline] = useState(false);
  const [activeSessions, setActiveSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  // ---------------------------
  // useEffect para cargar configuración 2FA
  // ---------------------------
  useEffect(() => {
    const fetch2FASettings = async () => {
      try {
        const response = await axios.get('/users/2fa/preferences', {
          headers: { Authorization: `Bearer ${token}` },
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

  // ---------------------------
  // Funciones para Two Factor Authentication (2FA)
  // ---------------------------
  const handleTwoFactorAuthChange = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      if (!twoFactorAuth) {
        // Habilitar 2FA: abrir modal de verificación
        setShowVerificationModal(true);
      } else {
        // Deshabilitar 2FA
        await axios.put(
          '/users/2fa/preferences',
          { twoFactorEnabled: false },
          {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
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
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
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
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
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

  // ---------------------------
  // Funciones para gestionar sesiones activas
  // ---------------------------
  const fetchSessions = async () => {
    setLoadingSessions(true);
    try {
      const response = await axios.get('/users/sessions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActiveSessions(response.data.sessions);
    } catch (err) {
      console.error('Error fetching sessions:', err.response?.data || err.message);
      setError(t('errorFetchingSessions') || 'Error fetching sessions');
    } finally {
      setLoadingSessions(false);
    }
  };

  const toggleSessionsInline = async () => {
    const newState = !showSessionsInline;
    setShowSessionsInline(newState);
    if (newState) {
      await fetchSessions();
    }
  };

  const handleCloseSession = async (sessionId) => {
    const confirmClose = window.confirm(
      t('confirmCloseSession') || 'Are you sure you want to close this session?'
    );
    if (!confirmClose) return;

    try {
      const response = await axios.delete(`/users/sessions/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 205) {
        alert(t('currentSessionClosed') || 'Your current session has been closed. Please log out.');
        // Aquí se puede forzar el logout del dispositivo actual
      } else {
        alert(t('sessionClosed') || 'Session closed successfully');
      }
      // Refrescar la lista de sesiones activas
      await fetchSessions();
    } catch (err) {
      console.error('Error closing session:', err.response?.data || err.message);
      setError(t('errorClosingSession') || 'Error closing session');
    }
  };

  // ---------------------------
  // Renderizado condicional
  // ---------------------------
  if (loading) {
    return (
      <motion.div className={styles.privacySettings} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Spinner animation="border" role="status" className={styles.spinner}>
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </motion.div>
    );
  }

  // ---------------------------
  // Renderizado principal
  // ---------------------------
  return (
    <motion.div className={styles.privacySettings} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className={styles.sectionTitle}>{t('privacy')}</h2>

      {/* Sección 2FA */}
      <div className={styles.settingItem}>
        <Form>
          <Form.Group as={Row} className={styles.formGroup}>
            <Form.Label column sm={4} className={styles.label}>
              {t('twoFactorAuth')}
            </Form.Label>
            <Col sm={8} className={`text-end ${styles.switchCol}`}>
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

      {/* Modal de 2FA */}
      <Modal show={showVerificationModal} onHide={() => setShowVerificationModal(false)} centered>
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

            {!codeSent ? (
              <Button
                variant="primary"
                onClick={handleSendVerificationCode}
                disabled={saving}
                className={`${styles.sendCodeBtn} mt-3`}
              >
                {saving ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> {t('sendingCode')}
                  </>
                ) : (
                  t('sendVerificationCode')
                )}
              </Button>
            ) : (
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
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> {t('verifying')}
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

      {/* Sección de Otras configuraciones */}
      <div className={styles.otherSettings}>
        <Form>
          <Form.Group as={Row} className={styles.formGroup}>
            <Form.Label column sm={4} className={styles.label}>
              {t('activeSessions')}
            </Form.Label>
            <Col sm={8} className="text-end">
              <Button variant="outline-primary" className={styles.outlineBtn} onClick={toggleSessionsInline}>
                {showSessionsInline ? t('hideActiveSessions') : t('manage')}
              </Button>
            </Col>
          </Form.Group>

        </Form>
      </div>

      {/* Sección Inline de Sesiones Activas */}
      <Collapse in={showSessionsInline}>
        <div id="active-sessions-inline" style={{ marginTop: '1rem' }}>
          {loadingSessions ? (
            <Spinner animation="border" role="status" className={styles.spinner}>
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          ) : activeSessions.length === 0 ? (
            <p>{t('noActiveSessions') || 'No active sessions found.'}</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>{t('device') || 'Device'}</th>
                  <th>{t('location') || 'Location'}</th>
                  <th>{t('loginTime') || 'Login Time'}</th>
                  <th>{t('actions') || 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {activeSessions.map((session) => (
                  <tr key={session.session_id}>
                    <td>{session.device}</td>
                    <td>{session.location}</td>
                    <td>{new Date(session.login_at).toLocaleString()}</td>
                    <td>
                      <Button variant="danger" size="sm" onClick={() => handleCloseSession(session.session_id)}>
                        {t('closeSession') || 'Close'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </Collapse>

      {/* Mensajes de error o éxito */}
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      {success && <Alert variant="success" className="mt-3">{success}</Alert>}
    </motion.div>
  );
};

export default PrivacySettings;
