<template>
  <div
    :class="`model-container ${editState ? 'editState' : ''}`"
    v-show="show"
    ref="live2d"
    @mouseenter=" (showDialog = true) && $store.state.app.isEditState && !editState && (showMap = true)"
    @mouseleave="hideMsg"
    :style="`top: ${$store.state.live2d.top}px; left: ${$store.state.live2d.left}px;width: ${$store.state.live2d.width}px; height: ${$store.state.live2d.height}px`"
  >
    <div class="size" v-show="editState">
      <span title="拖动，释放鼠标以观察效果">
        <svg-icon class="resize" ref="resize" icon-class="size" />
      </span>
      <span title="完成">
        <svg-icon class="done" icon-class="done" />
      </span>
    </div>
    <div v-if="showMap">
      <span class="editBtn" @click="($emit('update:editState', true)) && (showMap = false)">编辑看板娘</span>
    </div>
    <div
      v-if="!editState && showDialog"
      class="waifu-tips"
      style="width: 200px; height: 100px"
    >{{message}}</div>
    <canvas
      :width="$store.state.live2d.width"
      :height="$store.state.live2d.height"
      id="live2d"
      @click="randomMsg()"
      class="live2d"
    ></canvas>
    <div v-show="!editState" class="waifu-tool">
      <span
        class="fui-home"
        @mouseenter="message = '你要回去主页吗？'"
        @mouseleave="randomMsg"
        title="返回主页"
      >
        <svg-icon class="icon" icon-class="iconindex" />
      </span>
      <span
        class="fui-cross"
        @mouseenter="message = '我有很多姐妹哦，要试试切换吗？'"
        @mouseleave="randomMsg"
        title="切换模型"
      >
        <svg-icon class="icon" icon-class="changeclose" />
      </span>
      <span class="fui-cross" @mouseenter="chat" @mouseleave="randomMsg" title="聊天">
        <svg-icon class="icon" icon-class="iconchat" />
      </span>
      <span
        class="fui-eye"
        @click="show = !show"
        @mouseenter="message = '点了的话那我就只在屏幕外偷偷看着你了'"
        @mouseleave="randomMsg"
        title="关闭模型"
      >
        <svg-icon class="icon" icon-class="icondelete" />
      </span>
    </div>
  </div>
  <!-- </div> -->
</template>

