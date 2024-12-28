// Pages/ScheduleTutoring.jsx

import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import HeaderComponent from '../../../components/Header/Header';
import PersonalCenter from '../../../components/UserIndex/PersonalCenter';
import Footer from '../../../components/Footer/Footer';
import PageTitle from '../../../components/PageTitle/PageTitle';
import SelectCourse from '../../../components/UserIndex/PersonalizedTutoring/ScheduleTutoring/SelectCourse';
import ChooseTutor from '../../../components/UserIndex/PersonalizedTutoring/ScheduleTutoring/ChooseTutor';
import DateAndTimeSelector from '../../../components/UserIndex/PersonalizedTutoring/ScheduleTutoring/DateAndTimeSelector';
import TutoringMode from '../../../components/UserIndex/PersonalizedTutoring/ScheduleTutoring/TutoringMode';
import TutoringDuration from '../../../components/UserIndex/PersonalizedTutoring/ScheduleTutoring/TutoringDuration';
import GoalsTutoring from '../../../components/UserIndex/PersonalizedTutoring/ScheduleTutoring/GoalsTutoring';
import ConfirmTutoring from '../../../components/UserIndex/PersonalizedTutoring/ScheduleTutoring/ConfirmTutoring';
import CancellationPolicies from '../../../components/UserIndex/PersonalizedTutoring/ScheduleTutoring/CancellationPolicies';
import ReminderNotifications from '../../../components/UserIndex/PersonalizedTutoring/ScheduleTutoring/ReminderNotifications';
import styles from './ScheduleTutoring.module.css';

const ScheduleTutoring = () => {
  const { lang } = useParams();
  const { t } = useTranslation('UserIndex/PersonalizedTutoring/ScheduleTutoring');
  const headerHeight = '125px';

  const [step, setStep] = useState(1);
  const [tutoringData, setTutoringData] = useState({
    course: '',
    tutor: '',
    date: '',
    time: '',
    mode: '',
    duration: '',
    goals: '',
    notifications: [],
  });

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleDataChange = (field, value) => {
    setTutoringData({ ...tutoringData, [field]: value });
  };

  const handleConfirmTutoring = () => {
    // Logic to confirm the tutoring session (e.g., send data to the server)
    alert(t('tutoringScheduled'));
  };

  return (
    <>
      <PageTitle titleKey="scheduleTutoringTitle" />

      <HeaderComponent headerHeight={headerHeight} className="header-user-index" />

      <motion.div
        className="schedule-tutoring-page"
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
                  <h2 className={styles['page-title']}>{t('scheduleTutoring')}</h2>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <Form>
                    {step === 1 && (
                      <SelectCourse
                        course={tutoringData.course}
                        onChange={(value) => handleDataChange('course', value)}
                        onNext={handleNextStep}
                      />
                    )}
                    {step === 2 && (
                      <ChooseTutor
                        course={tutoringData.course}
                        tutor={tutoringData.tutor}
                        onChange={(value) => handleDataChange('tutor', value)}
                        onNext={handleNextStep}
                        onBack={handlePrevStep}
                      />
                    )}
                    {step === 3 && (
                      <DateAndTimeSelector
                        date={tutoringData.date}
                        time={tutoringData.time}
                        onDateChange={(value) => handleDataChange('date', value)}
                        onTimeChange={(value) => handleDataChange('time', value)}
                        onNext={handleNextStep}
                        onBack={handlePrevStep}
                      />
                    )}
                    {step === 4 && (
                      <TutoringMode
                        mode={tutoringData.mode}
                        onChange={(value) => handleDataChange('mode', value)}
                        onNext={handleNextStep}
                        onBack={handlePrevStep}
                      />
                    )}
                    {step === 5 && (
                      <TutoringDuration
                        duration={tutoringData.duration}
                        onChange={(value) => handleDataChange('duration', value)}
                        onNext={handleNextStep}
                        onBack={handlePrevStep}
                      />
                    )}
                    {step === 6 && (
                      <GoalsTutoring
                        goals={tutoringData.goals}
                        onChange={(value) => handleDataChange('goals', value)}
                        onNext={handleNextStep}
                        onBack={handlePrevStep}
                      />
                    )}
                    {step === 7 && (
                      <ReminderNotifications
                        notifications={tutoringData.notifications}
                        onChange={(value) => handleDataChange('notifications', value)}
                        onNext={handleNextStep}
                        onBack={handlePrevStep}
                      />
                    )}
                    {step === 8 && (
                      <ConfirmTutoring
                        tutoringData={tutoringData}
                        onConfirm={handleConfirmTutoring}
                        onBack={handlePrevStep}
                      />
                    )}
                    <CancellationPolicies />
                  </Form>
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

export default ScheduleTutoring;
