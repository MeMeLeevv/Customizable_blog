<template>
  <div class="Cartoons">
    <live2d
      v-if="live2d.show && showLive"
      :editState.sync="editState"
      @updateModel="updateModel"
      :showModel="live2d.showModel"
      @changeLive2d="showlive2d"
      v-bind:live2d.sync="live2d"
    ></live2d>

    <configHeader
      :backRouter="`/${this.$store.state.user.blogId}/config/Design`"
      lastTitle="设计"
      nowTitle="live2d看板娘"
    ></configHeader>
    <div class="wrap">
      <div class="item size">
        <div class="title">* 初始大小 : (请直接在模型上编辑)</div>
        <span class="width">
          <label for>
            宽度 :
            <input type="text" v-model="live2d.width" disabled />
          </label>
        </span>
        <span class="height">
          <label for>
            高度 :
            <input type="text" v-model="live2d.height" disabled />
          </label>
        </span>
      </div>
      <div class="item position">
        <div class="title">* 初始位置 : (请直接在模型上编辑)</div>
        <span class="left">
          <label for>
            左 :
            <input type="text" v-model="live2d.left" disabled />
          </label>
        </span>
        <span class="top">
          <label for>
            上 :
            <input type="text" v-model="live2d.top" disabled />
          </label>
        </span>
      </div>
      <div class="item selectModel">
        <span class="title" style="margin-right: 10px">* 初始模型 :</span>
        <el-select
          size="small"
          v-model="live2d.showModel"
          @change="change"
          placeholder="请选择"
        >
          <el-option
            v-for="item in $store.state.live2d.models"
            :key="item.value"
            :label="item.value"
            :value="item.value"
            style="display: flex; justify-content: space-between"
          >
            <span>{{ item.value }}</span>
            <el-image style="width: 34px; height: 34px" :src="item.src" fit="cover"></el-image>
          </el-option>
        </el-select>
      </div>
      <div class="item messages">
        <div class="title">* 点击时的提示语 :</div>
        <div class="input" v-for="(item, index) in live2d.msgs" :key="index">
          <input
            type="text"
            @blur="updateStoreMsg(item, index)"
            v-model="live2d.msgs[index]"
          />
          <span class="delete" @click="deleteMsg(index)" title="删除">
            <svg-icon class="icon" icon-class="cancel" />
          </span>
        </div>
        <div class="add">
          <span title="添加" @click="addMsg">
            <svg-icon class="icon" icon-class="addC" />
          </span>
        </div>
      </div>
      <div class="item chats">
        <div class="title">* 聊天 :</div>
        <div class="input" v-for="(item, index) in live2d.chats" :key="index">
          <input
            type="text"
            @blur="updateStoreChat(item, index)"
            v-model="live2d.chats[index]"
          />
          <span class="delete" @click="deleteChats(index)" title="删除">
            <svg-icon class="icon" icon-class="cancel" />
          </span>
        </div>
        <div class="add">
          <span title="添加" @click="addChats">
            <svg-icon class="icon" icon-class="addC" />
          </span>
        </div>
      </div>
      <div class="close">
        <span class="title">* 关闭此特效 :</span>
        <el-switch
          v-model="live2d.show"
          active-color="#13ce66"
          inactive-color="#ff4949"
        ></el-switch>
      </div>
    </div>
  </div>
