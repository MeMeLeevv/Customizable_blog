<template>
  <div class="blogs-settings">
    <span class="publish" title="发布" @click.stop="goBlankEditBlog">
      <svg-icon class="icon" icon-class="add" />
    </span>
    <configHeader :backRouter="`/${this.$store.state.user.blogId}`" lastTitle="首页" nowTitle="博客"></configHeader>
    <div class="search">
      <svg-icon class="icon" icon-class="search" />
      <input v-model="searchContent" placeholder="搜索项目..." type="search" />
      <div class="searchWrap">
        <div class="searchItem" @click.stop="goInArticle(item.articleId)" v-for="(item, index) in searchResult" :key="index">
          <div class="wordWrap">
            <span class="title">{{item.title}}</span>
            <span class="desc"> —— {{item.Summary}}</span>
          </div>
          <el-avatar class="avatar" shape="square" :size="50" fit="cover" :src="item.cover"></el-avatar>
        </div>
      </div>
    </div>
    <div class="tabbar" @click="requestArticle($event)">
      <!-- 点击tabbar高亮，tag的界面修改 -->
      <span :class="`${requestClass === '1' ? 'active' : ''} item`" data-request="1">发布</span>
      <span :class="`${requestClass === '2' ? 'active' : ''} item`" data-request="2">草稿</span>
      <span :class="`${requestClass === '3' ? 'active' : ''} item`" data-request="3">垃圾桶</span>
      <span
        ref="tags"
        :class="`${requestClass === 'tags' ? 'active' : ''} item`"
        data-request="tags"
      >分类</span>
    </div>
    <div v-if="requestClass === 'tags'" class="tagsList" @click="requestTagArt($event)">
      <span
        v-for="(item, index) in tags"
        :key="index"
        :data-request="item"
        :class="`${requestTag === item ? 'active' : ''}`"
        class="tag"
      >{{item}}</span>
    </div>
    <div
      class="showBlog"
      :style="`height: ${requestClass === 'tags' && tags.length > 0 ? 'calc(100vh - 245px - 64px)' : 'calc(100vh - 245px)'} ;`"
    >
      <div
        v-for="(item, index) in blogData"
        :key="index"
        class="item"
        @mouseenter="blogData[index].showEditBtn = true"
        @mouseleave="blogData[index].showEditBtn = false"
      >
        <div class="msg">
          <div class="top">
            <span class="title" :title="item.title">{{item.title}}</span>
            <!-- 一行省略！！！！ -->
            <span v-if="item.commentNum" class="commentNum">{{item.commentNum}}</span>
          </div>
          <div>
            <span
              class="class"
            >{{item.statusValue === '1' ? '发布' : item.statusValue === '2' ? '草稿' : '已删除'}}</span>
            <span class="publishTime">{{item.publicTime}}</span>
          </div>
        </div>
        <div class="pic" :style="`background-image: url(${item.cover})`"></div>
        <transition name="slide-fade">
          <div v-if="blogData[index].showEditBtn" class="btn">
            <div
              v-if="requestClass !== '3'"
              class="edit"
              @click.stop="goInArticle(item.articleId)"
            >编辑</div>
            <div v-else class="edit" @click.stop="recovery(item.articleId, index)">恢复</div>
            <div
              v-if="requestClass !== '3'"
              class="delete"
              @click.stop="deleteArticle(item.articleId, index)"
            >删除</div>
            <div v-else class="delete" @click.stop="deleteArCompletely(item.articleId, index)">彻底删除</div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>
<script>
/* 路由显示文章id， for循环文章数组，如果id匹配则ACTIVE状态 */
// import { deepClone } from '@/utils/index.js'
import configHeader from '@/components/configHeader'
import { fetchList, updateArticle, createArticle } from '@/api/article'
import { getBlogSetting } from '@/api/blog'

