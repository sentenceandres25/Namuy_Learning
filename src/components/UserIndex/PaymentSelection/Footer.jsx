// Footer.jsx
import React from 'react';
import footerStyles from './Footer.module.css';

const Footer = ({ t }) => {
  return (
    <footer className={footerStyles.footer}>
      <div className={footerStyles.footerContent}>
        <span className={footerStyles.companyName}>{t('companyName')}</span>
        <span className={footerStyles.footerMessage}>{t('footerMessage')}</span>
      </div>
    </footer>
  );
};

export default Footer;
