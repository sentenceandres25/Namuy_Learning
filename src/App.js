// src/App.jsx
import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// No importes AuthProvider aquí, ya que lo usarás en AppWrapper.
import { AuthContext } from './contexts/AuthContext';
import HeaderComponent from './components/Header/Header';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import LoginForm from './pages/LoginProcess/LoginForm';
import LoginPasswordPage from './pages/LoginProcess/LoginPasswordPage';
import NewAccountPage from './pages/LoginProcess/NewAccountPage';
import GeneralInfo from './pages/UserIndex/StudentProfile/GeneralInfo';
import AcademicHistory from './pages/UserIndex/StudentProfile/AcademicHistory';
import Settings from './pages/UserIndex/StudentProfile/Settings';
import UbicacionesGuardadas from './pages/UserIndex/StudentProfile/UbicacionesGuardadas';
import PerformanceStatistics from './pages/UserIndex/StudentProfile/PerformanceStatistics';
import CoursesInProgress from './pages/UserIndex/MyCourses/CoursesInProgress';
import CoursePage from './pages/CoursePage';
import OnlineCourse from './pages/OnlineCourse';
import CompletedCourses from './pages/UserIndex/MyCourses/CompletedCourses';
import PendingEvaluations from './pages/UserIndex/MyCourses/PendingEvaluations';
import CertificatesObtained from './pages/UserIndex/Certifications/CertificatesObtained';
import CertificatesInProgress from './pages/UserIndex/Certifications/CertificatesInProgress';
import ExpiredCertificates from './pages/UserIndex/Certifications/ExpiredCertificates';
import TutoringHistory from './pages/UserIndex/PersonalizedTutoring/TutoringHistory';
import ScheduleTutoring from './pages/UserIndex/PersonalizedTutoring/ScheduleTutoring';
import PendingTutoringSessions from './pages/UserIndex/PersonalizedTutoring/PendingTutoringSessions';
import EvaluateTutoringSessions from './pages/UserIndex/PersonalizedTutoring/EvaluateTutoringSessions';
import RequestExtraTutoring from './pages/UserIndex/PersonalizedTutoring/RequestExtraTutoring';
import RecentTopics from './pages/UserIndex/DiscussionForum/RecentTopics';
import MyContributions from './pages/UserIndex/DiscussionForum/MyContributions';
import StartNewConversation from './pages/UserIndex/DiscussionForum/StartNewConversation';
import FrequentlyAskedQuestions from './pages/UserIndex/AcademicSupport/FrequentlyAskedQuestions';
import TechnicalAssistance from './pages/UserIndex/AcademicSupport/TechnicalAssistance';
import VirtualLibrary from './pages/UserIndex/AdditionalResources/VirtualLibrary';
import SupplementaryMaterial from './pages/UserIndex/AdditionalResources/SupplementaryMaterial';
import StudyPolicies from './pages/UserIndex/AcademicRegulations/StudyPolicies';
import TermsAndConditions from './pages/UserIndex/AcademicRegulations/TermsAndConditions';
import MyCart from './pages/UserIndex/MyCart/MyCart';
import PaymentSelection from './pages/UserIndex/PaymentSelection/PaymentSelection';
import SearchPage from './pages/SearchPage';
import { useTranslation } from 'react-i18next';
import './i18n';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { i18n } = useTranslation();
  const { loading } = useContext(AuthContext); 

  useEffect(() => {
    // Lógica de idioma si la necesitas
  }, [i18n]);

  if (loading) {
    // Mostrar una pantalla de carga mientras el AuthContext verifica la sesión
    return <div>Cargando sesión...</div>;
  }

  // Cuando loading es false, ya podemos renderizar las rutas
  return (
    <ThemeProvider>
      <Router>
        <HeaderComponent  />
        <Routes>
          <Route path="/" element={<Navigate to={`/pages/HomePage/${i18n.language}`} />} />
          <Route path="/pages/HomePage/:lang" element={<HomePage />} />
          <Route path="/pages/AboutPage/:lang" element={<AboutPage />} />
          <Route path="/login/:lang" element={<LoginForm />} />
          <Route path="/login/password/:lang" element={<LoginPasswordPage />} />
          <Route path="/new-account/:lang" element={<NewAccountPage />} />

          {/* Rutas protegidas */}
          <Route path="/user/Info/:lang" element={<ProtectedRoute><GeneralInfo /></ProtectedRoute>} />
          <Route path="/user/AcademicHistory/:lang" element={<ProtectedRoute><AcademicHistory /></ProtectedRoute>} />
          <Route path="/user/Settings/:lang" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/user/UbicacionesGuardadas/:lang" element={<ProtectedRoute><UbicacionesGuardadas /></ProtectedRoute>} />
          <Route path="/user/PerformanceStatistics/:lang" element={<ProtectedRoute><PerformanceStatistics /></ProtectedRoute>} />
          <Route path="/user/CoursesInProgress/:lang" element={<ProtectedRoute><CoursesInProgress /></ProtectedRoute>} />
          <Route path="/user/CoursePage/:lang" element={<ProtectedRoute><CoursePage /></ProtectedRoute>} />
          <Route path="/user/OnlineCourse/:lang" element={<ProtectedRoute><OnlineCourse /></ProtectedRoute>} />
          <Route path="/user/CompletedCourses/:lang" element={<ProtectedRoute><CompletedCourses /></ProtectedRoute>} />
          <Route path="/user/PendingEvaluations/:lang" element={<ProtectedRoute><PendingEvaluations /></ProtectedRoute>} />
          <Route path="/user/CertificatesObtained/:lang" element={<ProtectedRoute><CertificatesObtained /></ProtectedRoute>} />
          <Route path="/user/CertificatesInProgress/:lang" element={<ProtectedRoute><CertificatesInProgress /></ProtectedRoute>} />
          <Route path="/user/ExpiredCertificates/:lang" element={<ProtectedRoute><ExpiredCertificates /></ProtectedRoute>} />
          <Route path="/user/TutoringHistory/:lang" element={<ProtectedRoute><TutoringHistory /></ProtectedRoute>} />
          <Route path="/user/ScheduleTutoring/:lang" element={<ProtectedRoute><ScheduleTutoring /></ProtectedRoute>} />
          <Route path="/user/PendingTutoringSessions/:lang" element={<ProtectedRoute><PendingTutoringSessions /></ProtectedRoute>} />
          <Route path="/user/EvaluateTutoringSessions/:lang" element={<ProtectedRoute><EvaluateTutoringSessions /></ProtectedRoute>} />
          <Route path="/user/RequestExtraTutoring/:lang" element={<ProtectedRoute><RequestExtraTutoring /></ProtectedRoute>} />
          <Route path="/user/MyContributions/:lang" element={<ProtectedRoute><MyContributions /></ProtectedRoute>} />
          <Route path="/user/RecentTopics/:lang" element={<ProtectedRoute><RecentTopics /></ProtectedRoute>} />
          <Route path="/user/StartNewConversation/:lang" element={<ProtectedRoute><StartNewConversation /></ProtectedRoute>} />
          <Route path="/user/FrequentlyAskedQuestions/:lang" element={<ProtectedRoute><FrequentlyAskedQuestions /></ProtectedRoute>} />
          <Route path="/user/TechnicalAssistance/:lang" element={<ProtectedRoute><TechnicalAssistance /></ProtectedRoute>} />
          <Route path="/user/VirtualLibrary/:lang" element={<ProtectedRoute><VirtualLibrary /></ProtectedRoute>} />
          <Route path="/user/SupplementaryMaterial/:lang" element={<ProtectedRoute><SupplementaryMaterial /></ProtectedRoute>} />
          <Route path="/user/StudyPolicies/:lang" element={<ProtectedRoute><StudyPolicies /></ProtectedRoute>} />
          <Route path="/user/TermsAndConditions/:lang" element={<ProtectedRoute><TermsAndConditions /></ProtectedRoute>} />
          <Route path="/user/MyCart/:lang" element={<ProtectedRoute><MyCart /></ProtectedRoute>} />
          <Route path="/user/PaymentSelection/:lang" element={<ProtectedRoute><PaymentSelection /></ProtectedRoute>} />
          <Route path="/SearchPage/:lang" element={<SearchPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
