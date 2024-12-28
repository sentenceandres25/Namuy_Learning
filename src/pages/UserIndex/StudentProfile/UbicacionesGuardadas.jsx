// UbicacionesGuardadas.jsx

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import HeaderComponent from '../../../components/Header/Header';
import CentroPersonal from '../../../components/UserIndex/PersonalCenter';
import Footer from '../../../components/Footer/Footer';
import PageTitle from '../../../components/PageTitle/PageTitle';
import MisUbicaciones from '../../../components/UserIndex/StudentProfile/UbicacionesGuardadas/MisUbicaciones';
import AgregarUbicacion from '../../../components/UserIndex/StudentProfile/UbicacionesGuardadas/AgregarUbicacion';
import EditarUbicacion from '../../../components/UserIndex/StudentProfile/UbicacionesGuardadas/EditarUbicacion';
import EliminarUbicacion from '../../../components/UserIndex/StudentProfile/UbicacionesGuardadas/EliminarUbicacion';
import UbicacionesRecientes from '../../../components/UserIndex/StudentProfile/UbicacionesGuardadas/UbicacionesRecientes';
import PreferenciasUbicacion from '../../../components/UserIndex/StudentProfile/UbicacionesGuardadas/PreferenciasUbicacion';
import styles from './UbicacionesGuardadas.module.css';

const UbicacionesGuardadas = () => {
  const { lang } = useParams(); // Obtener el parámetro lang de la URL
  const { t } = useTranslation('UserIndex/StudentProfile/UbicacionesGuardadas'); // Usar el namespace de traducción
  const headerHeight = '125px'; // Ajusta esto según el tamaño del header

  return (
    <>
      {/* Agregando el título de la pestaña */}
      <PageTitle titleKey="ubicacionesGuardadasTitle" /> {/* Usamos 'titleKey' para traducir el título de la pestaña */}

      {/* Encabezado */}
      <HeaderComponent headerHeight={headerHeight} className="header-user-index" />

      {/* Contenido principal con margen superior para evitar superposición con el encabezado */}
      <motion.div
        className={styles.ubicacionesPage} // Usamos el archivo CSS correspondiente
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
                <h2 className={styles.tituloUbicacionesGuardadas}>{t('ubicaciones_guardadas')}</h2>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <MisUbicaciones />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <AgregarUbicacion />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <EditarUbicacion />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <EliminarUbicacion />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <UbicacionesRecientes />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <PreferenciasUbicacion />
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </motion.div>

      {/* Pie de página */}
      <Footer />
    </>
  );
};

export default UbicacionesGuardadas;
