// Interests.jsx

import React, { useState } from 'react';
import { Form, Row, Col, Button, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import styles from './Interests.module.css'; // Asegúrate de usar el módulo CSS

const Interests = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/GeneralInfo');
  const [interests, setInterests] = useState([t('interes_programacion'), t('interes_ciberseguridad')]);
  const [newInterest, setNewInterest] = useState('');

  const handleAddInterest = () => {
    if (newInterest.trim() !== '') {
      setInterests([...interests, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interestToRemove) => {
    setInterests(interests.filter(interest => interest !== interestToRemove));
  };

  return (
    <motion.div
      className={styles.interests}
      initial={{ y: 50 }}
      animate={{ y: 0 }}
    >
      <h3 className={styles.title}>{t('intereses')}</h3>
      <Form>
        <Form.Group as={Row} >
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
              className={styles.input}
            />
          </Col>
          <Col sm={4}>
            <Button className={styles.button} onClick={handleAddInterest}>
              <FontAwesomeIcon icon={faPlusCircle} /> {t('agregar')}
            </Button>
          </Col>
        </Form.Group>
      </Form>
    </motion.div>
  );
};

export default Interests;
