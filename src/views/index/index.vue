<template>
  <div class="index">
    <div class="navbar">
      <div class="blogger_wrap margin">
        <button title="mine" @click="showMinelog = true">
          <svg-icon class="svg_icon" icon-class="avatar" />
        </button>
        <transition name="slide-fade">
          <titlelog :show="showMinelog" @updateShow="val => showMinelog = val" title="欢迎使用" class="titlelog" />
        </transition>
      </div>
      <div class="publish_wrap margin">
        <button title="publish">
          <svg-icon class="svg_icon" icon-class="publish" />
        </button>
      </div>
      <div class="search_wrap margin">
        <button title="search">
          <svg-icon class="svg_icon" icon-class="search" />
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import titlelog from '@/components/titlelog'

export default {
  name: 'index',
  data () {
    return {
      showMinelog: false
    }
  },
  created () {},
  computed: {},
  mounted () {},
  methods: {},
  components: {
    titlelog
  }
}
</script>
<style lang="scss" scoped>
.slide-fade-enter-active,.slide-fade-leave-active  {
  transition: transform .2s linear;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active 用于 2.1.8 以下版本 */ {
  transform: translateX(5px);
  opacity: 0;
}
.index {
  .navbar {
    height: 50px;
    display: flex;
    flex-direction: row-reverse;
    padding-right: 80px;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0.3),
      rgba(168, 194, 248, 0.3)
    );
    .margin {
      margin: 10px;
    }
    .svg_icon {
      font-size: 24px;
    }
    .blogger_wrap {
      position: relative;
      .titlelog {
        position: absolute;
        top: 200%;
        right: 0;
      }
    }
  }
}
</style>
