// src/pages/LoginProcess/LoginPasswordPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container, Card, Form, Alert, Spinner } from 'react-bootstrap';
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

  const { login } = useContext(AuthContext);

  // Recibir email desde la pantalla anterior
  const { email } = location.state || {};

  // Estados locales
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [loading, setLoading] = useState(false);

  // Ajustar idioma
  useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  // Si no hay email, redirigir a la página previa
  useEffect(() => {
    if (!email) {
      navigate(`/login/${lang || 'es'}`);
    }
  }, [email, navigate, lang]);

  // Handlers de input
  const handlePasswordChange = (e) => setPassword(e.target.value.trim());
  const handleCodeChange = (e) => setCode(e.target.value.trim());

  // Submit general (etapa 1 -> password, etapa 2 -> codigo 2FA)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    // ETAPA 1: Email/Pass
    if (!twoFactorRequired) {
      try {
        const loginData = {
          email: email?.trim() || '',
          password: password.trim()
        };

        if (!loginData.email || !loginData.password) {
          setErrorMessage(t('emailAndPasswordRequired'));
          return;
        }

        const resp = await fetch('http://localhost:3001/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(loginData),
        });
        const data = await resp.json();

        if (!resp.ok) {
          if (resp.status === 401) {
            setErrorMessage(t('incorrectPassword'));
          } else if (resp.status === 404) {
            setErrorMessage(t('userNotFound'));
          } else {
            setErrorMessage(data.error || t('anErrorOccurred'));
          }
          return;
        }

        // Si el backend indica 2FA
        if (data.twoFactorRequired) {
          setTwoFactorRequired(true);
        } else {
          // 2FA no requerido => login directo
          const userData = {
            user_id: data.user_id,
            email: loginData.email,
            username: data.username,
            last_access: data.last_access,
          };
          // Guardar en AuthContext
          login(userData, data.token);
          navigate(`/pages/HomePage/${lang || 'es'}`);
        }
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        setErrorMessage(t('anErrorOccurred'));
      } finally {
        setLoading(false);
      }
    } 
    // ETAPA 2: Código 2FA
    else {
      try {
        if (!code) {
          setErrorMessage(t('invalidVerificationCode'));
          return;
        }

        const verifyData = { email, code };
        const resp = await fetch('http://localhost:3001/api/auth/verify-2fa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(verifyData),
        });
        const data = await resp.json();

        if (!resp.ok) {
          setErrorMessage(data.error || t('invalidVerificationCode'));
          return;
        }

        // Éxito con 2FA
        const userData = {
          user_id: data.user_id,
          email,
          username: data.username,
          last_access: data.last_access,
        };
        login(userData, data.token);

        // Ir a Home
        navigate(`/pages/HomePage/${lang || 'es'}`);
      } catch (error) {
        console.error('Error al verificar 2FA:', error);
        setErrorMessage(t('anErrorOccurred'));
      } finally {
        setLoading(false);
      }
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
            <h3 className="text-center mb-4">
              {twoFactorRequired ? t('twoFactorAuthentication') : t('signIn')}
            </h3>

            {!twoFactorRequired && (
              <p className="text-center mb-4">
                {email}{' '}
                <Link to={`/login/${lang || 'es'}`} className={styles['change-email-link']}>
                  {t('change')}
                </Link>
              </p>
            )}

            <Form onSubmit={handleSubmit}>
              {!twoFactorRequired ? (
                <InputFieldLogin
                  type="password"
                  label={t('password')}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder={t('enterPassword')}
                />
              ) : (
                <InputFieldLogin
                  type="text"
                  label={t('verificationCode')}
                  value={code}
                  onChange={handleCodeChange}
                  placeholder={t('enterVerificationCode')}
                />
              )}

              {errorMessage && (
                <Alert variant="warning" className="mt-3">
                  {errorMessage}
                </Alert>
              )}

              <ButtonLogin
                text={
                  loading
                    ? <Spinner size="sm" />
                    : twoFactorRequired ? t('verify') : t('login')
                }
                disabled={loading}
              />
            </Form>

            {!twoFactorRequired && <LinksLogin />}
          </Card>
        </Container>
      </div>

      <Footer />
    </>
  );
};

export default LoginPasswordPage;
