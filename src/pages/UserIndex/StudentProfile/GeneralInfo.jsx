// src/pages/UserIndex/StudentProfile/GeneralInfo/GeneralInfo.jsx

import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import ProfilePicture from '../../../components/UserIndex/StudentProfile/GeneralInfo/ProfilePicture';
import PersonalDetails from '../../../components/UserIndex/StudentProfile/GeneralInfo/PersonalDetails';
import AccountDetails from '../../../components/UserIndex/StudentProfile/GeneralInfo/AccountDetails';
import Interests from '../../../components/UserIndex/StudentProfile/GeneralInfo/Interests';
import SessionHistory from '../../../components/UserIndex/StudentProfile/GeneralInfo/SessionHistory';
import { motion } from 'framer-motion';
import HeaderComponent from '../../../components/Header/Header';
import PersonalCenter from '../../../components/UserIndex/PersonalCenter';
import Footer from '../../../components/Footer/Footer';
import { useTranslation } from 'react-i18next';
import PageTitle from '../../../components/PageTitle/PageTitle';
import axios from '../../../axiosConfig'; // Asegúrate de tener la ruta correcta
import { AuthContext } from '../../../contexts/AuthContext';
import './GeneralInfo.css';

const GeneralInfo = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/GeneralInfo');
  const headerHeight = '125px';
  const { user } = useContext(AuthContext);

  const [personalDetails, setPersonalDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Obtener la información personal al montar el componente
  useEffect(() => {
    if (user && user.user_id) {
      // Llamamos a /api/personal_details/<user_id> en vez de /api/user/<user_id>
      axios
        .get(`/personal_details/${user.user_id}`)
        .then((response) => {
          console.log("Datos obtenidos del backend (personal_details):", response.data);
          setPersonalDetails(response.data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Error al obtener datos:", err.response?.data || err.message);
          if (err.response && err.response.status === 404) {
            setPersonalDetails(null);
          } else {
            setError(t('anErrorOccurred'));
          }
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
      setError(t('userNotAuthenticated'));
    }
  }, [user, t]);

  return (
    <>
      <PageTitle titleKey="generalInfoTitle" />

      <HeaderComponent headerHeight={headerHeight} className="header-user-index" />

      <motion.div
        className="general-info"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Container fluid className="user-index" style={{ marginTop: headerHeight }}>
          <Row>
            <Col md={3}>
              <PersonalCenter />
            </Col>

            <Col md={9}>
              {isLoading ? (
                <p>{t('loading')}</p>
              ) : error ? (
                <Alert variant="danger">{error}</Alert>
              ) : (
                <>
                  {updateSuccess && <Alert variant="success">{t('updateSuccess')}</Alert>}
                  <Row>
                    <Col md={12}>
                      <h2>{t('titulo')}</h2>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12}>
                    <ProfilePicture data={personalDetails} />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12}>
                      <PersonalDetails data={personalDetails} />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12}>
                      <AccountDetails data={personalDetails} />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12}>
                      <Interests interests={personalDetails?.interests || []} />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12}>
                      <SessionHistory data={personalDetails?.session_history} />
                    </Col>
                  </Row>
                </>
              )}
            </Col>
          </Row>
        </Container>
      </motion.div>

      <Footer />
    </>
  );
};

export default GeneralInfo;
