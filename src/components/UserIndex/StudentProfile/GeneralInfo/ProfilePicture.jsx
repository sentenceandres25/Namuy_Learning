// ProfilePicture.jsx
import React, { useState } from 'react';
import { Form, Image, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next'; 
import styles from './ProfilePicture.module.css'; // Importamos el módulo CSS con nombres únicos

const ProfilePicture = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/GeneralInfo'); 
  const [profilePic, setProfilePic] = useState('/path/to/default/profile.jpg');
  const [fileName, setFileName] = useState(t('seleccionar_archivo')); 

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
      setFileName(file.name); 
    }
  };

  return (
    <motion.div
      className={styles.profilePictureContainer}
      initial={{ y: -20 }}
      animate={{ y: 0 }}
    >
      <Image src={profilePic} roundedCircle className={styles.profilePicImage} />
      <Form.Group  className={styles.profilePicLabel}>
        <Form.Label>{t('actualizar_foto')}</Form.Label> 
        <Form.Control type="file" onChange={handleProfilePicChange} className={styles.hiddenFileInput} id="upload-button" />
        <label htmlFor="upload-button">
          <Button as="span" className={styles.uploadButton}>
            {t('seleccionar_archivo')}
          </Button>
          <span className={styles.fileName}>{fileName}</span> 
        </label>
      </Form.Group>
    </motion.div>
  );
};

export default ProfilePicture;
