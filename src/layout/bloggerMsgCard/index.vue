
<template>
  <!-- 是否可以将此卡片放在layout组件中，这样就不用每添加一个页面就要加这个组件了 -->
  <div
    :class="`bloggerMsgCard personalCart ${showPersonalCart ? 'showCart' : ''}`"
    @mouseenter="$store.state.app.isEditState && !editState && (showMap = true)"
    @mouseleave="$store.state.app.isEditState && !editState && (showMap = false)"
  >
    <div v-if="timeLine" class="showTimeLine">
      <timeLine @hide="timeLine=false" class="timeline" :blogData="blogData"></timeLine>
    </div>
    <div v-if="tabArticle" class="showTimeLine">
      <tabArticles @hide="tabArticle=false" :activeTab="activeTab" class="timeline" :blogData="tabBlogs"></tabArticles>
    </div>
    <transition v-if="isBlogger" name="slide-fade">
      <div v-if="showMap" class="map">
        <div class="avatarMap"></div>
        <span class="editBtn" @click="(editState = true) && (showMap = false)">编辑个人信息卡</span>
      </div>
    </transition>
    <!-- 小人卡片，外层负责方向翻转，里面的svg负责walk-->
    <div class="main">
      <div class="avatar">
        <img v-if="!editState" :src="bloggerMsg.avatar" alt />
        <span class="smallUploader" v-else>
          <uploadImg :small="true" @update="updateImg" :fileList="fileList"></uploadImg>
        </span>
      </div>
      <div class="name">
        <div v-if="!editState">{{bloggerMsg.name}}</div>
        <!-- 这里如果为空需要阻止其他操作！！！！messageBox的按钮颜色也要改一改 -->
        <input
          v-else
          minlength="1"
          maxlength="10"
          pattern="\S{1,10}"
          type="text"
          title="请输入1-10位之内的非空白字符名字"
          v-model="bloggerMsg.name"
          @blur="updateName(bloggerMsg.name)"
        />
      </div>
      <div class="desc">
        <div v-if="!editState">{{bloggerMsg.desc}}</div>
        <textarea
          v-else
          @blur="updateDesc(bloggerMsg.desc)"
          cols="30"
          rows="2"
          maxlength="30"
          title="不超过30个字符"
          v-model="bloggerMsg.desc"
        ></textarea>
      </div>
      <div class="articalGroup">
        <span class="post item">
          <div class="num">{{articleNum}}</div>
          <div class="belong">文章</div>
          <!-- 点击跳转到blogList那里,设锚id，点击就直接到文章列表那个位置？ -->
        </span>
        <span class="archive item" @click="showTimeLine">
          <div class="num">{{articleNum}}</div>
          <div class="belong">归档</div>
        </span>
      </div>
      <div class="socialLinkWrap">
        <transition name="fade">
          <div class="sLEdit" v-if="socialLinkEdit">
            <h5 class="title">编辑社交链接</h5>
            <div class="showLinkWrap">
              <div v-for="(item, index) in vmodelSocialLink" :key="index" class="item">
                <span @click="deleteLink(index)">
                  <svg-icon class="bin" icon-class="bin" />
                </span>
                <svg-icon class="logo" :icon-class="pickLogo(item)" />
                <input
                  class="link"
                  type="url"
                  :title="vmodelSocialLink[index]"
                  v-model="vmodelSocialLink[index]"
                />
              </div>
              <div class="addLink">
                <svg-icon class="dotCircle" :icon-class="pickLinkLogo" />
                <input
                  v-model="addLinkValue"
                  @input="addLinkTest"
                  @focus="lineActive = true"
                  @blur="lineActive = false"
                  type="url"
                  placeholder="添加社交链接或者邮箱吧"
                />
                <div v-if="linkTip" class="error">url不合格！</div>
                <div :class="`${lineActive ? 'lineActive' : ''} line`"></div>
              </div>
            </div>
            <div class="btn">
              <span class="cancel" @click="cancel">取消</span>
              <span class="apply" @click="addSocialLink">确定</span>
            </div>
          </div>
        </transition>
        <div class="socialLink">
          <a v-for="(item, index) in blogMsg.socialLink" target="blank" :key="index" :href="item">
            <svg-icon class="icon" :icon-class="pickLogo(item)" />
          </a>
          <span @click="showEditLink">
            <svg-icon v-if="editState" title="编辑" class="icon" icon-class="addC" />
          </span>
        </div>
      </div>
      <div class="line"></div>
      <div class="detailTags">
        <h5 class="title">标签</h5>
        <div class="wrap">
          <span v-if="blogMsg.tagsArr.length === 0">暂无标签</span>
          <span
            v-else
            v-for="(item, index) in blogMsg.tagsArr"
            @click="goTabArticles(item)"
            :key="index"
            class="item"
          >{{item}}</span>
        </div>
      </div>
    </div>
    <div
      :class="`tip ${cartoonMoveLeft && 'cartoonMoveLeft'} ${cartoonMoveRight && 'cartoonMoveRight'}`"
      @click="showPersonalCart = !showPersonalCart"
      title="个人信息展示卡"
    >
      <svg-icon class="icon" icon-class="POP" />
    </div>
  </div>
