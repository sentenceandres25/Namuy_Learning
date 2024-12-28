// Pages/PendingEvaluations.jsx

import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import HeaderComponent from '../../../components/Header/Header';
import CentroPersonal from '../../../components/UserIndex/PersonalCenter';
import Footer from '../../../components/Footer/Footer';
import PageTitle from '../../../components/PageTitle/PageTitle';
import UpcomingEvaluations from '../../../components/UserIndex/MyCourses/PendingEvaluations/UpcomingEvaluations';
import EvaluationsByCourse from '../../../components/UserIndex/MyCourses/PendingEvaluations/EvaluationsByCourse';
import EvaluationDetails from '../../../components/UserIndex/MyCourses/PendingEvaluations/EvaluationDetails';
import FeedbackPending from '../../../components/UserIndex/MyCourses/PendingEvaluations/FeedbackPending';
import styles from './PendingEvaluations.module.css';

const PendingEvaluations = () => {
  const { lang } = useParams();
  const { t } = useTranslation('UserIndex/MyCourses/PendingEvaluations');
  const headerHeight = '125px';
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);

  // Datos simulados de evaluaciones
  const evaluations = [
    {
      id: 1,
      title: 'Examen Final de React',
      course: 'Curso de React Avanzado',
      dueDate: '2023-11-20',
      difficulty: 'Alta',
      weight: '30%',
      format: 'Examen',
      topics: ['Hooks', 'Context API', 'Optimización'],
      estimatedTime: '2 horas',
      status: 'No Iniciada',
      resources: [
        { id: 1, title: 'Guía de Hooks', url: '/resources/hooks.pdf' },
        // Más recursos
      ],
    },
    // Más evaluaciones
  ];

  // Evaluaciones en revisión
  const feedbackPending = [
    {
      id: 2,
      title: 'Proyecto Final de Node.js',
      course: 'Curso de Node.js',
      submissionDate: '2023-11-10',
      status: 'En Revisión',
    },
    // Más evaluaciones en revisión
  ];

  // Función para seleccionar o deseleccionar una evaluación
  const handleSelectEvaluation = (evaluation) => {
    // Si la evaluación seleccionada es la misma, deseleccionarla
    if (selectedEvaluation && selectedEvaluation.id === evaluation.id) {
      setSelectedEvaluation(null);
    } else {
      setSelectedEvaluation(evaluation);
    }
  };

  return (
    <>
      <PageTitle titleKey="pendingEvaluationsTitle" />

      <HeaderComponent headerHeight={headerHeight} className="header-user-index" />

      <motion.div
        className="pending-evaluations-page"
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
                  <h2 className={styles['page-title']}>{t('pendingEvaluations')}</h2>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <UpcomingEvaluations
                    evaluations={evaluations}
                    onSelectEvaluation={handleSelectEvaluation}
                  />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <EvaluationsByCourse
                    evaluations={evaluations}
                    selectedEvaluation={selectedEvaluation}
                    onSelectEvaluation={handleSelectEvaluation}
                  />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  {selectedEvaluation && (
                    <EvaluationDetails evaluation={selectedEvaluation} />
                  )}
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <FeedbackPending evaluations={feedbackPending} />
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

export default PendingEvaluations;
