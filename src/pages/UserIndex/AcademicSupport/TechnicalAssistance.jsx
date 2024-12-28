// Pages/TechnicalAssistance.jsx

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import HeaderComponent from '../../../components/Header/Header';
import PersonalCenter from '../../../components/UserIndex/PersonalCenter';
import Footer from '../../../components/Footer/Footer';
import PageTitle from '../../../components/PageTitle/PageTitle';
import CommonTechnicalIssues from '../../../components/UserIndex/AcademicSupport/TechnicalAssistance/CommonTechnicalIssues';
import ReportTechnicalProblem from '../../../components/UserIndex/AcademicSupport/TechnicalAssistance/ReportTechnicalProblem';
import SystemStatus from '../../../components/UserIndex/AcademicSupport/TechnicalAssistance/SystemStatus';
import TroubleshootingGuide from '../../../components/UserIndex/AcademicSupport/TechnicalAssistance/TroubleshootingGuide';
import LiveSupport from '../../../components/UserIndex/AcademicSupport/TechnicalAssistance/LiveSupport';
import SupportForm from '../../../components/UserIndex/AcademicSupport/TechnicalAssistance/SupportForm';
import SpecificProblemSolutions from '../../../components/UserIndex/AcademicSupport/TechnicalAssistance/SpecificProblemSolutions';
import TechnicalDocumentation from '../../../components/UserIndex/AcademicSupport/TechnicalAssistance/TechnicalDocumentation';
import ResolutionTimeEstimates from '../../../components/UserIndex/AcademicSupport/TechnicalAssistance/ResolutionTimeEstimates';
import TechnicalFAQs from '../../../components/UserIndex/AcademicSupport/TechnicalAssistance/TechnicalFAQs';
import styles from './TechnicalAssistance.module.css';

const TechnicalAssistance = () => {
  const { lang } = useParams();
  const { t } = useTranslation('UserIndex/AcademicSupport/TechnicalAssistance');
  const headerHeight = '125px';

  return (
    <>
      <PageTitle titleKey="technicalAssistanceTitle" />

      <HeaderComponent headerHeight={headerHeight} className="header-user-index" />

      <motion.div
        className="technical-assistance-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Container fluid className="user-index" style={{ marginTop: headerHeight }}>
          <Row>
            {/* Left Sidebar Menu */}
            <Col md={3}>
              <PersonalCenter />
            </Col>

            {/* Main Content */}
            <Col md={9}>
              <Row>
                <Col md={12}>
                  <h2 className={styles['page-title']}>{t('technicalAssistance')}</h2>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <SystemStatus />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <CommonTechnicalIssues />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <TroubleshootingGuide />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <SpecificProblemSolutions />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <TechnicalFAQs />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <ResolutionTimeEstimates />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <TechnicalDocumentation />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <ReportTechnicalProblem />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <SupportForm />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <LiveSupport />
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

export default TechnicalAssistance;
