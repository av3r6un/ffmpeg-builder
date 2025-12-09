const { defineConfig } = require('@vue/cli-service');
const webpack = require('webpack');

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? '/ffmpeg-builder/' : '/',
  css: {
    loaderOptions: {
      scss: {
        additionalData: '@import "@/assets/variables.scss";',
      },
    },
  },
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
      }),
    ],
  },
  devServer: {
    port: 3000,
  },
});