<script>
/* 在编辑状态下，一切处理都可以被保存，包括换装/位移 */
export default {
  props: {
    showModel: String,
    editState: Boolean // 此时是否为可编辑状态
  },
  data () {
    return {
      showMap: false,
      show: true,
      showDialog: false,
      message: ''
    }
  },
  created () {
    this.message = this.$store.state.live2d.messages[0]
  },
  watch: {},
  components: {},
  computed: {},
  directives: {},
  mounted () {
    this.$nextTick(function () {
      const dir = `/live2d-widget-model-${this.showModel}/assets/${this.showModel}.model.json`
      /* const url =
      'https://cdn.jsdelivr.net/gh/QiShaoXuan/live2DModel@1.0.0' + dir 线上地址可以使用 */
      const url = '/live2dw' + dir
      // eslint-disable-next-line no-undef
      loadlive2d('live2d', url) // 次函数引用的是public文件里的live2d.js的函数，由于编译后的代码都是运行时都是放在index.html里的，所以记得要在index.html里引用live2d.js

      this.$refs.live2d.onmousedown = e => {
        // 算出鼠标相对元素的位置
        const target = e.target
        const tag = target.tagName.toLowerCase()
        if (tag === 'use' || tag === 'svg') {
          // 记住初始位置
          if (target.href && target.href.baseVal === '#icon-done') { // 退出编辑状态
            this.$emit('update:editState', false)
            return
          } else if (target.href && target.href.baseVal === '#icon-iconindex') { // 回到主页
            return
          } else if (target.href && target.href.baseVal === '#icon-changeclose') { // 换装
            this.changeClose()
            return
          }
          const oriX = e.clientX
          const oriY = e.clientY
          document.onmousemove = e => {
            e.preventDefault()
            // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
            const disX = (e.clientX - oriX)
            const disY = (e.clientY - oriY)

            // 移动当前元素
            let width = this.$refs.live2d.style.width.slice(0, -2) - 0
            let height = this.$refs.live2d.style.height.slice(0, -2) - 0

            if (disX > 0) { // 鼠标右移，缩小
              width -= Math.abs(disX)
            } else {
              width += Math.abs(disX)
            }
            if (disY > 0) { // 鼠标下移，缩小
              height -= Math.abs(disY)
            } else {
              height += Math.abs(disY)
            }
            // 右移变小为正，左移变大为负 // 上移变大位负，下移变小为正
            this.$store.dispatch('live2d/setWidth', width)
            this.$store.dispatch('live2d/setHeight', height)
          }
          document.onmouseup = e => {
            this.updateModel()
            // 鼠标弹起来的时候不再移动
            document.onmousemove = null
            // 预防鼠标弹起来后还会循环（即预防鼠标放上去的时候还会移动）
            document.onmouseup = null
          }
        } else {
          const disX = e.clientX - this.$refs.live2d.offsetLeft
          const disY = e.clientY - this.$refs.live2d.offsetTop
          document.onmousemove = e => {
            // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
            const left = e.clientX - disX
            const top = e.clientY - disY
            // 移动当前元素
            this.$refs.live2d.style.left = left + 'px'
            this.$refs.live2d.style.top = top + 'px'
            if (this.editState) {
              this.$store.dispatch('live2d/setLeft', left)
              this.$store.dispatch('live2d/setTop', top)
            }
          }
          document.onmouseup = e => {
            // 鼠标弹起来的时候不再移动
            document.onmousemove = null
            // 预防鼠标弹起来后还会循环（即预防鼠标放上去的时候还会移动）
            document.onmouseup = null
          }
        }
      }
    })
  },
  methods: {
    hideMsg () {
      this.showDialog = false
      if (this.$store.state.app.isEditState && !this.editState) {
        this.showMap = false
      }
    },
    changeClose () {
      this.$emit('changeLive2d') // 触发父组件切换模型，此时父组件需要消失一下，这样显示时才会再次重新加载子组件，模型url才会生效，切换才能成功
    },
    updateModel () {
      this.$emit('updateModel')
    },
    getRandomInt (min, max) {
      min = Math.ceil(min)
      max = Math.floor(max)
      return Math.floor(Math.random() * (max - min)) + min // 不含最大值，含最小值
    },
    randomMsg () {
      const len = this.$store.state.live2d.messages.length
      const number = this.getRandomInt(1, len)
      this.message = this.$store.state.live2d.messages[number]
    },
    chat () {
      const len = this.$store.state.live2d.chats.length
      const number = this.getRandomInt(1, len)
      this.message = this.$store.state.live2d.chats[number]
    }
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

.editState:hover {
  box-shadow: inset 0 0 0 2px #0888c8;
  cursor: move;
}

.label {
  display: block;
  cursor: pointer;
}
input[type="radio"] {
  margin-right: 15px;
}
.model-container {
  position: fixed;
  z-index: 99999;
  cursor: pointer;
  .size {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1000000;
    font-size: 20px;
    .resize {
      vertical-align: top;
      cursor: crosshair;
    }
    .done {
      vertical-align: top;
      margin-left: 5px;
      cursor: pointer;
      font-size: 18px;
    }
  }
  .editBtn {
    position: absolute;
    z-index: inherit;
    width: 130px;
    bottom: 20%;
    left: 50%;
    margin: 0 auto;
    transform: translateX(-50%);
    padding: 16px 33px;
    background: white;
    font-size: 12px;
    font-weight: 600;
    box-shadow: $shadow;
    text-align: center;
  }
  .editBtn:hover {
    cursor: pointer;
  }
}

.url-container {
  position: fixed;
  right: 10px;
  top: 15px;
}
.radio-container {
  width: 400px;
}

.waifu-tips {
  opacity: 1;
  margin: -20px 20px;
  padding: 5px 10px;
  border: 1px solid rgba(224, 186, 140, 0.62);
  border-radius: 12px;
  background-color: rgba(236, 217, 188, 0.5);
  box-shadow: 0 3px 15px 2px rgba(191, 158, 118, 0.2);
  text-overflow: ellipsis;
  overflow: hidden;
  position: absolute;
  z-index: 1000000;
  animation-delay: 5s;
  animation-duration: 50s;
  animation-iteration-count: infinite;
  animation-name: shake;
  animation-timing-function: ease-in-out;
  font-size: 14px;
  letter-spacing: 1px;
}
.waifu-tool {
  display: none;
  color: #aaa;
  top: 50%;
  transform: translateY(-50%);
  right: 10px;
  position: absolute;
  font-size: 16px;
}
.model-container:hover .waifu-tool {
  display: block;
}
.waifu-tool span {
  margin: 10px 0;
  display: block;
  cursor: pointer;
  transition: 0.2s;
}
.waifu-tool span .icon {
  fill: #5b6c7d;
  font-weight: 700;
}
.waifu-tool span .icon:hover {
  fill: #34495e;
}
.waifu #live2d {
  position: relative;
}

@keyframes shake {
  2% {
    transform: translate(0.5px, -1.5px) rotate(-0.5deg);
  }

  4% {
    transform: translate(0.5px, 1.5px) rotate(1.5deg);
  }

  6% {
    transform: translate(1.5px, 1.5px) rotate(1.5deg);
  }

  8% {
    transform: translate(2.5px, 1.5px) rotate(0.5deg);
  }

  10% {
    transform: translate(0.5px, 2.5px) rotate(0.5deg);
  }

  12% {
    transform: translate(1.5px, 1.5px) rotate(0.5deg);
  }

  14% {
    transform: translate(0.5px, 0.5px) rotate(0.5deg);
  }

  16% {
    transform: translate(-1.5px, -0.5px) rotate(1.5deg);
  }

  18% {
    transform: translate(0.5px, 0.5px) rotate(1.5deg);
  }

  20% {
    transform: translate(2.5px, 2.5px) rotate(1.5deg);
  }

  22% {
    transform: translate(0.5px, -1.5px) rotate(1.5deg);
  }

  24% {
    transform: translate(-1.5px, 1.5px) rotate(-0.5deg);
  }

  26% {
    transform: translate(1.5px, 0.5px) rotate(1.5deg);
  }

  28% {
    transform: translate(-0.5px, -0.5px) rotate(-0.5deg);
  }

  30% {
    transform: translate(1.5px, -0.5px) rotate(-0.5deg);
  }

  32% {
    transform: translate(2.5px, -1.5px) rotate(1.5deg);
  }

  34% {
    transform: translate(2.5px, 2.5px) rotate(-0.5deg);
  }

  36% {
    transform: translate(0.5px, -1.5px) rotate(0.5deg);
  }

  38% {
    transform: translate(2.5px, -0.5px) rotate(-0.5deg);
  }

  40% {
    transform: translate(-0.5px, 2.5px) rotate(0.5deg);
  }

  42% {
    transform: translate(-1.5px, 2.5px) rotate(0.5deg);
  }

  44% {
    transform: translate(-1.5px, 1.5px) rotate(0.5deg);
  }

  46% {
    transform: translate(1.5px, -0.5px) rotate(-0.5deg);
  }

  48% {
    transform: translate(2.5px, -0.5px) rotate(0.5deg);
  }

  50% {
    transform: translate(-1.5px, 1.5px) rotate(0.5deg);
  }

  52% {
    transform: translate(-0.5px, 1.5px) rotate(0.5deg);
  }

  54% {
    transform: translate(-1.5px, 1.5px) rotate(0.5deg);
  }

  56% {
    transform: translate(0.5px, 2.5px) rotate(1.5deg);
  }

  58% {
    transform: translate(2.5px, 2.5px) rotate(0.5deg);
  }

  60% {
    transform: translate(2.5px, -1.5px) rotate(1.5deg);
  }

  62% {
    transform: translate(-1.5px, 0.5px) rotate(1.5deg);
  }

  64% {
    transform: translate(-1.5px, 1.5px) rotate(1.5deg);
  }

  66% {
    transform: translate(0.5px, 2.5px) rotate(1.5deg);
  }

  68% {
    transform: translate(2.5px, -1.5px) rotate(1.5deg);
  }

  70% {
    transform: translate(2.5px, 2.5px) rotate(0.5deg);
  }

  72% {
    transform: translate(-0.5px, -1.5px) rotate(1.5deg);
  }

  74% {
    transform: translate(-1.5px, 2.5px) rotate(1.5deg);
  }

  76% {
    transform: translate(-1.5px, 2.5px) rotate(1.5deg);
  }

  78% {
    transform: translate(-1.5px, 2.5px) rotate(0.5deg);
  }

  80% {
    transform: translate(-1.5px, 0.5px) rotate(-0.5deg);
  }

  82% {
    transform: translate(-1.5px, 0.5px) rotate(-0.5deg);
  }

  84% {
    transform: translate(-0.5px, 0.5px) rotate(1.5deg);
  }

  86% {
    transform: translate(2.5px, 1.5px) rotate(0.5deg);
  }

  88% {
    transform: translate(-1.5px, 0.5px) rotate(1.5deg);
  }

  90% {
    transform: translate(-1.5px, -0.5px) rotate(-0.5deg);
  }

  92% {
    transform: translate(-1.5px, -1.5px) rotate(1.5deg);
  }

  94% {
    transform: translate(0.5px, 0.5px) rotate(-0.5deg);
  }

  96% {
    transform: translate(2.5px, -0.5px) rotate(-0.5deg);
  }

  98% {
    transform: translate(-1.5px, -1.5px) rotate(-0.5deg);
  }

  0%,
  100% {
    transform: translate(0, 0) rotate(0);
  }
}
</style>
