import React, { useState, useEffect } from 'react';
import './Redacao.css'; // Importe o arquivo CSS
import axios from 'axios';

const Redacao = ({ navigation }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const [temas, setTemas] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);

  useEffect(() => {
    const mockTemas = [
      'Tema 1: Tecnologia e Sociedade',
      'Tema 2: Meio Ambiente e Sustentabilidade',
      'Tema 3: Educação e Desenvolvimento',
    ];
    setTemas(mockTemas);
  }, []);

  useEffect(() => {
    let interval = null;
    if (timerActive) {
      interval = setInterval(() => {
        setCountdown(prevCountdown => {
          if (prevCountdown <= 1) {
            clearInterval(interval);
            setTimerActive(false);
            alert('Tempo esgotado!');
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 60000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const handleSubmit = async () => {
    const lines = conteudo.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 7) {
      alert('Erro: A redação deve ter pelo menos 7 linhas.');
      return;
    }
    if (lines.length > 30) {
      alert('Erro: A redação deve ter no máximo 30 linhas.');
      return;
    }

    const analysis = await analyzeRedacao(conteudo);
    setAnalysisResult(analysis);
    alert('Sucesso: Redação enviada para análise!');
  };

  const analyzeRedacao = async (conteudo) => {
    const apiKey = 'sk-redacao-JqmO1mKUUN0tTRA6L1jqT3BlbkFJCN7vu2sC1EoP7AxqMGyG'; // Substitua pela sua chave de API OpenAI
    const endpoint = 'https://api.openai.com/v1/chat/completions';
    const prompt = `Analise a seguinte redação do ENEM: "${conteudo}"`;

    try {
      const response = await axios.post(
        endpoint,
        {
          model: "gpt-3.5-turbo-0613",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 850,
          temperature: 0.7,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
        }
      );

      if (response.data.choices && response.data.choices.length > 0) {
        return response.data.choices[0].message.content.trim();
      }

      return 'Resposta inesperada da API.';
    } catch (error) {
      console.error('Erro na requisição:', error);
      return 'Erro ao chamar o assistente GPT.';
    }
  };

  const startTimer = () => {
    setTimerActive(true);
  };

  return (
    <div className={`container ${darkMode ? 'darkMode' : ''}`}>
      <div className="toggleContainer">
        <span className="toggleText">Alternar Tema Escuro</span>
        <label className="switch">
          <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
          <span className="slider round"></span>
        </label>
      </div>
      <h1 className="title">Redação do ENEM</h1>
      <div className="instructions">
        <strong>Instruções:</strong>
        <p>1. Escreva seu rascunho no espaço abaixo.</p>
        <p>2. O texto final deve ter até 30 linhas.</p>
        <p>3. Cópias de textos serão desconsideradas.</p>
        <p>4. Receberá nota zero se:</p>
        <p>- Tiver menos de 7 linhas.</p>
        <p>- Fugir do tema ou não for dissertativo-argumentativo.</p>
        <p>- Tiver partes desconectadas do tema.</p>
      </div>
      <div className="formGroup">
        <p>Temas Anteriores do ENEM:</p>
        {temas.map((tema, index) => (
          <p key={index}>{tema}</p>
        ))}
      </div>
      <input
        className="input"
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />
      <textarea
        className="textarea"
        placeholder="Conteúdo"
        rows="10"
        value={conteudo}
        onChange={(e) => setConteudo(e.target.value)}
      />
      <button className="button" onClick={handleSubmit}>Enviar para Análise</button>
      {analysisResult && (
        <div className="analysisResult">
          <h2 className="analysisTitle">Análise da Redação:</h2>
          <p>{analysisResult}</p>
        </div>
      )}
      <div className="timer">
        <p>Definir contagem regressiva (minutos):</p>
        <input
          className="input"
          type="number"
          value={countdown}
          onChange={(e) => setCountdown(parseInt(e.target.value, 10))}
        />
        <button className="button" onClick={startTimer}>Iniciar</button>
        <p>{countdown} minutos restantes</p>
      </div>
      <button className="button" onClick={() => navigation.goBack()}>Voltar</button>
    </div>
  );
};

export default Redacao;
