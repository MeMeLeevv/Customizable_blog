<template>
  <div class="loginORegis" @click="$emit('hideL0RPage')">
    <div class="center" @click.stop="">
      <div class="relative">
        <login v-if="showLogin" key="login" class="abso" @changeRegis="$emit('update:showLogin', false)"></login>
        <register v-if="!showLogin" class="abso" key="register" @changeLogin="$emit('update:showLogin', true)"></register>
      </div>
    </div>
  </div>
</template>
<script>
import login from '@/components/loginORegis/components/login.vue'
import register from '@/components/loginORegis/components/register.vue'

export default {
  name: 'loginORegis',
  props: {
    showLogin: Boolean
  },
  data () {
    return {
      showMinelog: false
    }
  },
  created () {},
  computed: {},
  mounted () {},
  methods: {
    register () {}
  },
  components: {
    login,
    register
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
.loginORegis {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 200;
  width: 100vw;
  height: 100vh;
  background: rgba($color: #000000, $alpha: 0.5);
  .center {
    width: 300px;
    min-height: 440px;
    padding: 50px 10px 30px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 20px;
    background: url(../../assets/images/loginBg.png) no-repeat;
    background-size: cover;
    .relative {
      position: relative;
      .abs {
        position: absolute;
      }
    }
  }
}
</style>
