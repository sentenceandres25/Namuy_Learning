// Components/LoginForm/ButtonLogin.jsx

import React from 'react';
import { Button } from 'react-bootstrap';
import styles from './ButtonLogin.module.css';

const ButtonLogin = ({ text }) => (
  <Button type="submit" variant="warning" className={styles.loginFormButton}>
    {text}
  </Button>
);

export default ButtonLogin;
