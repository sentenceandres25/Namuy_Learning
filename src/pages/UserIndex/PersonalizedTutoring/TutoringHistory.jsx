// Pages/TutoringHistory.jsx

import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import HeaderComponent from '../../../components/Header/Header';
import PersonalCenter from '../../../components/UserIndex/PersonalCenter';
import Footer from '../../../components/Footer/Footer';
import PageTitle from '../../../components/PageTitle/PageTitle';
import TutoringList from '../../../components/UserIndex/PersonalizedTutoring/TutoringHistory/TutoringsList';
import TutoringDetails from '../../../components/UserIndex/PersonalizedTutoring/TutoringHistory/TutoringDetails';
import styles from './TutoringHistory.module.css';

const TutoringHistory = () => {
  const { lang } = useParams();
  const { t } = useTranslation('UserIndex/PersonalizedTutoring/TutoringHistory');
  const headerHeight = '125px';
  const [selectedTutoring, setSelectedTutoring] = useState(null);

  // Simulated data of completed tutoring sessions
  const completedTutorings = [
    {
      id: 1,
      course: 'Introduction to Programming',
      date: '2023-11-05',
      time: '15:00',
      tutor: 'John Perez',
      duration: '1 hour',
      topicsCovered: ['Variables', 'Control Structures'],
      materials: [{ id: 1, title: 'Session Slides', url: '/materials/slides.pdf' }],
      rating: 5,
      comments: 'Excellent explanation and patience.',
      courseProgress: 'Advanced to 25%',
      notes: 'Review additional exercises on loops.',
      recommendations: ['Practice more loop exercises.'],
    },
    // Add more tutoring sessions as needed
  ];

  // Function to select or deselect a tutoring session
  const handleSelectTutoring = (tutoring) => {
    if (selectedTutoring && selectedTutoring.id === tutoring.id) {
      setSelectedTutoring(null);
    } else {
      setSelectedTutoring(tutoring);
    }
  };

  return (
    <>
      <PageTitle titleKey="tutoringHistoryTitle" />

      <HeaderComponent headerHeight={headerHeight} className="header-user-index" />

      <motion.div
        className="tutoring-history-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Container fluid className="user-index" style={{ marginTop: headerHeight }}>
          <Row>
            {/* Left-side menu */}
            <Col md={3}>
              <PersonalCenter />
            </Col>

            {/* Main content */}
            <Col md={9}>
              <Row>
                <Col md={12}>
                  <h2 className={styles['page-title']}>{t('tutoringHistory')}</h2>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <TutoringList
                    tutorings={completedTutorings}
                    selectedTutoring={selectedTutoring}
                    onSelectTutoring={handleSelectTutoring}
                  />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  {selectedTutoring && (
                    <TutoringDetails tutoring={selectedTutoring} />
                  )}
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

export default TutoringHistory;
