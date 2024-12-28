// src/components/IconLinks.jsx

import React, { useEffect, useState, useRef, useContext } from 'react';
import { Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { faFacebookSquare, faInstagramSquare, faYoutubeSquare } from '@fortawesome/free-brands-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './IconLinks.css';
import { AuthContext } from '../../contexts/AuthContext'; // Importar el contexto de autenticación

const IconLinks = () => {
  const { t, i18n } = useTranslation('IconLinks');
  const currentLang = i18n.language;
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext); // Usar el contexto de autenticación

  const [cartCount, setCartCount] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 991);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

  // Efecto para ajustar el tamaño de pantalla
  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth <= 991);
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Efecto para detectar clics fuera del menú desplegable
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };

    if (dropdownVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownVisible]);

  // Cargar datos del carrito desde localStorage
  useEffect(() => {
    try {
      const cartData = JSON.parse(localStorage.getItem('cartData')) || [];
      setCartCount(cartData.length);
    } catch (error) {
      console.error('Error al cargar datos del carrito desde localStorage:', error);
    }
  }, [user]); // Dependencia añadida para actualizar el carrito cuando el usuario cambia

  // Función para cerrar sesión
  const handleLogout = () => {
    logout(); // Usar el método de logout del contexto
    navigate(`/login/${currentLang}`);
  };

  // Función para redirigir al login si no está autenticado
  const handleAccountAccess = (e) => {
    if (!user) {
      e.preventDefault();
      navigate(`/login/${currentLang}`);
    }
  };

  // Manejo de clic en cuenta del usuario
  const handleAccountClick = (e) => {
    if (isMobile) {
      e.preventDefault(); 
      setDropdownVisible(!dropdownVisible); 
    } else if (!user) {
      e.preventDefault();
      navigate(`/login/${currentLang}`);
    }
  };

  return (
    <div className="icon-container">
      {/* Sección de perfil de usuario con dropdown */}
      <div 
        className="user-profile" 
        onMouseEnter={() => !isMobile && setDropdownVisible(true)} 
        onMouseLeave={() => !isMobile && setDropdownVisible(false)}
      >
        <Link
          to={isMobile ? "#" : `/user/info/${currentLang}`}
          className="user-link"
          style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}
          onClick={handleAccountClick}
        >
          <FontAwesomeIcon icon={faUserCircle} size="2x" />
          <span className="user-name" style={{ marginLeft: '8px' }}>
            {user ? `${t('hello')}, ${user.username}` : t('youraccount')}
          </span>
        </Link>

        {/* Mostrar dropdown si es visible en móvil o si es pantalla grande */}
        {(dropdownVisible || (!isMobile && dropdownVisible)) && (
          <div className="dropdown-menu-account-custom" ref={dropdownRef}>
            <div className="dropdown-header-account-custom">
              {user ? `${t('hello')}, ${user.username}` : t('youraccount')}
            </div>
            <Link
              to={user ? `/user/info/${currentLang}` : `/login/${currentLang}`}
              className="dropdown-item-account-custom"
              onClick={handleAccountAccess}
            >
              {t('account')}
            </Link>
            <Link to="/orders" className="dropdown-item-account-custom">
              {t('orders')}
            </Link>
            {user && (
              <div
                className="dropdown-item-account-custom"
                onClick={handleLogout}
                style={{ cursor: 'pointer' }}
              >
                {t('logout')}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Carrito de compras con contador */}
      <Link to={`/user/MyCart/${currentLang}`} className="cart-icon">
        <FontAwesomeIcon icon={faShoppingCart} size="2x" />
        <span className="cart-count">{cartCount}</span>
        <span className="cart-text">{t('mycart')}</span>
      </Link>

      {/* Redes sociales con hover animado */}
      <div className="social-icons">
        <Nav.Link href="https://facebook.com" target="_blank">
          <FontAwesomeIcon icon={faFacebookSquare} size="2x" />
        </Nav.Link>
        <Nav.Link href="https://instagram.com" target="_blank">
          <FontAwesomeIcon icon={faInstagramSquare} size="2x" />
        </Nav.Link>
        <Nav.Link href="https://youtube.com" target="_blank">
          <FontAwesomeIcon icon={faYoutubeSquare} size="2x" />
        </Nav.Link>
      </div>
    </div>
  );
};

export default IconLinks;
