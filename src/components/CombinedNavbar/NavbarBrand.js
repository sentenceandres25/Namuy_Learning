import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Navbar } from 'react-bootstrap';
import logo from '../../assets/images/logo1.png'; // Importa tu logo desde la carpeta assets

const NavbarBrand = () => {
  const { lang } = useParams(); // Obtener el parámetro lang de la URL
  
  return (
    <Navbar.Brand>
      <Link to={`/pages/HomePage/${lang}`} className="navbar-brand">
        <img 
          src={logo} 
          alt="Logo" 
          style={{ width: 'auto', height: '50px' }}  // Ajusta el tamaño según tus necesidades
        />
      </Link>
    </Navbar.Brand>
  );
};

export default NavbarBrand;
