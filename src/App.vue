<template>
  <div id="app" :class="usingFontName">
    <live2d
      v-if="live2d && live2d.show && showLive && !hideModel"
      :editState.sync="editState"
      @updateModel="updateModel"
      :showModel="live2d.showModel"
      @changeLive2d="showlive2d"
      v-bind:live2d.sync="live2d"
    ></live2d>
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
import { asyncRoutes } from '@/router'
import { storeLocalData, getLocalData } from '@/utils'

// import { Message } from 'element-ui'
import live2d from '@/components/live2d/live2d'
import { getInfoByBlogId } from '@/api/user'
// import { getBlogSetting } from '@/api/blog'
export default {
  name: 'App',
  provide () {
    return { reload: this.reload }
  },
  data () {
    return {
      isRouterAlive: true,
      isBlogger: false,
      live2d: {},
      firstLoad: true,
      usingFontName: this.$store.state.blog.blogSetting.fontStyle,
      hideModel: false,
      closeModel: this.$store.state.live2d.close,
      showLive: true,
      editState: false, // 模型是否处于编辑状态
      models: [] // 可用模型
    }
  },
  created () {
    this.$store.state.live2d.models.forEach(item => {
      this.models.push(item.value)
    })
    // 首次加载查询是否session过期，否则在store里储存全局用户信息
    this.$store
      .dispatch('user/firstShow')
      .then(() => {})
      .catch(err => {
        console.log(new Error(err))
      })
  },
  mounted () {
    window.addEventListener('scroll', this.appScroll, true)

    this.$nextTick(function () {
    })
  },
  watch: {
    '$store.state.blog.blogSetting': {
      handler: function (val) {
        if (!val) return
        this.blogSetting = val
        this.live2d = val.live2d
        this.$set(this.live2d, 'width', val.live2d.width)
        this.$set(this.live2d, 'height', val.live2d.height)
        this.$set(this.live2d, 'left', val.live2d.left)
        this.$set(this.live2d, 'top', val.live2d.top)
        this.$set(this.live2d, 'show', val.live2d.show)
        this.$set(this.live2d, 'showModel', val.live2d.showModel)
        this.firstLoad = false
        // console.log('updateBlogger', val)
        this.updateModel()
      },
      deep: true
    },
    live2d: {
      handler: function (val) {
        const blogSetting = this.$store.state.blog.blogSetting
        blogSetting.live2d = val
        this.$store.dispatch('blog/setBlogSetting', blogSetting)
      },
      immediate: true,
      deep: true

    },
    '$store.state.blog.blogSetting.theme': {
      handler (newV) {
        document.body.style.setProperty('--color-primary', newV)
      },
      immediate: true
    },
    '$store.state.blog.blogSetting.fontStyle' (newV, oldV) {
      if (newV !== oldV) {
        this.usingFontName = newV
      }
    },
    $route: { // 注意不要使用箭头函数，他没有自己的this和args
      handler: function (to, from) { /* 设置页面也储存blogId吧！这样就可以统一了~~~~~~~~~~~~ */
      // 记录路由的来源和去路,及时修改路由index.js对应路由下main的component
        if (to.params.blogId) { // 如果存在blogId，则在本地存储，以便刷新时用到
          storeLocalData([['blogId', to.params.blogId]])
        }
        this.to = to.path
        // const that = this
        if (to.params.blogId) {
        // 如果存在blogId ,则去获取
          // // console.log(to.params.blogId, '如果存在blogId, 则去获取')
          // getBlogSetting(to.params.blogId)
          getInfoByBlogId(to.params.blogId).then(res => {
          // that.$store.dispatch('blog/setUserInfo', res.data)
          })
        } else {
        // 如果没有，先去看看有没有有没有登录，登录的话可能是在config状态，那么信息卡呈现已登录用户信息
        /* if (this.$store.state.user.hasLogin) { // 直接在store中获取需要的用户数据
          } */
        }
        if (this.to === '/') {
          console.log('to == /')
          if (getLocalData(['blogId']).length[0]) { // 这里是为了预防刷新时路由会自动变成‘/’,此时需要取出blogId
            this.$router.push(`/${getLocalData(['blogId'])[0]}`)
          } else {
            this.$router.push('/tCqtL_yo9') // 否则默认路由为‘/tCqtL_yo9’
          }
        }
        /* if (
          !this.$store.state.user.hasLogin && // hasLogin会有延迟，！！！！
        this.to.indexOf('config') !== -1
        ) {
          Message({
            message: '抱歉，您暂无权限访问，请登录！',
            type: 'error',
            duration: 5 * 1000
          })
          this.$router.push('/error/403')
        } */
        if (this.to.indexOf('/config/Design/Cartoons') !== -1) {
        // 在设置页面虽然能调用此组件地updateModel，但并没有产生更新，于是设置页面也插入live2d组件（操作直接作用于它），此时这个页面的live2d组件要隐藏
          this.hideModel = true
        } else {
          this.hideModel = false
        // // console.log(this.$store.getters.model, 'this.$store.state.live2d.model')
        }
      },
      immediate: true
    },
    '$store.state.user.hasLogin': function (newV) {
      if (newV) {
        // console.log(asyncRoutes, 'asyncRoutes')
        this.$router.addRoutes(asyncRoutes)
      }
    },
    '$store.state.user.blogId': { // 设置博主状态
      handler (val) {
        this.$store.dispatch('user/setBlogger', this.$route.params.blogId === val)
      },
      immediate: true
    },
    '$route.params.blogId': { // 设置博主状态
      handler (val) {
        this.$store.dispatch('user/setBlogger', this.$store.state.user.blogId === val)
      },
      immediate: true
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    },
    updateModel () {
      this.showLive = false
      setTimeout(() => {
        this.showLive = true
      }, 100)
    },
    showlive2d () {
      this.showLive = false
      let index = this.models.indexOf(this.blogSetting.live2d.showModel)
      if (index === this.models.length - 1) {
        // 切换时index + 1
        index = 0
      }
      this.blogSetting.live2d.showModel = this.models[index + 1]
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
