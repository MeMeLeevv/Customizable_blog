<template>
  <div class="navbar">
    <transition name="slide-fade">
      <loginORegis
        v-if="showLogin0Regis"
        :showLogin="showLogin"
        v-on:update:showLogin="$store.dispatch('app/setLogin', $event)"
        @hideL0RPage="$store.dispatch('app/setLogin0Regis', false)"
      ></loginORegis>
    </transition>
    <div v-if="!$store.state.user.hasLogin" class="blogger_wrap margin"  @mouseenter="showMinelog = true">
      <button title="我的">
        <svg-icon class="svg_icon" icon-class="avatar" />
      </button>
      <transition name="slide-fade">
        <titlelog
          :show="showMinelog"
          @updateShow="val => showMinelog = val"
          title="欢迎使用"
          button1="登录"
          button2="注册"
          @clickBtn1="login"
          @clickBtn2="register"
          class="titlelog"
        />
      </transition>
    </div>
    <div v-else class="blogger_wrap margin" @mouseenter="showMineList = true">
      <div class="showMsg">
        <img class="avatar" :src="$store.state.user.avatar" alt="">
      </div>
      <transition name="slide-fade">
        <ul v-show="showMineList" class="mineList" @mouseleave="showMineList = false">
          <li>我的博客</li>
          <li>管理博客</li>
          <li>账号设置</li>
          <li @click="logout">退出</li>
        </ul>
      </transition>
    </div>
    <div v-if="$store.state.user.hasLogin" class="publish_wrap margin">
      <button title="发布">
        <svg-icon class="svg_icon" icon-class="publish" />
      </button>
    </div>
    <div class="search_wrap margin">
      <button title="搜索">
        <svg-icon class="svg_icon" icon-class="search" />
      </button>
    </div>
  </div>
</template>
<script>
import titlelog from '@/components/titlelog'
import loginORegis from '@/components/loginORegis'

export default {
  name: 'navbar',
  data () {
    return {
      showMinelog: false,
      showMineList: false
    }
  },
  created () {},
  computed: {
    showLogin0Regis () {
      return this.$store.state.app.showLogin0Regis
    },
    showLogin () {
      return this.$store.state.app.showLogin
    }
  },
  mounted () {},
  methods: {
    login () {
      this.$store.dispatch('app/setLogin0Regis', true)
      this.$store.dispatch('app/setLogin', true)
    },
    register () {
      this.$store.dispatch('app/setLogin0Regis', true)
      this.$store.dispatch('app/setLogin', false)
    },
    logout () {
      this.$store.dispatch('user/logout').then((res) => {
        // console.log(res, 'logout')
      })
    }
  },
  components: {
    titlelog,
    loginORegis
  }
}
</script>
<style lang="scss" scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: transform 0.2s linear;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active 用于 2.1.8 以下版本 */ {
  transform: translateX(5px);
  opacity: 0;
}
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
    .showMsg{
      .avatar {
        display: inline-block;
        width: 30px;
        height: 30px;
        border-radius: 50%;
      }
    }
    .showMsg:hover {
      cursor: pointer;
    }
    .mineList {
      padding: 0;
      margin: 0;
      position: absolute;
      top: 130%;
      right:50%;
      width: 100px;
      text-align: center;
      box-shadow: $shadow;
      list-style: none;
      li {
        transition: background-color .2s;
        padding: 10px;
      }
      li:hover {
        cursor: pointer;
        background: $darkMColor;
        color: white;
      }
    }
  }
}
</style>
