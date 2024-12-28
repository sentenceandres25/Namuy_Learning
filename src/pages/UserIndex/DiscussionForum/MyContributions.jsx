// Pages/MyContributions.jsx

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import HeaderComponent from '../../../components/Header/Header';
import PersonalCenter from '../../../components/UserIndex/PersonalCenter';
import Footer from '../../../components/Footer/Footer';
import PageTitle from '../../../components/PageTitle/PageTitle';
import MyMessagesList from '../../../components/UserIndex/DiscussionForum/MyContributions/MyMessagesList';
import TopicsStarted from '../../../components/UserIndex/DiscussionForum/MyContributions/TopicsStarted';
import RepliesToMyMessages from '../../../components/UserIndex/DiscussionForum/MyContributions/RepliesToMyMessages';
import MyFavoriteComments from '../../../components/UserIndex/DiscussionForum/MyContributions/MyFavoriteComments';
import TopicsRead from '../../../components/UserIndex/DiscussionForum/MyContributions/TopicsRead';
import RecentActivity from '../../../components/UserIndex/DiscussionForum/MyContributions/RecentActivity';
import ParticipationStatistics from '../../../components/UserIndex/DiscussionForum/MyContributions/ParticipationStatistics';
import ReplyNotifications from '../../../components/UserIndex/DiscussionForum/MyContributions/ReplyNotifications';
import RelatedTopicsLinks from '../../../components/UserIndex/DiscussionForum/MyContributions/RelatedTopicsLinks';
import styles from './MyContributions.module.css';

const MyContributions = () => {
  const { lang } = useParams();
  const { t } = useTranslation('UserIndex/DiscussionForum/MyContributions');
  const headerHeight = '125px';

  // Sample data (replace with real data from your API or state)
  const myMessages = [
    {
      id: 1,
      topicTitle: 'Understanding React Hooks',
      date: '2023-11-05',
      content: 'Can someone explain how useEffect works?',
    },
    // Add more messages as needed
  ];

  const topicsStarted = [
    {
      id: 1,
      title: 'Best Practices for Node.js',
      date: '2023-10-20',
      replies: 5,
    },
    // Add more topics as needed
  ];

  const repliesToMyMessages = [
    {
      id: 1,
      topicTitle: 'Understanding React Hooks',
      replyCount: 3,
    },
    // Add more replies as needed
  ];

  const favoriteComments = [
    {
      id: 1,
      topicTitle: 'JavaScript ES6 Features',
      date: '2023-09-15',
      content: 'I found arrow functions very useful!',
    },
    // Add more favorites as needed
  ];

  const topicsRead = [
    {
      id: 1,
      title: 'CSS Grid vs Flexbox',
      date: '2023-08-10',
    },
    // Add more topics as needed
  ];

  const recentActivity = [
    // Combine recent messages, replies, etc.
  ];

  const participationStats = {
    totalMessages: 10,
    topicsStarted: 2,
    repliesReceived: 15,
  };

  const replyNotifications = [
    {
      id: 1,
      topicTitle: 'Understanding React Hooks',
      replyFrom: 'Alice',
      date: '2023-11-06',
    },
    // Add more notifications as needed
  ];

  const relatedTopics = [
    {
      id: 1,
      title: 'State Management in React',
      date: '2023-11-01',
    },
    // Add more related topics as needed
  ];

  return (
    <>
      <PageTitle titleKey="myContributionsTitle" />

      <HeaderComponent headerHeight={headerHeight} className="header-user-index" />

      <motion.div
        className="my-contributions-page"
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
                  <h2 className={styles['page-title']}>{t('myContributions')}</h2>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <ParticipationStatistics stats={participationStats} />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <MyMessagesList messages={myMessages} />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <TopicsStarted topics={topicsStarted} />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <RepliesToMyMessages replies={repliesToMyMessages} />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <MyFavoriteComments favorites={favoriteComments} />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <TopicsRead topics={topicsRead} />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <RecentActivity activities={recentActivity} />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <ReplyNotifications notifications={replyNotifications} />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <RelatedTopicsLinks topics={relatedTopics} />
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

export default MyContributions;