export default {
  name: 'blogs-settings',
  data () {
    return {
      requestClass: '1', // draft/delete/tags
      requestTag: '',
      height: '',
      searchContent: '',
      searchResult: [],
      tags: [],
      blogData: [
        /* {
          title: '粉彩35344444444444444444444444444444444444444444444',
          commentNum: 1,
          class: '草稿',
          publicTime: '上星期三 13:14 pm',
          cover:
            'http://up.enterdesk.com/edpic_360_360/0d/5b/13/0d5b1395af7cf6441276d37b1caf947c.jpg',
          showEditBtn: false
        },
        {
          title: '粉彩',
          commentNum: 0,
          class: '已发布',
          publicTime: '上星期三 13:14 pm',
          cover:
            'https://tse4-mm.cn.bing.net/th?id=OIP.jLZH6cGvAFAoyAaSrbCytQHaEx&pid=Api&rs=1',
          showEditBtn: false
        },
        {
          title: '粉彩',
          commentNum: 0,
          class: '已发布',
          publicTime: '上星期三 13:14 pm',
          cover:
            'https://tse1-mm.cn.bing.net/th?id=OIP.GeaC4usF_VB_Baxba_Qs6wHaE7&pid=Api&rs=1',
          showEditBtn: false
        },
        {
          title: '粉彩',
          commentNum: 0,
          class: '已发布',
          publicTime: '上星期三 13:14 pm',
          cover:
            'https://tse2-mm.cn.bing.net/th?id=OIP.BCvxraCfcl9WxgvLcs2XxAAAAA&pid=Api&rs=1',
          showEditBtn: false
        },
        {
          title: '粉彩',
          commentNum: 0,
          class: '已发布',
          publicTime: '上星期三 13:14 pm',
          cover:
            'http://up.enterdesk.com/edpic_360_360/0d/5b/13/0d5b1395af7cf6441276d37b1caf947c.jpg',
          showEditBtn: false
        } */
      ]
    }
  },
  created () {},
  computed: {},
  watch: {
    searchContent (newV) {
      this.searchArt()
    },
    requestClass: {
      handler (newV, oldV) {
        const that = this
        if (newV === oldV || !newV) return // 重复点击或无效点击
        if (newV === 'tags') {
          // 如果点击了分类，默认转到第一个tag（如果有tags的话）
          getBlogSetting(this.$store.state.user.blogId).then(res => {
            this.tags = res.data.tagsArr
            if (this.tags.length !== 0) {
              this.requestTag = this.tags[0]
            }
          })
        } else {
          fetchList({ blogId: this.$store.state.user.blogId }).then(res => {
            if (res.data.length === 0) return
            that.blogData = res.data.filter(item => item.statusValue === newV)
            // console.log(that.blogData, 'that.blogData')
            for (let i = 0; i <= that.blogData.length - 1; i++) {
              const content = that.blogData[i].content
              const start = content.search(/>/)
              const last = content.search(/<\/h1>/)
              // console.log(that.blogData[i], 'that.blogData[i]')
              that.blogData[i].title = content.slice(start + 1, last)
              this.$set(that.blogData[i], 'showEditBtn', false) // 深度双向绑定（与html）
            }
            // console.log(res, 'blogList res')
          })
        }
      },
      immediate: true
    },
    requestTag: {
      handler (newV, oldV) {
        if (newV !== oldV && newV) {
          fetchList({ blogId: this.$store.state.user.blogId })
            .then(res => {
              this.blogData = res.data.filter(item => {
                return (
                  item.tapsArr.indexOf(newV) !== -1 &&
                  item.statusValue !== '3' &&
                  item.statusValue !== '4'
                )
              })
            })
            .then(res => {
              for (let i = 0; i <= this.blogData.length - 1; i++) {
                const content = this.blogData[i].content
                const start = content.search(/>/)
                const last = content.search(/<\/h1>/)
                // console.log(that.blogData[i], 'that.blogData[i]')
                this.blogData[i].title = content.slice(start + 1, last)
                this.$set(this.blogData[i], 'showEditBtn', false) // 深度双向绑定（与html）
              }
            })
        } // 重复点击或无效点击
      }
    }
  },
  mounted () {},
  methods: {
    goBlankEditBlog () {
      this.$store.dispatch('user/setConfigNow', true)
      console.log('create')
      createArticle({ blogId: this.$store.state.user.blogId }).then(res => {
        this.$router.push(`/${this.$route.params.blogId}/articles/${res.data.articleId}`)
      }) // 如果为空推出后要销毁
    },
    searchArt () {
      this.searchContent = this.searchContent.trim()
      if (!this.searchContent) {
        this.searchResult = []
        return
      }
      fetchList({ blogId: this.$store.state.user.blogId }).then(res => {
        this.searchResult = []
        if (res.data.length === 0) {
          this.searchResult = []
        } else {
          const blogData = res.data.filter(
            item => item.statusValue !== '3' && item.statusValue !== '4'
          )
          // console.log(this.blogData, 'this.blogData')
          for (let i = 0; i <= blogData.length - 1; i++) {
            const content = blogData[i].content
            const start = content.search(/>/)
            const last = content.search(/<\/h1>/)
            // console.log(this.blogData[i], 'this.blogData[i]')
            const title = content.slice(start + 1, last)
            if (title.indexOf(this.searchContent) !== -1) {
              blogData[i].title = title
              this.searchResult.push(blogData[i])
            }
          }
        }
        // console.log(res, 'blogList res')
      })
    },
    deleteArCompletely (articleId, index) {
      this.$confirm('此操作将彻底删除该文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          updateArticle({ articleId: articleId, statusValue: '4' }).then(
            res => {
              // console.log(res, 'res')
              this.blogData.splice(index, 1)
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            }
          )
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    recovery (articleId, index) {
      this.$confirm('此操作将恢复文章成草稿, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          updateArticle({ articleId: articleId, statusValue: '2' }).then(
            res => {
              // console.log(res, 'res')
              this.blogData.splice(index, 1)
              this.$message({
                type: 'success',
                message: '恢复成功!'
              })
            }
          )
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消恢复'
          })
        })
    },
    deleteArticle (articleId, index) {
      this.$confirm(
        '此操作将删除该文章, 您可以在垃圾箱找到它，是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          updateArticle({ articleId: articleId, statusValue: '3' }).then(
            res => {
              // console.log(res, 'res')
              this.blogData.splice(index, 1)
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            }
          )
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    goInArticle (articleId) {
      this.$store.dispatch('user/setConfigNow', true)
      if (this.$route.params.articleId === articleId) return
      this.$router.push(
        `/${this.$store.state.user.blogId}/articles/${articleId}`
      )
    },
    requestArticle (e) {
      this.requestClass = e.target.dataset.request
    },
    requestTagArt (e) {
      this.requestTag = e.target.dataset.request
    }
  },
  components: {
    configHeader
  }
}
</script>
<style lang="scss" scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: transform 0.1s linear;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active 用于 2.1.8 以下版本 */ {
  transform: translateX(5px);
  opacity: 0;
}

