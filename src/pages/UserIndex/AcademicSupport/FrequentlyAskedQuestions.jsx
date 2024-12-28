// Pages/FrequentlyAskedQuestions.jsx

import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import HeaderComponent from '../../../components/Header/Header';
import PersonalCenter from '../../../components/UserIndex/PersonalCenter';
import Footer from '../../../components/Footer/Footer';
import PageTitle from '../../../components/PageTitle/PageTitle';
import SearchBar from '../../../components/UserIndex/AcademicSupport/FrequentlyAskedQuestions/SearchBar';
import FAQTopicsMenu from '../../../components/UserIndex/AcademicSupport/FrequentlyAskedQuestions/FAQTopicsMenu'; // Updated import
import FAQList from '../../../components/UserIndex/AcademicSupport/FrequentlyAskedQuestions/FAQList';
import QuickSolutions from '../../../components/UserIndex/AcademicSupport/FrequentlyAskedQuestions/QuickSolutions';
import RelatedResources from '../../../components/UserIndex/AcademicSupport/FrequentlyAskedQuestions/RelatedResources';
import ContactSupport from '../../../components/UserIndex/AcademicSupport/FrequentlyAskedQuestions/ContactSupport';
import FAQUpdates from '../../../components/UserIndex/AcademicSupport/FrequentlyAskedQuestions/FAQUpdates';
import UserQuestions from '../../../components/UserIndex/AcademicSupport/FrequentlyAskedQuestions/UserQuestions';
import styles from './FrequentlyAskedQuestions.module.css';

const FrequentlyAskedQuestions = () => {
  const { lang } = useParams();
  const { t } = useTranslation('UserIndex/AcademicSupport/FrequentlyAskedQuestions');
  const headerHeight = '125px';

  // Sample data (replace with real data from your API or state)
  const faqs = [
    {
      id: 1,
      question: 'How do I enroll in a course?',
      answer:
        'To enroll in a course, navigate to the Courses section and select the course you are interested in. Click on "Enroll Now" and follow the prompts.',
      category: 'Course Enrollment',
    },
    // Add more FAQs as needed
  ];

  const categories = [
    'Course Enrollment',
    'Evaluation Process',
    'Tutoring',
    'Certificates',
    'Technical Issues',
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredFAQs = faqs.filter(
    (faq) =>
      (faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedCategory ? faq.category === selectedCategory : true)
  );

  return (
    <>
      <PageTitle titleKey="frequentlyAskedQuestionsTitle" />

      <HeaderComponent headerHeight={headerHeight} className="header-user-index" />

      <motion.div
        className="frequently-asked-questions-page"
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
                  <h2 className={styles['page-title']}>{t('frequentlyAskedQuestions')}</h2>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <SearchBar searchQuery={searchQuery} onSearch={setSearchQuery} />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <FAQTopicsMenu
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                  />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <FAQUpdates />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <FAQList faqs={filteredFAQs} />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <QuickSolutions />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <RelatedResources />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <ContactSupport />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <UserQuestions />
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

export default FrequentlyAskedQuestions;
