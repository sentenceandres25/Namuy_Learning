// src/pages/LoginProcess/LoginForm.jsx

import React, { useState, useEffect } from 'react';
import { Form, Container, Card, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HeaderComponent from '../../components/Header/Header'; 
import Footer from '../../components/Footer/Footer'; 
import PageTitle from '../../components/PageTitle/PageTitle'; 
import InputFieldLogin from '../../components/LoginForm/InputFieldLogin';
import ButtonLogin from '../../components/LoginForm/ButtonLogin';
import CreateAccountButtonLogin from '../../components/LoginForm/CreateAccountButtonLogin';
import LinksLogin from '../../components/LoginForm/LinksLogin';
import SocialLoginButtons from '../../components/LoginForm/SocialLoginButtons'; 
import styles from './LoginForm.module.css'; // Asegúrate de que este import está presente y correcto

const LoginForm = () => {
  const { t, i18n } = useTranslation('LoginProgress/LoginForm');
  const { lang } = useParams();
  const navigate = useNavigate();
  const headerHeight = '125px';
  
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Cambiar el idioma según el parámetro de URL
  useEffect(() => {
    if (lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  // Manejar cambios en el campo de correo electrónico
  const handleEmailChange = (e) => {
    setEmail(e.target.value.trim());
  };

  // Manejar el envío del formulario de correo electrónico
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      setErrorMessage(t('emailRequired'));
      return;
    }

    // Opcional: Validar formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage(t('invalidEmailFormat'));
      return;
    }

    // Navegar a la página de contraseña, pasando el email en el estado
    navigate(`/login/password/${lang}`, { state: { email } });
  };

  // Manejar el clic en "Crear Cuenta"
  const handleCreateAccount = () => {
    navigate(`/new-account/${lang}`);
  };

  return (
    <>
      {/* Título de la página */}
      <PageTitle titleKey="loginPageTitle" />

      {/* Componente de encabezado */}
      <HeaderComponent headerHeight={headerHeight} className="header-user-index" />

      {/* Contenido principal */}
      <div className={styles.animatedBackground}>
        <Container className={`${styles.loginFormContainer} d-flex justify-content-center align-items-center`}>
          <Card className={`${styles.loginFormCard} shadow-lg`}>
            <h3 className="text-center mb-4">{t('signIn')}</h3>
            <Form onSubmit={handleSubmit}>
              <InputFieldLogin
                type="email"
                label={t('email')}
                value={email}
                onChange={handleEmailChange}
                ariaLabel={t('email')}
                placeholder={t('enterEmail')}
              />
              {errorMessage && (
                <Alert variant="warning" className="mt-3">
                  {errorMessage}
                </Alert>
              )}
              <ButtonLogin text={t('next')} />
            </Form>

            {/* Botones de inicio de sesión social (opcional) */}
            <SocialLoginButtons />

            {/* Botón para crear una cuenta */}
            <CreateAccountButtonLogin onClick={handleCreateAccount} text={t('createAccount')} />

            {/* Enlaces para "Olvidé mi contraseña" y "Necesito ayuda" */}
            <LinksLogin />
          </Card>
        </Container>
      </div>

      {/* Componente de pie de página */}
      <Footer />
    </>
  );
};

export default LoginForm;
