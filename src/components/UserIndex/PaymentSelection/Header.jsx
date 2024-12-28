// Header.jsx
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import logo from '../../../assets/images/logo1.png';
import headerStyles from './Header.module.css';

const HeaderComponent = ({ rightOption, t }) => {
  const { lang } = useParams();
  
  return (
    <header className={headerStyles.header}>
      <div className={headerStyles.logo}>
        <Link to={`/pages/HomePage/${lang}`} className="navbar-brand">
          <img src={logo} alt={t('companyName') + " Logo"} />
        </Link>
      </div>
      <div className={headerStyles.rightOption}>
        <Link 
          to={`/user/MyCart/${lang}`} 
          className={headerStyles.cancelButton}
        >
          {rightOption}
        </Link>
      </div>
    </header>
  );
};

export default HeaderComponent;
