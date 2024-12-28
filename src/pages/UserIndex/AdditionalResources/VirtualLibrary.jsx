// Pages/VirtualLibrary.jsx

import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import HeaderComponent from '../../../components/Header/Header';
import PersonalCenter from '../../../components/UserIndex/PersonalCenter';
import Footer from '../../../components/Footer/Footer';
import PageTitle from '../../../components/PageTitle/PageTitle';
import SearchBar from '../../../components/UserIndex/AdditionalResources/VirtualLibrary/SearchBar';
import ResourceCategories from '../../../components/UserIndex/AdditionalResources/VirtualLibrary/ResourceCategories';
import NewArrivals from '../../../components/UserIndex/AdditionalResources/VirtualLibrary/NewArrivals';
import ResourceCatalog from '../../../components/UserIndex/AdditionalResources/VirtualLibrary/ResourceCatalog';
import OnlineAccess from '../../../components/UserIndex/AdditionalResources/VirtualLibrary/OnlineAccess';
import LibraryGuides from '../../../components/UserIndex/AdditionalResources/VirtualLibrary/LibraryGuides';
import CourseRecommendedResources from '../../../components/UserIndex/AdditionalResources/VirtualLibrary/CourseRecommendedResources';
import RequestAdditionalResources from '../../../components/UserIndex/AdditionalResources/VirtualLibrary/RequestAdditionalResources';
import MySavedResources from '../../../components/UserIndex/AdditionalResources/VirtualLibrary/MySavedResources';
import AvailableDownloads from '../../../components/UserIndex/AdditionalResources/VirtualLibrary/AvailableDownloads';
import styles from './VirtualLibrary.module.css';

const VirtualLibrary = () => {
  const { lang } = useParams();
  const { t } = useTranslation('UserIndex/AdditionalResources/VirtualLibrary');
  const headerHeight = '125px';

  // Sample data (replace with real data from your API or state)
  const resources = [
    {
      id: 1,
      title: 'Effective Study Techniques',
      author: 'John Doe',
      category: 'Study Techniques',
      onlineAccess: true,
      downloadable: true,
      description: 'A comprehensive guide on how to study effectively.',
    },
    // Add more resources as needed
  ];

  const categories = [
    'Study Techniques',
    'Personal Development',
    'Science',
    'Literature',
    // Add more categories as needed
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredResources = resources.filter(
    (resource) =>
      (resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedCategory ? resource.category === selectedCategory : true)
  );

  return (
    <>
      <PageTitle titleKey="virtualLibraryTitle" />

      <HeaderComponent headerHeight={headerHeight} className="header-user-index" />

      <motion.div
        className="virtual-library-page"
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
                  <h2 className={styles['page-title']}>{t('virtualLibrary')}</h2>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <SearchBar searchQuery={searchQuery} onSearch={setSearchQuery} />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <ResourceCategories
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                  />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <NewArrivals resources={resources} />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <ResourceCatalog resources={filteredResources} />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <OnlineAccess />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <LibraryGuides />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <CourseRecommendedResources />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <RequestAdditionalResources />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <MySavedResources />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <AvailableDownloads />
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

export default VirtualLibrary;