</template>

<script>
import { Message, MessageBox } from 'element-ui'
import { deepClone } from '@/utils/index'
import timeLine from '@/components/timeLine'
import tabArticles from '@/components/tabArticles'
import { getInfoByBlogId, updateUserInfo } from '@/api/user'
import { getBlogSetting, updateBlogSetting } from '@/api/blog'
import { fetchList } from '@/api/article'
import uploadImg from '@/components/uploadImg/index.vue'
export default {
  name: 'bloggerMsgCard',
  data () {
    return {
      activeTab: '',
      showMap: false,
      isBlogger: false,
      editState: false, // 此时是否为可编辑状态
      showMinelog: false,
      socialLinkEdit: false,
      showPersonalCart: false,
      cartoonMoveLeft: false,
      cartoonMoveRight: false,
      fileList: [],
      lineActive: false,
      pickLinkLogo: 'dotCircle',
      showLinkLogo: '',
      timeLine: false,
      tabArticle: false,
      tabBlogs: [],
      bloggerMsg: {
        avatar: '',
        name: '',
        desc: ''
      },
      articleNum: 0,
      blogMsg: {
        socialLink: [],
        tagsArr: []
      },
      blogForm: {
        socialLink: []
      },
      addLinkValue: '',
      linkTip: false,
      vmodelSocialLink: []
    }
  },
  props: {
    blogData: Array
  },
  watch: {
    '$store.state.blog.allArticleSNum': {
      handler (val) {
        this.articleNum = val
      }
    },
    '$store.state.blog.blogSetting': {
      handler (val) {
        this.blogMsg = val
        console.log(val, 'blogSetting')
      },
      deep: true
    },
    '$route.params.blogId': {
      handler (val) {
        getInfoByBlogId(val).then(res => {
          if (res.code === 200) {
            this.bloggerMsg = res.data
          }
        })
        getBlogSetting(val).then(res => {
          this.blogMsg = res.data
          this.blogForm.socialLink = deepClone(this.blogMsg.socialLink)
          this.$store.dispatch('blog/setBlogSetting', res.data)
        })
      },
      immediate: true
    },
    '$store.state.user.isBlogger': {
      handler (val) {
        this.isBlogger = val
      },
      immediate: true
    },
    showPersonalCart (newV) {
      if (newV) {
        // 此时正是卡片展开时，卡片展开动画，小人走路，到正确位置后小人需恢复原样
        this.cartoonMoveLeft = true
        setTimeout(() => {
          this.cartoonMoveLeft = false
        }, 1000)
      } else {
        // 此时是收起动画，小人方向应不变
        this.cartoonMoveRight = true
        setTimeout(() => {
          this.cartoonMoveRight = false
        }, 1000)
      }
    },
    editState: {
      handler (newV) {
        if (newV) {
          // 监听编辑信号，即使切换编辑状态下socialLink的数据
          this.vmodelSocialLink = deepClone(this.blogForm.socialLink)
          if (this.bloggerMsg.avatar) {
            this.fileList = [
              {
                name: 'bloggerAvatar.jpg',
                url: this.bloggerMsg.avatar
              }
            ]
          }
        } else {
          // 否则，置空对象
          this.vmodelSocialLink = []
        }
      },
      immediate: true
    }
  },
  created () {},
  computed: {},
  mounted () {},
  methods: {
    goTabArticles (tab) {
      this.tabArticle = true
      this.activeTab = tab
      fetchList({ blogId: this.$route.params.blogId })
        .then(res => {
          this.tabBlogs = res.data.filter(item => {
            return item.tapsArr.indexOf(tab) !== -1 &&
              item.statusValue !== '3' &&
              item.statusValue !== '4'
          })
          console.log(this.tabBlogs, 'this.tabBlogs')
        })
        .then(res => {
          for (let i = 0; i <= this.tabBlogs.length - 1; i++) {
            const content = this.tabBlogs[i].content
            const start = content.search(/>/)
            const last = content.search(/<\/h1>/)
            this.$set(this.tabBlogs[i], 'title', content.slice(start + 1, last))
          }
        })
    },
    updateImg () {
      updateUserInfo({
        userId: this.$store.state.user.userId,
        avatar: this.fileList[0].url
      }).then(res => {
        this.$store.dispatch('user/setAvatar', this.fileList[0].url)
      })
    },
    updateDesc (value) {
      if (value) {
        updateUserInfo({
          userId: this.$store.state.user.userId,
          desc: value
        }).then(res => {
          this.$store.dispatch('user/setDesc', value)
        })
      }
    },
    updateName (value) {
      if (value) {
        updateUserInfo({
          userId: this.$store.state.user.userId,
          name: value
        }).then(res => {
          this.$store.dispatch('user/setName', value)
        })
      }
    },
    showTimeLine () {
      this.timeLine = true
    },
    pickLogo (item) {
      // 展示区根据数组元素来链接logo
      return `${
        item.indexOf('bilibili') !== -1
          ? 'bilibili'
          : item.indexOf('facebook') !== -1
          ? 'facebook'
          : item.indexOf('github') !== -1
          ? 'github'
          : item.indexOf('Pinterest') !== -1
          ? 'Pinterest'
          : item.indexOf('twitter') !== -1
          ? 'twitter'
          : item.indexOf('weibo') !== -1
          ? 'weibo'
          : item.indexOf('youtube') !== -1
          ? 'youtube'
          : item.indexOf('behance') !== -1
          ? 'behance'
          : 'link'
      }`
    },
    cancel () {
      // 取消编辑链接
      this.socialLinkEdit = false
      this.addLinkValue = ''
      this.linkTip = false
      this.pickLinkLogo = 'dotCircle'
      this.vmodelSocialLink = deepClone(this.blogForm.socialLink)
    },
    showEditLink () {
      // 显示编辑链接框
      this.socialLinkEdit = true
      this.blogForm.socialLink = deepClone(this.blogMsg.socialLink)
    },
    deleteLink (index) {
      MessageBox.confirm('确定删除改链接吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.vmodelSocialLink.splice(index, 1)
        this.blogForm.socialLink.splice(index, 1)
      })
    },
    addSocialLink () {
      if (!this.addLinkValue) {
        // 此时没有添加链接
        this.blogMsg.socialLink = deepClone(this.blogForm.socialLink)
        this.socialLinkEdit = false
        return
      }
      if (this.linkTip) {
        // 提示url錯誤
        Message({
          message: '請輸入正確的url格式！',
          type: 'error',
          duration: 3 * 1000
        })
      } else {
        // 添加
        this.blogForm.socialLink.push(this.addLinkValue)
        this.blogMsg.socialLink = deepClone(this.blogForm.socialLink)
        this.vmodelSocialLink = deepClone(this.blogForm.socialLink)
        this.socialLinkEdit = false
        this.addLinkValue = ''
        this.pickLinkLogo = 'dotCircle'
        // 如果確定在edit按鈕摁下去時將所有初始值都存到store中，只要放棄編輯就一切恢復原值，那麼是不是每個編輯區域也就不需要分展示值和form值了？
        updateBlogSetting({
          blogId: this.$store.state.user.blogId,
          socialLink: this.blogForm.socialLink
        })
      }
    },
    addLinkTest (e) {
      this.pickLinkLogo = `${
        !this.addLinkValue
          ? 'dotCircle'
          : this.addLinkValue.indexOf('bilibili') !== -1
          ? 'bilibili'
          : this.addLinkValue.indexOf('facebook') !== -1
          ? 'facebook'
          : this.addLinkValue.indexOf('github') !== -1
          ? 'github'
          : this.addLinkValue.indexOf('Pinterest') !== -1
          ? 'Pinterest'
          : this.addLinkValue.indexOf('twitter') !== -1
          ? 'twitter'
          : this.addLinkValue.indexOf('weibo') !== -1
          ? 'weibo'
          : this.addLinkValue.indexOf('youtube') !== -1
          ? 'youtube'
          : this.addLinkValue.indexOf('behance') !== -1
          ? 'behance'
          : 'link'
      }`
      const reg = new RegExp(
        '(https?|ftp|file)://[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]'
      )
      if (this.addLinkValue === '' || reg.test(this.addLinkValue)) {
        // 地址新增正确
        this.linkTip = false
      } else {
        this.linkTip = true
      }
    }
  },
  components: {
    timeLine,
    uploadImg,
    tabArticles
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

@mixin keyframes($animationName) {
  @keyframes #{$animationName} {
    @content;
  }
}

