const resolve = require('path').resolve // eslint-disable-line

const config = {
  entry: {
    main: resolve(__dirname, './src/index.ts')
  },

  resolve: {
    modules: [resolve(__dirname, 'lib'), 'node_modules', 'build'],
    extensions: ['.ts', '.js', 'vue', '.json'],
    alias: {
      '~': __dirname,
      '@': __dirname,
      'src': resolve(__dirname, 'src')
    }
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules|build/,
        loader: 'babel-loader'
      },
      {
        test: /\.vue$/,
        exclude: /node_modules|build/,
        loader: 'vue-loader'
      },
      {
        test: /\.ts$/,
        exclude: /node_modules|build/,
        loader: 'ts-loader'
      }
    ]
  }
}

module.exports = config