.blogs-settings {
  position: relative;
  .publish {
    position: fixed;
    bottom: 100px;
    left: 198px;
    transform: translateX(-50%);
    width: 44px;
    height: 44px;
    line-height: 44px;
    text-align: center;
    border-radius: 50%;
    background: white;
    font-size: 18px;
    cursor: pointer;
    z-index: 1;
  }
  .search {
    position: relative;
    height: 44px;
    line-height: 44px;
    background: white;
    margin: 0 -32px;
    padding: 0 20px;
    .icon {
      vertical-align: middle;
      font-size: 22px;
    }
    input {
      margin-left: 10px;
      width: 250px;
      font-size: 12px;
    }
    .searchWrap {
      width: 100%;
      position: absolute;
      top: 100%;
      left: 0;
      z-index: 100;
      box-shadow: $shadow;
      background: white;
      line-height: 10px;
      .searchItem {
        padding: 10px;
        cursor: pointer;
        .wordWrap {
          width: 86%;
          height: 50px;
          display: inline-block;
          vertical-align: top;
          line-height: 50px;
          .title {
            max-width: 28%;
            display: inline-block;
            margin-left: 10px;
            font-size: 14px;
            font-weight: bold;
            letter-spacing: 1px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;

          }
          .desc {
            max-width: 70%;
            display: inline-block;
            font-size: 12px;
            letter-spacing: 1px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            text-indent: 5px;
          }
        }
        .avatar {
          float: right;
        }
      }
      .searchItem:hover {
        background: #f3f3f3;
      }
    }
  }
  .tabbar {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    margin: 0 -32px;
    height: 44px;
    line-height: 44px;
    text-align: center;
    .active {
      background: #e4e4e4;
    }
    .item {
      width: 25%;
      display: inline-block;
      font-size: 11px;
      border-left: 1px solid #f6f6f6;
      font-weight: 600;
    }
    .item:hover {
      cursor: pointer;
      background: #e4e4e4;
    }
  }
  .tagsList {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    .tag {
      padding: 10px;
      font-size: 11px;
      border-radius: 20px;
    }
    .active {
      background: #e4e4e4;
    }
    .tag:hover {
      background: #e4e4e4;
      cursor: pointer;
    }
  }
  .showBlog {
    margin: 0 -32px;
    overflow-y: auto;
    overflow-x: hidden;
    background: #f6f6f6;
    .itemActive {
      background: #e4e4e4;
    }
    .item {
      position: relative;
      height: 88px;
      padding: 22px 0px 22px 33px;
      border-bottom: 1px solid #f6f6f6;
      .msg {
        display: inline-block;
        .top {
          margin: 0 0 2px 0;
        }
        .title {
          display: inline-block;
          max-width: 170px;
          vertical-align: middle;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 16px;
        }
        .commentNum,
        .class {
          padding: 4px 6px;
          vertical-align: middle;
          margin: 0 10px;
          text-align: center;
          background: #d0d0d0;
          font-size: 11px;
        }
        .class {
          margin: 0 5.5px 0 0;
        }
        .publishTime {
          color: #a1a1a1;
          font-size: 11px;
        }
      }
      .pic {
        width: 88px;
        height: 87px;
        position: absolute;
        right: 0;
        top: 0;
        background-size: cover;
      }
      .btn {
        position: absolute;
        right: 0;
        top: 0;
        width: 88px;
        text-align: center;
        .edit,
        .delete {
          height: 44px;
          line-height: 44px;
          font-size: 11px;
          background: #e4e4e4;
          border-bottom: 1px solid #f6f6f6;
          border-left: 1px solid #f6f6f6;
        }
        .edit:hover {
          background: #d0d0d0;
        }
        .delete:hover {
          background: #f0523d;
        }
      }
    }
    .item:hover {
      background: #e4e4e4;
      cursor: pointer;
    }
  }
}
</style>
