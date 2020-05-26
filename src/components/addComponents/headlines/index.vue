<template>
  <div class="headlines">
    <div v-if="isBlogger" class="control-button-wrapper">
      <div class="iconBar">
        <button class="btn" title="编辑" @click="showEditDialog = true">
          <svg-icon class="icon" icon-class="editPan" />
        </button>
        <button class="btn" title="删除" @click.stop="$emit('deleteHeadlines')">
          <svg-icon class="icon" icon-class="bin" />
        </button>
        <!-- <button class="btn">
          <svg-icon class="icon upIcon" icon-class="fullArrow" />
        </button>
        <button class="btn">
          <svg-icon class="icon downIcon" icon-class="fullArrow" />
        </button>-->
      </div>
    </div>
    <div v-if="showEditDialog" class="editDialog">
      <!-- 注意dialog要放在父级，否则编辑刷新时dialog会消失 -->
      <div class="hide" @click="showEditDialog = false">
        <svg-icon class="icon" icon-class="cancel" />
      </div>
      <div class="header">格式</div>
      <div class="content">
        <div class="item">
          <label class="label">背景</label>
          <div class="itemBlock imgbg">
            <uploadImg :small="false" @update="updateImg" :fileList="fileList"></uploadImg>
          </div>
        </div>
      </div>
    </div>
    <div v-if="which === 1" class="wrap1" style="height: 580px;">
      <!-- 背景图不使用background-size(只有cover/contain/100% 100%)，展示效果不好 -->
      <div class="bg">
        <!-- <img
          style="height: 580px;"
          src="https://www.squarespace.com/assets/template-picker-2016/images/banner_splash.png"
          alt
        />-->
        <el-image
          fit="cover"
          :src="headlinesData.bg"
        ></el-image>
      </div>
      <div class="content_wrapper" style="padding-top: 150px">
        <editor :center="true" :needContent="needContent" :editable="isBlogger" :needTitle="true" v-bind:content.sync="headlinesData.content"></editor>
      </div>
    </div>
  </div>
</template>
<script>
import editor from '../editor'
import uploadImg from '@/components/uploadImg/index.vue'
export default {
  name: 'headlines',
  props: {
    which: Number,
    headlinesData: Object
  },
  data () {
    return {
      fileList: [],
      needContent: false,
      headlineSetting: {
        bg: '/api/images/1b3749af628c2ec4e77a1bff2daa8abb.png'
        // 'https://www.squarespace.com/assets/template-picker-2016/images/banner_splash.png'
      },
      showEditDialog: false,
      isBlogger: false,
      content: '<h1>meme`s gardent</h1><p>神秘境地</p>'
    }
  },
  watch: {
    showEditDialog (val) {
      if (val) {
        this.fileList = [
          {
            name: 'headlines.jpg',
            url: this.headlinesData.bg
          }
        ]
      }
    },
    headlinesData: {
      handler (val) {
        this.$emit('update:headlinesData', val)
      },
      deep: true
    },
    '$store.state.user.isBlogger': {
      handler (val) {
        this.isBlogger = val
      },
      immediate: true
    }
  },
  created () {},
  computed: {},
  mounted () {
    this.$nextTick(function () {
      setInterval(() => {
        this.updateContent()
      }, 5000)
      // 编辑器样式初始化
    })
  },
  methods: {
    updateContent () {
      this.needContent = false
      setTimeout(() => {
        this.needContent = true
      }, 100)
    },
    updateImg () {
      this.headlinesData.bg = this.fileList[0].url
      this.$emit('update:headlinesData', this.headlinesData)
      /* updateBlogSetting({
        userId: this.$store.state.user.userId,
        avatar: this.fileList[0].url
      }).then(res => {
        this.$store.dispatch('user/setAvatar', this.fileList[0].url)
      }) */
    }
  },
  beforeDestroy () {},
  components: { editor, uploadImg }
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
  position: relative;
  max-height: 100vh;
  overflow: hidden;
  .control-button-wrapper {
    position: absolute;
    top: 80px;
    right: 22px;
    height: 44px;
    display: flex;
    z-index: 100;
    .iconBar {
      margin-right: 11px;
      padding: 4px;
      height: 44px;
      display: flex;
      justify-content: space-around;
      align-items: center;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.02);
      background-color: #fff;
      border-radius: 8px;
      overflow-x: hidden;
      overflow-y: hidden;
      .editbtn {
        padding: 0 14px;
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: 36px;
        letter-spacing: 1px;
      }
      .btn {
        border-radius: 4px;
        width: 36px;
        height: 36px;
        .icon {
          font-size: 18px;
        }
        .upIcon {
          transform: rotate(135deg);
        }
        .downIcon {
          transform: rotate(-45deg);
        }
      }
    }
  }
  .editDialog {
    position: absolute;
    top: 100px;
    right: 100px;
    z-index: 10;
    box-shadow: $shadow;
    background: white;
    .hide {
      position: absolute;
      top: 15px;
      right: 15px;
      font-size: 18px;
      cursor: pointer;
    }
    .header {
      width: 320px;
      height: 55px;
      line-height: 55px;
      background-color: #fff;
      border-radius: 8px 8px 0 0;
      overflow: hidden;
      color: rgb(49, 49, 49);
      text-align: center;
      box-shadow: rgba(0, 0, 0, 0.06) 0px -1px 0px 0px inset; /* 底线 */
    }
    .content {
      height: 255px;
      overflow-x: hidden;
      overflow-y: auto;
      .label {
        letter-spacing: 0.75px;
        font-weight: 500;
        font-size: 9.75px;
        color: #a1a1a1;
        margin-top: 33px;
        padding: 0 22px;
      }
      .itemBlock {
        display: flex;
        justify-content: center;
        .select {
          width: 90%;
        }
      }
      .imgbg {
        width: 250px;
        height: 200px;
        margin: 5px auto;
        overflow: hidden;
      }
    }
  }
  .wrap1 {
    position: relative;
    .bg {
      width: 100vw;
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      .el-image {
        width: 100vw;
      }
      img {
        display: inline-block;
        width: 100%;
        height: 100%;
        object-position: 50% 50%;
        object-fit: cover;
      }
    }
    .content_wrapper {
      color: white;
      word-spacing: 2px;
      letter-spacing: 1px;
      .is-hidden {
        opacity: 0;
      }
      .is-focused {
        opacity: 1;
      }
    }
  }
}
</style>
