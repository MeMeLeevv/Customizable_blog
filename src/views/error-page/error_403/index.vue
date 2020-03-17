<template>
  <div class="error">
    <div class="center" @click.stop="">
      <svg-icon class="main" icon-class="403" />
      <h1>抱歉，您暂无权限访问此页面哦</h1>
      <div class="bottom">
        <span class="item back" @click="login"><svg-icon icon-class="avatar" /> 登录</span>
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
  watch: {
    '$store.state.user.hasLogin': function (newV) {
      if (newV) {
        this.$router.go(-1) // 返回上一层
      }
    }
  },
  created () {},
  computed: {},
  mounted () {},
  methods: {
    login () {
      this.$store.dispatch('app/setLogin0Regis', true)
      this.$store.dispatch('app/setLogin', true)
    }
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
