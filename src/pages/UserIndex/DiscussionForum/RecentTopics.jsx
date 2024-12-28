// Pages/RecentTopics.jsx

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import HeaderComponent from '../../../components/Header/Header';
import PersonalCenter from '../../../components/UserIndex/PersonalCenter';
import Footer from '../../../components/Footer/Footer';
import PageTitle from '../../../components/PageTitle/PageTitle';
import TopicList from '../../../components/UserIndex/DiscussionForum/RecentTopics/TopicList';
import PopularTopics from '../../../components/UserIndex/DiscussionForum/RecentTopics/PopularTopics';
import TopicsByCategory from '../../../components/UserIndex/DiscussionForum/RecentTopics/TopicsByCategory';
import NewReplies from '../../../components/UserIndex/DiscussionForum/RecentTopics/NewReplies';
import UnansweredTopics from '../../../components/UserIndex/DiscussionForum/RecentTopics/UnansweredTopics';
import CreateTopicButton from '../../../components/UserIndex/DiscussionForum/RecentTopics/CreateTopicButton';
import DateFilter from '../../../components/UserIndex/DiscussionForum/RecentTopics/DateFilter';
import SubscribeToTopics from '../../../components/UserIndex/DiscussionForum/RecentTopics/SubscribeToTopics';
import TopicSearch from '../../../components/UserIndex/DiscussionForum/RecentTopics/TopicSearch';
import Acknowledgements from '../../../components/UserIndex/DiscussionForum/RecentTopics/Acknowledgements';
import styles from './RecentTopics.module.css';

const RecentTopics = () => {
  const headerHeight = '125px';
  const { lang } = useParams();
  const { t } = useTranslation('UserIndex/DiscussionForum/RecentTopics');

  return (
    <>
      <PageTitle titleKey="recentTopicsTitle" />

      <HeaderComponent headerHeight={headerHeight} className="header-user-index" />

      <motion.div
        className="recent-topics-page"
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
            <Col md={6}>
              <Row>
                <Col md={12}>
                  <h2 className={styles['page-title']}>{t('recentTopics')}</h2>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <DateFilter />
                  <TopicSearch />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <TopicList />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <NewReplies />
                  <UnansweredTopics />
                </Col>
              </Row>
            </Col>

            {/* Right Sidebar */}
            <Col md={3}>
              <CreateTopicButton />
              <PopularTopics />
              <TopicsByCategory />
              <SubscribeToTopics />
              <Acknowledgements />
            </Col>
          </Row>
        </Container>
      </motion.div>

      <Footer />
    </>
  );
};

export default RecentTopics;
