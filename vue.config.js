const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
  runtimeCompiler: true,
  devServer: {
    proxy: {
      '/V1': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        pathRewrite: {
            '^/V1': ''
        }
    }
    }
}
})
