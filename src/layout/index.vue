<template>
  <div class="Layout" ref="layout">
    <transition name="left-fade">
      <router-view v-if="!configNow"  class="sidebar" />
      <router-view v-else class="sidebar" name="second" />
    </transition>

    <div class="main" ref="main">
      <transition v-if="isBlogger" name="slide-fade">
        <div class="triangle" v-show="triangleShow" @click.stop="shrink">
          <svg-icon class="shrink" icon-class="fullArrow" />
        </div>
      </transition>
      <toolbar @fullpage="fullpage" />

      <router-view name="main" />
    </div>
  </div>
</template>
<script>
import toolbar from '@/layout/toolbar'
import scssVar from '@/styles/variables.scss'
export default {
  name: 'Layout',
  data () {
    return {
      triangleShow: false,
      isBlogger: false,
      configNow: false
    }
  },
  watch: {
    '$store.state.blog.blogWasFresh': {
      handler (val) {
        this.$refs.main.scrollTop = this.$store.state.blog.scrollTop
        this.$store.dispatch('blog/setBlogFresh', false)
      }
    },
    '$store.state.user.isBlogger': {
      handler (val) {
        this.isBlogger = val
      },
      immediate: true
    },
    '$store.state.user.configNow': {
      handler (val) {
        this.configNow = val
      },
      immediate: true
    }
  },
  created () {
  },
  computed: {},
  mounted () {
    window.addEventListener('scroll', this.menu, true)

    this.$nextTick(function () {
      this.fullpage()
    })
  },
  methods: {
    menu () {
      // this.scroll = document.body.scrollTop === 0 ? document.documentElement.scrollTop : document.body.scrollTop
      if (this.$refs.main !== undefined) {
        const scrollTop = this.$refs.main.scrollTop
        if (scrollTop !== 0) {
          this.$store.dispatch('blog/setScrollTop', scrollTop)
        }
      }

      // this.scroll = this.$store.state.blog.scrollTop
      // console.log(this.scroll)
    },
    fullpage () {
      setTimeout(() => {
        this.$store.dispatch('blog/setFullPage', true)
      }, 100)
      this.$refs.main.style.top = `-${scssVar.toolbarHeight}`
      this.$refs.main.style.right = '0px'
      this.$refs.main.style.width = '100%'
      this.$refs.main.style.height = `calc(100% + ${scssVar.toolbarHeight})`
      this.triangleShow = true
    },
    shrink () {
      setTimeout(() => {
        this.$store.dispatch('blog/setFullPage', false)
      }, 100)
      this.$refs.main.style.top = scssVar.pagePadding
      this.$refs.main.style.right = scssVar.pagePadding
      this.$refs.main.style.width = 'calc(100% - 412px)'
      this.$refs.main.style.height = `calc(100% - ${scssVar.page2Padding})`
      this.triangleShow = false
    }
  },
  components: {
    toolbar
  }
}
</script>
<style lang="scss" scoped>
.left-fade-enter-active,.left-fade-leave-active {
  position: absolute;
  transition: all .4s ease;
}
.left-fade-enter, .left-fade-leave-to
/* .slide-fade-leave-active 用于 2.1.8 以下版本 */ {
  transform: translateX(10px);
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all .8s ease-in;
}
.slide-fade-leave-active {
  transition: all .2s ease-out;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active 用于 2.1.8 以下版本 */ {
  transform: translate(10px, 10px);
  opacity: 0;
}
.Layout {
  width: 100%;
  min-height: 100vh;
  position: relative;
  background-image: url(../assets/images/bg.png);
  background-repeat: no-repeat;
  background-size: cover;
  color: $font_color;
  .sidebar {
    width: 396px;
    height: 100%;
    padding: $page2Padding;
    padding-bottom: 16px;
    overflow: hidden;
  }
  .main {
    width: calc(100% - 412px);
    height: calc(100% - 32px);
    position: absolute;
    top: $pagePadding;
    right: $pagePadding;
    background-color: white;
    box-shadow: $shadow;
    transition: width 0.3s, height 0.3s, top 0.3s, left 0.3s;
    z-index: 10;
    overflow-y: auto;
    .triangle {
      position: fixed;
      top: -55px;
      right: -55px;
      z-index: 200;
      width: 0px;
      height: 0px;
      border: 55px solid transparent;
      border-left: 55px solid white;
      box-shadow: -5px 0 6px -4px rgba(0, 0, 0, 0.11);
      transform: rotate(-45deg);
      .shrink {
        position: absolute;
        top: -14px;
        left: -43px;
        transition: left 0.5s;
        font-size: 22px;
        font-weight: 600;
        transform: rotate(45deg);
      }
    }
    .triangle:hover {
      cursor: pointer;
      .shrink {
        left: -48px;
      }
    }
  }
}
</style>
