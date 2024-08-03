import React, { useState } from 'react';
//import './LoginForm.css'; // Importe o arquivo CSS

const LoginForm = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Lógica de autenticação aqui
    navigation('/dashboard');
  };

  return (
    <div className="container">
      <h1 className="title">Login no E-Learning Brasil</h1>
      <input
        className="input"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="input"
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="button" onClick={handleLogin}>Entrar</button>
    </div>
  );
};

export default LoginForm;
