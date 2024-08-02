import React, { useState } from 'react';
import './Exercises.css'; // Importe o arquivo CSS
import axios from 'axios';

const Exercises = ({ navigation }) => {
  const [subject, setSubject] = useState('Ciências Humanas');
  const [numQuestions, setNumQuestions] = useState('15');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);

  const generateQuestions = async () => {
    // Lógica para gerar questões usando ChatGPT
    const prompt = `Gerar ${numQuestions} questões de ${subject} com 4 opções cada e a resposta correta indicada.`;
    const generatedQuestions = await callGPTAssistant(prompt);
    setQuestions(generatedQuestions);
  };

  const submitAnswers = async () => {
    // Lógica para verificar respostas usando ChatGPT
    const prompt = `Verifique as respostas fornecidas: ${JSON.stringify(answers)} para as questões: ${JSON.stringify(questions)}. Retorne a pontuação total.`;
    const verificationResult = await callGPTAssistant(prompt);
    setResults(verificationResult);
  };

  const callGPTAssistant = async (prompt) => {
    const apiKey = 'sk-redacao-JqmO1mKUUN0tTRA6L1jqT3BlbkFJCN7vu2sC1EoP7AxqMGyG'; // Substitua pela sua chave de API OpenAI
    const endpoint = 'https://api.openai.com/v1/chat/completions';

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
        const generatedText = response.data.choices[0].message.content.trim();
        // Parse the generated text to extract questions and answers
        const parsedResult = parseResult(generatedText);
        return parsedResult;
      }

      return 'Resposta inesperada da API.';
    } catch (error) {
      console.error('Erro na requisição:', error);
      return 'Erro ao chamar o assistente GPT.';
    }
  };

  const parseResult = (text) => {
    // Lógica para parsear o texto gerado pelo ChatGPT em objetos de questões ou resultados de verificação
    try {
      const parsed = JSON.parse(text);
      return parsed;
    } catch (error) {
      console.error('Erro ao parsear resultado:', error);
      return text;
    }
  };

  return (
    <div className="container">
      <h1 className="title">Gerador de Questões</h1>
      <select
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="picker"
      >
        <option value="Ciências Humanas">Ciências Humanas</option>
        <option value="Ciências Naturais">Ciências Naturais</option>
        <option value="Linguagens">Linguagens</option>
        <option value="Matemática">Matemática</option>
        <option value="Língua Inglesa">Língua Inglesa</option>
        <option value="Língua Espanhola">Língua Espanhola</option>
        <option value="Redação">Redação</option>
      </select>
      <input
        type="number"
        placeholder="Número de Questões"
        value={numQuestions}
        onChange={(e) => setNumQuestions(e.target.value)}
        className="input"
      />
      <button onClick={generateQuestions} className="button">Gerar Questões</button>
      {questions.length > 0 && (
        <div>
          {questions.map(q => (
            <div key={q.id} className="questionContainer">
              <p className="questionText">{q.question}</p>
              {q.options.map(option => (
                <button
                  key={option}
                  onClick={() => setAnswers({ ...answers, [q.id]: option })}
                  className="button"
                >
                  {option}
                </button>
              ))}
            </div>
          ))}
          <button onClick={submitAnswers} className="button">Enviar Respostas</button>
        </div>
      )}
      {results && (
        <div className="resultsContainer">
          <p className="resultsText">{results}</p>
        </div>
      )}
      <button onClick={() => navigation.goBack()} className="button">Voltar</button>
    </div>
  );
};

export default Exercises;
