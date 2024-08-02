import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Importe o arquivo CSS

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1 className="title">Painel de Controle</h1>
      <button className="button" onClick={() => navigate('Lessons')}>Aulas</button>
      <button className="button" onClick={() => navigate('Exercises')}>Exercícios</button>
      <button className="button" onClick={() => navigate('Chatbot')}>Chatbot</button>
      <button className="button" onClick={() => navigate('Profile')}>Perfil</button>
      <button className="button" onClick={() => navigate('redacao')}>Redação</button>
    </div>
  );
};

export default Dashboard;
