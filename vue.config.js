const { defineConfig } = require('@vue/cli-service');
const webpack = require('webpack');

const ASSET_PATH = process.env.NODE_ENV === 'production' ? '/ffmpeg-builder/' : '/';

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: ASSET_PATH,
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
        'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH),
      }),
    ],
  },
  devServer: {
    port: 3000,
  },
});
