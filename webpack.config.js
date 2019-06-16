const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV,
  devtool: "sourcemap",
  entry: {
    flap: './src/flap.js',
    shootup: './src/shootup.js',
    stopboat: './src/stopboat.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: "/dist/"
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-class-properties']
          }
        }
      }
    ]
  }
};