const Dotenv = require('dotenv-webpack');

const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
  runtimeCompiler: true,
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT',
      'Access-Control-Allow-Headers':
        'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    },
    proxy: {
      '/V1': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        pathRewrite: {
            '^/V1': ''
        }
    }
    }
  },
  configureWebpack: {
    plugins: [
      new Dotenv()
    ]
  }
})
