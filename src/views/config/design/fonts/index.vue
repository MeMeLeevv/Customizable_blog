<template>
  <div class="Fonts">
    <configHeader :backRouter="`/${this.$store.state.user.blogId}/config/Design`"  lastTitle="设计" nowTitle="字体"></configHeader>
    <div class="tabbar" ref="tabbar" @click="switchTab">
      <span class="item" :data-index="0">汉仪</span>
      <span class="item" :data-index="1">方正</span>
      <span class="item" :data-index="2">字体视界</span>
      <span
        v-if="showLine"
        class="line"
        :style="`width: ${lineWAL[tabIndex].lineWidth}px; left: ${lineWAL[tabIndex].lineLeft}px`"
      ></span>
    </div>
    <div class="showFontWrap" style="height: calc(100vh - 300px);">
      <!-- 点击后在store中更换body里font的className -->
      <div
        :class="`item ${usingFontName === item.fontName ? 'active' : ''} ${item.fontName}`"
        v-for="(item, index) in showFonts"
        :key="index"
        @click="setFont(item.fontName)"
      >
        <div :class="`title ${item.fontName}`">{{item.title}}</div>
        <div class="content">{{item.content}}</div>
        <div class="sizeFixed" v-if="usingFontName === item.fontName">
          <span>基本尺寸</span>
          <span>
            <input type="text" @blur="checkSize(item)" class="font" v-model="item.size" />
            <span :class="`icon ${minusUnable ? 'unable' : ''}`" @click="minus(item)">
              <svg-icon class="svg" icon-class="minus" />
            </span>
            <span :class="`icon ${addUnable ? 'unable' : ''}`" @click="add(item)">
              <svg-icon class="svg" icon-class="add" />
            </span>
          </span>
        </div>
      </div>
    </div>
    <div class="default">
      <button @click="setDefault" class="defaultBtn">默认</button>
    </div>
  </div>
