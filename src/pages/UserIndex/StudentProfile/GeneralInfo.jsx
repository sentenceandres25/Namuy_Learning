// src/pages/UserIndex/StudentProfile/GeneralInfo/GeneralInfo.jsx

import React, {
  useEffect,
  useState,
  useContext,
  lazy,
  Suspense,
  useRef
} from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';

import HeaderComponent from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import PersonalCenter from '../../../components/UserIndex/PersonalCenter';
import PageTitle from '../../../components/PageTitle/PageTitle';
import { AuthContext } from '../../../contexts/AuthContext';

import './GeneralInfo.css';
import { useTranslation } from 'react-i18next';

// Lazy imports
const ProfilePicture = lazy(() =>
  import('../../../components/UserIndex/StudentProfile/GeneralInfo/ProfilePicture')
);
const PersonalDetails = lazy(() =>
  import('../../../components/UserIndex/StudentProfile/GeneralInfo/PersonalDetails')
);
const AccountDetails = lazy(() =>
  import('../../../components/UserIndex/StudentProfile/GeneralInfo/AccountDetails')
);
const Interests = lazy(() =>
  import('../../../components/UserIndex/StudentProfile/GeneralInfo/Interests')
);
const SessionHistory = lazy(() =>
  import('../../../components/UserIndex/StudentProfile/GeneralInfo/SessionHistory')
);

const GeneralInfo = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/GeneralInfo');
  const headerHeight = '125px';
  const { user } = useContext(AuthContext);

  // Control visibility of each section
  const [showProfilePic, setShowProfilePic] = useState(false);
  const [showPersonalDetails, setShowPersonalDetails] = useState(false);
  const [showAccountDetails, setShowAccountDetails] = useState(false);
  const [showInterests, setShowInterests] = useState(false);
  const [showSessionHistory, setShowSessionHistory] = useState(false);

  // Refs for each section
  const profilePicRef = useRef(null);
  const personalDetailsRef = useRef(null);
  const accountDetailsRef = useRef(null);
  const interestsRef = useRef(null);
  const sessionHistoryRef = useRef(null);

  // IntersectionObserver for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const targetId = entry.target.id;
            if (targetId === 'profilePicRow') setShowProfilePic(true);
            if (targetId === 'personalDetailsRow') setShowPersonalDetails(true);
            if (targetId === 'accountDetailsRow') setShowAccountDetails(true);
            if (targetId === 'interestsRow') setShowInterests(true);
            if (targetId === 'sessionHistoryRow') setShowSessionHistory(true);

            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 1,
        rootMargin: '-50px 0px', // Adjust as needed
      }
    );

    // Function to observe or display immediately if in viewport
    const checkOrObserve = (ref, setState) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        setState(true);
      } else {
        observer.observe(ref.current);
      }
    };

    // Observe each section
    checkOrObserve(profilePicRef, setShowProfilePic);
    checkOrObserve(personalDetailsRef, setShowPersonalDetails);
    checkOrObserve(accountDetailsRef, setShowAccountDetails);
    checkOrObserve(interestsRef, setShowInterests);
    checkOrObserve(sessionHistoryRef, setShowSessionHistory);

    // Cleanup observer on unmount
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <PageTitle titleKey="generalInfoTitle" />

      <HeaderComponent headerHeight={headerHeight} className="header-user-index" />

      <motion.div
        className="general-info"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Container fluid className="user-index" style={{ marginTop: headerHeight }}>
          <Row>
            <Col md={3}>
              <PersonalCenter />
            </Col>

            <Col md={9}>
              <Row>
                <Col md={12}>
                  <h2>{t('titulo')}</h2>
                </Col>
              </Row>

              {/* ProfilePicture */}
              <Row id="profilePicRow" ref={profilePicRef}>
                <Col md={12}>
                  {showProfilePic && (
                    <Suspense fallback={<p>Loading Picture...</p>}>
                      <ProfilePicture />
                    </Suspense>
                  )}
                </Col>
              </Row>

              {/* PersonalDetails */}
              <Row id="personalDetailsRow" ref={personalDetailsRef}>
                <Col md={12}>
                  {showPersonalDetails && (
                    <Suspense fallback={<p>Loading Personal Details...</p>}>
                      <PersonalDetails />
                    </Suspense>
                  )}
                </Col>
              </Row>

              {/* AccountDetails */}
              <Row id="accountDetailsRow" ref={accountDetailsRef}>
                <Col md={12}>
                  {showAccountDetails && (
                    <Suspense fallback={<p>Loading Account Details...</p>}>
                      <AccountDetails />
                    </Suspense>
                  )}
                </Col>
              </Row>

              {/* Interests */}
              <Row id="interestsRow" ref={interestsRef}>
                <Col md={12}>
                  {showInterests && (
                    <Suspense fallback={<p>Loading Interests...</p>}>
                      <Interests interests={[]} /> {/* Interests prop can be adjusted as needed */}
                    </Suspense>
                  )}
                </Col>
              </Row>

              {/* SessionHistory */}
              <Row id="sessionHistoryRow" ref={sessionHistoryRef}>
                <Col md={12}>
                  {showSessionHistory && (
                    <Suspense fallback={<p>Loading Session History...</p>}>
                      <SessionHistory />
                    </Suspense>
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

export default GeneralInfo;
