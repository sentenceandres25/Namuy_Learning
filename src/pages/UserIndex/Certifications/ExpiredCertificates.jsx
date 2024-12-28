// Pages/ExpiredCertificates.jsx

import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import HeaderComponent from '../../../components/Header/Header';
import CentroPersonal from '../../../components/UserIndex/PersonalCenter';
import Footer from '../../../components/Footer/Footer';
import PageTitle from '../../../components/PageTitle/PageTitle';
import ExpiredList from '../../../components/UserIndex/Certifications/ExpiredCertificates/ExpiredList';
import CertificateDetails from '../../../components/UserIndex/Certifications/ExpiredCertificates/CertificateDetails';
import styles from './ExpiredCertificates.module.css';

const ExpiredCertificates = () => {
  const { lang } = useParams();
  const { t } = useTranslation('UserIndex/Certifications/ExpiredCertificates');
  const headerHeight = '125px';
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  // Datos simulados de certificados caducados
  const expiredCertificates = [
    {
      id: 1,
      courseName: 'Data Science Avanzado',
      institution: 'Tech University',
      obtainedDate: '2020-05-20',
      expiredDate: '2022-05-20',
      reason: 'Requiere actualización de conocimientos',
      downloadUrl: '/certificates/expired/data-science.pdf',
      renewalOptions: '/renew/data-science',
      suggestedCourses: [
        { id: 1, title: 'Data Science 2023', url: '/courses/data-science-2023' },
        // Más cursos
      ],
      history: 'Completado con honores, 100 horas de estudio.',
    },
    // Agrega más certificados caducados según necesites
  ];

  // Función para seleccionar o deseleccionar un certificado
  const handleSelectCertificate = (certificate) => {
    if (selectedCertificate && selectedCertificate.id === certificate.id) {
      setSelectedCertificate(null);
    } else {
      setSelectedCertificate(certificate);
    }
  };

  return (
    <>
      <PageTitle titleKey="expiredCertificatesTitle" />

      <HeaderComponent headerHeight={headerHeight} className="header-user-index" />

      <motion.div
        className="expired-certificates-page"
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
                  <h2 className={styles['page-title']}>{t('expiredCertificates')}</h2>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <ExpiredList
                    certificates={expiredCertificates}
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
            </Col>
          </Row>
        </Container>
      </motion.div>

      <Footer />
    </>
  );
};

export default ExpiredCertificates;
