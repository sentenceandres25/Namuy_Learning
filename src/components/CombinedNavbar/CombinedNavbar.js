import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import NavbarBrand from './NavbarBrand';
import SearchBar from './SearchBar';
import LanguageCurrencyDropdown from './LanguageCurrencyDropdown';
import IconLinks from './IconLinks';
import HorizontalMenu from './HorizontalMenu';
import SubcategoryMenu from './SubcategoryMenu';
import ProductMenu from './ProductMenu';
import { categories } from '../data/categories';
import { subcategoryImages } from '../data/subcategoryImages';
import { products } from '../data/products';
import { productImages } from '../data/productImages';
import { useLanguageCurrency } from './hooks/useLanguageCurrency'; // Importar el hook personalizado
import './CombinedNavbar.css';

const CombinedNavbar = () => {
  // Estados locales
  const [isHovering, setIsHovering] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado del menú hamburguesa

  // Referencias para elementos del DOM
  const menuRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Hook personalizado para idioma y moneda
  const { currentLanguage, handleLanguageChange, currency, handleCurrencyChange } = useLanguageCurrency();
  
  // Hooks de traducción y navegación
  const { t, i18n } = useTranslation('categoriesData');
  const { lang } = useParams();
  const navigate = useNavigate(); // Agregar navigate para manejar la navegación

  // Estados para búsqueda y categoría
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(t('AllCategories'));
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Manejo de hover en menú
  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    setActiveCategory(null);
  };

  // Manejo de búsqueda
  const handleCategoryChange = (eventKey) => setCategory(eventKey);
  const handleSearchChange = (e) => setSearch(e.target.value);
  const handleSearch = (e) => {
    e.preventDefault();
    console.log(`Buscando "${search}" en la categoría "${category}"`);
  };

  // Funciones para scroll en el menú horizontal
  const scrollLeft = () => {
    if (menuRef.current) {
      menuRef.current.scrollBy({ left: -menuRef.current.offsetWidth / 10, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    if (menuRef.current) {
      menuRef.current.scrollBy({ left: menuRef.current.offsetWidth / 10, behavior: 'smooth' });
    }
  };

  // Intersection Observer para animaciones al hacer scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.fade-in-section').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  // Activación de la barra de búsqueda
  useEffect(() => {
    if (isSearchActive && searchContainerRef.current) {
      searchContainerRef.current.classList.add('is-search-active');
    } else if (searchContainerRef.current) {
      searchContainerRef.current.classList.remove('is-search-active');
    }
  }, [isSearchActive]);

  // Cambiar idioma basado en parámetros de la URL
  useEffect(() => {
    setCategory(t('AllCategories'));
  }, [t]);

  useEffect(() => {
    if (lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  // Función para alternar el estado del menú hamburguesa
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <div className="header-component fade-in-section" ref={searchContainerRef}>
        <div className="header-inner" ref={searchContainerRef}>
          <NavbarBrand />
          <div className="menu-container">
            <SearchBar
              category={category}
              handleCategoryChange={handleCategoryChange}
              handleSearch={handleSearch}
              handleSearchChange={handleSearchChange}
              search={search}
              toggleSearch={() => setIsSearchActive(!isSearchActive)}
            />
          </div>
          <LanguageCurrencyDropdown
            currentLanguage={currentLanguage}
            handleLanguageChange={handleLanguageChange}
            handleCurrencyChange={handleCurrencyChange}
          />
          <div className="icon-container">
            <IconLinks t={t} />
          </div>
        </div>

        {/* Navbar con menú horizontal y hamburguesa */}
        <div className="my-navbar fade-in-section" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <div className="my-navbar-inner">
            <HorizontalMenu
              categories={Object.keys(categories)}
              activeCategory={activeCategory}
              handleMouseEnter={handleMouseEnter}
              handleMouseLeave={handleMouseLeave}
              setActiveCategory={setActiveCategory}
              scrollLeft={scrollLeft}
              scrollRight={scrollRight}
              menuRef={menuRef}
              menuOpen={isMenuOpen} // Pasar el estado del menú
              toggleMenu={toggleMenu} // Pasar la función para alternar el menú
              navigate={navigate} // Pasar navigate para manejar la navegación
            />

            {/* Subcategoría y menú de productos */}
            {activeCategory && (
              <div className="my-dropdown" onMouseLeave={handleMouseLeave}>
                <div className="vertical-menu">
                  {Object.keys(categories).map((category) => (
                    <div
                      key={category}
                      className={`menu-item ${activeCategory === category ? 'active' : ''}`}
                      onMouseEnter={() => setActiveCategory(category)}
                      onClick={() => setActiveCategory(category)}
                    >
                      {/* Corregir el acceso a la clave de traducción */}
                      {t(`categories.${category.toLowerCase()}`)}
                    </div>
                  ))}
                </div>
                <h4>{t('Subcategories')}</h4> {/* Traducción del título de subcategorías */}
                <SubcategoryMenu
                  categories={categories}
                  activeCategory={activeCategory}
                  subcategoryImages={subcategoryImages}
                  setActiveSubcategory={setActiveSubcategory}
                  t={t}  // Pasar t para traducir las subcategorías
                />

                <h4>{t('Products')}</h4> {/* Título para productos */}
                <ProductMenu
                  activeSubcategory={activeSubcategory}
                  products={products}
                  productImages={productImages}
                />
              </div>
            )}
          </div>
        </div>

        {/* Fondo del menú cuando está abierto */}
        <div className={`menu-backdrop ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}></div>
      </div>
    </Suspense>
  );
};

export default CombinedNavbar;
