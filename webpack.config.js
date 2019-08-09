const path = require('path');

module.exports = {
  resolve: {
    extensions: ['.ts', '.js']
  },
  mode: process.env.NODE_ENV,
  devtool: "sourcemap",
  entry: {
    flap: './src/flap.ts',
    stopboat: './src/stopboat.ts',
    menu: "./src/menu/entry.ts",
    dino: "./src/dino.ts"
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: "/dist/"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'ts-loader'
        }
      }
    ]
  }
};