import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFire } from '@fortawesome/free-solid-svg-icons';  
import { useTranslation } from 'react-i18next'; // Importar el hook useTranslation
import './DiscountsAndHighlights.css';

const DiscountsAndHighlights = () => {
  const { t } = useTranslation('DiscountsAndHighlights'); // Hook para traducción

  const discounts = [
    { title: t('discounts.title1'), description: t('discounts.description1') },
    { title: t('discounts.title2'), description: t('discounts.description2') },
    { title: t('discounts.title3'), description: t('discounts.description3') },
  ];

  const weeklyHighlights = [
    { title: t('highlights.product1'), img: 'path_to_image1' },
    { title: t('highlights.product2'), img: 'path_to_image2' },
    { title: t('highlights.product3'), img: 'path_to_image3' },
    { title: t('highlights.product4'), img: 'path_to_image4' },
    { title: t('highlights.product5'), img: 'path_to_image5' },
    { title: t('highlights.product6'), img: 'path_to_image6' },
  ];

  return (
    <Container fluid className="discounts-highlights-container">
      <Row>
        {/* Caja de Descuentos */}
        <Col md={6} className="discounts-container">
          <h2 className="section-title-weekly">{t('discounts.title')}</h2>
          <Row>
            {discounts.map((discount, index) => (
              <Col md={12} key={index}>
                <Card className="discount-card shadow-lg p-2 mb-2 bg-white rounded">
                  <Card.Body>
                    <Card.Title>{discount.title}</Card.Title>
                    <Card.Text>{discount.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>

        {/* Caja de Weekly Highlights */}
        <Col md={6} className="highlights-container">
          <h2 className="section-title-weekly">
            <FontAwesomeIcon icon={faFire} className="fire-icon" /> {t('highlights.title')}
          </h2>
          <Row>
            {weeklyHighlights.map((highlight, index) => (
              <Col xs={6} md={4} key={index}>
                <Card className="highlight-card shadow-sm p-1 mb-2 bg-white rounded">
                  <Card.Img variant="top" src={highlight.img} />
                  <Card.Body>
                    <Card.Title>{highlight.title}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default DiscountsAndHighlights;
