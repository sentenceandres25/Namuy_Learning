// src/components/UserIndex/StudentProfile/Interests.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Form, Row, Col, Button, Badge, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import axios from '../../../../axiosConfig';
import { AuthContext } from '../../../../contexts/AuthContext';
import styles from './Interests.module.css'; // Ajusta si usas CSS Module

const Interests = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/GeneralInfo');
  const { user, token } = useContext(AuthContext);
  const [interests, setInterests] = useState([]);
  const [newInterest, setNewInterest] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const MAX_INTERESTS = 10;

  useEffect(() => {
    if (!user?.user_id) return;
    axios
      .get(`/interests/${user.user_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        if (response.data && Array.isArray(response.data.interests)) {
          setInterests(response.data.interests);
        }
      })
      .catch(err => {
        console.error("Error al obtener intereses:", err.response?.data || err.message);
        setError(t('errorFetchingInterests'));
      });
  }, [user, token, t]);

  const handleAddInterest = () => {
    const trimmedInterest = newInterest.trim();
    if (trimmedInterest === '') return;

    if (interests.length >= MAX_INTERESTS) {
      setError(t('interestLimitReached'));
      return;
    }

    axios
      .post(`/interests/${user.user_id}`, { interest: trimmedInterest }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        if (response.status === 201 || response.status === 200) {
          setInterests([trimmedInterest, ...interests]);
          setNewInterest('');
          setSuccess(t('interestAdded'));
          setError(null);
        }
      })
      .catch(err => {
        console.error("Error al agregar interés:", err.response?.data || err.message);
        setError(err.response?.data?.error || t('errorAddingInterest'));
        setSuccess(null);
      });
  };

  const handleRemoveInterest = (interestToRemove) => {
    axios
      .delete(`/interests/${user.user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { interest: interestToRemove }
      })
      .then(response => {
        if (response.status === 200) {
          setInterests(interests.filter(interest => interest !== interestToRemove));
          setSuccess(t('interestRemoved'));
          setError(null);
        }
      })
      .catch(err => {
        console.error("Error al eliminar interés:", err.response?.data || err.message);
        setError(err.response?.data?.error || t('errorRemovingInterest'));
        setSuccess(null);
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddInterest();
    }
  };

  return (
    <motion.div
      className={styles.interests}
      initial={{ y: 50 }}
      animate={{ y: 0 }}
    >
      <h3 className={styles.title}>{t('intereses')}</h3>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Form>
        <Form.Group as={Row}>
          <Col sm={12}>
            {interests.map((interest, index) => (
              <Badge key={index} pill className={styles.badge}>
                {interest}{' '}
                <FontAwesomeIcon
                  icon={faTimesCircle}
                  onClick={() => handleRemoveInterest(interest)}
                  style={{ cursor: 'pointer' }}
                />
              </Badge>
            ))}
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="align-items-center">
          <Col sm={8}>
            <Form.Control
              type="text"
              placeholder={t('agregar_interes')}
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyDown={handleKeyDown}
              className={styles.input}
              disabled={interests.length >= MAX_INTERESTS}
            />
          </Col>
          <Col sm={4}>
            <Button
              className={styles.button}
              onClick={handleAddInterest}
              disabled={interests.length >= MAX_INTERESTS}
            >
              <FontAwesomeIcon icon={faPlusCircle} /> {t('agregar')}
            </Button>
          </Col>
        </Form.Group>

        {interests.length >= MAX_INTERESTS && (
          <Form.Text className="text-muted">
            {t('maxInterestsReached', { count: MAX_INTERESTS })}
          </Form.Text>
        )}
      </Form>
    </motion.div>
  );
};

export default Interests;
