const webpack = require('webpack');
const path = require('path');

module.exports = {
  resolve: {
    alias: {
      'react-native$': 'react-native-web'
    }
  }
};