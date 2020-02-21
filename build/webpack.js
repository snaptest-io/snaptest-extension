var paths = require('./paths.conf.js');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PACKAGE = require('../package.json') ;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require('webpack');

module.exports = {
  watch: process.env.WEBPACK_WATCH === "True",
  mode:  process.env.WEBPACK_MODE || "development",
  optimization: {
    minimize: process.env.WEBPACK_MINIFY === "True"
  },
  devtool: 'inline-source-map',
  entry: {
    tab: paths.srcPath + '/tab.jsx',
    background: paths.srcPath + '/session.jsx',
    popup: paths.srcPath + '/popup.jsx',
    window: paths.srcPath + '/window.jsx',
    devtool: paths.srcPath + '/devtool.jsx',
    injected: paths.srcPath + '/injected.js'
  },
  output: {
    path: paths.target,
    filename: '[name].js',
    chunkFilename: '[id].common.js'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      'react': 'react-lite',
      'react-dom': 'react-lite'
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      API_URL: JSON.stringify(process.env.API_URL),
      API_DOMAIN: JSON.stringify(process.env.API_DOMAIN),
      MARKETING_URL: JSON.stringify(process.env.MARKETING_URL),
      DB_PERSISTANCE: process.env.DB_PERSISTANCE === "True",
      SKIP_SPLASH: process.env.SKIP_SPLASH === "True"
    }),
    new CopyPlugin([
      { from: paths.assetsPath + "/images", to: paths.distPath + "/assets" },
      {
        from: paths.assetsPath,
        to: paths.distPath,
        ignore: [ "images/**/*", "manifest.json" ]
      }
    ]),
    new HtmlWebpackPlugin({
      title: PACKAGE.version,
      inject: false,
      template: "assets/manifest.ejs",
      filename: "manifest.json"
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ],
  module: {
    rules: [
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.jsx$|\.js/,
        exclude: /node_modules/,
        use: "babel-loader"
      }
    ]
  }
};