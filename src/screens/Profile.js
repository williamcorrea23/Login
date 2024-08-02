import React from 'react';
import './Profile.css'; // Importe o arquivo CSS

const Profile = ({ navigation }) => {
  return (
    <div className="container">
      <h1 className="title">Perfil</h1>
      <button className="button" onClick={() => navigation.goBack()}>Voltar</button>
    </div>
  );
};

export default Profile;
