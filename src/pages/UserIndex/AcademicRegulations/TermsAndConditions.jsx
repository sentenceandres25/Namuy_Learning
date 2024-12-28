// Pages/TermsAndConditions.jsx

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import HeaderComponent from '../../../components/Header/Header';
import PersonalCenter from '../../../components/UserIndex/PersonalCenter';
import Footer from '../../../components/Footer/Footer';
import PageTitle from '../../../components/PageTitle/PageTitle';
import Introduction from '../../../components/UserIndex/AcademicRegulations/TermsAndConditions/Introduction';
import AcceptanceOfTerms from '../../../components/UserIndex/AcademicRegulations/TermsAndConditions/AcceptanceOfTerms';
import ServicesDescription from '../../../components/UserIndex/AcademicRegulations/TermsAndConditions/ServicesDescription';
import UserResponsibilities from '../../../components/UserIndex/AcademicRegulations/TermsAndConditions/UserResponsibilities';
import IntellectualProperty from '../../../components/UserIndex/AcademicRegulations/TermsAndConditions/IntellectualProperty';
import ConfidentialityDataProtection from '../../../components/UserIndex/AcademicRegulations/TermsAndConditions/ConfidentialityDataProtection';
import PlatformAccessRestrictions from '../../../components/UserIndex/AcademicRegulations/TermsAndConditions/PlatformAccessRestrictions';
import PaymentsCancellations from '../../../components/UserIndex/AcademicRegulations/TermsAndConditions/PaymentsCancellations';
import ModificationOfTerms from '../../../components/UserIndex/AcademicRegulations/TermsAndConditions/ModificationOfTerms';
import LimitationOfLiability from '../../../components/UserIndex/AcademicRegulations/TermsAndConditions/LimitationOfLiability';
import DisputeResolution from '../../../components/UserIndex/AcademicRegulations/TermsAndConditions/DisputeResolution';
import DurationTermination from '../../../components/UserIndex/AcademicRegulations/TermsAndConditions/DurationTermination';
import FinalProvisions from '../../../components/UserIndex/AcademicRegulations/TermsAndConditions/FinalProvisions';
import AcceptableUsePolicy from '../../../components/UserIndex/AcademicRegulations/TermsAndConditions/AcceptableUsePolicy';
import ServiceInterruption from '../../../components/UserIndex/AcademicRegulations/TermsAndConditions/ServiceInterruption';
import UsageLicense from '../../../components/UserIndex/AcademicRegulations/TermsAndConditions/UsageLicense';
import ThirdPartyContentDisclaimer from '../../../components/UserIndex/AcademicRegulations/TermsAndConditions/ThirdPartyContentDisclaimer';
import ForumsInteractionSpaces from '../../../components/UserIndex/AcademicRegulations/TermsAndConditions/ForumsInteractionSpaces';
import ModificationSuspensionOfServices from '../../../components/UserIndex/AcademicRegulations/TermsAndConditions/ModificationSuspensionOfServices';
import StudentRights from '../../../components/UserIndex/AcademicRegulations/TermsAndConditions/StudentRights';
import ComplianceWithLaws from '../../../components/UserIndex/AcademicRegulations/TermsAndConditions/ComplianceWithLaws';
import AccountSecurity from '../../../components/UserIndex/AcademicRegulations/TermsAndConditions/AccountSecurity';
import NonTransferability from '../../../components/UserIndex/AcademicRegulations/TermsAndConditions/NonTransferability';
import styles from './TermsAndConditions.module.css';

const TermsAndConditions = () => {
  const { lang } = useParams();
  const { t } = useTranslation('UserIndex/AcademicRegulations/TermsAndConditions');
  const headerHeight = '125px';

  return (
    <>
      <PageTitle titleKey="termsAndConditionsTitle" />

      <HeaderComponent headerHeight={headerHeight} className="header-user-index" />

      <motion.div
        className="terms-and-conditions-page"
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
                  <h2 className={styles['page-title']}>{t('termsAndConditions')}</h2>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <Introduction />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <AcceptanceOfTerms />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <ServicesDescription />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <UserResponsibilities />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <IntellectualProperty />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <ConfidentialityDataProtection />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <PlatformAccessRestrictions />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <PaymentsCancellations />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <ModificationOfTerms />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <LimitationOfLiability />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <DisputeResolution />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <DurationTermination />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <FinalProvisions />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <AcceptableUsePolicy />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <ServiceInterruption />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <UsageLicense />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <ThirdPartyContentDisclaimer />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <ForumsInteractionSpaces />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <ModificationSuspensionOfServices />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <StudentRights />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <ComplianceWithLaws />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <AccountSecurity />
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <NonTransferability />
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

export default TermsAndConditions;
