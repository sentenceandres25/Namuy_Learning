import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HeaderComponent from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import PageTitle from '../../components/PageTitle/PageTitle';
import styles from './NewAccountPage.module.css';

const NewAccountPage = () => {
  const { t, i18n } = useTranslation('LoginProgress/NewAccountPage');
  const { lang } = useParams();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage(t('passwordsDoNotMatch'));
      return;
    }

    fetch('http://localhost:3001/api/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    })
      .then((res) => {
        if (res.status === 201) {
          navigate(`/login/${lang}`);
        } else if (res.status === 409) {
          throw new Error(t('emailOrUsernameAlreadyRegistered'));
        } else {
          return res.json().then((data) => {
            throw new Error(data.error || t('anErrorOccurred'));
          });
        }
      })
      .catch((err) => setErrorMessage(err.message || t('anErrorOccurred')));
  };

  return (
    <>
      <PageTitle titleKey="newAccountPageTitle" />
      <HeaderComponent headerHeight="125px" className="header-user-index" />
      <div className={styles.newaccount}>
        <div className={styles['newaccount-container']}>
          <div className={styles['newaccount-card']}>
            <h1 className={styles['newaccount-title']}>{t('createNewAccount')}</h1>
            <form onSubmit={handleSubmit}>
              <div className={styles['newaccount-form-group']}>
                <label htmlFor="newaccount-username">{t('username')}</label>
                <input
                  type="text"
                  id="newaccount-username"
                  className={styles['newaccount-input-field']}
                  placeholder={t('enterUsername')}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className={styles['newaccount-form-group']}>
                <label htmlFor="newaccount-email">{t('email')}</label>
                <input
                  type="email"
                  id="newaccount-email"
                  className={styles['newaccount-input-field']}
                  placeholder={t('enterEmail')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className={styles['newaccount-form-group']}>
                <label htmlFor="newaccount-password">{t('password')}</label>
                <input
                  type="password"
                  id="newaccount-password"
                  className={styles['newaccount-input-field']}
                  placeholder={t('atLeast6Characters')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className={styles['newaccount-form-group']}>
                <label htmlFor="newaccount-confirm-password">
                  {t('reEnterPassword')}
                </label>
                <input
                  type="password"
                  id="newaccount-confirm-password"
                  className={styles['newaccount-input-field']}
                  placeholder={t('reEnterPasswordPlaceholder')}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              {errorMessage && (
                <p className={styles['error-message']}>{errorMessage}</p>
              )}
              <div className={styles['newaccount-form-group']}>
                <button
                  className={styles['newaccount-create-btn']}
                  type="submit"
                >
                  {t('createAccount')}
                </button>
              </div>
            </form>
            <div className={styles['newaccount-links']}>
              <p>
                {t('byCreatingAccount')}{' '}
                <a href="/terms" className={styles['newaccount-link']}>
                  {t('conditionsOfUse')}
                </a>{' '}
                {t('and')}{' '}
                <a href="/privacy" className={styles['newaccount-link']}>
                  {t('privacyNotice')}
                </a>
                .
              </p>
              <a
                href={`/login/${lang}`}
                className={styles['newaccount-signin-link']}
              >
                {t('alreadyHaveAccountSignIn')}
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NewAccountPage;
