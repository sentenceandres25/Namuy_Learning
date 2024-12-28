import React from 'react';
import { NavDropdown, Form, FormControl, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next'; // Importar el hook useTranslation
import './SearchBar.css';

const SearchBar = ({
  category,
  handleCategoryChange,
  handleSearch,
  handleSearchChange,
  search,
}) => {
  const { t } = useTranslation('categoriesData'); // Usar el hook de traducción

  return (
    <div className="search-and-category d-flex">
      {/* Dropdown para seleccionar categorías */}
      <NavDropdown
        title={category}
        id="navbarScrollingDropdown"
        onSelect={handleCategoryChange}
      >
        <NavDropdown.Item eventKey="allCategories">{t('AllCategories')}</NavDropdown.Item>
        <NavDropdown.Item eventKey="ropa">{t('categories.ropa')}</NavDropdown.Item>
        <NavDropdown.Item eventKey="ninos">{t('categories.ninos')}</NavDropdown.Item>
        <NavDropdown.Item eventKey="ninas">{t('categories.ninas')}</NavDropdown.Item>
        <NavDropdown.Item eventKey="mujeres">{t('categories.mujeres')}</NavDropdown.Item>
        <NavDropdown.Item eventKey="hombres">{t('categories.hombres')}</NavDropdown.Item>
        <NavDropdown.Item eventKey="perros">{t('categories.perros')}</NavDropdown.Item>
        <NavDropdown.Item eventKey="gatos">{t('categories.gatos')}</NavDropdown.Item>
        <NavDropdown.Item eventKey="otros">{t('categories.otros')}</NavDropdown.Item>
      </NavDropdown>

      {/* Formulario de búsqueda */}
      <Form className="d-flex" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
        <FormControl
          type="search"
          placeholder={t('searchText')} // Traducir el texto del placeholder
          className="mr-2"
          aria-label="Buscar"
          onChange={handleSearchChange}
          value={search}
        />
        <Button variant="outline-success" type="submit">
          <FontAwesomeIcon icon={faSearch} className="fa-search" />
        </Button>
      </Form>
    </div>
  );
};

export default SearchBar;
