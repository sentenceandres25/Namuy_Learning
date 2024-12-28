// src/components/UserIndex/StudentProfile/ParentComponent.jsx

import React, { useContext, useState } from 'react';
import PersonalDetails from './GeneralInfo/PersonalDetails';
import { AuthContext } from '../../../../contexts/AuthContext';
import axios from 'axios';
import { Spinner, Alert } from 'react-bootstrap';

const ParentComponent = () => {
  const { user, token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleUpdate = async (userData, file) => {
    if (!user || !user.id) {
      console.error("ID de usuario no definido.");
      setErrorMessage('ID de usuario no definido.');
      return;
    }

    const formData = new FormData();
    formData.append('changes', JSON.stringify(userData));
    if (file) {
      formData.append('file', file);
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await axios.post(`/api/user/${user.id}/requestChange`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log("Respuesta de la solicitud:", response.data);
      setSuccessMessage(response.data.message || 'Solicitud enviada con éxito.');
    } catch (error) {
      console.error("Error al enviar la solicitud de cambio:", error);
      setErrorMessage(error.response?.data?.error || 'Error al enviar la solicitud.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && (
        <div className={styles.loading}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Enviando...</span>
          </Spinner>
          <span>Enviando...</span>
        </div>
      )}
      {successMessage && (
        <Alert variant="success">
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert variant="danger">
          {errorMessage}
        </Alert>
      )}
      <PersonalDetails data={/* tus datos */} onUpdate={handleUpdate} />
    </div>
  );
};

export default ParentComponent;
