<template>
  <div id="app" :class="usingFontName">
    <live2d v-if="closeModel && showLive && !hideModel" :editState.sync="editState" @updateModel="updateModel" :showModel="showModel" @changeLive2d="showlive2d"></live2d>
    <router-view />
  </div>
</template>

<script>
import { asyncRoutes } from '@/router'
import { Message } from 'element-ui'
import live2d from '@/components/live2d/live2d'

export default {
  name: 'App',
  data () {
    return {
      usingFontName: this.$store.state.app.fontFamily,
      hideModel: false,
      closeModel: this.$store.state.live2d.close,
      showLive: true,
      editState: false, // 模型是否处于编辑状态
      showModel: this.$store.state.live2d.model, // 默认的模型
      models: [] // 可用模型
    }
  },
  created () {
    this.$store.state.live2d.models.forEach(item => {
      this.models.push(item.value)
    })
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
  },
  mounted () {
    this.$nextTick(function () {
    })
  },
  watch: {
    '$store.state.app.fontFamily' (newV, oldV) {
      if (newV !== oldV) {
        this.usingFontName = newV
      }
    },
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
      if (this.to === '/config/Design/Cartoons') {
        // 在设置页面虽然能调用此组件地updateModel，但并没有产生更新，于是设置页面也插入live2d组件（操作直接作用于它），此时这个页面的live2d组件要隐藏
        this.hideModel = true
      } else {
        this.hideModel = false
        // console.log(this.$store.getters.model, 'this.$store.state.live2d.model')
      }
    },
    '$store.state.live2d.model': function (newV) {
      this.showModel = newV
    },
    '$store.state.live2d.close': function (newV) {
      this.closeModel = newV
    },
    '$store.state.user.hasLogin': function (newV) {
      if (newV) {
        console.log(asyncRoutes, 'asyncRoutes')
        this.$router.addRoutes(asyncRoutes)
      }
    }
  },
  methods: {
    updateModel () {
      this.showLive = false
      setTimeout(() => {
        this.showLive = true
      }, 100)
    },
    showlive2d () {
      this.showLive = false
      let index = this.models.indexOf(this.showModel)
      if (index === this.models.length - 1) { // 切换时index + 1
        index = 0
      }
      this.showModel = this.models[index + 1]
      setTimeout(() => {
        this.showLive = true
      }, 100)
    }
  },
  components: {
    live2d
  }
}
</script>

<style lang="scss">
/* html,body{
    cursor: url(/static/strawberry.ico),auto; // 文件地址需放在static中，不能放在assets里，
} */
</style>
