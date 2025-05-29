const path = require('path')

module.exports = {
  entry: './src/router.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  optimization: {
    minimize: false
  },
  devtool: 'source-map',
  mode: 'none'
}
