// Pages/StartNewConversation.jsx

import React, { useState } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import HeaderComponent from '../../../components/Header/Header';
import PersonalCenter from '../../../components/UserIndex/PersonalCenter';
import Footer from '../../../components/Footer/Footer';
import PageTitle from '../../../components/PageTitle/PageTitle';
import TopicTitle from '../../../components/UserIndex/DiscussionForum/StartNewConversation/TopicTitle';
import SelectCategory from '../../../components/UserIndex/DiscussionForum/StartNewConversation/SelectCategory';
import TopicDescription from '../../../components/UserIndex/DiscussionForum/StartNewConversation/TopicDescription';
import AddFilesOrLinks from '../../../components/UserIndex/DiscussionForum/StartNewConversation/AddFilesOrLinks';
import ConversationPrivacy from '../../../components/UserIndex/DiscussionForum/StartNewConversation/ConversationPrivacy';
import TagsKeywords from '../../../components/UserIndex/DiscussionForum/StartNewConversation/TagsKeywords';
import ResponseNotifications from '../../../components/UserIndex/DiscussionForum/StartNewConversation/ResponseNotifications';
import VisibilityPreferences from '../../../components/UserIndex/DiscussionForum/StartNewConversation/VisibilityPreferences';
import TopicVerification from '../../../components/UserIndex/DiscussionForum/StartNewConversation/TopicVerification';
import PublishButton from '../../../components/UserIndex/DiscussionForum/StartNewConversation/PublishButton';
import styles from './StartNewConversation.module.css';

const StartNewConversation = () => {
  const { lang } = useParams();
  const { t } = useTranslation('UserIndex/DiscussionForum/StartNewConversation');
  const headerHeight = '125px';

  const [step, setStep] = useState(1);
  const [conversationData, setConversationData] = useState({
    title: '',
    category: '',
    description: '',
    filesOrLinks: [],
    privacy: 'public',
    tags: [],
    notifications: true,
    visibility: 'everyone',
  });

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleDataChange = (field, value) => {
    setConversationData({ ...conversationData, [field]: value });
  };

  const handlePublish = () => {
    // Logic to publish the conversation (e.g., send data to server)
    alert(t('conversationPublished'));
  };

  return (
    <>
      <PageTitle titleKey="startNewConversationTitle" />

      <HeaderComponent headerHeight={headerHeight} className="header-user-index" />

      <motion.div
        className="start-new-conversation-page"
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
                  <h2 className={styles['page-title']}>{t('startNewConversation')}</h2>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <Form>
                    {step === 1 && (
                      <TopicTitle
                        title={conversationData.title}
                        onChange={(value) => handleDataChange('title', value)}
                        onNext={handleNextStep}
                      />
                    )}
                    {step === 2 && (
                      <SelectCategory
                        category={conversationData.category}
                        onChange={(value) => handleDataChange('category', value)}
                        onNext={handleNextStep}
                        onBack={handlePrevStep}
                      />
                    )}
                    {step === 3 && (
                      <TopicDescription
                        description={conversationData.description}
                        onChange={(value) => handleDataChange('description', value)}
                        onNext={handleNextStep}
                        onBack={handlePrevStep}
                      />
                    )}
                    {step === 4 && (
                      <AddFilesOrLinks
                        filesOrLinks={conversationData.filesOrLinks}
                        onChange={(value) => handleDataChange('filesOrLinks', value)}
                        onNext={handleNextStep}
                        onBack={handlePrevStep}
                      />
                    )}
                    {step === 5 && (
                      <ConversationPrivacy
                        privacy={conversationData.privacy}
                        onChange={(value) => handleDataChange('privacy', value)}
                        onNext={handleNextStep}
                        onBack={handlePrevStep}
                      />
                    )}
                    {step === 6 && (
                      <TagsKeywords
                        tags={conversationData.tags}
                        onChange={(value) => handleDataChange('tags', value)}
                        onNext={handleNextStep}
                        onBack={handlePrevStep}
                      />
                    )}
                    {step === 7 && (
                      <ResponseNotifications
                        notifications={conversationData.notifications}
                        onChange={(value) => handleDataChange('notifications', value)}
                        onNext={handleNextStep}
                        onBack={handlePrevStep}
                      />
                    )}
                    {step === 8 && (
                      <VisibilityPreferences
                        visibility={conversationData.visibility}
                        onChange={(value) => handleDataChange('visibility', value)}
                        onNext={handleNextStep}
                        onBack={handlePrevStep}
                      />
                    )}
                    {step === 9 && (
                      <TopicVerification
                        conversationData={conversationData}
                        onPublish={handlePublish}
                        onBack={handlePrevStep}
                      />
                    )}
                  </Form>
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

export default StartNewConversation;
