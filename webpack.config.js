var webpack = require("webpack");
var path = require("path");

module.exports = {
  cache: true,
  debug: false,
  entry: "./js/app-tmp.js",
  devtool: "source-map",
  output: {
    path: path.join(__dirname, "js"),
    filename: "bundle.js",
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: true,
      mangle: true,
      sourceMap: true
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/, exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query:
          {
            presets: ['react']
          }
      },
      {
        test: /\.scss$/,
        loader: "style!css!sass"
      }
    ]
  }
};
