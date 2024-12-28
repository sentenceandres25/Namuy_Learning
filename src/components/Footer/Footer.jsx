// Footer.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import FooterColumn from './FooterColumn';
import SocialIcons from './SocialIcons';
import SubscriptionForm from './SubscriptionForm';
import styles from './Footer.module.css';
import { FaApple, FaAndroid } from 'react-icons/fa';

const Footer = () => {
  const { t } = useTranslation('Footer');

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerSections}>
          <FooterColumn
            title={t('footer.sobreNosotros')}
            links={[
              { text: t('footer.quienesSomos'), href: '#' },
              { text: t('footer.responsabilidadSocial'), href: '#' },
              { text: t('footer.empleos'), href: '#' },
              { text: t('footer.salaDePrensa'), href: '#' },
            ]}
          />
          <FooterColumn
            title={t('footer.ayudaApoyo')}
            links={[
              { text: t('footer.informacionEnvio'), href: '#' },
              { text: t('footer.devolucion'), href: '#' },
              { text: t('footer.reembolso'), href: '#' },
              { text: t('footer.rastrearPedido'), href: '#' },
              { text: t('footer.guiaTallas'), href: '#' },
              { text: t('footer.namuaVIP'), href: '#' },
            ]}
          />
          <FooterColumn
            title={t('footer.servicioCliente')}
            links={[
              { text: t('footer.contactenos'), href: '#' },
              { text: t('footer.formaPago'), href: '#' },
              { text: t('footer.puntos'), href: '#' },
            ]}
          />
          {/* Nuevo bloque para Find Us y App */}
          <div className={styles.specialSection}>
            <FooterColumn title={t('footer.encuentranosEn')}>
              <SocialIcons />
            </FooterColumn>
            <FooterColumn title={t('footer.app')}>
              <div className={styles.appIcons}>
                <a href="#"><FaApple /></a>
                <a href="#"><FaAndroid /></a>
              </div>
            </FooterColumn>
          </div>
        </div>
        
        <SubscriptionForm title={t('footer.suscribete')} />
        
        <div className={styles.footerPayment}>
          <img src="visa.png" alt="Visa" />
          <img src="mastercard.png" alt="Mastercard" />
          <img src="paypal.png" alt="PayPal" />
        </div>

        <div className={styles.footerBottom}>
          <p>©2009-2024 {t('footer.derechosReservados')}</p>
          <ul>
            <li><a href="#">{t('footer.centroPrivacidad')}</a></li>
            <li><a href="#">{t('footer.politicaPrivacidad')}</a></li>
            <li><a href="#">{t('footer.terminosCondiciones')}</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
