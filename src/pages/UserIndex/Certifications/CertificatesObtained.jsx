// Pages/CertificatesObtained.jsx

import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import HeaderComponent from '../../../components/Header/Header';
import CentroPersonal from '../../../components/UserIndex/PersonalCenter';
import Footer from '../../../components/Footer/Footer';
import PageTitle from '../../../components/PageTitle/PageTitle';
import CertificateList from '../../../components/UserIndex/Certifications/Certificates/List';
import CertificateDetails from '../../../components/UserIndex/Certifications/Certificates/CertificateDetails';
import CertificateHistory from '../../../components/UserIndex/Certifications/Certificates/CertificateHistory';
import styles from './CertificatesObtained.module.css';

const CertificatesObtained = () => {
  const { lang } = useParams();
  const { t } = useTranslation('UserIndex/Certifications/Certificates');
  const headerHeight = '125px';
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  // Datos simulados de certificaciones obtenidas
  const certificates = [
    {
      id: 1,
      courseName: 'Desarrollo Web Avanzado',
      institution: 'Academia Online',
      obtainedDate: '2023-08-15',
      validUntil: '2025-08-15',
      isValid: true,
      topicsCovered: ['HTML5', 'CSS3', 'JavaScript ES6', 'React', 'Node.js'],
      achievements: ['Mejor Proyecto', 'Participación Destacada'],
      badgeUrl: '/badges/web-development.png',
    },
    {
      id: 2,
      courseName: 'Machine Learning Básico',
      institution: 'Universidad Virtual',
      obtainedDate: '2022-05-20',
      validUntil: '2024-05-20',
      isValid: true,
      topicsCovered: ['Regresión Lineal', 'Árboles de Decisión', 'Redes Neuronales'],
      achievements: ['Proyecto con Puntuación Más Alta'],
      badgeUrl: '/badges/machine-learning.png',
    },
  ];

  // Función para seleccionar o deseleccionar una certificación
  const handleSelectCertificate = (certificate) => {
    if (selectedCertificate && selectedCertificate.id === certificate.id) {
      // Si se hace clic en la misma certificación, deseleccionarla para ocultar los detalles
      setSelectedCertificate(null);
    } else {
      setSelectedCertificate(certificate);
    }
  };

  return (
    <>
      <PageTitle titleKey="certificatesObtainedTitle" />

      <HeaderComponent headerHeight={headerHeight} className="header-user-index" />

      <motion.div
        className="certificates-obtained-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Container fluid className="user-index" style={{ marginTop: headerHeight }}>
          <Row>
            {/* Menú lateral izquierdo */}
            <Col md={3}>
              <CentroPersonal />
            </Col>

            {/* Contenido principal */}
            <Col md={9}>
              <Row>
                <Col md={12}>
                  <h2 className={styles['page-title']}>{t('certificatesObtained')}</h2>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <CertificateList
                    certificates={certificates}
                    selectedCertificate={selectedCertificate}
                    onSelectCertificate={handleSelectCertificate}
                  />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  {selectedCertificate && (
                    <CertificateDetails certificate={selectedCertificate} />
                  )}
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <CertificateHistory certificates={certificates} />
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

export default CertificatesObtained;
