/**
 * webpack configs
 */

import path from 'path'
import glob from 'glob'

const pkgs = glob.sync('./src/*.js')
      .filter(s => !/index/.test(s))
      .map(s => path.basename(s, path.extname(s)))

export default [{
  mode: process.env.NODE_ENV,
  target: 'node',
  node: false,
  entry: pkgs.reduce((acc, pkg) => {
    acc[pkg] = path.resolve(`./src/${pkg}.js`)
    return acc
  }, {}),
  optimization: {
    minimize: false
  },
  output: {
    path: path.resolve('.'),
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [{
      test: /.js$/,
      use: 'babel-loader',
      sideEffects: false
    }]
  },
  plugins: [

  ],
  externals: [
    '@babel/core'
  ]
},{
  mode: process.env.NODE_ENV,
  target: 'node',
  node: false,
  entry: {
    ['index']: path.resolve('src/index.js')
  },
  optimization: {
    minimize: false
  },
  output: {
    path: path.resolve('.'),
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [{
      test: /.js$/,
      use: 'babel-loader',
      sideEffects: false
    }]
  },
  plugins: [

  ],
  externals: [
    '@babel/core',
  ].concat(pkgs.map(s => `./${s}`))
}]
