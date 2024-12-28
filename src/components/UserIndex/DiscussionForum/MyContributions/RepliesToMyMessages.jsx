// Components/MyContributions/RepliesToMyMessages.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './RepliesToMyMessages.module.css';
import { FaComments } from 'react-icons/fa';

const RepliesToMyMessages = ({ replies }) => {
  const { t } = useTranslation('UserIndex/DiscussionForum/MyContributions');

  const handleReplyClick = (topicTitle) => {
    // Navigate to the specific reply thread
    alert(`Viewing replies for: ${topicTitle}`);
  };

  return (
    <div className={styles.repliesToMyMessages}>
      <h3>
        <FaComments /> {t('repliesToMyMessages')}
      </h3>
      {replies.length > 0 ? (
        replies.map((reply) => (
          <div key={reply.id} className={styles.replyItem} onClick={() => handleReplyClick(reply.topicTitle)}>
            <h4>{reply.topicTitle}</h4>
            <p>
              <strong>{t('replies')}:</strong> {reply.replyCount}
            </p>
          </div>
        ))
      ) : (
        <p>{t('noReplies')}</p>
      )}
    </div>
  );
};

export default RepliesToMyMessages;
