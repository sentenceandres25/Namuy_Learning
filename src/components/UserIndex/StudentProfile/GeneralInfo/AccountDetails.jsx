// src/components/UserIndex/StudentProfile/GeneralInfo/AccountDetails.jsx

import React, { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import styles from './AccountDetails.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useLanguageCurrency } from '../../../CombinedNavbar/hooks/useLanguageCurrency'; // Ruta corregida
import axios from '../../../../axiosConfig';

const AccountDetails = ({ data = {}, onPasswordUpdate }) => {
  // data DEBE contener { user_id, date_joined, account_status, ... }

  const { t } = useTranslation('UserIndex/StudentProfile/GeneralInfo');

  // Usamos el hook para manejar el idioma y la moneda
  const { currentLanguage, handleLanguageChange } = useLanguageCurrency();

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdatePassword = async () => {
    // Validar campos
    if (!newPassword || !confirmPassword) {
      alert(t('passwordErrorEmpty'));
      return;
    }
    if (newPassword !== confirmPassword) {
      alert(t('passwordErrorMatch'));
      return;
    }

    try {
      // Llamar a la ruta /account/<user_id>/updatePassword
      // Ajusta la URL si tu endpoint es diferente
      await axios.put(`/account/${data.user_id}/updatePassword`, {
        newPassword,
      });

      alert(t('passwordUpdated'));
      // Limpiar campos
      setNewPassword('');
      setConfirmPassword('');
      
      // Disparar callback si lo requieres
      if (onPasswordUpdate) onPasswordUpdate();
    } catch (error) {
      alert(t('passwordErrorServer'));
      console.error('Error al actualizar contraseña:', error);
    }
  };

  const handleLanguageSelect = (e) => {
    const newLang = e.target.value;
    handleLanguageChange(newLang);
  };

  return (
    <motion.div
      className={styles.accountDetails}
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
        {t('accountDetailsTitle')}
      </motion.h3>

      <Form className={styles.form}>
        {/* Fecha de inscripción (solo lectura) */}
        <Form.Group as={Row} className={styles.formGroup}>
          <Form.Label column sm={4} className={styles.label}>
            {t('inscriptionDate')}
          </Form.Label>
          <Col sm={8}>
            <Form.Control
              type="text"
              disabled
              className={styles.input}
              value={
                data.date_joined
                  ? data.date_joined.split('T')[0] // "yyyy-mm-dd"
                  : ''
              }
            />
          </Col>
        </Form.Group>

        {/* Nueva contraseña */}
        <Form.Group as={Row} className={styles.formGroup}>
          <Form.Label column sm={4} className={styles.label}>
            {t('newPassword')}
          </Form.Label>
          <Col sm={8}>
            <div className={styles.passwordWrapper}>
              <Form.Control
                type={showNewPassword ? 'text' : 'password'}
                className={styles.input}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <FontAwesomeIcon
                icon={showNewPassword ? faEyeSlash : faEye}
                className={styles.eyeIcon}
                onClick={() => setShowNewPassword(!showNewPassword)}
              />
            </div>
          </Col>
        </Form.Group>

        {/* Confirmar contraseña */}
        <Form.Group as={Row} className={styles.formGroup}>
          <Form.Label column sm={4} className={styles.label}>
            {t('confirmPassword')}
          </Form.Label>
          <Col sm={8}>
            <div className={styles.passwordWrapper}>
              <Form.Control
                type={showConfirmPassword ? 'text' : 'password'}
                className={styles.input}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <FontAwesomeIcon
                icon={showConfirmPassword ? faEyeSlash : faEye}
                className={styles.eyeIcon}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </div>
          </Col>
        </Form.Group>

        {/* Botón para actualizar contraseña */}
        <Form.Group as={Row} className={styles.formGroup}>
          <Form.Label column sm={4} className={styles.label} />
          <Col sm={8}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                variant="outline-dark"
                className={styles.button}
                onClick={handleUpdatePassword}
              >
                <FontAwesomeIcon icon={faLock} /> {t('updatePassword')}
              </Button>
            </motion.div>
          </Col>
        </Form.Group>

        {/* Estado de la cuenta (solo lectura) */}
        <Form.Group as={Row} className={styles.formGroup}>
          <Form.Label column sm={4} className={styles.label}>
            {t('accountStatus')}
          </Form.Label>
          <Col sm={8}>
            <Form.Control
              type="text"
              disabled
              className={styles.input}
              value={
                data.account_status ? data.account_status : ''
              }
            />
          </Col>
        </Form.Group>

        {/* Selector de idioma */}
        <Form.Group as={Row} className={styles.formGroup}>
          <Form.Label column sm={4} className={styles.label}>
            {t('preferredLanguage')}
          </Form.Label>
          <Col sm={8}>
            <motion.div initial={{ x: -10 }} animate={{ x: 0 }}>
              <Form.Select
                className={styles.select}
                value={currentLanguage}
                onChange={handleLanguageSelect}
              >
                <option value="es">{t('spanish')}</option>
                <option value="en">{t('english')}</option>
                {/* Agrega más opciones si soportas otros idiomas */}
              </Form.Select>
            </motion.div>
          </Col>
        </Form.Group>
      </Form>
    </motion.div>
  );
};

export default AccountDetails;