</template>
<script>
import configHeader from '@/components/configHeader'
import { updateBlogSetting } from '@/api/blog'
export default {
  name: 'Fonts',
  data () {
    return {
      tabsWidth: [],
      showLine: false,
      tabIndex: 0, // 此时被展示的tab的index
      normalSize: '16px',
      addUnable: false,
      minusUnable: false,
      usingFontName: this.$store.state.app.fontFamily, // 正在使用的字体
      lineWAL: [
        {
          lineWidth: 0,
          lineLeft: 0
        }
      ],
      showFonts: [],
      fonts: [
        {
          fontName: 'HYXinRenWenSong55W', // 对应字体包指定的class
          title: '汉仪新人文宋 55W',
          content: '自古逢秋悲寂寥',
          size: '16px',
          index: 0 // 对应tab
        },
        {
          fontName: 'HYSuJinLiW',
          title: '汉仪素金隶 W',
          content: '自古逢秋悲寂寥',
          size: '16px',
          index: 0
        },
        {
          fontName: 'FZMiaoWuJW',
          title: '方正喵呜简体',
          content: '自古逢秋悲寂寥',
          size: '16px',
          index: 1
        },
        {
          fontName: 'FZSJ-ODZKJW',
          title: '方正手迹-欧蝶正楷',
          content: '自古逢秋悲寂寥',
          size: '16px',
          index: 1
        },
        {
          fontName: 'yplly',
          title: '印品溜溜圆',
          content: '自古逢秋悲寂寥',
          size: '16px',
          index: 2
        },
        {
          fontName: 'x-yht',
          title: 'X-幼黑体',
          content: '自古逢秋悲寂寥',
          size: '16px',
          index: 2
        }
      ]
    }
  },
  created () {},
  watch: {
    '$store.state.blog.blogSetting.fontStyle': {
      handler (newV, oldV) {
        if (newV !== oldV) {
          this.usingFontName = newV
        }
      },
      immediate: true
    },
    tabIndex: {
      handler (newV) {
        this.showFonts = this.fonts.filter(item => item.index === Number(newV)) // 对应tab下该展示的字体
        console.log(typeof (newV), 'show')
      },
      immediate: true
    }
  },
  computed: {},
  mounted () {
    this.$nextTick(function () {
      const children = this.$refs.tabbar.children
      let left = 0
      for (let i = 0; i < children.length; i++) { // dom渲染好后开始计算每个tab的width和offsetLeft，记得加上padding
        if (children[i].className === 'item') {
          this.lineWAL[i] = {
            lineWidth: children[i].clientWidth,
            lineLeft: 0
          }
          this.showLine = true
          if (i > 0) {
            left += children[i - 1].clientWidth + 16
          }
          this.lineWAL[i].lineLeft = left
        }
      }
      console.log(this.lineWAL, 'this.lineWAL')
    })
  },
  methods: {
    setDefault () {
      const data = this.$store.state.blog.blogSetting
      updateBlogSetting({ blogId: this.$store.state.user.blogId, fontStyle: '' }).then(res => {
        data.fontStyle = ''
        this.$store.dispatch('blog/setBlogSetting', data)
      })
    },
    setFont (font) {
      const data = this.$store.state.blog.blogSetting
      updateBlogSetting({ blogId: this.$store.state.user.blogId, fontStyle: font }).then(res => {
        data.fontStyle = font
        this.$store.dispatch('blog/setBlogSetting', data)
      })
    },
    minus (item) { // 字体减小 在store中font-size变化rem
      let num = Number(item.size.match(/^(\d+)px$/)[1])
      this.addUnable = false
      if (num === 12) {
        this.minusUnable = true
        return
      } else {
        num--
        if (num === 12) {
          this.minusUnable = true
        } else {
          this.minusUnable = false
        }
      }
      item.size = `${num}px`
    },
    add (item) { // 字体变大
      let num = Number(item.size.match(/^(\d+)px$/)[1])
      this.minusUnable = false
      if (num === 24) {
        this.addUnable = true
        return
      } else {
        num++
        if (num === 24) {
          this.addUnable = true
        } else {
          this.addUnable = false
        }
      }
      item.size = `${num}px`
    },
    checkSize (item) { // input框看用户是否填对了
      const reg = /^(\d+)px$/
      const result = item.size.match(reg)
      if (result) {
        console.log(result[1])
      } else {
        console.log('uncheck')
      }
    },
    switchTab (e) { /// 点击切换tab
      this.tabIndex = e.target.dataset.index
    }
  },
  components: {
    configHeader
  }
}
</script>
<style lang="scss" scoped>
.Fonts {
  .tabbar {
    display: flex;
    height: 55px;
    line-height: 55px;
    position: relative;
    margin-bottom: 22px;
    box-shadow: rgba(0, 0, 0, 0.06) 0px -1px 0px 0px inset;
    font-size: 14px;
    .item {
      vertical-align: middle;
      color: rgb(118, 118, 118);
      display: inline-flex;
      margin-right: 16px;
      cursor: pointer;
    }
    .line {
      width: 55px;
      position: absolute;
      bottom: 0px;
      height: 2px;
      background-color: rgb(49, 49, 49);
      transition: all 350ms cubic-bezier(0.66, 0, 0.34, 1);
    }
  }
  .showFontWrap {
    overflow-x: hidden;
    overflow-y: auto;
    .item {
      width: 260px;
      height: 100px;
      margin-bottom: 16px;
      position: relative;
      padding: 25px 22px 13px;
      background: white;
      transition: height 0.3s;
      cursor: pointer;
      .title {
        margin-bottom: 6px;
        font-size: 20px;
      }
      .content {
        margin-bottom: 13px;
        font-size: 16px;
        color: #313131;
        line-height: 20px;
        font-weight: 300;
      }
      .sizeFixed {
        display: flex;
        justify-content: space-between;
        height: 44px;
        line-height: 44px;
        font-size: 14px;
        color: #3e3e3e;
        font-weight: 400;
        .icon {
          display: inline-block;
          width: 32px;
          height: 44px;
          text-align: center;
          font-size: 18px;
        }
        .unable {
          cursor: not-allowed;
          .svg {
            fill: #d6d6d6;
          }
        }
        .font {
          width: 50px;
          padding: 0 6px;
          font-size: 14px;
          font-weight: 300;
          text-align: center;
          line-height: 22px;
          min-height: 22px;
          border-radius: 5px;
          text-overflow: ellipsis;
        }
        .font:focus {
          background: rgb(235, 235, 235);
        }
      }
    }
    .active {
      height: 140px;
      border: 1px solid #313131;
    }
  }
  .defaultBtn {
    padding: 10px 15px;
  }
}
</style>
