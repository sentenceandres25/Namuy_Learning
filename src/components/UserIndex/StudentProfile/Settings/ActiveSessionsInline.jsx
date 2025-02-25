import React, { useState, useEffect, useContext } from 'react';
import { Table, Button, Spinner, Alert, Collapse } from 'react-bootstrap';
import { AuthContext } from '../../contexts/AuthContext';
import axios from '../../axiosConfig';
import { useTranslation } from 'react-i18next';

const ActiveSessionsInline = () => {
  const { token, logout } = useContext(AuthContext);
  const { t } = useTranslation();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  const fetchSessions = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/users/sessions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setSessions(response.data.sessions);
    } catch (err) {
      setError(t('errorFetchingSessions') || 'Error fetching sessions.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSession = async (sessionId) => {
    try {
      const response = await axios.delete(`/users/sessions/${sessionId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.status === 205) {
        alert(t('currentSessionClosed') || 'Your current session has been closed. Please log out.');
        logout();
      } else {
        alert(t('sessionClosedSuccessfully') || 'Session closed successfully.');
        fetchSessions();
      }
    } catch (err) {
      setError(t('errorClosingSession') || 'Error closing session.');
    }
  };

  useEffect(() => {
    if (open) {
      fetchSessions();
    }
  }, [open]);

  return (
    <div style={{ marginTop: '1rem' }}>
      <Button
        onClick={() => setOpen(!open)}
        aria-controls="active-sessions-collapse"
        aria-expanded={open}
        variant="info"
      >
        {open ? t('hideActiveSessions') : t('showActiveSessions')}
      </Button>
      <Collapse in={open}>
        <div id="active-sessions-collapse" style={{ marginTop: '1rem' }}>
          {loading && <Spinner animation="border" />}
          {error && <Alert variant="danger">{error}</Alert>}
          {!loading && sessions.length === 0 && (
            <p>{t('noActiveSessions') || 'No active sessions found.'}</p>
          )}
          {!loading && sessions.length > 0 && (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>{t('device') || 'Device'}</th>
                  <th>{t('location') || 'Location'}</th>
                  <th>{t('loginTime') || 'Login Time'}</th>
                  <th>{t('actions') || 'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map(session => (
                  <tr key={session.session_id}>
                    <td>{session.device}</td>
                    <td>{session.location}</td>
                    <td>{session.login_at}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleCloseSession(session.session_id)}
                      >
                        {t('closeSession') || 'Close Session'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </Collapse>
    </div>
  );
};

export default ActiveSessionsInline;
