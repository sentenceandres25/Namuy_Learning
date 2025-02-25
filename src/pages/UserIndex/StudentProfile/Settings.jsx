import React, { lazy, Suspense } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import styles from './Settings.module.css';

// Lazy loading for performance optimization
const HeaderComponent = lazy(() => import('../../../components/Header/Header'));
const CentroPersonal = lazy(() => import('../../../components/UserIndex/PersonalCenter'));
const Footer = lazy(() => import('../../../components/Footer/Footer'));
const PageTitle = lazy(() => import('../../../components/PageTitle/PageTitle'));
const NotificationSettings = lazy(() => import('../../../components/UserIndex/StudentProfile/Settings/NotificationSettings'));
const PrivacySettings = lazy(() => import('../../../components/UserIndex/StudentProfile/Settings/PrivacySettings'));
const ContentPreferences = lazy(() => import('../../../components/UserIndex/StudentProfile/Settings/ContentPreferences'));
/**
 * AnimatedSection
 * A reusable wrapper that uses Intersection Observer to trigger
 * an entrance animation when the user scrolls this section into view.
 */
const AnimatedSection = ({ children }) => {
  // "triggerOnce: true" ensures the animation only happens on the first entry.
  // "threshold: 0.1" means the component starts animating when 10% is in view.
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      style={{ marginBottom: '20px' }}
    >
      {children}
    </motion.div>
  );
};

const Settings = () => {
  // Getting language parameter from the URL (e.g., /en, /es, etc.)
  const { lang } = useParams();
  
  // Using the i18next translation with a specific namespace
  const { t } = useTranslation('UserIndex/StudentProfile/Settings');

  // Define a consistent header height
  const headerHeight = '125px';

  // Debugging the selected language (remove if not needed)
  console.log(`Selected language: ${lang}`);

  return (
    <Suspense fallback={<div>Loading settings...</div>}>
      {/* Tab/Page Title - uses "settingsTitle" key from the translation file */}
      <PageTitle titleKey="settingsTitle" />

      {/* Header with dynamic height */}
      <HeaderComponent headerHeight={headerHeight} className="header-user-index" />

      {/* Main content with an entry animation using Framer Motion */}
      <motion.div
        className="settings-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Container fluid className="user-index" style={{ marginTop: headerHeight }}>
          <Row>
            {/* Left column: Personal Center menu */}
            <Col md={3}>
              <CentroPersonal />
            </Col>

            {/* Right column: All settings sections */}
            <Col md={9}>
              {/* Main Settings Title */}
              <Row>
                <Col md={12}>
                  <h2 className={styles['settings-title']}>{t('settings')}</h2>
                </Col>
              </Row>

              {/* Wrap each section in an AnimatedSection to reveal it on scroll */}
              <AnimatedSection>
                <Row>
                  <Col md={12}>
                    <NotificationSettings />
                  </Col>
                </Row>
              </AnimatedSection>

              <AnimatedSection>
                <Row>
                  <Col md={12}>
                    <PrivacySettings />
                  </Col>
                </Row>
              </AnimatedSection>

              <AnimatedSection>
                <Row>
                  <Col md={12}>
                    <ContentPreferences />
                  </Col>
                </Row>
              </AnimatedSection>
            </Col>
          </Row>
        </Container>
      </motion.div>

      {/* Footer */}
      <Footer />
    </Suspense>
  );
};

export default Settings;
