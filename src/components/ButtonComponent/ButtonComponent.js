import React from 'react';
import './ButtonComponent.css';

const ButtonComponent = ({ text, link }) => {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer">
      <button className="custom-button">
        {text}
      </button>
    </a>
  );
};

export default ButtonComponent;
