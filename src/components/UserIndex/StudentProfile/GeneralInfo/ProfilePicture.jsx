// src/components/UserIndex/StudentProfile/GeneralInfo/ProfilePicture.jsx

import React, { useState, useEffect, useContext } from 'react';
import { Form, Image, Button, Spinner, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next'; 
import { AuthContext } from '../../../../contexts/AuthContext';
import axios from '../../../../axiosConfig';
import styles from './ProfilePicture.module.css';

const ProfilePicture = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/GeneralInfo');
  // Retrieve the authenticated user from context
  const { user } = useContext(AuthContext);

  // State to hold profile picture URL, selected file, loading and messages
  const [profilePic, setProfilePic] = useState('/uploads/default/profile.jpg');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch the current profile picture on mount
  useEffect(() => {
    if (user && user.user_id) {
      const fetchProfilePicture = async () => {
        try {
          const response = await axios.get(`/profile_picture/${user.user_id}`);
          if (response.data.picture_url) {
            const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
            setProfilePic(`${backendURL}${response.data.picture_url}`);
          } else {
            setProfilePic('/uploads/default/profile.jpg');
          }
        } catch (err) {
          setError(t('errorFetchingPhoto'));
        }
      };
      fetchProfilePicture();
    }
  }, [user, t]);

  // Handle file input changes and preview the selected image
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
      setSelectedFile(file);
    }
  };

  // Handle uploading the selected file
  const handleUpload = async () => {
    setError('');
    setSuccess('');

    if (!selectedFile) {
      setError(t('noFileSelected'));
      return;
    }
    if (!user || !user.user_id) {
      setError(t('noUserId'));
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await axios.post(
        `/profile_picture/${user.user_id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data.picture_url) {
        const backendURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
        setProfilePic(`${backendURL}${response.data.picture_url}`);
        setSuccess(t('fotoSubidaConExito'));
      }
    } catch (err) {
      setError(t('errorUploadingPhoto'));
    } finally {
      setLoading(false);
      setSelectedFile(null);
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
          <span className="visually-hidden">{t('loading')}</span>
        </Spinner>
      )}

      <Image 
        src={profilePic} 
        roundedCircle 
        className={styles.profilePicImage} 
        alt={t('foto_perfil')} 
      />

      {/* Centered text */}
      <div className={styles.centeredText}>
        <p>{t('actualizar_foto')}</p>
      </div>

      {/* Container with the two buttons centered */}
      <div className={styles.buttonContainer}>
        <div>
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
        </div>
        <div>
          <Button 
            className={styles.uploadPhotoButton}
            onClick={handleUpload} 
            disabled={loading}
          >
            {t('upload_photo')}
          </Button>
        </div>
      </div>

      {error && <Alert variant="danger" className={styles.alert}>{error}</Alert>}
      {success && <Alert variant="success" className={styles.alert}>{success}</Alert>}
    </motion.div>
  );
};

export default ProfilePicture;
