// Components/LoginForm/CreateAccountButtonLogin.jsx

import React from 'react';
import { Button } from 'react-bootstrap';
import styles from './CreateAccountButtonLogin.module.css';

const CreateAccountButtonLogin = ({ onClick, text }) => (
  <Button
    variant="outline-secondary"
    className={styles.createAccountButton}
    onClick={onClick}
    aria-label={text}
  >
    {text}
  </Button>
);

export default CreateAccountButtonLogin;
