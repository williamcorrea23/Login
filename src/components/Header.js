import React from 'react';
import './Header.css'; // Importe o arquivo CSS
import { FaBars } from 'react-icons/fa';

const Header = ({ title }) => {
  return (
    <header className="header">
      <h1 className="title">{title}</h1>
      <FaBars className="icon" />
    </header>
  );
};

export default Header;
