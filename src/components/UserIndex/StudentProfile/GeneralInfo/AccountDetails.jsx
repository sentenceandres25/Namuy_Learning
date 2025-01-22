// src/components/UserIndex/StudentProfile/GeneralInfo/AccountDetails.jsx

import React, { useEffect, useState, useContext } from 'react';
import { Form, Row, Col, Button, Alert, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import styles from './AccountDetails.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useLanguageCurrency } from '../../../CombinedNavbar/hooks/useLanguageCurrency';
import axios from '../../../../axiosConfig';
import { AuthContext } from '../../../../contexts/AuthContext';

const AccountDetails = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/GeneralInfo');
  const { currentLanguage, handleLanguageChange } = useLanguageCurrency();
  const { user, token } = useContext(AuthContext);

  // State to hold account information
  const [accountData, setAccountData] = useState({
    date_joined: '',
    account_status: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // States for password fields
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Fetch account details on component mount
  useEffect(() => {
    // Ensure user is authenticated
    if (!user || !user.user_id) {
      setError(t('userNotAuthenticated') || 'User is not authenticated.');
      setIsLoading(false);
      return;
    }

    // Fetch personal details from the backend
    axios
      .get(`/personal_details/${user.user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const data = response.data || {};
        setAccountData({
          date_joined: data.date_joined || '',
          account_status: data.account_status || '',
        });
        setIsLoading(false);
      })
      .catch((err) => {
        const errorMessage =
          err.response?.data?.error || t('anErrorOccurred') || 'An error occurred while fetching account details.';
        setError(errorMessage);
        setIsLoading(false);
      });
  }, [user, token, t]);

  // Handler to toggle password visibility
  const togglePasswordVisibility = (field) => {
    if (field === 'newPassword') {
      setShowNewPassword((prev) => !prev);
    } else if (field === 'confirmPassword') {
      setShowConfirmPassword((prev) => !prev);
    }
  };

  // Handler to update password
  const handleUpdatePassword = async () => {
    // Validate password fields
    if (!newPassword || !confirmPassword) {
      alert(t('passwordErrorEmpty') || 'Please fill in both password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert(t('passwordErrorMatch') || 'Passwords do not match.');
      return;
    }

    try {
      // Send PUT request to update password
      await axios.put(
        `/account/${user.user_id}/updatePassword`,
        { newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(t('passwordUpdated') || 'Password updated successfully.');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      alert(t('passwordErrorServer') || 'Server error. Please try again later.');
      console.error('Error updating password:', error);
    }
  };

  // Handler for language selection
  const handleLanguageSelect = (e) => {
    handleLanguageChange(e.target.value);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className={styles.accountDetails}>
        <Spinner animation="border" role="status" />
        <span>{t('loading')}</span>
      </div>
    );
  }

  // Render error state
  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

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
        {/* Date Joined (Read-Only) */}
        <Form.Group as={Row} className={styles.formGroup}>
          <Form.Label column sm={4} className={styles.label}>
            {t('inscriptionDate')}
          </Form.Label>
          <Col sm={8}>
            <Form.Control
              type="text"
              disabled
              className={styles.input}
              value={accountData.date_joined ? accountData.date_joined.split('T')[0] : ''}
            />
          </Col>
        </Form.Group>

        {/* New Password */}
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
                onClick={() => togglePasswordVisibility('newPassword')}
              />
            </div>
          </Col>
        </Form.Group>

        {/* Confirm Password */}
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
                onClick={() => togglePasswordVisibility('confirmPassword')}
              />
            </div>
          </Col>
        </Form.Group>

        {/* Update Password Button */}
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

        {/* Account Status (Read-Only) */}
        <Form.Group as={Row} className={styles.formGroup}>
          <Form.Label column sm={4} className={styles.label}>
            {t('accountStatus')}
          </Form.Label>
          <Col sm={8}>
            <Form.Control
              type="text"
              disabled
              className={styles.input}
              value={accountData.account_status || ''}
            />
          </Col>
        </Form.Group>

        {/* Language Selector */}
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
              </Form.Select>
            </motion.div>
          </Col>
        </Form.Group>
      </Form>
    </motion.div>
  );
};

export default AccountDetails;
