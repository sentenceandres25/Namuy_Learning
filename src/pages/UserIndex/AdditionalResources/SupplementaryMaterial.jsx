// Pages/SupplementaryMaterial.jsx

import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import HeaderComponent from '../../../components/Header/Header';
import PersonalCenter from '../../../components/UserIndex/PersonalCenter';
import Footer from '../../../components/Footer/Footer';
import PageTitle from '../../../components/PageTitle/PageTitle';
import SearchBar from '../../../components/UserIndex/AdditionalResources/SupplementaryMaterial/SearchBar';
import MaterialCategories from '../../../components/UserIndex/AdditionalResources/SupplementaryMaterial/MaterialCategories';
import MaterialRecommendations from '../../../components/UserIndex/AdditionalResources/SupplementaryMaterial/MaterialRecommendations';
import MaterialList from '../../../components/UserIndex/AdditionalResources/SupplementaryMaterial/MaterialList';
import MaterialByCourse from '../../../components/UserIndex/AdditionalResources/SupplementaryMaterial/MaterialByCourse';
import ExamPreparationMaterials from '../../../components/UserIndex/AdditionalResources/SupplementaryMaterial/ExamPreparationMaterials';
import ViewMaterialOnline from '../../../components/UserIndex/AdditionalResources/SupplementaryMaterial/ViewMaterialOnline';
import DownloadMaterials from '../../../components/UserIndex/AdditionalResources/SupplementaryMaterial/DownloadMaterials';
import InstructionsForUse from '../../../components/UserIndex/AdditionalResources/SupplementaryMaterial/InstructionsForUse';
import SuggestMaterials from '../../../components/UserIndex/AdditionalResources/SupplementaryMaterial/SuggestMaterials';
import styles from './SupplementaryMaterial.module.css';

const SupplementaryMaterial = () => {
  const { lang } = useParams();
  const { t } = useTranslation('UserIndex/AdditionalResources/SupplementaryMaterial');
  const headerHeight = '125px';

  // Sample data (replace with real data from your API or state)
  const materials = [
    {
      id: 1,
      title: 'Study Guide for Algebra',
      type: 'Study Guide',
      course: 'Algebra 101',
      category: 'Study Guides',
      downloadable: true,
      onlineView: true,
      description: 'A comprehensive study guide for Algebra.',
    },
    // Add more materials as needed
  ];

  const categories = [
    'Study Guides',
    'Practice Exercises',
    'PDF Presentations',
    'Educational Videos',
    // Add more categories as needed
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredMaterials = materials.filter(
    (material) =>
      (material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.type.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedCategory ? material.category === selectedCategory : true)
  );

  return (
    <>
      <PageTitle titleKey="supplementaryMaterialTitle" />

      <HeaderComponent headerHeight={headerHeight} className="header-user-index" />

      <motion.div
        className="supplementary-material-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Container fluid className="user-index" style={{ marginTop: headerHeight }}>
          <Row>
            {/* Left Sidebar Menu */}
            <Col md={3}>
              <PersonalCenter />
            </Col>

            {/* Main Content */}
            <Col md={9}>
              <Row>
                <Col md={12}>
                  <h2 className={styles['page-title']}>{t('supplementaryMaterial')}</h2>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <SearchBar searchQuery={searchQuery} onSearch={setSearchQuery} />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <MaterialCategories
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                  />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <MaterialRecommendations materials={materials} />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <MaterialByCourse />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <ExamPreparationMaterials />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <MaterialList materials={filteredMaterials} />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <ViewMaterialOnline />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <DownloadMaterials />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <InstructionsForUse />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <SuggestMaterials />
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

export default SupplementaryMaterial;
