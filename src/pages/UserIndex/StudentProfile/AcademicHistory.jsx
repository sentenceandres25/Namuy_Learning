// AcademicHistory.jsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import HeaderComponent from '../../../components/Header/Header';
import CentroPersonal from '../../../components/UserIndex/PersonalCenter';
import Footer from '../../../components/Footer/Footer';
import CompletedCourses from '../../../components/UserIndex/StudentProfile/AcademicHistory/CompletedCourses';
import InProgressCourses from '../../../components/UserIndex/StudentProfile/AcademicHistory/InProgressCourses';
import Evaluations from '../../../components/UserIndex/StudentProfile/AcademicHistory/Evaluations';
import PerformanceStats from '../../../components/UserIndex/StudentProfile/AcademicHistory/PerformanceStats';
import GeneralProgress from '../../../components/UserIndex/StudentProfile/AcademicHistory/GeneralProgress';
import PageTitle from '../../../components/PageTitle/PageTitle';
import styles from './AcademicHistory.module.css'; // Importar el archivo CSS Module

const AcademicHistory = () => {
  const { lang } = useParams();
  const { t } = useTranslation('UserIndex/StudentProfile/AcademicHistory');
  const headerHeight = '125px';

  return (
    <>
      <PageTitle titleKey="academicHistoryTitle" />
      <HeaderComponent headerHeight={headerHeight} className="header-user-index" />
      <motion.div
        className={styles.academicHistory} // Aplicar clase para el contenedor principal
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Container fluid className="user-index" style={{ marginTop: headerHeight }}>
          <Row>
            <Col md={3}>
              <CentroPersonal />
            </Col>
            <Col md={9}>
              <Row>
                <Col md={12}>
                  <h2 className={styles.title}>{t('academicHistory')}</h2>
                </Col>
              </Row>
              <Row>
                <Col md={12} className={styles.sectionContainer}>
                  <CompletedCourses />
                </Col>
              </Row>
              <Row>
                <Col md={12} className={styles.sectionContainer}>
                  <InProgressCourses />
                </Col>
              </Row>
              <Row>
                <Col md={12} className={styles.sectionContainer}>
                  <Evaluations />
                </Col>
              </Row>
              <Row>
                <Col md={12} className={styles.sectionContainer}>
                  <PerformanceStats />
                </Col>
              </Row>
              <Row>
                <Col md={12} className={styles.sectionContainer}>
                  <GeneralProgress />
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </motion.div>
      <Footer />
    </>
  );
};

export default AcademicHistory;
