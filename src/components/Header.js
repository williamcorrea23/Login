import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ title }) => {
  return (
    <header className="header">
      <h1>{title}</h1>
      <nav>
        <Link to="/">Dashboard</Link>
        <Link to="/aulas">Aulas</Link>
        <Link to="/exercicios">Exercícios</Link>
        <Link to="/redacao">Redação</Link>
      </nav>
    </header>
  );
};

export default Header;