// Components/LoginForm/SocialLoginButtons.jsx

import React from 'react';
import { Button } from 'react-bootstrap';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import styles from './SocialLoginButtons.module.css';

const SocialLoginButtons = () => (
  <div className={styles.socialButtons}>
    <Button variant="outline-danger" className={styles.socialButton}>
      <FaGoogle /> Sign in with Google
    </Button>
    <Button variant="outline-primary" className={styles.socialButton}>
      <FaFacebook /> Sign in with Facebook
    </Button>
  </div>
);

export default SocialLoginButtons;
