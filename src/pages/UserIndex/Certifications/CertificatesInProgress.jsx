// Pages/CertificatesInProgress.jsx

import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import HeaderComponent from '../../../components/Header/Header';
import CentroPersonal from '../../../components/UserIndex/PersonalCenter';
import Footer from '../../../components/Footer/Footer';
import PageTitle from '../../../components/PageTitle/PageTitle';
import ProgressList from '../../../components/UserIndex/Certifications/CertificatesInProgress/ProgressList';
import ProgressDetails from '../../../components/UserIndex/Certifications/CertificatesInProgress/ProgressDetails';
import styles from './CertificatesInProgress.module.css';

const CertificatesInProgress = () => {
  const { lang } = useParams();
  const { t } = useTranslation('UserIndex/Certifications/CertificatesInProgress');
  const headerHeight = '125px';
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  // Datos simulados de certificaciones en progreso
  const certificatesInProgress = [
    {
      id: 1,
      courseName: 'Machine Learning Avanzado',
      institution: 'Tech Academy',
      startDate: '2023-09-01',
      estimatedEndDate: '2023-12-15',
      progress: 65,
      pendingRequirements: ['Proyecto Final', 'Examen de Evaluación'],
      studyMaterials: [
        { id: 1, title: 'Notas de Clase', url: '/materials/class-notes.pdf' },
        { id: 2, title: 'Lectura Complementaria: Algoritmos', url: '/materials/algorithms.pdf' }
      ],
      performanceStats: {
        averageScore: 88,
        timeInvested: '40 horas'
      },
      supportContact: '/support'
    },
    {
      id: 2,
      courseName: 'Full Stack Web Development',
      institution: 'Code University',
      startDate: '2023-08-15',
      estimatedEndDate: '2023-11-20',
      progress: 75,
      pendingRequirements: ['Módulo de Seguridad', 'Proyecto Final de Integración'],
      studyMaterials: [
        { id: 3, title: 'Guía de APIs REST', url: '/materials/apis-guide.pdf' },
        { id: 4, title: 'CSS Avanzado', url: '/materials/css-advanced.pdf' }
      ],
      performanceStats: {
        averageScore: 92,
        timeInvested: '60 horas'
      },
      supportContact: '/support'
    },
    {
      id: 3,
      courseName: 'Data Science y Análisis de Datos',
      institution: 'Data Academy',
      startDate: '2023-07-10',
      estimatedEndDate: '2023-11-30',
      progress: 50,
      pendingRequirements: ['Evaluación de Estadística', 'Tareas de Python para Análisis'],
      studyMaterials: [
        { id: 5, title: 'Curso de Estadística Básica', url: '/materials/statistics-course.pdf' },
        { id: 6, title: 'Python para Ciencia de Datos', url: '/materials/python-data-science.pdf' }
      ],
      performanceStats: {
        averageScore: 85,
        timeInvested: '35 horas'
      },
      supportContact: '/support'
    },
    {
      id: 4,
      courseName: 'Certificación en Ciberseguridad',
      institution: 'Cyber Institute',
      startDate: '2023-06-01',
      estimatedEndDate: '2023-10-25',
      progress: 80,
      pendingRequirements: ['Evaluación Práctica', 'Laboratorio de Redes'],
      studyMaterials: [
        { id: 7, title: 'Manual de Seguridad en Redes', url: '/materials/network-security.pdf' },
        { id: 8, title: 'Técnicas de Análisis de Vulnerabilidades', url: '/materials/vulnerability-analysis.pdf' }
      ],
      performanceStats: {
        averageScore: 90,
        timeInvested: '45 horas'
      },
      supportContact: '/support'
    }
  ];

  const handleSelectCertificate = (certificate) => {
    if (selectedCertificate && selectedCertificate.id === certificate.id) {
      setSelectedCertificate(null);
    } else {
      setSelectedCertificate(certificate);
    }
  };

  return (
    <>
      <PageTitle titleKey="certificatesInProgressTitle" />

      <HeaderComponent headerHeight={headerHeight} className="header-user-index" />

      <motion.div
        className="certificates-in-progress-page"
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
                  <h2 className={styles['page-title']}>{t('certificatesInProgress')}</h2>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <ProgressList
                    certificates={certificatesInProgress}
                    selectedCertificate={selectedCertificate}
                    onSelectCertificate={handleSelectCertificate}
                  />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  {selectedCertificate && (
                    <ProgressDetails certificate={selectedCertificate} />
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

export default CertificatesInProgress;
