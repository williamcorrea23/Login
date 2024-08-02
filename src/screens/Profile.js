import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const Profile = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <Button title="Voltar" onPress={() => navigation.goBack()} color="#009739" />
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

export default Profile;