// Aulas.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc, increment } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDwNC4QWaBQYqvayl98oMArcGdYV0JuqSk",
  authDomain: "elearning-568mbq.firebaseapp.com",
  projectId: "elearning-568mbq",
  storageBucket: "elearning-568mbq.appspot.com",
  messagingSenderId: "956581108104",
  appId: "1:956581108104:web:2be9a9b0c5978cd4b3823d",
  measurementId: "G-WLB4FBXE9R"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const apiKey = env.apikey;

const subjects = {
  Matemática: {
    id: "matematica",
    title: "Matemática",
    details: "Selecione uma aula para saber mais:\n1. Geometria Plana\n2. Geometria Espacial\n3. Álgebra\n4. Funções\n5. Estatística\n6. Probabilidade\n7. Matemática Financeira\n8. Trigonometria\n9. Análise Combinatória\n10. Números Complexos\n11. Polinômios\n12. Progressões\n13. Matrizes e Determinantes\n14. Sistemas Lineares\n15. Geometria Analítica",
    subtopics: {
      1: "Geometria Plana: Áreas e perímetros de figuras planas, teorema de Tales, semelhança de triângulos, relações métricas no triângulo retângulo.",
      2: "Geometria Espacial: Volumes e áreas de superfície de sólidos geométricos, poliedros, cilindros, cones e esferas.",
      3: "Álgebra: Equações e inequações de 1º e 2º graus, sistemas de equações, fatoração.",
      4: "Funções: Funções afim, quadrática, exponencial, logarítmica e modular. Gráficos e propriedades.",
      5: "Estatística: Medidas de tendência central, medidas de dispersão, interpretação de gráficos e tabelas.",
      6: "Probabilidade: Espaço amostral, eventos, probabilidade condicional, distribuição binomial.",
      7: "Matemática Financeira: Porcentagem, juros simples e compostos, descontos, taxas.",
      8: "Trigonometria: Relações trigonométricas no triângulo retângulo, funções trigonométricas, equações trigonométricas.",
      9: "Análise Combinatória: Princípio fundamental da contagem, permutações, combinações, arranjos.",
      10: "Números Complexos: Operações com números complexos, forma algébrica e trigonométrica.",
      11: "Polinômios: Operações com polinômios, teorema do resto, teorema fundamental da álgebra.",
      12: "Progressões: Progressões aritméticas e geométricas, termo geral, soma dos termos.",
      13: "Matrizes e Determinantes: Operações com matrizes, propriedades dos determinantes.",
      14: "Sistemas Lineares: Resolução de sistemas lineares, regra de Cramer, escalonamento.",
      15: "Geometria Analítica: Ponto, reta, circunferência, cônicas no plano cartesiano."
    }
  },
  Linguagens: {
    id: "linguagens",
    title: "Linguagens",
    details: "Selecione uma aula para saber mais:\n1. Interpretação de Texto\n2. Gêneros Textuais\n3. Figuras de Linguagem\n4. Funções da Linguagem\n5. Variação Linguística\n6. Morfologia\n7. Sintaxe\n8. Semântica\n9. Literatura Brasileira\n10. Literatura Portuguesa\n11. Movimentos Literários\n12. Intertextualidade\n13. Coesão e Coerência\n14. Argumentação\n15. Língua Estrangeira (Inglês/Espanhol)",
    subtopics: {
      1: "Interpretação de Texto: Análise de textos diversos, identificação de ideias principais e secundárias, inferências.",
      2: "Gêneros Textuais: Características e estruturas de diversos gêneros como artigo de opinião, editorial, crônica, conto.",
      3: "Figuras de Linguagem: Metáfora, metonímia, hipérbole, prosopopeia, antítese, entre outras.",
      4: "Funções da Linguagem: Referencial, emotiva, conativa, fática, metalinguística e poética.",
      5: "Variação Linguística: Variações regionais, sociais, históricas e estilísticas da língua portuguesa.",
      6: "Morfologia: Classes gramaticais, estrutura e formação de palavras.",
      7: "Sintaxe: Análise sintática, concordância verbal e nominal, regência, crase.",
      8: "Semântica: Significado das palavras, ambiguidade, polissemia, homonímia, paronímia.",
      9: "Literatura Brasileira: Principais autores e obras da literatura brasileira.",
      10: "Literatura Portuguesa: Principais autores e obras da literatura portuguesa.",
      11: "Movimentos Literários: Características e contexto histórico dos principais movimentos literários.",
      12: "Intertextualidade: Relações entre textos, paráfrase, paródia, citação.",
      13: "Coesão e Coerência: Mecanismos de coesão textual, construção de textos coerentes.",
      14: "Argumentação: Técnicas argumentativas, tipos de argumentos, construção de argumentos sólidos.",
      15: "Língua Estrangeira: Interpretação de textos em inglês ou espanhol, vocabulário e estruturas básicas."
    }
  },
  "Ciências Humanas": {
    id: "humanas",
    title: "Ciências Humanas",
    details: "Selecione uma aula para saber mais:\n1. História do Brasil Colônia\n2. História do Brasil Império\n3. História do Brasil República\n4. História Antiga\n5. História Medieval\n6. História Moderna\n7. História Contemporânea\n8. Geografia Física do Brasil\n9. Geografia Humana do Brasil\n10. Geopolítica Mundial\n11. Filosofia Antiga e Medieval\n12. Filosofia Moderna e Contemporânea\n13. Sociologia Clássica\n14. Sociologia Contemporânea\n15. Atualidades",
    subtopics: {
      1: "História do Brasil Colônia: Descobrimento, ciclos econômicos, sociedade colonial.",
      2: "História do Brasil Império: Independência, Primeiro e Segundo Reinados, escravidão.",
      3: "História do Brasil República: Proclamação da República, Era Vargas, Ditadura Militar, redemocratização.",
      4: "História Antiga: Civilizações mesopotâmicas, Egito, Grécia e Roma antigas.",
      5: "História Medieval: Feudalismo, Império Bizantino, Islã, Cruzadas.",
      6: "História Moderna: Renascimento, Grandes Navegações, Reforma Protestante, Absolutismo.",
      7: "História Contemporânea: Revolução Francesa, Revolução Industrial, Guerras Mundiais, Guerra Fria.",
      8: "Geografia Física do Brasil: Relevo, clima, hidrografia, vegetação.",
      9: "Geografia Humana do Brasil: População, urbanização, industrialização, agricultura.",
      10: "Geopolítica Mundial: Globalização, blocos econômicos, conflitos internacionais.",
      11: "Filosofia Antiga e Medieval: Filósofos gregos, patrística, escolástica.",
      12: "Filosofia Moderna e Contemporânea: Racionalismo, empirismo, idealismo, existencialismo.",
      13: "Sociologia Clássica: Marx, Durkheim, Weber.",
      14: "Sociologia Contemporânea: Movimentos sociais, desigualdade, cultura e identidade.",
      15: "Atualidades: Principais acontecimentos políticos, econômicos e sociais recentes."
    }
  },
  "Ciências da Natureza": {
    id: "natureza",
    title: "Ciências da Natureza",
    details: "Selecione uma aula para saber mais:\n1. Mecânica\n2. Termologia\n3. Óptica\n4. Ondulatória\n5. Eletromagnetismo\n6. Química Geral\n7. Físico-Química\n8. Química Orgânica\n9. Bioquímica\n10. Citologia\n11. Genética\n12. Evolução\n13. Ecologia\n14. Fisiologia Humana\n15. Biotecnologia",
    subtopics: {
      1: "Mecânica: Cinemática, dinâmica, estática, gravitação universal.",
      2: "Termologia: Temperatura, calor, termodinâmica, gases.",
      3: "Óptica: Reflexão, refração, lentes, instrumentos ópticos.",
      4: "Ondulatória: Ondas mecânicas e eletromagnéticas, som.",
      5: "Eletromagnetismo: Eletrostática, eletrodinâmica, magnetismo.",
      6: "Química Geral: Estrutura atômica, tabela periódica, ligações químicas.",
      7: "Físico-Química: Soluções, termoquímica, cinética química, equilíbrio químico.",
      8: "Química Orgânica: Funções orgânicas, isomeria, reações orgânicas.",
      9: "Bioquímica: Proteínas, carboidratos, lipídios, ácidos nucleicos.",
      10: "Citologia: Estrutura celular, organelas, metabolismo celular.",
      11: "Genética: Leis de Mendel, genética molecular, biotecnologia.",
      12: "Evolução: Teorias evolutivas, evidências da evolução, especiação.",
      13: "Ecologia: Ecossistemas, ciclos biogeoquímicos, relações ecológicas, biomas.",
      14: "Fisiologia Humana: Sistemas do corpo humano, homeostase.",
      15: "Biotecnologia: Engenharia genética, clonagem, organismos transgênicos."
    }
  },
  Redação: {
    id: "redacao",
    title: "Redação",
    details: "Selecione uma aula para saber mais:\n1. Estrutura do Texto Dissertativo-Argumentativo\n2. Introdução\n3. Desenvolvimento\n4. Conclusão\n5. Tese e Argumentação\n6. Coesão Textual\n7. Coerência Textual\n8. Repertório Sociocultural\n9. Proposta de Intervenção\n10. Tipos de Argumento\n11. Análise de Temas Anteriores\n12. Uso da Norma Culta\n13. Evitando Erros Comuns\n14. Estratégias de Planejamento\n15. Técnicas de Revisão",
    subtopics: {
      1: "Estrutura do Texto Dissertativo-Argumentativo: Organização em introdução, desenvolvimento e conclusão.",
      2: "Introdução: Técnicas para apresentar o tema e a tese de forma eficaz.",
      3: "Desenvolvimento: Estratégias para elaborar parágrafos argumentativos sólidos.",
      4: "Conclusão: Métodos para retomar a tese e apresentar uma proposta de intervenção.",
      5: "Tese e Argumentação: Como formular uma tese clara e desenvolver argumentos consistentes.",
      6: "Coesão Textual: Uso de conectivos e elementos de ligação para dar fluidez ao texto.",
      7: "Coerência Textual: Manutenção da unidade temática e progressão das ideias.",
      8: "Repertório Sociocultural: Incorporação de conhecimentos de outras áreas para enriquecer a argumentação.",
      9: "Proposta de Intervenção: Elaboração de soluções viáveis e detalhadas para o problema apresentado.",
      10: "Tipos de Argumento: Exploração de diferentes tipos de argumentos (autoridade, exemplificação, causa e consequência).",
      11: "Análise de Temas Anteriores: Estudo dos temas das edições passadas do ENEM e suas abordagens.",
      12: "Uso da Norma Culta: Aplicação correta das regras gramaticais e ortográficas.",
      13: "Evitando Erros Comuns: Identificação e prevenção de erros frequentes nas redações do ENEM.",
      14: "Estratégias de Planejamento: Técnicas para organizar as ideias antes de começar a escrever.",
      15: "Técnicas de Revisão: Métodos eficazes para revisar e aprimorar o texto final."
    }
  }
};

