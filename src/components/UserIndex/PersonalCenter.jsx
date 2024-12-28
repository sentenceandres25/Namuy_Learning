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
  faCertificate,
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
  faMapMarkerAlt,
  faExclamationTriangle,
  faComments
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
    { title: t('Academic History'), icon: faClipboard, link: 'AcademicHistory' },
    { title: t('Preferences and Settings'), icon: faCogs, link: 'Settings' },
    { title: t('Saved Locations'), icon: faMapMarkerAlt, link: 'UbicacionesGuardadas' },
    { title: t('Performance Statistics'), icon: faClipboardCheck, link: 'PerformanceStatistics' },
  ];

  const coursesItems = [
    { title: t('In Progress Courses'), icon: faClipboardCheck, link: 'CoursesInProgress' },
    { title: t('Completed Courses'), icon: faClipboardCheck, link: 'CompletedCourses' },
    { title: t('Pending Evaluations'), icon: faClipboardCheck, link: 'PendingEvaluations' },
  ];

  const certificationsItems = [
    { title: t('Obtained Certificates'), icon: faCertificate, link: 'CertificatesObtained' },
    { title: t('Certificates in Progress'), icon: faClipboardCheck, link: 'CertificatesInProgress' },
    { title: t('Expired Certificates'), icon: faExclamationTriangle, link: 'ExpiredCertificates' },
  ];

  const tutoringItems = [
    { title: t('Tutoring History'), icon: faClipboard, link: 'TutoringHistory' },
    { title: t('Schedule New Tutoring'), icon: faClock, link: 'ScheduleTutoring' },
    { title: t('Pending Tutoring Sessions'), icon: faClipboardCheck, link: 'PendingTutoringSessions' },
    { title: t('Evaluate Tutoring Sessions'), icon: faStar, link: 'EvaluateTutoringSessions' },
    { title: t('Request Extra Tutoring'), icon: faCommentDots, link: 'RequestExtraTutoring' },
  ];

  const forumItems = [
    { title: t('Recent Topics'), icon: faClock, link: 'RecentTopics' },
    { title: t('My Participations'), icon: faClipboard, link: 'MyContributions' },
    { title: t('Start New Conversation'), icon: faComments, link: 'StartNewConversation' },
  ];

  const supportItems = [
    { title: t('Frequent Questions'), icon: faQuestionCircle, link: 'FrequentlyAskedQuestions' },
    { title: t('Technical Support'), icon: faClipboardCheck, link: 'TechnicalAssistance' },
  ];

  const resourcesItems = [
    { title: t('Virtual Library'), icon: faBook, link: 'VirtualLibrary' },
    { title: t('Supplementary Materials'), icon: faDownload, link: 'SupplementaryMaterial' },
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
          title={t('My Courses')}
          icon={faBook}
          items={coursesItems}
          lang={lang}
        />

        <CollapsibleSection
          title={t('Certifications')}
          icon={faCertificate}
          items={certificationsItems}
          lang={lang}
        />

        <CollapsibleSection
          title={t('Personalized Tutoring')}
          icon={faChalkboardTeacher}
          items={tutoringItems}
          lang={lang}
        />

        <CollapsibleSection
          title={t('Discussion Forum')}
          icon={faComments}
          items={forumItems}
          lang={lang}
        />

        <CollapsibleSection
          title={t('Academic Support')}
          icon={faCommentDots}
          items={supportItems}
          lang={lang}
        />

        <CollapsibleSection
          title={t('Additional Resources')}
          icon={faClipboard}
          items={resourcesItems}
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
