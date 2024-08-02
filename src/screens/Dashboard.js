import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Importe o arquivo CSS

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1 className="title">Painel de Controle</h1>
      <button className="button" onClick={() => navigation.navigate('Lessons')}>Aulas</button>
      <button className="button" onClick={() => navigation.navigate('Exercises')}>Exercícios</button>
      <button className="button" onClick={() => navigation.navigate('Chatbot')}>Chatbot</button>
      <button className="button" onClick={() => navigation.navigate('Profile')}>Perfil</button>
      <button className="button" onClick={() => navigation.navigate('Redacao')}>Redação</button>
    </div>
  );
};

export default Dashboard;
