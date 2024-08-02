import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

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
  const navigation = useNavigation();

  const showChat = (topic, type = 'lesson') => {
    navigation.navigate('Chatbot', { topic, type });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aulas</Text>
      {Object.keys(lessons).map((topic) => (
        <TouchableOpacity
          key={lessons[topic].id}
          style={styles.lessonItem}
          onPress={() => showChat(topic, 'lesson')}
        >
          <Text style={styles.lessonTitle}>{lessons[topic].title}</Text>
          <Text style={styles.lessonDetails}>{lessons[topic].details}</Text>
        </TouchableOpacity>
      ))}
      <Button title="Voltar" onPress={() => navigation.goBack()} color="#009739" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  lessonItem: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  lessonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  lessonDetails: {
    fontSize: 16,
  },
});

export default Lessons;