import React, { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faBars } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next'; // Importar useTranslation
import './HorizontalMenu.css';

const HorizontalMenu = ({
  categories,
  activeCategory,
  handleMouseEnter,
  handleMouseLeave,
  setActiveCategory,
  scrollLeft,
  scrollRight,
  menuRef,
  menuOpen, // Ahora se pasa desde CombinedNavbar
  toggleMenu, // Función para alternar el menú pasada desde CombinedNavbar
  navigate // Recibe la función navigate de React Router
}) => {
  // Referencias para los elementos del menú hamburguesa
  const menuRefHamburger = useRef(null); 
  const hamburgerRef = useRef(null); 

  // Hook de traducción
  const { t } = useTranslation('categoriesData'); // Usar el hook para la traducción

  // Efecto para detectar clics fuera del menú hamburguesa y cerrarlo
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Si el clic ocurre fuera del menú y del ícono hamburguesa, cerrar el menú
      if (
        menuRefHamburger.current &&
        !menuRefHamburger.current.contains(event.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target)
      ) {
        if (menuOpen) toggleMenu(); // Solo cerrar si el menú está abierto
      }
    };

    // Añadir evento de clic al documento
    document.addEventListener('mousedown', handleClickOutside);

    // Limpiar el evento cuando el componente se desmonta
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRefHamburger, hamburgerRef, menuOpen, toggleMenu]);

  return (
    <>
      {/* Botón de hamburguesa visible en pantallas pequeñas */}
      <div ref={hamburgerRef} className="hamburger" onClick={toggleMenu}>
        <FontAwesomeIcon icon={faBars} />
      </div>

      {/* Menú hamburguesa que aparece al hacer clic en el botón */}
      <div ref={menuRefHamburger} className={`hamburger-menu ${menuOpen ? 'active' : ''}`}>
        {categories.map((category) => (
          <a
            key={category}
            className={`menu-item ${activeCategory === category ? 'active' : ''}`}
            onClick={() => {
              setActiveCategory(category);
              navigate(`/${category}`); // Usar navigate para cambiar la URL
              toggleMenu(); // Cierra el menú al seleccionar una categoría
            }}
          >
            {t(`categories.${category.toLowerCase()}`)} {/* Utilizar t() para traducir */}
          </a>
        ))}
      </div>

      {/* Menú horizontal visible solo en pantallas grandes */}
      <div className="menu-wrapper">
        {/* Flecha para desplazar el menú a la izquierda */}
        <div
          className="menu-arrow left-arrow"
          onClick={scrollLeft}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </div>

        {/* Contenedor del menú horizontal */}
        <div
          className={`horizontal-menu ${activeCategory ? 'hover' : ''}`}
          ref={menuRef}
          onMouseEnter={handleMouseEnter}
        >
          {categories.map((category) => (
            <a
              key={category}
              className={`menu-item ${activeCategory === category ? 'active' : ''}`}
              onMouseEnter={() => {
                setActiveCategory(category);
              }}
              onClick={() => navigate(`/${category}`)} // Usar navigate para cambiar la URL al hacer clic
            >
              {t(`categories.${category.toLowerCase()}`)} {/* Utilizar t() para traducir */}
            </a>
          ))}
        </div>

        {/* Flecha para desplazar el menú a la derecha */}
        <div
          className="menu-arrow right-arrow"
          onClick={scrollRight}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </div>
      </div>
    </>
  );
};

export default HorizontalMenu;
