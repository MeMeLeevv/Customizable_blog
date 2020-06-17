/* eslint-disable quotes */
// vue.config.js
'use strict'
const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}

const config = {
  // 在v3.3之前，又叫 baseUrl,可以理解为项目的一个contextPath，默认为/, 如果你配置了为 yourProjectPath，那么在构建后，所有引用的路径都会带上 yourProjectPath
  publicPath: '/',
  // 当运行 vue-cli-service build 时生成的生产环境构建文件的目录。注意目标目录在构建之前会被清除 (构建时传入 --no-clean 可关闭该行为)。
  outputDir: 'dist',
  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
  assetsDir: 'static',
  /* 默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存。然而，这也要求 index 的 HTML 是被 Vue CLI 自动生成的。
  如果你无法使用 Vue CLI 生成的 index HTML，你可以通过将这个选项设为 false 来关闭文件名哈希。 */
  // filenameHashing: true,
  productionSourceMap: false,
  // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码。
  lintOnSave: process.env.NODE_ENV === 'development',
  // 选项...
  devServer: {
    port: 8000, // 端口号
    host: 'localhost',
    https: false, // https:{type:Boolean}
    open: false, // 配置自动启动浏览器
    overlay: { // 出现编译器错误或警告时，在浏览器中显示全屏覆盖。
      warnings: false,
      errors: true
    },
    hotOnly: true,
    proxy: {
      '/api': { //  跨域，这里假设有个api地址，前端请求时都要加上 /api/*** ，这里检测到有 /api 时就会执行这里，将 /api/*** 替换成 http://localhost:8080/***
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },

  chainWebpack (config) {
    // 添加别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('@assets', resolve('src/assets'))
      .set('@components', resolve('src/components'))
      .set('@router', resolve('src/router'))
      .set('@views', resolve('src/views'))
    // 删除预加载
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config
      // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('cheap-source-map')
      )

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
            // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({ /* Code Splitting——分离业务代码和第三方库（ vendor ）
              按需加载（利用 import() 语法）参考：https://zhuanlan.zhihu.com/p/26710831 */
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: { // 提取公共模块
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          config.optimization.runtimeChunk('single')
        }
      )
  },
  css: {
    // 提供了一个针对CSS预处理的统一配置入口，包括了Sass、Less等的
    loaderOptions: {
      // 默认情况下 `sass` 选项会同时对 `sass` 和 `scss` 语法同时生效
      // 因为 `scss` 语法在内部也是由 sass-loader 处理的
      // 但是在配置 `data` 选项的时候
      // `scss` 语法会要求语句结尾必须有分号，`sass` 则要求必须没有分号
      // 在这种情况下，我们可以使用 `scss` 选项，对 `scss` 语法进行单独配置
      // https://cli.vuejs.org/zh/guide/css.html#%E5%90%91%E9%A2%84%E5%A4%84%E7%90%86%E5%99%A8-loader-%E4%BC%A0%E9%80%92%E9%80%89%E9%A1%B9
      scss: {
        // @/ 是 src/ 的别名 切面式的注入了全局样式，以减少一些高频文件的引入重复工作。
        prependData: `@import "~@/styles/variables.scss";`
      }
    }
  }
}

// app.use('/', apiRoutes)
module.exports = config
