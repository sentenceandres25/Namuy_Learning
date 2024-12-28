// Components/LoginForm/InputFieldLogin.jsx

import React from 'react';
import { Form } from 'react-bootstrap';
import styles from './InputFieldLogin.module.css';

const InputFieldLogin = ({ label, type = 'text', value, onChange, ariaLabel }) => (
  <Form.Group className="mb-3">
    <Form.Label>{label}</Form.Label>
    <Form.Control
      type={type}
      value={value}
      onChange={onChange}
      placeholder={label}
      className={styles.loginFormInput}
      required
      aria-label={ariaLabel}
    />
  </Form.Group>
);

export default InputFieldLogin;
