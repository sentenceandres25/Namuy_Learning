// src/components/UserIndex/StudentProfile/GeneralInfo/PersonalDetails.jsx

import React, { useEffect, useState, useContext } from 'react';
import { Form, Row, Col, Button, Alert, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import styles from './PersonalDetails.module.css';
import { AuthContext } from '../../../../contexts/AuthContext';
import axios from 'axios';

const PersonalDetails = ({ data, onUpdate }) => {
  const { t } = useTranslation('UserIndex/StudentProfile/GeneralInfo');
  const { user, token, loading } = useContext(AuthContext);

  const [userData, setUserData] = useState({
    full_name: '',
    student_id: '',
    email: '',
    alt_email: '',
    contact_number: '',
    id_type: '',
    id_number: '',
    birth_date: '',
    country_of_residence: ''
  });

  const [pendingRequest, setPendingRequest] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    console.log("Datos recibidos en PersonalDetails:", data);
    console.log("Usuario desde contexto:", user);
    console.log("ID de Usuario:", user && user.user_id ? user.user_id : 'No definido');

    if (data) {
      setUserData({
        full_name: data.full_name || '',
        student_id: data.student_id || '',
        email: data.email || '',
        alt_email: data.alt_email || '',
        contact_number: data.contact_number || '',
        id_type: data.id_type || '',
        id_number: data.id_number || '',
        birth_date: data.birth_date ? data.birth_date.split('T')[0] : '',
        country_of_residence: data.country_of_residence || '',
        doc_url: data.doc_url || ''
      });
      setIsFirstTime(false);
    } else {
      setIsFirstTime(true);
    }
  }, [data, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setRequestMessage('');
    setPendingRequest(true);

    if (!user || !user.user_id) {
      setErrorMessage('ID de usuario no definido.');
      setPendingRequest(false);
      return;
    }

    try {
      // Definir campos que requieren aprobación
      const approvalRequiredFields = ['full_name', 'id_type', 'id_number', 'student_id'];
      const hasApprovalFields = approvalRequiredFields.some(field => userData[field]);

      // Enviar solicitud de cambio si hay campos que requieren aprobación
      if (hasApprovalFields) {
        // Recopilar solo los campos que requieren aprobación
        const approvalFields = {};
        approvalRequiredFields.forEach(field => {
          if (userData[field]) {
            approvalFields[field] = userData[field];
          }
        });

        // Verificar si se adjuntó un archivo
        if (!file) {
          setErrorMessage('Se requiere un documento de identidad para cambios que requieren aprobación.');
          setPendingRequest(false);
          return;
        }

        // Enviar solicitud de cambio con campos que requieren aprobación
        await handleSubmitApprovalFields(approvalFields, file);
      }

      // Recopilar campos que no requieren aprobación
      const updatableFields = ['email', 'alt_email', 'contact_number', 'birth_date', 'country_of_residence'];
      const autoFields = {};

      updatableFields.forEach(field => {
        if (userData[field]) {
          autoFields[field] = userData[field];
        }
      });

      // Enviar actualización automática solo si hay campos para actualizar
      if (Object.keys(autoFields).length > 0) {
        await handleUpdateAutoFields(autoFields);
      }

      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error("Error al enviar la solicitud de cambio:", error);
      setErrorMessage(error.response?.data?.error || 'Error al enviar la solicitud.');
    } finally {
      setPendingRequest(false);
    }
  };

  const handleUpdateAutoFields = async (autoFields) => {
    console.log("Enviando solicitud PUT con autoFields:", autoFields);

    if (Object.keys(autoFields).length === 0) {
      console.error("autoFields está vacío. No se enviará la solicitud PUT.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3001/api/user/${user.user_id}`,
        autoFields, // Datos en formato JSON
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            // 'Content-Type': 'application/json' // Axios lo maneja automáticamente
          }
        }
      );

      console.log("Respuesta de la actualización:", response.data);
      setUserData(prev => ({
        ...prev,
        ...response.data
      }));
      setRequestMessage("Información actualizada correctamente.");
    } catch (error) {
      console.error("Error al actualizar la información:", error);
      setErrorMessage(error.response?.data?.error || 'Error al actualizar la información.');
    }
  };

  const handleSubmitApprovalFields = async (approvalFields, file) => {
    try {
      const formData = new FormData();
      formData.append('changes', JSON.stringify(approvalFields));
      formData.append('file', file);

      const response = await axios.post(
        `http://localhost:3001/api/user/${user.user_id}/requestChange`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            // **Nota:** No es necesario establecer 'Content-Type'; Axios lo maneja automáticamente.
          }
        }
      );

      console.log("Respuesta de la solicitud:", response.data);
      if (response.data.pending) {
        setRequestMessage(response.data.message);
      }
    } catch (error) {
      console.error("Error al enviar la solicitud de cambio:", error);
      setErrorMessage(error.response?.data?.error || 'Error al enviar la solicitud.');
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
        <span>Cargando...</span>
      </div>
    );
  }

  if (!user) {
    return <div className={styles.error}>No autenticado.</div>;
  }

  return (
    <motion.div
      className={styles['personal-details']}
      initial={{ x: -50 }}
      animate={{ x: 0 }}
    >
      <h3 className={styles.title}>{t('detalles_personales')}</h3>

      {pendingRequest && (
        <Alert variant="info">
          {requestMessage || t('solicitud_pendiente')}
        </Alert>
      )}
      {errorMessage && (
        <Alert variant="danger">
          {errorMessage}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        {/* Full Name */}
        <Form.Group as={Row} className={styles['form-group']}>
          <Form.Label column sm={4} className={styles.label}>{t('nombre_completo')}</Form.Label>
          <Col sm={8}>
            <Form.Control
              type="text"
              name="full_name"
              placeholder={t('placeholder_nombre')}
              className={styles.input}
              value={userData.full_name}
              onChange={handleChange}
              required
            />
            <Form.Text muted>{t('cambio_requiere_aprobacion')}</Form.Text>
          </Col>
        </Form.Group>

        {/* Student ID */}
        <Form.Group as={Row} className={styles['form-group']}>
          <Form.Label column sm={4} className={styles.label}>{t('id_estudiante')}</Form.Label>
          <Col sm={8}>
            <Form.Control
              type="text"
              name="student_id"
              placeholder="20230001"
              className={styles.input}
              value={userData.student_id}
              onChange={handleChange}
              disabled={!isFirstTime}
              required
              pattern="[0-9]+"
              title={t('solo_digitos')}
            />
            {isFirstTime && <Form.Text muted>{t('solo_primera_vez')}</Form.Text>}
          </Col>
        </Form.Group>

        {/* Email */}
        <Form.Group as={Row} className={styles['form-group']}>
          <Form.Label column sm={4} className={styles.label}>{t('correo_electronico')}</Form.Label>
          <Col sm={8}>
            <Form.Control
              type="email"
              name="email"
              placeholder={t('placeholder_correo')}
              className={styles.input}
              value={userData.email}
              onChange={handleChange}
              required
            />
          </Col>
        </Form.Group>

        {/* Alternate Email */}
        <Form.Group as={Row} className={styles['form-group']}>
          <Form.Label column sm={4} className={styles.label}>{t('correo_alternativo')}</Form.Label>
          <Col sm={8}>
            <Form.Control
              type="email"
              name="alt_email"
              placeholder={t('placeholder_correo_alternativo')}
              className={styles.input}
              value={userData.alt_email}
              onChange={handleChange}
              required
            />
          </Col>
        </Form.Group>

        {/* Contact Number */}
        <Form.Group as={Row} className={styles['form-group']}>
          <Form.Label column sm={4} className={styles.label}>{t('numero_contacto')}</Form.Label>
          <Col sm={8}>
            <Form.Control
              type="text"
              name="contact_number"
              placeholder={t('placeholder_numero_contacto')}
              className={styles.input}
              value={userData.contact_number}
              onChange={handleChange}
              pattern="[0-9]+"
              required
              title={t('solo_digitos')}
            />
          </Col>
        </Form.Group>

        {/* ID Type */}
        <Form.Group as={Row} className={styles['form-group']}>
          <Form.Label column sm={4} className={styles.label}>{t('tipo_identificacion')}</Form.Label>
          <Col sm={8}>
            <Form.Select
              name="id_type"
              className={styles.input}
              value={userData.id_type}
              onChange={handleChange}
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

        {/* ID Number */}
        <Form.Group as={Row} className={styles['form-group']}>
          <Form.Label column sm={4} className={styles.label}>{t('numero_identificacion')}</Form.Label>
          <Col sm={8}>
            <Form.Control
              type="text"
              name="id_number"
              placeholder={t('placeholder_numero_identificacion')}
              className={styles.input}
              value={userData.id_number}
              onChange={handleChange}
              pattern="[0-9]+"
              required
              title={t('solo_digitos')}
            />
            <Form.Text muted>{t('cambio_requiere_aprobacion')}</Form.Text>
          </Col>
        </Form.Group>

        {/* Birth Date */}
        <Form.Group as={Row} className={styles['form-group']}>
          <Form.Label column sm={4} className={styles.label}>{t('fecha_nacimiento')}</Form.Label>
          <Col sm={8}>
            <Form.Control
              type="date"
              name="birth_date"
              className={styles['date-input']}
              value={userData.birth_date}
              onChange={handleChange}
              required
            />
          </Col>
        </Form.Group>

        {/* Country of Residence */}
        <Form.Group as={Row} className={styles['form-group']}>
          <Form.Label column sm={4} className={styles.label}>{t('pais_residencia')}</Form.Label>
          <Col sm={8}>
            <Form.Control
              type="text"
              name="country_of_residence"
              placeholder={t('placeholder_pais_residencia')}
              className={styles.input}
              value={userData.country_of_residence}
              onChange={handleChange}
              required
            />
          </Col>
        </Form.Group>

        {/* Documento de Identidad (si se necesitan campos de aprobación) */}
        {['full_name', 'id_type', 'id_number', 'student_id'].some(field => userData[field]) && (
          <Form.Group as={Row} className={styles['form-group']}>
            <Form.Label column sm={4} className={styles.label}>{t('documento_identidad')}</Form.Label>
            <Col sm={8}>
              <Form.Control
                type="file"
                name="file"
                className={styles.input}
                onChange={handleFileChange}
                required
                accept=".png,.jpg,.jpeg,.pdf"
              />
              <Form.Text muted>{t('solo_formatos_permitidos')}</Form.Text>
            </Col>
          </Form.Group>
        )}

        <Row>
          <Col sm={{ span: 8, offset: 4 }}>
            <Button
              type="submit"
              variant="success"
              disabled={pendingRequest}
            >
              {t('actualizar_informacion')}
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Mostrar el documento de identidad si existe */}
      {userData.doc_url && (
        <div className={styles.document}>
          <h5>{t('documento_identidad')}</h5>
          <a href={`http://localhost:3001${userData.doc_url}`} target="_blank" rel="noopener noreferrer">
            {t('ver_documento')}
          </a>
        </div>
      )}
    </motion.div>
  );
};

export default PersonalDetails;
