var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'app/public/');
var APP_DIR = path.resolve(__dirname, 'app/');

var config = {
  entry: {
    ui: (APP_DIR + '/index.jsx'),
  },
  output: {
    filename: 'bundle.js'
  },

  watchOptions: {
    poll: 2500
  },

  module: {
   loaders: [
     {
       test: /\.jsx?/,
       include: APP_DIR,
       loader: 'babel'
     },
     {
       test: /\.js?/,
       include: APP_DIR,
       loader: 'babel'
     },
   ]
 }
};

module.exports = config;
