<template>
  <div class="headlines">
    <div class="wrap1" style="height: 580px;">
      <!-- 背景图不使用background-size(只有cover/contain/100% 100%)，展示效果不好 -->
      <div class="bg">
        <img
          style="height: 580px;"
          src="https://static1.squarespace.com/static/5e85fd5635ceb4455319720e/t/5e8bf6287a32914c2768573b/1562688063139/20140301_Trade-151_0124-copy.jpg?format=2500w"
          alt
        />
      </div>
      <div class="content_wrapper" style="padding-top: 50px">
        <editor></editor>
      </div>
    </div>
  </div>
</template>
<script>
import editor from '../editor'
export default {
  name: 'headlines',
  data () {
    return {
    }
  },
  watch: {},
  created () {},
  computed: {
  },
  mounted () {
    this.$nextTick(function () {
      // 编辑器样式初始化

    })
  },
  methods: {
  },
  beforeDestroy () {},
  components: { editor }
}
</script>
<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s linear;
}
.fade-enter, .fade-leave-to
/* .slide-fade-leave-active 用于 2.1.8 以下版本 */ {
  opacity: 0;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: transform 0.2s linear;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active 用于 2.1.8 以下版本 */ {
  transform: translateY(-5px);
  opacity: 0;
}

.headlines {
  .wrap1 {
    position: relative;
    .bg {
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      img {
        display: inline-block;
        width: 100%;
        height: 100%;
        object-position: 50% 50%;
        object-fit: cover;
      }
    }
    .content_wrapper {
      .is-hidden {
        opacity: 1;
      }
      .is-focused {
        opacity: 1;
      }
    }
  }
}
</style>
