import React, { useEffect, startTransition } from 'react';
import styles from './OnlineCourseHeader.module.css';
import { FaStar, FaShareAlt, FaEllipsisV, FaLanguage } from 'react-icons/fa';
import { Dropdown, ProgressBar } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import logo from '../../assets/images/logo1.png';

const OnlineCourseHeader = ({ course }) => {
  const { t, i18n } = useTranslation('OnlineCourse');
  const navigate = useNavigate();
  const { lang } = useParams();

  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'es';
    if (lang && i18n.language !== lang) {
      startTransition(() => {
        i18n.changeLanguage(lang);
        localStorage.setItem('language', lang);
      });
    } else if (!lang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
  }, [lang, i18n]);

  const handleLogoClick = () => {
    startTransition(() => {
      navigate(`/pages/HomePage/${lang || i18n.language}`);
    });
  };

  // Función para alternar el idioma
  const handleLanguageToggle = () => {
    const newLanguage = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  return (
    <header className={styles.header}>
      <img
        src={logo}
        alt={t('companyLogoAlt')}
        className={styles.logo}
        onClick={handleLogoClick}
        style={{ cursor: 'pointer' }}
      />
      <h1 className={styles.title}>{course.title}</h1>
      <div className={styles.headerActions}>
        <button className={styles.ratingButton}>
          <FaStar /> <span className={styles.buttonText}>{t('leaveRating')}</span>
        </button>
        <div className={styles.progress}>
          <ProgressBar now={course.progress} label={`${course.progress}%`} />
        </div>
        <button className={styles.shareButton}>
          <FaShareAlt /> <span className={styles.buttonText}>{t('share')}</span>
        </button>
        <button onClick={handleLanguageToggle} className={styles.languageToggle}>
          <FaLanguage className={styles.languageIcon} /> {i18n.language === 'en' ? 'Español' : 'English'}
        </button>
        <Dropdown>
          <Dropdown.Toggle variant="link" className={styles.dropdownToggle}>
            <FaEllipsisV />
          </Dropdown.Toggle>
          <Dropdown.Menu align="end" className={`${styles.dropdownMenu} custom-dropdown-menu`}>
            <Dropdown.Item className={`${styles.dropdownItem} custom-dropdown-item`} href="#/favorite">
              {t('markAsFavorite')}
            </Dropdown.Item>
            <Dropdown.Item className={`${styles.dropdownItem} custom-dropdown-item`} href="#/archive">
              {t('archiveCourse')}
            </Dropdown.Item>
            <Dropdown.Item className={`${styles.dropdownItem} custom-dropdown-item`} href="#/gift">
              {t('giftCourse')}
            </Dropdown.Item>
            <Dropdown.Item className={`${styles.dropdownItem} custom-dropdown-item`} href="#/notifications">
              {t('activateNotifications')}
            </Dropdown.Item>
            <Dropdown.Item className={`${styles.dropdownItem} custom-dropdown-item`} href="#/promotions">
              {t('promotionalEmails')}
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item className={`${styles.dropdownItem} custom-dropdown-item`} disabled>
              {t('refundable', {
                isRefundable: course.isRefundable ? t('yes') : t('no'),
              })}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </header>
  );
};

export default OnlineCourseHeader;
