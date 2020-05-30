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
    <div
      v-if="!$store.state.user.hasLogin"
      class="blogger_wrap margin"
      @mouseenter="showMinelog = true"
    >
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
        <img class="avatar" :src="$store.state.user.avatar" alt />
      </div>
      <transition name="slide-fade">
        <ul v-show="showMineList" class="mineList" @mouseleave="showMineList = false">
          <li @click="myBlog">我的博客</li>
          <!-- <li>管理博客</li>
          <li>账号设置</li>-->
          <li @click="logout">退出</li>
        </ul>
      </transition>
    </div>
    <div v-if="$store.state.user.hasLogin" class="publish_wrap margin">
      <button title="发布">
        <svg-icon class="svg_icon" icon-class="publish" />
      </button>
      <el-badge :is-dot="hasNewMsg" class="item" style="padding-bottom: 5px; margin:0 10px 0 20px">
        <button @click="showNotice = true" title="消息" class="msg">
          <svg-icon class="svg_icon" style="font-size: 20px" icon-class="msg" />
        </button>
      </el-badge>
      <div class="noticeWrap" v-if="showNotice">
        <div class="header">通知</div>
        <span class="cancel" @click.stop="cancelNotice">
          <svg-icon class="svg_icon" icon-class="cancel" />
        </span>
        <div v-if="noticeArr.length !== 0">
          <div class="item" v-for="(item, index) in noticeArr" :key="index">
            <span class="dot" v-if="!item.hasRead"></span>
            <span class="logo">
              <svg-icon class="svg_icon" icon-class="garden" />
            </span>
            <span class="center">
              <svg-icon class="svg_icon" icon-class="liked" />
              有人点赞了您的评论：{{item.content}}
              <span class="time">{{item.time}}</span>
            </span>
            <span class="cover">
              <img :src="item.cover" alt />
            </span>
          </div>
        </div>
        <div v-else style="text-align:center;margin-bottom: 10px">暂无通知</div>
      </div>
    </div>
    <!-- <div class="search_wrap margin">
      <button title="搜索">
        <svg-icon class="svg_icon" icon-class="search" />
      </button>
    </div>-->

    <div class="logoWrap">
      <img class="logo" src="https://img-blog.csdnimg.cn/20200526232259333.png" alt />
    </div>
  </div>
