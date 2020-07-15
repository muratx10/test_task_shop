const path = require('path');
const nodeExternals = require('webpack-node-externals');

const config = {
  mode: 'production',
  entry: './index.js',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  externals: nodeExternals(),
};

module.exports = config;
