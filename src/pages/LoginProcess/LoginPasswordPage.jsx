// src/pages/LoginProcess/LoginPasswordPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container, Card, Form, Alert } from 'react-bootstrap';
import styles from './LoginPasswordPage.module.css';
import HeaderComponent from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import PageTitle from '../../components/PageTitle/PageTitle';
import InputFieldLogin from '../../components/LoginForm/InputFieldLogin';
import ButtonLogin from '../../components/LoginForm/ButtonLogin';
import LinksLogin from '../../components/LoginForm/LinksLogin';
import { AuthContext } from '../../contexts/AuthContext';

const LoginPasswordPage = () => {
  const { t, i18n } = useTranslation('LoginProgress/LoginPasswordPage');
  const { lang } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {};
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login } = useContext(AuthContext);

  useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  useEffect(() => {
    if (!email) {
      navigate(`/login/${lang || 'es'}`);
    }
  }, [email, navigate, lang]);

  const handlePasswordChange = (e) => setPassword(e.target.value.trim());

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = {
      email: email ? email.trim() : '',
      password: password ? password.trim() : ''
    };

    if (!loginData.email || !loginData.password) {
      setErrorMessage(t('emailAndPasswordRequired'));
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          setErrorMessage(t('incorrectPassword'));
        } else if (response.status === 404) {
          setErrorMessage(t('userNotFound'));
        } else {
          setErrorMessage(errorData.error || t('anErrorOccurred'));
        }
        return;
      }

      const data = await response.json();
      // data.token, data.user_id, data.username deben venir del backend
      const userData = {
        user_id: data.user_id,
        email: loginData.email,
        username: data.username,
      };
      // Llamar login con userData y data.token
      login(userData, data.token);
      navigate(`/pages/HomePage/${lang || 'es'}`);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setErrorMessage(t('anErrorOccurred'));
    }
  };

  if (!email) return null;

  return (
    <>
      <PageTitle titleKey="loginPageTitle" />
      <HeaderComponent headerHeight="125px" className="header-user-index" />
      <div className={styles['password-login']}>
        <Container
          className={`${styles['password-login-container']} d-flex justify-content-center align-items-center`}
        >
          <Card className={`${styles['password-login-card']} shadow-lg`}>
            <h3 className="text-center mb-4">{t('signIn')}</h3>
            <p className="text-center mb-4">
              {email}{' '}
              <Link to={`/login/${lang || 'es'}`} className={styles['change-email-link']}>
                {t('change')}
              </Link>
            </p>
            <Form onSubmit={handleSubmit}>
              <InputFieldLogin
                type="password"
                label={t('password')}
                value={password}
                onChange={handlePasswordChange}
                ariaLabel={t('password')}
                placeholder={t('enterPassword')}
              />
              {errorMessage && (
                <Alert variant="warning" className="mt-3">
                  {errorMessage}
                </Alert>
              )}
              <ButtonLogin text={t('login')} />
            </Form>
            <LinksLogin />
          </Card>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default LoginPasswordPage;
