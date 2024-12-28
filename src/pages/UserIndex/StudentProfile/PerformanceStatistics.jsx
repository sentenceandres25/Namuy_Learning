// PerformanceStatistics.jsx

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import HeaderComponent from '../../../components/Header/Header';
import PersonalCenter from '../../../components/UserIndex/PersonalCenter';
import Footer from '../../../components/Footer/Footer';
import PageTitle from '../../../components/PageTitle/PageTitle';
import CompletionRate from '../../../components/UserIndex/StudentProfile/PerformanceStatistics/CompletionRate';
import StudyHours from '../../../components/UserIndex/StudentProfile/PerformanceStatistics/StudyHours';
import AverageRatings from '../../../components/UserIndex/StudentProfile/PerformanceStatistics/AverageRatings';
import WeeklyProgress from '../../../components/UserIndex/StudentProfile/PerformanceStatistics/WeeklyProgress';
import HighScores from '../../../components/UserIndex/StudentProfile/PerformanceStatistics/HighScores';
import TasksProjects from '../../../components/UserIndex/StudentProfile/PerformanceStatistics/TasksProjects';
import PerformanceComparison from '../../../components/UserIndex/StudentProfile/PerformanceStatistics/PerformanceComparison';
import ActiveDays from '../../../components/UserIndex/StudentProfile/PerformanceStatistics/ActiveDays';
import AchievedGoals from '../../../components/UserIndex/StudentProfile/PerformanceStatistics/AchievedGoals';
import CommitmentLevel from '../../../components/UserIndex/StudentProfile/PerformanceStatistics/CommitmentLevel';
import ForumParticipation from '../../../components/UserIndex/StudentProfile/PerformanceStatistics/ForumParticipation';
import AverageTime from '../../../components/UserIndex/StudentProfile/PerformanceStatistics/AverageTime';
import TopPerformanceCourses from '../../../components/UserIndex/StudentProfile/PerformanceStatistics/TopPerformanceCourses';
import SpecialAchievements from '../../../components/UserIndex/StudentProfile/PerformanceStatistics/SpecialAchievements';
import styles from './PerformanceStatistics.module.css';

const PerformanceStatistics = () => {
  const { lang } = useParams(); // Get the lang parameter from the URL
  const { t } = useTranslation('UserIndex/StudentProfile/PerformanceStatistics'); // Use the translation namespace
  const headerHeight = '125px'; // Adjust this based on the header size

  return (
    <>
      {/* Page title */}
      <PageTitle titleKey="performanceStatisticsTitle" /> {/* Use translation key for the title */}

      {/* Header */}
      <HeaderComponent headerHeight={headerHeight} className="header-user-index" />

      {/* Main content with top margin to prevent overlap with the header */}
      <motion.div
        className={styles.statisticsPage} // Use the corresponding CSS file
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Container fluid className="user-index" style={{ marginTop: headerHeight }}>
          <Row>
            {/* Left side menu */}
            <Col md={3}>
              <PersonalCenter />
            </Col>

            {/* Main content */}
            <Col md={9}>
              <Row>
                <Col md={12}>
                  <h2 className={styles.performanceStatisticsTitle}>{t('performance_statistics')}</h2>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <CompletionRate />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <StudyHours />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <AverageRatings />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <WeeklyProgress />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <HighScores />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <TasksProjects />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <PerformanceComparison />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <ActiveDays />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <AchievedGoals />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <CommitmentLevel />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <ForumParticipation />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <AverageTime />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <TopPerformanceCourses />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <SpecialAchievements />
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </motion.div>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default PerformanceStatistics;
