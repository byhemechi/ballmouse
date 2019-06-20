const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV,
  devtool: "sourcemap",
  entry: {
    flap: './src/flap.js',
    shootup: './src/shootup.js',
    stopboat: './src/stopboat.ts',
    menu: "./src/menu/entry.js"
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: "/dist/"
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'ts-loader'
        }
      }
    ]
  }
};