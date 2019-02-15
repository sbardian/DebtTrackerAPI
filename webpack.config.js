const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: path.join(__dirname, '/src/client/index.html'),
  filename: 'index.html',
  inject: 'body',
});

module.exports = {
  mode: 'development',
  entry: ['./src/client/index.js'],
  output: {
    path: path.join(__dirname, '/dist/client'),
    publicPath: '/',
    filename: 'index_bundle.js',
  },
  devServer: {
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
          },
        ],
      },
    ],
  },
  plugins: [HtmlWebpackPluginConfig],
};
