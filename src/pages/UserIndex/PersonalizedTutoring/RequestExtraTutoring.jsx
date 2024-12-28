// Pages/RequestExtraTutoring.jsx

import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import HeaderComponent from '../../../components/Header/Header';
import PersonalCenter from '../../../components/UserIndex/PersonalCenter';
import Footer from '../../../components/Footer/Footer';
import PageTitle from '../../../components/PageTitle/PageTitle';
import SelectCourse from '../../../components/UserIndex/PersonalizedTutoring/RequestExtraTutoring/SelectCourse';
import Justification from '../../../components/UserIndex/PersonalizedTutoring/RequestExtraTutoring/Justification';
import ChooseTutor from '../../../components/UserIndex/PersonalizedTutoring/RequestExtraTutoring/ChooseTutor';
import PreferredDateTime from '../../../components/UserIndex/PersonalizedTutoring/RequestExtraTutoring/PreferredDateTime';
import DurationSelection from '../../../components/UserIndex/PersonalizedTutoring/RequestExtraTutoring/DurationSelection';
import TutoringMode from '../../../components/UserIndex/PersonalizedTutoring/RequestExtraTutoring/TutoringMode';
import RequestConfirmation from '../../../components/UserIndex/PersonalizedTutoring/RequestExtraTutoring/RequestConfirmation';
import ExtraTutoringPolicies from '../../../components/UserIndex/PersonalizedTutoring/RequestExtraTutoring/ExtraTutoringPolicies';
import RequestNotifications from '../../../components/UserIndex/PersonalizedTutoring/RequestExtraTutoring/RequestNotifications';
import AdditionalSupport from '../../../components/UserIndex/PersonalizedTutoring/RequestExtraTutoring/AdditionalSupport';
import styles from './RequestExtraTutoring.module.css';

const RequestExtraTutoring = () => {
  const { lang } = useParams();
  const { t } = useTranslation('UserIndex/PersonalizedTutoring/RequestExtraTutoring');
  const headerHeight = '125px';

  const [step, setStep] = useState(1);
  const [requestData, setRequestData] = useState({
    course: '',
    justification: '',
    tutor: '',
    date: '',
    time: '',
    duration: '',
    mode: '',
    notifications: [],
  });

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleDataChange = (field, value) => {
    setRequestData({ ...requestData, [field]: value });
  };

  const handleConfirmRequest = () => {
    // Logic to submit the request (e.g., send data to server)
    alert(t('requestSubmitted'));
  };

  return (
    <>
      <PageTitle titleKey="requestExtraTutoringTitle" />

      <HeaderComponent headerHeight={headerHeight} className="header-user-index" />

      <motion.div
        className="request-extra-tutoring-page"
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
                  <h2 className={styles['page-title']}>{t('requestExtraTutoring')}</h2>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <Form>
                    {step === 1 && (
                      <SelectCourse
                        course={requestData.course}
                        onChange={(value) => handleDataChange('course', value)}
                        onNext={handleNextStep}
                      />
                    )}
                    {step === 2 && (
                      <Justification
                        justification={requestData.justification}
                        onChange={(value) => handleDataChange('justification', value)}
                        onNext={handleNextStep}
                        onBack={handlePrevStep}
                      />
                    )}
                    {step === 3 && (
                      <ChooseTutor
                        course={requestData.course}
                        tutor={requestData.tutor}
                        onChange={(value) => handleDataChange('tutor', value)}
                        onNext={handleNextStep}
                        onBack={handlePrevStep}
                      />
                    )}
                    {step === 4 && (
                      <PreferredDateTime
                        date={requestData.date}
                        time={requestData.time}
                        onDateChange={(value) => handleDataChange('date', value)}
                        onTimeChange={(value) => handleDataChange('time', value)}
                        onNext={handleNextStep}
                        onBack={handlePrevStep}
                      />
                    )}
                    {step === 5 && (
                      <DurationSelection
                        duration={requestData.duration}
                        onChange={(value) => handleDataChange('duration', value)}
                        onNext={handleNextStep}
                        onBack={handlePrevStep}
                      />
                    )}
                    {step === 6 && (
                      <TutoringMode
                        mode={requestData.mode}
                        onChange={(value) => handleDataChange('mode', value)}
                        onNext={handleNextStep}
                        onBack={handlePrevStep}
                      />
                    )}
                    {step === 7 && (
                      <RequestNotifications
                        notifications={requestData.notifications}
                        onChange={(value) => handleDataChange('notifications', value)}
                        onNext={handleNextStep}
                        onBack={handlePrevStep}
                      />
                    )}
                    {step === 8 && (
                      <RequestConfirmation
                        requestData={requestData}
                        onConfirm={handleConfirmRequest}
                        onBack={handlePrevStep}
                      />
                    )}
                    <ExtraTutoringPolicies />
                    <AdditionalSupport />
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

export default RequestExtraTutoring;
