import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
//import Icon from 'react-icons/fa';    
//'react-native-vector-icons/FontAwesome';
import { FaFontAwesome } from 'react-icons/fa';

const Header = ({ title }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
   <Icon name="bars" size={24} color="white" />
   <FaFontAwesome />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#009739',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Header;
