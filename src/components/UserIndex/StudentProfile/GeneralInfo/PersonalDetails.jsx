// src/components/UserIndex/StudentProfile/GeneralInfo/PersonalDetails.jsx

import React, { useEffect, useState, useContext } from 'react';
import { Form, Row, Col, Button, Alert, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../../../contexts/AuthContext';
import axios from '../../../../axiosConfig';
import styles from './PersonalDetails.module.css';

// Approval-required fields (if these change, a document must be uploaded)
const APPROVAL_REQUIRED_FIELDS = ['full_name', 'id_type', 'id_number', 'student_id'];

const PersonalDetails = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/GeneralInfo');
  const { user, token, setUser } = useContext(AuthContext);

  // Local state for personal details
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState({
    full_name: '',
    student_id: '',
    email: '',
    alt_email: '',
    contact_number: '',
    id_type: '',
    id_number: '',
    birth_date: '',
    country_of_residence: '',
    doc_url: ''
  });
  const [originalData, setOriginalData] = useState(null);

  // States for handling form submission and file upload
  const [pendingRequest, setPendingRequest] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [file, setFile] = useState(null);
  const [isFirstTime, setIsFirstTime] = useState(false);

  // Fetch personal details on mount
  useEffect(() => {
    if (!user || !user.user_id) {
      setError(t('userNotAuthenticated') || 'User is not authenticated');
      setIsLoading(false);
      return;
    }

    axios
      .get(`/personal_details/${user.user_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {
        const data = response.data;
        if (data) {
          // Map data to local state
          const initial = {
            full_name: data.full_name || '',
            student_id: data.student_id || '',
            email: data.email || user.email || '',
            alt_email: data.alt_email || '',
            contact_number: data.contact_number || '',
            id_type: data.id_type || '',
            id_number: data.id_number || '',
            birth_date: data.birth_date ? data.birth_date.split('T')[0] : '',
            country_of_residence: data.country_of_residence || '',
            doc_url: data.doc_url || ''
          };
          setUserData(initial);
          setOriginalData(initial);
          setIsFirstTime(!data.student_id);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.error || t('errorLoadingPersonalDetails') || 'Error loading personal details');
        setIsLoading(false);
      });
  }, [user, token, t]);

  // Returns true if any approval-required fields have changed
  const requiresApprovalDoc = () => {
    if (!originalData) return false;
    return APPROVAL_REQUIRED_FIELDS.some(
      (field) => userData[field] !== originalData[field]
    );
  };

  // Handle input changes
  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setRequestMessage('');
    setPendingRequest(true);

    if (!user || !user.user_id) {
      setError(t('userNotAuthenticated') || 'User not authenticated or missing user_id');
      setPendingRequest(false);
      return;
    }

    try {
      // If any approval-required fields changed, submit with file
      const changedApprovals = APPROVAL_REQUIRED_FIELDS.filter(
        (field) => originalData && userData[field] !== originalData[field]
      );
      if (changedApprovals.length > 0) {
        if (!file) {
          setError(t('errorFileRequired') || 'Document required for changes.');
          setPendingRequest(false);
          return;
        }
        const approvalFields = {};
        changedApprovals.forEach((field) => {
          approvalFields[field] = userData[field];
        });
        await submitApprovalFields(approvalFields, file);
      }

      // If email changed, update email
      if (userData.email && userData.email !== user.email) {
        await updateUserEmail(userData.email);
      }

      // Update non-approval fields in personal_details
      const updatable = ['alt_email', 'contact_number', 'birth_date', 'country_of_residence'];
      const autoFields = {};
      updatable.forEach((f) => {
        if (userData[f]) autoFields[f] = userData[f];
      });
      if (Object.keys(autoFields).length > 0) {
        await updateAutoFields(autoFields);
      }

      setRequestMessage(t('infoUpdated') || 'Information updated successfully');
    } catch (err) {
      setError(err.response?.data?.error || t('errorSubmittingRequest') || 'Error submitting request');
    } finally {
      setPendingRequest(false);
    }
  };

  // Submit fields that require approval with file upload
  const submitApprovalFields = async (approvalFields, file) => {
    const formData = new FormData();
    formData.append('changes', JSON.stringify(approvalFields));
    formData.append('file', file);

    await axios.post(
      `/personal_details/${user.user_id}/requestChange`,
      formData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
  };

  // Update user email in both personal_details and context
  const updateUserEmail = async (newEmail) => {
    await axios.put(
      `/users/${user.user_id}/email`,
      { email: newEmail },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (setUser) {
      setUser(prev => ({ ...prev, email: newEmail }));
    }
  };

  // Update non-approval fields in personal_details
  const updateAutoFields = async (autoFields) => {
    const resp = await axios.put(
      `/personal_details/${user.user_id}`,
      autoFields,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setUserData(prev => ({ ...prev, ...resp.data }));
    setOriginalData(prev => ({ ...prev, ...resp.data }));
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">{t('loading')}</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <motion.div
      className={styles['personal-details']}
      initial={{ x: -50 }}
      animate={{ x: 0 }}
    >
      <h3 className={styles.title}>{t('detalles_personales')}</h3>

      {pendingRequest && requestMessage && (
        <Alert variant="info">{requestMessage}</Alert>
      )}

      <Form onSubmit={handleSubmit}>
        {/* Full Name */}
        <Form.Group as={Row} className={styles['form-group']}>
          <Form.Label column sm={4} className={styles.label}>
            {t('nombre_completo')}
          </Form.Label>
          <Col sm={8}>
            <Form.Control
              type="text"
              name="full_name"
              value={userData.full_name}
              onChange={handleChange}
              className={styles.input}
              required
            />
            <Form.Text muted>{t('cambio_requiere_aprobacion')}</Form.Text>
          </Col>
        </Form.Group>

        {/* Student ID */}
        <Form.Group as={Row} className={styles['form-group']}>
          <Form.Label column sm={4} className={styles.label}>
            {t('id_estudiante')}
          </Form.Label>
          <Col sm={8}>
            <Form.Control
              type="text"
              name="student_id"
              value={userData.student_id}
              onChange={handleChange}
              disabled={!isFirstTime}
              className={styles.input}
              required
            />
            {isFirstTime && (
              <Form.Text muted>{t('solo_primera_vez')}</Form.Text>
            )}
          </Col>
        </Form.Group>

        {/* Primary Email */}
        <Form.Group as={Row} className={styles['form-group']}>
          <Form.Label column sm={4} className={styles.label}>
            {t('correo_electronico')}
          </Form.Label>
          <Col sm={8}>
            <Form.Control
              type="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </Col>
        </Form.Group>

        {/* Alternate Email */}
        <Form.Group as={Row} className={styles['form-group']}>
          <Form.Label column sm={4} className={styles.label}>
            {t('correo_alternativo')}
          </Form.Label>
          <Col sm={8}>
            <Form.Control
              type="email"
              name="alt_email"
              value={userData.alt_email}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </Col>
        </Form.Group>

        {/* Contact Number */}
        <Form.Group as={Row} className={styles['form-group']}>
          <Form.Label column sm={4} className={styles.label}>
            {t('numero_contacto')}
          </Form.Label>
          <Col sm={8}>
            <Form.Control
              type="text"
              name="contact_number"
              value={userData.contact_number}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </Col>
        </Form.Group>

        {/* Identification Type */}
        <Form.Group as={Row} className={styles['form-group']}>
          <Form.Label column sm={4} className={styles.label}>
            {t('tipo_identificacion')}
          </Form.Label>
          <Col sm={8}>
            <Form.Select
              name="id_type"
              value={userData.id_type}
              onChange={handleChange}
              className={styles.input}
              required
            >
              <option value="">{t('seleccione_opcion')}</option>
              <option value="CC">Cédula de Ciudadanía</option>
              <option value="TI">Tarjeta de Identidad</option>
              <option value="CE">Cédula de Extranjería</option>
              <option value="PASS">Pasaporte</option>
            </Form.Select>
            <Form.Text muted>{t('cambio_requiere_aprobacion')}</Form.Text>
          </Col>
        </Form.Group>

        {/* Identification Number */}
        <Form.Group as={Row} className={styles['form-group']}>
          <Form.Label column sm={4} className={styles.label}>
            {t('numero_identificacion')}
          </Form.Label>
          <Col sm={8}>
            <Form.Control
              type="text"
              name="id_number"
              value={userData.id_number}
              onChange={handleChange}
              className={styles.input}
              required
            />
            <Form.Text muted>{t('cambio_requiere_aprobacion')}</Form.Text>
          </Col>
        </Form.Group>

        {/* Birth Date */}
        <Form.Group as={Row} className={styles['form-group']}>
          <Form.Label column sm={4} className={styles.label}>
            {t('fecha_nacimiento')}
          </Form.Label>
          <Col sm={8}>
            <Form.Control
              type="date"
              name="birth_date"
              value={userData.birth_date}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </Col>
        </Form.Group>

        {/* Country of Residence */}
        <Form.Group as={Row} className={styles['form-group']}>
          <Form.Label column sm={4} className={styles.label}>
            {t('pais_residencia')}
          </Form.Label>
          <Col sm={8}>
            <Form.Control
              type="text"
              name="country_of_residence"
              value={userData.country_of_residence}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </Col>
        </Form.Group>

        {/* File input for document upload (only if approval-required fields have changed) */}
        {requiresApprovalDoc() && (
          <Form.Group as={Row} className={styles['form-group']}>
            <Form.Label column sm={4} className={styles.label}>
              {t('documento_identidad')}
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="file"
                name="file"
                onChange={handleFileChange}
                className={styles.input}
                accept=".png,.jpg,.jpeg,.pdf"
                required
              />
              <Form.Text muted>{t('solo_formatos_permitidos')}</Form.Text>
            </Col>
          </Form.Group>
        )}

        <Row>
          <Col sm={{ span: 8, offset: 4 }}>
            <Button type="submit" variant="success" disabled={pendingRequest}>
              {t('actualizar_informacion')}
            </Button>
          </Col>
        </Row>
      </Form>

      {userData.doc_url && (
        <div className={styles.document}>
          <h5>{t('documento_identidad')}</h5>
          <a
            href={`http://localhost:3001${userData.doc_url}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('ver_documento')}
          </a>
        </div>
      )}
    </motion.div>
  );
};

export default PersonalDetails;
