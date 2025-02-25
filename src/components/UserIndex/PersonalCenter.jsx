// Components/PersonalCenter/PersonalCenter.jsx

import React, { useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; 
import CollapsibleSection from './CollapsibleSection';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faBook,
  faChalkboardTeacher,
  faCommentDots,
  faCogs,
  faClipboardCheck,
  faStar,
  faSignOutAlt,
  faQuestionCircle,
  faDownload,
  faGraduationCap,
  faClipboard,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import styles from './PersonalCenter.module.css';

const PersonalCenter = () => {
  const { lang } = useParams();
  const { t, i18n } = useTranslation('UserIndex/PersonalCenter');
  const navigate = useNavigate();
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    i18n.changeLanguage(lang);

    // Cargar datos del usuario desde localStorage
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      setUserName(userData?.name || null);
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
    }
  }, [lang, i18n]);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    setUserName(null);
    navigate(`/login/${lang}`);
  };

  // Definición de los elementos de cada sección
  const profileItems = [
    { title: t('General Information'), icon: faGraduationCap, link: 'Info' },
    { title: t('Preferences and Settings'), icon: faCogs, link: 'Settings' },
  ];

  const tutoringItems = [
    { title: t('Tutoring History'), icon: faClipboard, link: 'TutoringHistory' },
    { title: t('Schedule New Tutoring'), icon: faClock, link: 'ScheduleTutoring' },
    { title: t('Pending Tutoring Sessions'), icon: faClipboardCheck, link: 'PendingTutoringSessions' },
    { title: t('Evaluate Tutoring Sessions'), icon: faStar, link: 'EvaluateTutoringSessions' },
  ];

  const supportItems = [
    { title: t('Frequent Questions'), icon: faQuestionCircle, link: 'FrequentlyAskedQuestions' },
    { title: t('Technical Support'), icon: faClipboardCheck, link: 'TechnicalAssistance' },
  ];

  const policyItems = [
    { title: t('Study Policies'), icon: faClipboard, link: 'StudyPolicies' },
    { title: t('Terms'), icon: faClipboardCheck, link: 'TermsAndConditions' },
  ];

  return (
    <div className={styles.personalCenter}>
      <h3 className={styles.panelTitle}>{t('Options Menu')}</h3>
      <ListGroup>

        <CollapsibleSection
          title={t('Student Profile')}
          icon={faUser}
          items={profileItems}
          lang={lang}
        />

        <CollapsibleSection
          title={t('Personalized Tutoring')}
          icon={faChalkboardTeacher}
          items={tutoringItems}
          lang={lang}
        />

        <CollapsibleSection
          title={t('Academic Support')}
          icon={faCommentDots}
          items={supportItems}
          lang={lang}
        />

        <CollapsibleSection
          title={t('Academic Regulations')}
          icon={faClipboard}
          items={policyItems}
          lang={lang}
        />

        {/* Sección de Cerrar Sesión */}
        <ListGroup.Item action onClick={handleLogout} className={styles.listGroupItem}>
          <FontAwesomeIcon icon={faSignOutAlt} className={styles.itemIcon} />
          <span>{t('Log Out')}</span>
        </ListGroup.Item>

      </ListGroup>
    </div>
  );
};

export default PersonalCenter;
