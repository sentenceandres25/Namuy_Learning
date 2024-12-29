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
import axios from '../../../axiosConfig'; 
import { AuthContext } from '../../../contexts/AuthContext';
import './GeneralInfo.css';

const GeneralInfo = () => {
  const { t } = useTranslation('UserIndex/StudentProfile/GeneralInfo');
  const headerHeight = '125px';
  const { user, token } = useContext(AuthContext);

  const [personalDetails, setPersonalDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && user.user_id) {
      // Hacer la petición con el token (buena práctica de seguridad)
      axios
        .get(`/user/${user.user_id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then((response) => {
          console.log("Datos obtenidos del backend:", response.data);
          // Se espera que 'response.data' contenga { date_joined, account_status, ... } 
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
  }, [user, token, t]);

  if (isLoading) {
    return <p>{t('loading')}</p>;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  // Si personalDetails no existe, mostramos aviso
  if (!personalDetails) {
    return <Alert variant="info">{t('noDetails')}</Alert>;
  }

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
              <Row>
                <Col md={12}>
                  <h2>{t('titulo')}</h2>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <ProfilePicture profilePic={personalDetails?.profile_pic} />
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  {/* Pasamos la información a PersonalDetails */}
                  <PersonalDetails data={personalDetails} />
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  {/* Pasamos la MISMA info a AccountDetails */}
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
            </Col>
          </Row>
        </Container>
      </motion.div>

      <Footer />
    </>
  );
};

export default GeneralInfo;
