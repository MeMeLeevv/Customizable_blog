<template>
  <div class="index">
    <bloggerMsgCard></bloggerMsgCard>
  </div>
</template>
<script>
import bloggerMsgCard from '@/layout/bloggerMsgCard/index'

export default {
  name: 'index',
  data () {
    return {
    }
  },
  watch: {
  },
  created () {
  },
  computed: {},
  mounted () {},
  methods: {
  },
  components: {
    bloggerMsgCard
  }
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

.index {
  overflow-x: hidden;
  min-height: calc(
    100% - 105px
  ); /* 这里的高度可能会随屏幕大小而改动！！！记得切换设备试试 */
}
</style>