@include keyframes(walk) {
  10% {
    transform: rotate(-15deg);
  }
  20% {
    transform: rotate(10deg);
  }
  30% {
    transform: rotate(-5deg);
  }
  40% {
    transform: rotate(5deg);
  }
  50% {
    transform: rotate(-5deg);
  }
  60% {
    transform: rotate(10deg);
  }
  70% {
    transform: rotate(-15deg);
  }
  90% {
    transform: rotate(5deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

.personalCart {
  position: absolute;
  display: inline-block;
  z-index: 100;
  left: -290px;
  top: 200px;
  transition: left 1s;
  .timeline {
    position: absolute;
    left: 110%;
    top: -100px;
    width: 767px;
    max-height: 650px;
    padding: 10px;
    overflow-y: auto;
    box-shadow: $shadow;
    border-radius: 10px;
    background: white;
  }
  .map {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 200;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    text-align: center;
    background: rgba($color: #000000, $alpha: 0.2);
    .avatarMap {
      width: 90px;
      height: 45px;
      margin: 0 auto;
      border-radius: 90px 90px 0 0;
      position: relative;
      transform: translateY(-99.5%);
      background: rgba($color: #000000, $alpha: 0.2);
    }
    .editBtn {
      position: relative;
      top: 20%;
      padding: 16px 33px;
      margin: 0 auto;
      background: white;
      font-size: 12px;
      font-weight: 600;
    }
    .editBtn:hover {
      cursor: pointer;
    }
  }
  .main {
    position: relative;
    width: 300px;
    min-height: 400px;
    padding: 60px 10px 10px 20px;
    border-radius: 10px;
    box-shadow: $shadow;
    background: white;
    text-align: center;
    .editSvgG {
      position: absolute;
      right: 20px;
      top: 20px;
      padding: 4px;
      box-shadow: $shadow;
      font-size: 18px;
      border-radius: 8px;
      .icon {
        margin: 0 2px;
        box-sizing: content-box;
        padding: 5px;
        border-radius: 5px;
      }
      .icon:hover {
        cursor: pointer;
        background: #f3f3f3;
      }
    }
    .avatar {
      width: 90px;
      height: 90px;
      position: absolute;
      top: -40px;
      left: 50%;
      transform: translateX(-50%);
      padding: 5px;
      border-radius: 50%;
      background-image: linear-gradient(
        to top,
        rgba(255, 255, 255, 0.3),
        rgba(168, 194, 248, 0.3)
      );
      img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        transition: transform 0.3s;
        box-shadow: $shadow;
      }
      .smallUploader {
        display: inline-block;
        width: 80px;
        height: 80px;
        overflow: hidden;
      }
    }
    .avatar:hover {
      cursor: pointer;
      img {
        transform: scale(1.1);
      }
    }
    .name {
      margin: 5px 0;
      input {
        text-align: center;
      }
    }
    .desc {
      font-size: 12px;
      color: gray;
      textarea {
        height: 31px;
        text-align: center;
      }
    }
    .articalGroup {
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      .item {
        margin: 15px 0;
        cursor: pointer;
        .belong {
          font-size: 12px;
        }
        .num {
          margin: 5px 0;
          font-size: 18px;
          font-weight: 600;
        }
      }
    }
    .socialLinkWrap {
      position: relative;
      .sLEdit {
        position: absolute;
        width: 340px;
        left: 110%;
        top: -200%;
        box-shadow: $shadow;
        border-radius: 5px;
        background-color: #f6f6f6;
        border: 1px solid #e4e4e4;
        .showLinkWrap {
          max-height: 379px;
          overflow-y: auto;
          .item {
            padding: 22px 25px;
            border-top: 1px solid #e4e4e4;
            cursor: pointer;
            .bin {
              font-size: 16px;
              vertical-align: middle;
            }
            .bin:hover {
              fill: $font_error;
            }
            .logo {
              font-size: 38px;
              vertical-align: middle;
              margin: 0 10px;
            }
            .link {
              vertical-align: middle;
            }
          }
          .item:hover {
            background: #ececec;
          }
          .addLink {
            position: relative;
            padding: 22px 27px;
            .dotCircle {
              vertical-align: middle;
              margin-right: 11px;
              font-size: 22px;
            }
            input {
              vertical-align: middle;
              font-size: 14px;
            }
            .error {
              font-size: 12px;
              color: $font_error;
            }
            .line {
              position: absolute;
              bottom: 10px;
              left: 50%;
              transform: translateX(-50%);
              width: 240px;
              height: 1px;
              background-color: #e4e4e4;
              border-top: none;
            }
            .lineActive {
              background-color: black;
              transition: background-color 0.3s linear;
            }
          }
        }
      }
      .btn {
        .cancel,
        .apply {
          display: inline-block;
          width: 50%;
          height: 44px;
          line-height: 44px;
          border: 1px solid #e4e4e4;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          border-bottom: none;
          border-left: none;
        }
        .apply {
          border-right: none;
        }
        .cancel:hover,
        .apply:hover {
          background-color: white;
        }
      }
      .socialLink {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        font-size: 28px;
        .icon {
          cursor: pointer;
          margin: 10px 10px;
        }
      }
    }
    .line {
      width: 100%;
      height: 1px;
      background: #f3f3f3;
    }
    .detailTags,
    .friends {
      .wrap {
        display: flex;
        flex-direction: row;
        justify-content: center;
        flex-wrap: wrap;
        .item {
          padding: 5px;
          margin: 5px;
          border-radius: 10px;
          border: 1px solid color(primary);
          color: color(primary);
          font-size: 14px;
          transition: border 0.3s, color 0.3s;
        }
        .item:hover {
          cursor: pointer;
          color: gray;
          border-color: gray;
        }
      }
    }
  }
  .tip {
    position: absolute;
    top: 0;
    right: -20px;
    font-size: 24px;
    transform: rotateY(180deg);
  }
  .tip:hover {
    cursor: pointer;
  }
  .cartoonMoveLeft {
    right: 0;
    transform: rotateY(0deg);
    .icon {
      animation: walk 2s ease infinite;
    }
  }
  .cartoonMoveRight {
    transform: rotateY(180deg);
    .icon {
      animation: walk 2s ease infinite;
    }
  }
}
.showCart {
  left: 0px;
}
</style>