</template>
<script>
import titlelog from '@/components/titlelog'
import loginORegis from '@/components/loginORegis'
import { updateNotice } from '@/api/notice'
export default {
  name: 'navbar',
  data () {
    return {
      showNotice: false,
      showMinelog: false,
      showMineList: false,
      noticeArr: [],
      trueNotice: [],
      hasNewMsg: false
    }
  },
  watch: {
    '$store.state.user.hasLogin' (newV) {
      // eslint-disable-next-line no-undef
      const socket = io('http://localhost:3000')
      const that = this // socket里面有个自己的this
      if (newV) {
        // 此处的this无法与数据双向绑定，也就是说无法及时跟新，所以暂时采用store全局保存
        socket.emit(
          'login',
          { blogId: that.$store.state.user.blogId },
          data => {}
        )
        socket.on('getNotice', function (data) {
          /* fetchList(this.$route.params.blogId).then(res => {
            this.noticeArr = res.data
          }) */
          if (data.code === 200) {
            if (data.msg.length !== 0) {
              // console.log(data.msg, 'data.msg')
              that.$store.dispatch('blog/setNoticeArr', data.msg.reverse())
              for (let i = 0; i < data.msg.length; i++) {
                if (data.msg[i].new) {
                  that.$store.dispatch('blog/setNewMsg', true)
                  return
                }
              }
            }
            // console.log(that.noticeArr)
          }
        })

        /* socket.on('getNotice', (data) => {
          console.log(data)
          socket.emit('my other event', { my: 'data' })
        }) */
      } else {
        socket.emit('logout')
      }
    },
    '$store.state.blog.noticeArr': {
      handler (newV) {
        this.noticeArr = newV
      },
      immediate: true,
      deep: true
    },
    '$store.state.blog.hasNewMsg': {
      handler (newV) {
        this.hasNewMsg = newV
      },
      immediate: true
    }
  },
  created () {
    /* if (this.$route.params.articleId) {
      console.log(this.$route.params.articleId)
      setInterval(() => {
        console.log(this.noticeArr)
      }, 2000)
    } */
  },
  computed: {
    showLogin0Regis () {
      return this.$store.state.app.showLogin0Regis
    },
    showLogin () {
      return this.$store.state.app.showLogin
    }
  },
  mounted () {
    this.$nextTick(function () {
      // console.log(this.$socket.emit, 'socket')
      /* this.$socket.on('checkLogin', function (data) {
        console.log('checkData', data)
      })
      this.$socket.emit('login', '客户端需要帮助了') */
      // eslint-disable-next-line no-undef
    })
  },
  methods: {
    cancelNotice () {
      this.showNotice = false
      for (let i = 0; i < this.noticeArr.length; i++) {
        if (this.noticeArr[i].new) {
          updateNotice({ _id: this.noticeArr[i]._id, new: false }).then(res => {
            this.$store.dispatch('blog/setNewMsg', false)
          })
        }
      }
    },
    connectWS () {},
    myBlog () {
      const userBlogId = this.$store.state.user.blogId
      if (userBlogId && userBlogId !== this.$route.params.blogId) {
        // 如果已经是user的博客首页那就不需要进行push了
        this.$router.push(`/${this.$store.state.user.blogId}`)
      }
    },
    login () {
      this.$store.dispatch('app/setLogin0Regis', true)
      this.$store.dispatch('app/setLogin', true)
    },
    register () {
      this.$store.dispatch('app/setLogin0Regis', true)
      this.$store.dispatch('app/setLogin', false)
    },
    logout () {
      this.$store.dispatch('user/logout').then(res => {
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
.navbar::before {
  content: "";
  display: inline-block;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: $navbarHeight;
  background-color: color(primary);
  opacity: 0.5;
  z-index: -1;
}
.navbar {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  height: $navbarHeight;
  display: flex;
  flex-direction: row-reverse;
  padding-right: 80px;
  .logoWrap {
    margin-right: 70%;
    margin-top: 8px;
    .logo {
      display: inline-block;
      width: 50px;
      height: 35px;
    }
  }
  button {
    background: none;
  }
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
    .showMsg {
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
      right: 50%;
      z-index: 100;
      width: 100px;
      text-align: center;
      box-shadow: $shadow;
      list-style: none;
      background: white;
      li {
        transition: background-color 0.2s;
        padding: 10px;
      }
      li:hover {
        cursor: pointer;
        background: color(primary);
        color: white;
      }
    }
  }
  .publish_wrap {
    position: relative;
    .noticeWrap {
      position: absolute;
      top: 135%;
      right: 15px;
      width: 450px;
      box-shadow: $shadow;
      background: white;
      border-radius: 10px;
      .header {
        margin: 0 10px 10px 10px;
        line-height: 50px;
        border-bottom: 1px solid #f3f3f3;
        position: relative;
      }
      .cancel {
        display: inline-block;
        position: absolute;
        right: 10px;
        top: 10px;
        cursor: pointer;
      }
      .item {
        max-height: 100px;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        line-height: 85px;
        padding: 10px;
        border-bottom: 1px solid #f3f3f3;
        cursor: pointer;
        .dot {
          display: inline-block;
          width: 5px;
          height: 5px;
          margin-top: 30px;
          border-radius: 50%;
          background: red;
        }
        .logo {
          vertical-align: top;
          margin-left: 10px;
          .svg-icon {
            font-size: 40px;
          }
        }
        .center {
          display: inline-block;
          width: 225px;
          margin: 0 10px;
          vertical-align: top;
          line-height: 20px;
          white-space: normal;
          font-size: 14px;
          .svg-icon {
            font-size: 12px;
          }
          .time {
            display: block;
            margin-top: 5px;
            color: gray;
            font-size: 12px;
          }
        }
        .cover {
          img {
            display: inline-block;
            width: 86px;
            height: auto;
          }
        }
      }
      .item:hover {
        background: #f3f3f3;
      }
    }
  }
}
</style>