</template>
<script>
import configHeader from '@/components/configHeader'
import live2d from '@/components/live2d/live2d'
// import { deepClone } from '@/utils/index.js'
import { updateBlogSetting } from '@/api/blog'
export default {
  name: 'Cartoons',
  data () {
    return {
      showLive: true,
      firstLoad: true,
      editState: false, // 模型是否处于编辑状态
      live2d: this.$store.state.blog.blogSetting.live2d,
      models: [] // 可用模型
    }
  },
  created () {
    this.$store.state.live2d.models.forEach(item => {
      this.models.push(item.value)
    })
  },
  watch: {
    '$store.state.blog.blogSetting': {
      handler: function (val) {
        if (!val) return
        if (this.firstLoad) {
          this.blogSetting = val
          this.live2d = val.live2d
          /* this.$set(this.live2d, 'width', val.live2d.width)
          this.$set(this.live2d, 'height', val.live2d.height)
          this.$set(this.live2d, 'left', val.live2d.left)
          this.$set(this.live2d, 'top', val.live2d.top)
          this.$set(this.live2d, 'show', val.live2d.show)
          this.$set(this.live2d, 'msgs', val.live2d.msgs)
          this.$set(this.live2d, 'chats', val.live2d.chats)

          "width": 250,
        "height": 200,
        "left": 400,
        "top": 500, */
          this.firstLoad = false
        }
        // console.log('updateBlogger', val)
      },
      deep: true
    },
    live2d: {
      handler: function (val) {
        console.log(val, 'live2d')
        const blogSetting = this.$store.state.blog.blogSetting
        blogSetting.live2d = val
        updateBlogSetting(blogSetting).then(res => {
          this.$store.dispatch('blog/setBlogSetting', blogSetting)
          // this.updateModel()
        })
      },
      deep: true

    }
  },
  computed: {},
  mounted () {},
  methods: {
    updateModel () {
      this.showLive = false
      setTimeout(() => {
        this.showLive = true
      }, 100)
    },
    showlive2d () {
      this.showLive = false
      let index = this.models.indexOf(this.live2d.showModel)
      if (index === this.models.length - 1) {
        // 切换时index + 1
        index = 0
      }
      this.live2d.showModel = this.models[index + 1]
      setTimeout(() => {
        this.showLive = true
      }, 100)
    },
    change () {
      this.updateModel()
    },
    addMsg () {
      // 保存的时候记得过滤空
      this.live2d.msgs.push('')
    },
    addChats () {
      this.live2d.chats.push('')
    },
    updateStoreMsg (item, index) {
      // 如果内容为空或者无改变而出发blur事件就不操作
      /* if (item === '' || item === this.blogSetting.live2d.msgs[index]) {
      } else {
        this.blogSetting.live2d.msgs
      } */
    },
    updateStoreChat (item, index) {
      // 如果内容为空或者无改变而出发blur事件就不操作
      /* if (item === '' || item === this.$store.state.live2d.chats[index]) {
      } else {
        this.$store.dispatch('live2d/setChats', deepClone(this.chats))
      } */
    },
    deleteMsg (index) {
      this.live2d.msgs.splice(index, 1)
    },
    deleteChats (index) {
      this.live2d.chats.splice(index, 1)
    }
  },
  components: {
    configHeader,
    live2d
  }
}
</script>
<style lang="scss" scoped>
.title {
  margin: 10px 0;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.5px;
}
.add {
  text-align: center;
  font-size: 18px;
  cursor: pointer;
}
.Cartoons {
  .wrap {
    height: calc(100vh - 157px);
    overflow-y: auto;
    background: #f6f6f6;
    margin: 0 -32px;
    padding-right: 16px;
    padding-left: 32px;
    padding-bottom: 16px;
  }
  .item {
    margin: 10px 0;
  }
  .size,
  .position {
    label {
      font-size: 14px;
      font-weight: 400;
    }
    input {
      width: 100px;
      padding: 0 6px;
      font-size: 14px;
      font-weight: 300;
      text-align: center;
      line-height: 22px;
      min-height: 22px;
      border-radius: 5px;
      text-overflow: ellipsis;
    }
    input:focus {
      background: rgb(235, 235, 235);
    }
  }
  .messages,
  .chats {
    input {
      width: 94%;
      padding: 0 6px;
      margin: 2px 0;
      font-size: 14px;
      font-weight: 300;
      line-height: 22px;
      min-height: 22px;
      border-radius: 5px;
      text-overflow: ellipsis;
    }
    input:focus {
      background: rgb(235, 235, 235);
    }
    .delete {
      vertical-align: middle;
      font-size: 18px;
      cursor: pointer;
    }
  }
}
</style>
