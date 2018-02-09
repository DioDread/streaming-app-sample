const path = require('path');
const HtmlPlugin = require('html-webpack-plugin');

module.exports = {
  entry: 'app.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '',
  },
  target: "electron",
  resolve: {
    modules: [
      path.join(__dirname, 'node_modules'),
      path.join(__dirname, 'src'),
    ],
    extensions: [
      '.js',
      '.jsx'
    ],
  },
  module: {
    rules: [{
      test: /.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
    }],
  },
  plugins:[
    new HtmlPlugin({
      template: 'index.html',
      inject: 'body',
    }),
  ],
};