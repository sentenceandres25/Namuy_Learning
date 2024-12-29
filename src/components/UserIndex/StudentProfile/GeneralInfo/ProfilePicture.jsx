// src/components/UserIndex/StudentProfile/GeneralInfo/ProfilePicture.jsx

import React, { useState, useEffect } from 'react';
import { Form, Image, Button, Spinner, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next'; 
import styles from './ProfilePicture.module.css';
import axios from '../../../../axiosConfig';

const ProfilePicture = ({ data = {} }) => {
  const { t } = useTranslation('UserIndex/StudentProfile/GeneralInfo');
  
  const [profilePic, setProfilePic] = useState('/uploads/default/profile.jpg'); // Ruta por defecto
  const [fileName, setFileName] = useState(t('seleccionar_archivo')); 
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const userId = data.user_id;

  useEffect(() => {
    if (userId) {
      // Obtener la foto de perfil actual
      const fetchProfilePicture = async () => {
        try {
          const response = await axios.get(`/profile_picture/${userId}`);
          if (response.data.picture_url) {
            // Prepend the backend base URL
            const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
            setProfilePic(`${backendURL}${response.data.picture_url}`);
          } else {
            setProfilePic('/uploads/default/profile.jpg'); // Imagen por defecto si no hay
          }
        } catch (err) {
          console.error("Error al obtener la foto de perfil:", err.response?.data || err.message);
          setError(t('errorFetchingPhoto'));
        }
      };

      fetchProfilePicture();
    }
  }, [userId, t]);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Preview local
      setProfilePic(URL.createObjectURL(file));
      setFileName(file.name);
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    setError('');
    setSuccess('');

    if (!selectedFile) {
      setError(t('noFileSelected'));
      return;
    }

    if (!userId) {
      setError(t('noUserId'));
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Llamar a /api/profile_picture/<user_id> con multipart/form-data
      const response = await axios.post(`/profile_picture/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log("Foto subida:", response.data);
      if (response.data.picture_url) {
        // Prepend the backend base URL
        const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
        setProfilePic(`${backendURL}${response.data.picture_url}`);
        setSuccess(t('fotoSubidaConExito'));
      }
    } catch (err) {
      console.error("Error al subir foto:", err.response?.data || err.message);
      setError(t('errorUploadingPhoto'));
    } finally {
      setLoading(false);
      setSelectedFile(null);
      setFileName(t('seleccionar_archivo'));
    }
  };

  return (
    <motion.div
      className={styles.profilePictureContainer}
      initial={{ y: -20 }}
      animate={{ y: 0 }}
    >
      {loading && (
        <Spinner animation="border" role="status" className={styles.spinner}>
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      )}

      <Image src={profilePic} roundedCircle className={styles.profilePicImage} alt={t('foto_perfil')} />

      <Form.Group className={styles.profilePicLabel}>
        <Form.Label>{t('actualizar_foto')}</Form.Label>
        <Form.Control
          type="file"
          onChange={handleProfilePicChange}
          className={styles.hiddenFileInput}
          id="upload-button"
          accept=".png,.jpg,.jpeg,.gif"
        />
        <label htmlFor="upload-button" className={styles.uploadLabel}>
          <Button as="span" className={styles.uploadButton}>
            {t('seleccionar_archivo')}
          </Button>
        </label>
      </Form.Group>

      <Button className={styles.uploadPhotoButton} onClick={handleUpload} disabled={loading}>
        {t('subir_foto')}
      </Button>

      {error && <Alert variant="danger" className={styles.alert}>{error}</Alert>}
      {success && <Alert variant="success" className={styles.alert}>{success}</Alert>}
    </motion.div>
  );
};

export default ProfilePicture;
