import { useState, useEffect } from 'react';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [enemData, setEnemData] = useState(null);

  useEffect(() => {
    const userDocRef = doc(db, "Users", user.uid);
    const enemDataRef = collection(userDocRef, "EnemData");

    const loadUserData = async () => {
      try {
        const userDoc = await getDoc(userDocRef);
        setUser(userDoc.data());

        const enemDataQuery = await getDocs(enemDataRef);
        const enemDataDocs = enemDataQuery.docs;
        const enemData = enemDataDocs[0].data();
        setEnemData(enemData);
      } catch (error) {
        console.error(error);
      }
    };

    loadUserData();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      {user && (
        <div>
          <h2>Informações do Usuário</h2>
          <p>Email: {user.email}</p>
          <p>Nome: {user.firstName}</p>
        </div>
      )}
      {enemData && (
        <div>
          <h2>Dados do Enem</h2>
          <p>Espanhol: {enemData.espanhol.acertos} acertos, {enemData.espanhol.erros} erros</p>
          <p>Inglês: {enemData.Ingles.acertos} acertos, {enemData.Ingles.erros} erros</p>
          <p>Língua Portuguesa: {enemData.ling.acertos} acertos, {enemData.ling.erros} erros</p>
          <p>Matemática: {enemData.matematica.acertos} acertos, {enemData.matematica.erros} erros</p>
          <p>Ciências Humanas: {enemData.cienciasHumanas.acertos} acertos, {enemData.cienciasHumanas.erros} erros</p>
          <p>Ciências da Natureza: {enemData.cienciasDaNatureza.acertos} acertos, {enemData.cienciasDaNatureza.erros} erros</p>
          <p>Redação: {enemData.redacao.notaTotal} nota total, {enemData.redacao.redacoesFeitas} redações feitas</p>
        </div>
      )}
    </div>
  );
};
