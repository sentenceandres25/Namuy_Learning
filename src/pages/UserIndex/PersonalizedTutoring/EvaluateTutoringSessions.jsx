// Pages/EvaluateTutoringSessions.jsx

import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import HeaderComponent from '../../../components/Header/Header';
import CentroPersonal from '../../../components/UserIndex/PersonalCenter';
import Footer from '../../../components/Footer/Footer';
import PageTitle from '../../../components/PageTitle/PageTitle';
import SessionsToEvaluateList from '../../../components/UserIndex/PersonalizedTutoring/EvaluateTutoringSessions/SessionsToEvaluateList';
import EvaluationForm from '../../../components/UserIndex/PersonalizedTutoring/EvaluateTutoringSessions/EvaluationForm';
import EvaluationHistory from '../../../components/UserIndex/PersonalizedTutoring/EvaluateTutoringSessions/EvaluationHistory';
import styles from './EvaluateTutoringSessions.module.css';

const EvaluateTutoringSessions = () => {
  const { lang } = useParams();
  const { t } = useTranslation('UserIndex/PersonalizedTutoring/EvaluateTutoringSessions');
  const headerHeight = '125px';
  const [selectedSession, setSelectedSession] = useState(null);

  // Sample data for tutoring sessions to evaluate
  const sessionsToEvaluate = [
    {
      id: 1,
      course: 'Physics',
      topic: 'Quantum Mechanics',
      date: '2023-11-05',
      tutor: 'Dr. John Doe',
    },
    // Add more sessions as needed
  ];

  // Sample data for evaluation history
  const evaluationHistory = [
    {
      id: 1,
      course: 'Mathematics',
      topic: 'Calculus',
      date: '2023-10-20',
      tutor: 'Jane Smith',
      rating: 5,
      comments: 'Great session!',
    },
    // Add more evaluations as needed
  ];

  // Function to select or deselect a session
  const handleSelectSession = (session) => {
    if (selectedSession && selectedSession.id === session.id) {
      setSelectedSession(null);
    } else {
      setSelectedSession(session);
    }
  };

  return (
    <>
      <PageTitle titleKey="evaluateTutoringSessionsTitle" />

      <HeaderComponent headerHeight={headerHeight} className="header-user-index" />

      <motion.div
        className="evaluate-tutoring-sessions-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Container fluid className="user-index" style={{ marginTop: headerHeight }}>
          <Row>
            {/* Left Sidebar Menu */}
            <Col md={3}>
              <CentroPersonal />
            </Col>

            {/* Main Content */}
            <Col md={9}>
              <Row>
                <Col md={12}>
                  <h2 className={styles['page-title']}>{t('evaluateTutoringSessions')}</h2>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <SessionsToEvaluateList
                    sessions={sessionsToEvaluate}
                    selectedSession={selectedSession}
                    onSelectSession={handleSelectSession}
                  />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  {selectedSession && (
                    <EvaluationForm session={selectedSession} onSubmit={() => setSelectedSession(null)} />
                  )}
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <EvaluationHistory evaluations={evaluationHistory} />
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

export default EvaluateTutoringSessions;
