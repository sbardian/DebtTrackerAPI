/**
 * Created by sbardian on 12/11/16.
 */

'use strict'
let webpack = require('webpack');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + '/src/client/index.html',
  filename: 'index.html',
  inject: 'body'
});

module.exports = {
  entry: [
    './src/client/index.js'
  ],
  output: {
    path: __dirname + '/dist/client',
    publicPath: '/',
    filename: "index_bundle.js"
  },
  devServer: {
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
    }
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test:   /\.css$/,
        loader: 'style-loader!css-loader',
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader'
      }
    ],
  },
  plugins: [
    HtmlWebpackPluginConfig,
    new webpack.EnvironmentPlugin(['DebtTrackerAPI'])
  ]
};
