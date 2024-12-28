import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Button.css'; // Asegúrate de que el path sea correcto y que el archivo CSS exista

const Button = ({ text, onClick }) => {
    return (
        <button className="btn btn-primary btn-lg" onClick={onClick}>
            {text}
        </button>
    );
};

export default Button;
