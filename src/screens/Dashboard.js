import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const Dashboard = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Painel de Controle</Text>
      <Button title="Aulas" onPress={() => navigation.navigate('Lessons')} color="#009739" />
      <Button title="Exercícios" onPress={() => navigation.navigate('Exercises')} color="#009739" />
      <Button title="Chatbot" onPress={() => navigation.navigate('Chatbot')} color="#009739" />
      <Button title="Perfil" onPress={() => navigation.navigate('Profile')} color="#009739" />
      <Button title="Redação" onPress={() => navigation.navigate('Redacao')} color="#009739" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default Dashboard;
