// Pages/StudyPolicies.jsx

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import HeaderComponent from '../../../components/Header/Header';
import PersonalCenter from '../../../components/UserIndex/PersonalCenter';
import Footer from '../../../components/Footer/Footer';
import PageTitle from '../../../components/PageTitle/PageTitle';
import GeneralStudyNorms from '../../../components/UserIndex/AcademicRegulations/StudyPolicies/GeneralStudyNorms';
import AttendancePunctuality from '../../../components/UserIndex/AcademicRegulations/StudyPolicies/AttendancePunctuality';
import CourseRequirements from '../../../components/UserIndex/AcademicRegulations/StudyPolicies/CourseRequirements';
import UseOfMaterials from '../../../components/UserIndex/AcademicRegulations/StudyPolicies/UseOfMaterials';
import EvaluationFeedback from '../../../components/UserIndex/AcademicRegulations/StudyPolicies/EvaluationFeedback';
import AcademicConductCode from '../../../components/UserIndex/AcademicRegulations/StudyPolicies/AcademicConductCode';
import SubmissionDeadlines from '../../../components/UserIndex/AcademicRegulations/StudyPolicies/SubmissionDeadlines';
import UseOfTechnology from '../../../components/UserIndex/AcademicRegulations/StudyPolicies/UseOfTechnology';
import ForumParticipationRules from '../../../components/UserIndex/AcademicRegulations/StudyPolicies/ForumParticipationRules';
import ConsequencesOfNonCompliance from '../../../components/UserIndex/AcademicRegulations/StudyPolicies/ConsequencesOfNonCompliance';
import styles from './StudyPolicies.module.css';

const StudyPolicies = () => {
  const { lang } = useParams();
  const { t } = useTranslation('UserIndex/AcademicRegulations/StudyPolicies');
  const headerHeight = '125px';

  return (
    <>
      <PageTitle titleKey="studyPoliciesTitle" />

      <HeaderComponent headerHeight={headerHeight} className="header-user-index" />

      <motion.div
        className="study-policies-page"
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
                  <h2 className={styles['page-title']}>{t('studyPolicies')}</h2>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <GeneralStudyNorms />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <AttendancePunctuality />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <CourseRequirements />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <UseOfMaterials />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <EvaluationFeedback />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <AcademicConductCode />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <SubmissionDeadlines />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <UseOfTechnology />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <ForumParticipationRules />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <ConsequencesOfNonCompliance />
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

export default StudyPolicies;
