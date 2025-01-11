import React, { useEffect, useState, useContext, useRef } from 'react';
import { Form, Row, Col, Button, Alert, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import styles from './PersonalDetails.module.css';
import { AuthContext } from '../../../../contexts/AuthContext';
import axios from '../../../../axiosConfig';  // <-- Tu axiosConfig con baseURL

const APPROVAL_REQUIRED_FIELDS = ['full_name', 'id_type', 'id_number', 'student_id'];

const PersonalDetails = ({ data, onUpdate }) => {
  const { t } = useTranslation('UserIndex/StudentProfile/GeneralInfo');
  const { user, token, loading } = useContext(AuthContext);

  // userData: estado que se va modificando con los inputs
  const [userData, setUserData] = useState({
    full_name: '',
    student_id: '',
    email: '', // Correo principal (tabla users)
    alt_email: '',
    contact_number: '',
    id_type: '',
    id_number: '',
    birth_date: '',
    country_of_residence: '',
    doc_url: ''
  });

  // Guardamos la "data original" para poder comparar y ver si algo cambió
  const [originalData, setOriginalData] = useState(null);

  const [pendingRequest, setPendingRequest] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    console.log('Datos recibidos en <PersonalDetails/>:', data);
    console.log('Usuario desde contexto:', user);

    if (data) {
      const initialData = {
        full_name: data.full_name || '',
        student_id: data.student_id || '',
        // El "correo principal" se toma de user?.email
        email: user?.email || '',
        alt_email: data.alt_email || '',
        contact_number: data.contact_number || '',
        id_type: data.id_type || '',
        id_number: data.id_number || '',
        birth_date: data.birth_date ? data.birth_date.split('T')[0] : '',
        country_of_residence: data.country_of_residence || '',
        doc_url: data.doc_url || ''
      };
      setUserData(initialData);
      setOriginalData(initialData); // Guardamos copia para comparar
      setIsFirstTime(false);
    } else {
      // Asumimos primera vez
      setIsFirstTime(true);
      setOriginalData(null);
    }
  }, [data, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  /**
   * Función auxiliar: verifica si alguno de los campos "aprobables" cambió
   * con respecto a la data original. Retorna true si al menos uno difiere.
   */
  const requiresApprovalDoc = () => {
    if (!originalData) return false; 
    return APPROVAL_REQUIRED_FIELDS.some(field => userData[field] !== originalData[field]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setRequestMessage('');
    setPendingRequest(true);

    if (!user || !user.user_id) {
      setErrorMessage('ID de usuario no definido. Requiere autenticación.');
      setPendingRequest(false);
      return;
    }

    try {
      // 1. Verificamos si cambió alguno de los campos "approval required"
      const changedApprovalFields = APPROVAL_REQUIRED_FIELDS.filter(
        field => originalData && userData[field] !== originalData[field]
      );
      const hasApprovalFields = changedApprovalFields.length > 0;

      // Si se modificó algo en esos campos => se requiere doc
      if (hasApprovalFields) {
        if (!file) {
          setErrorMessage(t('errorFileRequired')); // "Se requiere documento..."
          setPendingRequest(false);
          return;
        }
        // Estructura con los campos cambiados
        const approvalFields = {};
        changedApprovalFields.forEach(field => {
          approvalFields[field] = userData[field];
        });

        // Solicitud POST con file y changes
        await handleSubmitApprovalFields(approvalFields, file);
      }

      // 2. Campos "no aprobables": alt_email, contact_number, birth_date, country_of_residence
      //   + Manejo especial de email (tabla users)
      const updatableFields = ['alt_email', 'contact_number', 'birth_date', 'country_of_residence'];
      const autoFields = {};
      updatableFields.forEach((field) => {
        if (userData[field]) {
          autoFields[field] = userData[field];
        }
      });

      // Revisar correo principal en 'users'
      if (userData.email && userData.email !== user.email) {
        // Actualizar email en la tabla 'users'
        await handleUpdateUserEmail(userData.email);
      }

      // Actualizar resto en personal_details
      if (Object.keys(autoFields).length > 0) {
        await handleUpdateAutoFields(autoFields);
      }

      // Callback: refrescar datos en el padre
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      setErrorMessage(error.response?.data?.error || t('errorSubmittingRequest'));
    } finally {
      setPendingRequest(false);
    }
  };

  /**
   * PUT: /users/:user_id/email => Actualiza el correo principal en la tabla users
   */
  const handleUpdateUserEmail = async (newEmail) => {
    try {
      const resp = await axios.put(
        `/users/${user.user_id}/email`,
        { email: newEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Respuesta de updateEmail:', resp.data);
      setRequestMessage(t('emailUpdated'));
    } catch (error) {
      console.error('Error al actualizar email principal:', error);
      throw error;
    }
  };

  /**
   * PUT: /personal_details/:user_id => Actualizar campos sin aprobación
   */
  const handleUpdateAutoFields = async (autoFields) => {
    try {
      const response = await axios.put(
        `/personal_details/${user.user_id}`,
        autoFields,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Actualizar userData local con la respuesta
      setUserData(prev => ({ ...prev, ...response.data }));
      // Actualizar originalData (solo para esos campos)
      setOriginalData(prev => ({ ...prev, ...response.data }));

      setRequestMessage(t('infoUpdated'));
    } catch (error) {
      console.error('Error al actualizar personal_details:', error);
      throw error;
    }
  };

  /**
   * POST: /personal_details/:user_id/requestChange => Adjuntar doc + campos
   */
  const handleSubmitApprovalFields = async (approvalFields, file) => {
    try {
      const formData = new FormData();
      formData.append('changes', JSON.stringify(approvalFields));
      formData.append('file', file);

      const response = await axios.post(
        `/personal_details/${user.user_id}/requestChange`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data?.pending) {
        setRequestMessage(response.data.message);
      }
    } catch (error) {
      console.error('Error al solicitar aprobación:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
        <span>{t('loading')}</span>
      </div>
    );
  }

  if (!user) {
    return <div className={styles.error}>{t('notAuthenticated')}</div>;
  }

  // Determinar si DEBEMOS mostrar el input de documento en el formulario
  // (solo si se cambió al menos uno de los approval fields)
  const showDocInput = originalData && APPROVAL_REQUIRED_FIELDS.some(
    field => userData[field] !== originalData[field]
  );

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
      {errorMessage && (
        <Alert variant="danger">{errorMessage}</Alert>
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
          <Form.Label column sm={4} className={styles.label}>
            {t('id_estudiante')}
          </Form.Label>
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

        {/* Email (principal, tabla users) */}
        <Form.Group as={Row} className={styles['form-group']}>
          <Form.Label column sm={4} className={styles.label}>
            {t('correo_electronico')}
          </Form.Label>
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

        {/* Alternate Email (personal_details) */}
        <Form.Group as={Row} className={styles['form-group']}>
          <Form.Label column sm={4} className={styles.label}>
            {t('correo_alternativo')}
          </Form.Label>
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
          <Form.Label column sm={4} className={styles.label}>
            {t('numero_contacto')}
          </Form.Label>
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
          <Form.Label column sm={4} className={styles.label}>
            {t('tipo_identificacion')}
          </Form.Label>
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
          <Form.Label column sm={4} className={styles.label}>
            {t('numero_identificacion')}
          </Form.Label>
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
          <Form.Label column sm={4} className={styles.label}>
            {t('fecha_nacimiento')}
          </Form.Label>
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
          <Form.Label column sm={4} className={styles.label}>
            {t('pais_residencia')}
          </Form.Label>
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

        {/* Documento (archivo) SOLO si realmente cambió algún approval field */}
        {showDocInput && (
          <Form.Group as={Row} className={styles['form-group']}>
            <Form.Label column sm={4} className={styles.label}>
              {t('documento_identidad')}
            </Form.Label>
            <Col sm={8}>
              <Form.Control
                type="file"
                name="file"
                className={styles.input}
                onChange={handleFileChange}
                accept=".png,.jpg,.jpeg,.pdf"
                required
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
