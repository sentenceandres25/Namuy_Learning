// AccountDetails.jsx
import React from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import styles from './AccountDetails.module.css';

const AccountDetails = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/GeneralInfo');

  return (
    <motion.div
      className={`${styles.accountDetails} my-4`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h3
        className={styles.title}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {t('titulo')}
      </motion.h3>

      <Form className={styles.form}>
        <Form.Group as={Row}  className={styles.formGroup}>
          <Form.Label column sm={4} className={styles.label}>
            {t('fecha_inscripcion')}
          </Form.Label>
          <Col sm={8}>
            <Form.Control type="date" disabled className={styles.input} />
          </Col>
        </Form.Group>

        <Form.Group as={Row}  className={styles.formGroup}>
          <Form.Label column sm={4} className={styles.label}>
            {t('contrasena')}
          </Form.Label>
          <Col sm={8}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button variant="outline-dark" className={styles.button}>
                <FontAwesomeIcon icon={faLock} /> {t('actualizar_contrasena')}
              </Button>
            </motion.div>
          </Col>
        </Form.Group>

        <Form.Group as={Row}  className={styles.formGroup}>
          <Form.Label column sm={4} className={styles.label}>
            {t('estado_cuenta')}
          </Form.Label>
          <Col sm={8}>
            <Form.Control type="text" placeholder={t('estado_activo')} disabled className={styles.input} />
          </Col>
        </Form.Group>

        <Form.Group as={Row}  className={styles.formGroup}>
          <Form.Label column sm={4} className={styles.label}>
            {t('idioma_preferido')}
          </Form.Label>
          <Col sm={8}>
            <motion.div initial={{ x: -10 }} animate={{ x: 0 }}>
              <Form.Select className={styles.select}>
                <option>{t('espanol')}</option>
                <option>{t('ingles')}</option>
                <option>{t('portugues')}</option>
              </Form.Select>
            </motion.div>
          </Col>
        </Form.Group>
      </Form>
    </motion.div>
  );
};

export default AccountDetails;
