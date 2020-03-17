<template>
  <div class="error">
    <div class="center" @click.stop="">
      <svg-icon class="main" icon-class="404" />
      <h1>哎呀，您访问的页面不翼而飞啦</h1>
      <div class="bottom">
        <span class="item back" @click="$router.go(-1)"><svg-icon icon-class="back" /> 返回上一页</span>
        <span class="item index"><svg-icon icon-class="index" /> 网站首页</span>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'error',
  props: {
  },
  data () {
    return {
    }
  },
  created () {},
  computed: {},
  mounted () {},
  methods: {
  },
  components: {
  }
}
</script>
<style lang="scss" scoped>
.error {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
  width: 100vw;
  height: 100vh;
  background: white;
  .center {
    width: 500px;
    padding: 50px 10px 30px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    font-weight: 600;
    .main {
      font-size: 100px
    }
    .bottom {
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      .item:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
