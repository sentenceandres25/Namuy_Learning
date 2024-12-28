import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChalkboardTeacher, faBookOpen, faUserGraduate } from '@fortawesome/free-solid-svg-icons'; // Nuevos íconos
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Importar el hook useTranslation
import './InfoSection.css';

const InfoSection = () => {
  const { t } = useTranslation('InfoSection'); // Hook para traducción

  return (
    <div className="info-section-wrapper">
      <div className="info-section">
        <Container>
          <Row className="justify-content-between align-items-center text-center info-row">
            <Col xs={12} md={4} className="d-flex align-items-center justify-content-center info-col">
              <Link to="/courses-info" className="info-link">
                <div className="info-content">
                  <FontAwesomeIcon icon={faChalkboardTeacher} className="info-icon" />
                  <span className="info-text">{t('infoSection.coursesInfo')}</span> {/* Información de cursos */}
                </div>
              </Link>
            </Col>
            <Col xs={12} md={4} className="d-flex align-items-center justify-content-center info-col">
              <Link to="/resources" className="info-link">
                <div className="info-content">
                  <FontAwesomeIcon icon={faBookOpen} className="info-icon" />
                  <span className="info-text">{t('infoSection.resources')}</span> {/* Recursos educativos */}
                </div>
              </Link>
            </Col>
            <Col xs={12} md={4} className="d-flex align-items-center justify-content-center info-col">
              <Link to="/new-students" className="info-link">
                <div className="info-content">
                  <FontAwesomeIcon icon={faUserGraduate} className="info-icon" />
                  <span className="info-text">
                    {t('infoSection.newStudents')} <span className="highlight">{t('infoSection.welcomeDiscount')}</span>
                  </span> {/* Descuento de bienvenida para estudiantes nuevos */}
                </div>
              </Link>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default InfoSection;
