// Pages/PendingTutoringSessions.jsx

import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import HeaderComponent from '../../../components/Header/Header';
import CentroPersonal from '../../../components/UserIndex/PersonalCenter';
import Footer from '../../../components/Footer/Footer';
import PageTitle from '../../../components/PageTitle/PageTitle';
import SessionsList from '../../../components/UserIndex/PersonalizedTutoring/PendingTutoringSessions/SessionsList';
import SessionDetails from '../../../components/UserIndex/PersonalizedTutoring/PendingTutoringSessions/SessionDetails';
import styles from './PendingTutoringSessions.module.css';

const PendingTutoringSessions = () => {
  const { lang } = useParams();
  const { t } = useTranslation('UserIndex/PersonalizedTutoring/PendingTutoringSessions');
  const headerHeight = '125px';
  const [selectedSession, setSelectedSession] = useState(null);

  // Sample data for pending tutoring sessions
  const pendingSessions = [
    {
      id: 1,
      course: 'Mathematics',
      tutor: 'Alice Johnson',
      date: '2023-11-10',
      time: '14:00',
      status: 'Confirmed',
      mode: 'Virtual',
      duration: '1 hour',
      objectives: 'Understand integrals and derivatives',
      materials: [{ id: 1, title: 'Calculus Notes', url: '/materials/calculus-notes.pdf' }],
      sessionLink: '/join-session/1',
      contactTutorLink: '/contact-tutor/1',
    },
    // Add more sessions as needed
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
      <PageTitle titleKey="pendingTutoringSessionsTitle" />

      <HeaderComponent headerHeight={headerHeight} className="header-user-index" />

      <motion.div
        className="pending-tutoring-sessions-page"
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
                  <h2 className={styles['page-title']}>{t('pendingTutoringSessions')}</h2>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <SessionsList
                    sessions={pendingSessions}
                    selectedSession={selectedSession}
                    onSelectSession={handleSelectSession}
                  />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  {selectedSession && <SessionDetails session={selectedSession} />}
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

export default PendingTutoringSessions;