const Aulas = () => {
  const [currentSubject, setCurrentSubject] = useState("");
  const [currentTopic, setCurrentTopic] = useState("");
  const [currentSubtopic, setCurrentSubtopic] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const checkAuthState = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          console.log("Usuário não está logado. Redirecionando para a página de login.");
          window.location.href = '/index.html';
        }
      });
    };

    checkAuthState();
  }, []);

  const checkSaldoMensagens = async (userId) => {
    try {
      const docRef = doc(db, "Users", userId);
      const docSnap = await getDoc(docRef);

     if (docSnap.exists()) {
        const userData = docSnap.data();
        const saldoMensagens = userData.saldo_mens || 0;
        const lastMessageDateStr = userData.lastMessageDate;

        const today = new Date();
        let lastMessageDate = lastMessageDateStr ? new Date(lastMessageDateStr) : null;

        const isNewDay = lastMessageDate ? (today.getDate() !== lastMessageDate.getDate() || today.getMonth() !== lastMessageDate.getMonth() || today.getFullYear() !== lastMessageDate.getFullYear()) : true;

        if (isNewDay) {
          const updatedSaldo = 50;
          await updateDoc(docRef, {
            saldo_mens: updatedSaldo,
            lastMessageDate: today.toISOString()
          });
          return true;
        } else if (saldoMensagens <= 0) {
          alert('Você atingiu o limite diário de mensagens.');
          return false;
        } else {
          await updateDoc(docRef, {
            saldo_mens: increment(-1)
          });
          return true;
        }
      } else {
        alert('Usuário não encontrado.');
        return false;
      }
    } catch (error) {
      console.error("Erro ao verificar o saldo de mensagens: " + error.message);
      return false;
    }
  };

  const handleSubjectClick = (subject) => {
    setCurrentSubject(subject);
    setCurrentTopic("");
    setCurrentSubtopic("");
    setChatMessages([]);
  };

  const handleTopicClick = (topic) => {
    setCurrentTopic(topic);
    setCurrentSubtopic("");
    setChatMessages([]);
  };

  const handleSubtopicClick = (subtopic) => {
    setCurrentSubtopic(subtopic);
    startLesson(subtopic);
  };

  const startLesson = async (subtopic) => {
    if (await checkSaldoMensagens(userId)) {
      const message = `Inicie uma aula sobre ${currentSubject}: ${currentTopic} - ${subtopic}.`;
      const response = await getAIResponse(message);
      setChatMessages([{ role: 'ai', content: response }]);
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === "") return;

    const userMessage = { role: 'user', content: inputMessage };
    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage("");

    if (await checkSaldoMensagens(userId)) {
      const aiResponse = await getAIResponse(inputMessage);
      setChatMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
    } else {
      setChatMessages(prev => [...prev, { role: 'ai', content: "Desculpe, você não tem saldo suficiente para continuar." }]);
    }
  };

  const getAIResponse = async (message) => {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `Você é um professor interativo especializado em ${currentSubject}. Seu objetivo é ensinar o tópico ${currentTopic} - ${currentSubtopic} de forma envolvente e clara.`
            },
            {
              role: "user",
              content: message
            }
          ],
          max_tokens: 4000,
          temperature: 0.5
        })
      });

      if (!response.ok) {
        throw new Error("Falha na chamada da API");
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Erro ao obter resposta da IA:", error);
      return "Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.";
    }
  };

  return (
    <div className="container">
      <h1>Aulas</h1>
      <div className="subject-buttons">
        {Object.entries(subjects).map(([key, value]) => (
          <button
            key={value.id}
            className={`subject-button ${currentSubject === key ? 'active' : ''}`}
            onClick={() => handleSubjectClick(key)}
          >
            {value.title}
          </button>
        ))}
      </div>
      {currentSubject && (
        <div className="topic-list">
          <h2>{subjects[currentSubject].title}</h2>
          <p>{subjects[currentSubject].details}</p>
          {Object.entries(subjects[currentSubject].subtopics).map(([key, value]) => (
            <div
              key={key}
              className="topic-item"
              onClick={() => handleTopicClick(value)}
            >
              <i className="fas fa-book"></i> {value}
            </div>
          ))}
        </div>
      )}
      {currentTopic && (
        <div className="subtopic-list">
          <h3>{currentTopic}</h3>
          {Object.entries(subjects[currentSubject].subtopics).map(([key, value]) => (
            <div
              key={key}
              className="subtopic-item"
              onClick={() => handleSubtopicClick(value)}
            >
              <i className="fas fa-chevron-right"></i> {value.split(":")[0]}
            </div>
          ))}
        </div>
      )}
      <div className="chat-container">
        <div className="chat-messages">
          {chatMessages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}-message`}>
              {msg.content}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
          />
          <button onClick={handleSendMessage}>Enviar</button>
        </div>
      </div>
    </div>
  );
};

export default Aulas;