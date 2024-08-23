import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <nav className="footer-nav">
        <Link to="/" className="active">
          <i className="fas fa-home"></i>
          Home
        </Link>
        <Link to="/aulas">
          <i className="fas fa-book"></i>
          Aulas
        </Link>
        <Link to="/exercicios">
          <i className="fas fa-pencil-alt"></i>
          Exercícios
        </Link>
        <Link to="/redacao">
          <i className="fas fa-pen-fancy"></i>
          Redação
        </Link>
      </nav>
    </footer>
  );
};

export default Footer;