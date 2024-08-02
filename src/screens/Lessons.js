import React from 'react';
import './Lessons.css'; // Importe o arquivo CSS
import { useNavigate } from 'react-router-dom';

const lessons = {
  'Matemática': {
    id: 'matematica',
    title: "Matemática",
    details: "Selecione uma aula para saber mais:\n1. Álgebra\n2. Geometria\n3. Trigonometria\n4. Cálculo\n5. Estatística\n6. Probabilidade\n7. Álgebra Linear\n8. Equações Diferenciais\n9. Números Complexos\n10. Teoria dos Números",
    subtopics: {
      '1': "+Conteúdo Enem de Álgebra.",
      '2': "+Conteúdo Enem de Geometria.",
      '3': "+Conteúdo Enem de Trigonometria.",
      '4': "+Conteúdo Enem de Cálculo.",
      '5': "+Conteúdo Enem de Estatística.",
      '6': "+Conteúdo Enem de Probabilidade.",
      '7': "+Conteúdo Enem de Álgebra Linear.",
      '8': "+Conteúdo Enem de Equações Diferenciais.",
      '9': "+Conteúdo Enem de Números Complexos.",
      '10': "+Conteúdo Enem de Teoria dos Números."
    }
  },
  'Linguagens': {
    id: 'linguagens',
    title: "Linguagens",
    details: "Selecione uma aula para saber mais:\n1. Português\n2. Inglês\n3. Literatura\n4. Técnicas de Escrita\n5. Gramática\n6. Fonética\n7. Semântica\n8. Sintaxe\n9. Interpretação de Texto\n10. Oratória",
    subtopics: {
      '1': "+Conteúdo Enem de Português.",
      '2': "+Conteúdo Enem de Inglês.",
      '3': "+Conteúdo Enem de Literatura.",
      '4': "+Conteúdo Enem de Técnicas de Escrita.",
      '5': "+Conteúdo Enem de Gramática.",
      '6': "+Conteúdo Enem de Fonética.",
      '7': "+Conteúdo Enem de Semântica.",
      '8': "+Conteúdo Enem de Sintaxe.",
      '9': "+Conteúdo Enem de Interpretação de Texto.",
      '10': "+Conteúdo Enem de Oratória."
    }
  },
  'Ciências Humanas': {
    id: 'humanas',
    title: "Ciências Humanas",
    details: "Selecione uma aula para saber mais:\n1. História\n2. Geografia\n3. Sociologia\n4. Filosofia\n5. Antropologia\n6. Ciência Política\n7. Economia\n8. Psicologia\n9. Direito\n10. Ética",
    subtopics: {
      '1': "+Conteúdo Enem de História.",
      '2': "+Conteúdo Enem de Geografia.",
      '3': "+Conteúdo Enem de Sociologia.",
      '4': "+Conteúdo Enem de Filosofia.",
      '5': "+Conteúdo Enem de Antropologia.",
      '6': "+Conteúdo Enem de Ciência Política.",
      '7': "+Conteúdo Enem de Economia.",
      '8': "+Conteúdo Enem de Psicologia.",
      '9': "+Conteúdo Enem de Direito.",
      '10': "+Conteúdo Enem de Ética."
    }
  },
  'Ciências da Natureza': {
    id: 'natureza',
    title: "Ciências da Natureza",
    details: "Selecione uma aula para saber mais:\n1. Física\n2. Química\n3. Biologia\n4. Astronomia\n5. Ciências da Terra\n6. Ciências Ambientais\n7. Genética\n8. Ecologia\n9. Geologia\n10. Oceanografia",
    subtopics: {
      '1': "+Conteúdo Enem de Física.",
      '2': "+Conteúdo Enem de Química.",
      '3': "+Conteúdo Enem de Biologia.",
      '4': "+Conteúdo Enem de Astronomia.",
      '5': "+Conteúdo Enem de Ciências da Terra.",
      '6': "+Conteúdo Enem de Ciências Ambientais.",
      '7': "+Conteúdo Enem de Genética.",
      '8': "+Conteúdo Enem de Ecologia.",
      '9': "+Conteúdo Enem de Geologia.",
      '10': "+Conteúdo Enem de Oceanografia."
    }
  },
  'Redação': {
    id: 'redacao',
    title: "Redação",
    details: "Selecione uma aula para saber mais:\n1. Escrevendo uma Redação\n2. Estrutura da Redação\n3. Tese\n4. Desenvolvimento de Argumentos\n5. Introdução e Conclusão\n6. Revisão\n7. Escrita Argumentativa\n8. Escrita Persuasiva\n9. Escrita Expositiva\n10. Escrita Narrativa",
    subtopics: {
      '1': "+Conteúdo Enem de Escrevendo uma Redação.",
      '2': "+Conteúdo Enem de Estrutura da Redação.",
      '3': "+Conteúdo Enem de Tese.",
      '4': "+Conteúdo Enem de Desenvolvimento de Argumentos.",
      '5': "+Conteúdo Enem de Introdução e Conclusão.",
      '6': "+Conteúdo Enem de Revisão.",
      '7': "+Conteúdo Enem de Escrita Argumentativa.",
      '8': "+Conteúdo Enem de Escrita Persuasiva.",
      '9': "+Conteúdo Enem de Escrita Expositiva.",
      '10': "+Conteúdo Enem de Escrita Narrativa."
    }
  }
};

const Lessons = () => {
  const navigate = useNavigate();

  const showChat = (topic, type = 'lesson') => {
    navigate('/chatbot', { state: { topic, type } });
  };

  return (
    <div className="container">
      <h1 className="title">Aulas</h1>
      {Object.keys(lessons).map((topic) => (
        <div
          key={lessons[topic].id}
          className="lessonItem"
          onClick={() => showChat(topic, 'lesson')}
        >
          <h2 className="lessonTitle">{lessons[topic].title}</h2>
          <p className="lessonDetails">{lessons[topic].details}</p>
        </div>
      ))}
      <button className="button" onClick={() => navigate(-1)}>Voltar</button>
    </div>
  );
};

export default Lessons;
