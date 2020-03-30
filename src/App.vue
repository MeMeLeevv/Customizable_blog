<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { asyncRoutes } from '@/router'
import { Message } from 'element-ui'

export default {
  name: 'App',
  data () {
    return {
    }
  },
  watch: {
    '$route' (to, from) { // 记录路由的来源和去路,及时修改路由index.js对应路由下main的component
      this.from = from.path
      this.to = to.path
      if (!this.$store.state.user.hasLogin && this.to.indexOf('config') !== -1) {
        Message({
          message: '抱歉，您暂无权限访问，请登录！',
          type: 'error',
          duration: 5 * 1000
        })
        this.$router.push('/error/403')
      }
    },
    '$store.state.user.hasLogin': function (newV) {
      if (newV) {
        console.log(asyncRoutes, 'asyncRoutes')
        this.$router.addRoutes(asyncRoutes)
      }
    }
  },
  methods: {
  },
  created () {
    // 首次加载查询是否session过期，否则在store里储存全局用户信息
    this.$store.dispatch('user/firstShow').then(() => {
    }).catch(err => {
      console.log(new Error(err))
    })
    /* setTimeout(() => { // 定时器,created执行一秒后触发
      window.L2Dwidget.init({
        pluginRootPath: 'live2dw/', // 指向你的目录
        pluginJsPath: 'lib/', // 指向你的目录··
        pluginModelPath: 'live2d-widget-model-nico/assets/', // 中间这个koharu就是你的老婆,想换个老婆,换这个就可以了
        tagMode: false,
        debug: false,
        model: { jsonPath: '/live2dw/live2d-widget-model-nico/assets/nico.model.json' }, // 中间这个koharu就是你的老婆,想换个老婆,换这个就可以了
        display: { position: 'right', width: 150, height: 300 }, // 调整大小,和位置
        mobile: { show: true }, // 要不要盯着你的鼠标看
        log: false
      })
    }, 300) */
  }
}
</script>

<style lang="scss" scoped>

</style>
