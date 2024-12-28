// Settings.jsx

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import HeaderComponent from '../../../components/Header/Header';
import CentroPersonal from '../../../components/UserIndex/PersonalCenter';
import Footer from '../../../components/Footer/Footer';
import PageTitle from '../../../components/PageTitle/PageTitle';
import InterfaceSettings from '../../../components/UserIndex/StudentProfile/Settings/InterfaceSettings';
import NotificationSettings from '../../../components/UserIndex/StudentProfile/Settings/NotificationSettings';
import PrivacySettings from '../../../components/UserIndex/StudentProfile/Settings/PrivacySettings';
import ContentPreferences from '../../../components/UserIndex/StudentProfile/Settings/ContentPreferences';
import AccessibilitySettings from '../../../components/UserIndex/StudentProfile/Settings/AccessibilitySettings';
import AccountPreferences from '../../../components/UserIndex/StudentProfile/Settings/AccountPreferences';
import DeviceSettings from '../../../components/UserIndex/StudentProfile/Settings/DeviceSettings';
import AdsPreferences from '../../../components/UserIndex/StudentProfile/Settings/AdsPreferences';
import KeyboardShortcuts from '../../../components/UserIndex/StudentProfile/Settings/KeyboardShortcuts';
import Integrations from '../../../components/UserIndex/StudentProfile/Settings/Integrations';
import styles from './Settings.module.css';

const Settings = () => {
  const { lang } = useParams(); // Obtener el parámetro lang de la URL
  const { t } = useTranslation('UserIndex/StudentProfile/Settings'); // Usar el namespace de traducción
  const headerHeight = '125px'; // Ajusta esto según el tamaño del header

  // Puedes usar el parámetro `lang` para ajustar el contenido según el idioma
  console.log(`Idioma seleccionado: ${lang}`);

  return (
    <>
      {/* Agregando el título de la pestaña */}
      <PageTitle titleKey="settingsTitle" /> {/* Usamos 'titleKey' para traducir el título de la pestaña */}

      {/* Encabezado */}
      <HeaderComponent headerHeight={headerHeight} className="header-user-index" />

      {/* Contenido principal con margen superior para evitar superposición con el encabezado */}
      <motion.div
        className="settings-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Container fluid className="user-index" style={{ marginTop: headerHeight }}>
          <Row>
            {/* Menú lateral izquierdo */}
            <Col md={3}>
              <CentroPersonal />
            </Col>

            {/* Contenido principal */}
            <Col md={9}>
              <Row>
                <Col md={12}>
                <h2 className={styles['settings-title']}>{t('settings')}</h2>
                {/* Usando traducción para el título */}
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <InterfaceSettings />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <NotificationSettings />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <PrivacySettings />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <ContentPreferences />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <AccessibilitySettings />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <AccountPreferences />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <DeviceSettings />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <AdsPreferences />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <KeyboardShortcuts />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <Integrations />
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </motion.div>

      {/* Pie de página */}
      <Footer />
    </>
  );
};

export default Settings;
