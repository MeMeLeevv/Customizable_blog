<template>
  <div class="comments-settings">
    <div class="overlay" v-if="showNullTip || showDeleteTip"></div>
    <configHeader :backRouter="`/${this.$store.state.user.blogId}`" lastTitle="首页" nowTitle="评论"></configHeader>
    <div v-if="showDeleteTip" class="DeleteTip">
      <div class="title">删除评论</div>
      <div class="content">您确定要删除此评论吗</div>
      <div class="btnWrap" @click="showNullTip = false">
        <div class="cancel" @click="showDeleteTip = false">取消</div>
        <div class="delete" @click="deleteComment">删除</div><!--  -->
        <div class="delete0Report" @click="deleteAReportCom">删除并举报</div>
      </div>
    </div>
    <div v-if="showNullTip" class="nullTip">
      <div class="title">请输入评论文字</div>
      <div class="content">在上方字段中输入文字以发表评论。</div>
      <div class="btnWrap" @click="showNullTip = false">
        <div class="ok">好的</div>
      </div>
    </div>
    <div class="tabbar" @click="requestComments($event)">
      <div :class="`${requireComments === 'all' ? 'active' : ''} item`" data-request="all">所有</div>
      <div :class="`${requireComments === 'beReported' ? 'active' : ''} item`" title="被其他用户举报" data-request="beReported">被标记</div>
    </div>
    <div class="commentWrap" style="height: calc(100vh - 203px)">
      <div
        class="item"
        v-for="(item,index) in comments"
        :key="index"
        @mouseenter="item.showIcons = true"
        @mouseleave="item.showIcons = false"
      >
        <div class="header">
          <div class="avatar">
            <img class="img" :src="item.avatar" alt />
          </div>
          <div class="detailMag">
            <div class="name">{{item.name}}</div>
            <div class="tipMsg">
              <span class="time">{{item.time}}</span> 关于
              <span class="articleName">{{item.articleTitle}}</span>
            </div>
            <div class="beReply" v-if="item.beReply">
              <div class="content">
                回复
                <span class="beReplyName">{{item.beReply.name}} :</span>
                <span class="beReplyContent" :title="item.beReply.content">{{item.beReply.content}}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="replyContent">{{item.content}}</div>
        <transition name="fade">
          <div v-show="item.showIcons" class="icons">
            <span class="icon bin" title="删除" @click="(showDeleteTip = true) && (deleteIndex = index)">
              <svg-icon icon-class="bin" />
            </span>
            <span class="icon" title="回复" @click="replyInput.apply(this,[$event ,item, index])">
              <svg-icon icon-class="comment" />
            </span>
          </div>
        </transition>
        <div class="replyArea" v-if="item.showComment">
          <textarea v-model="item.bloggerReply" class="textArea" name id cols="30" rows="10"></textarea>
          <span @click="submitComment(item)" class="replyBtn">回复</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import configHeader from '@/components/configHeader'
import { Message } from 'element-ui'
import { fetchPacomment, fetchSoncomment, createSoncomment } from '@/api/comment'
import { fetchArticle } from '@/api/article'
import { parseTime } from '@/utils/index.js'
/* PaPaCommentId: { type: String, required: true },
    userId: String,
    blogId: String,
    commentId: String,
    time: String,
    content: String,
    likes: Array,
    reports: Array,
    beReply: {
      name: String,
      content: String,
      userId: String,
      commentId: String
    },
    name: String,
    avatar: String */
export default {
  name: 'comments-settings',
  data () {
    return {
      content: '',
      requireComments: 'all',
      showNullTip: false,
      showDeleteTip: false,
      deleteIndex: -1, // 被点击删除的comment的索引
      comments: [
        /* {
          state: 1, // 是否显示，数据库不会真的删除
          hasReported: false, // 是否被举报
          showIcons: false,
          showComment: false,
          articleID: '12344',
          articleTitle: '粉彩',
          replyID: '111',
          replyName: 'Amy Cooper',
          replyAvatar:
            'https://gss0.baidu.com/-Po3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/8cb1cb13495409231efd8e7d9458d109b3de4919.jpg',
          replyTime: '12小时前',
          replyContent: '哈哈哈你说得对!',
          likes: [],
          bloggerReply: '', // 博主回复， 用于textarea的v-model绑定
          beReplyName: 'Emma',
          beReplyContent:
            '这个js技巧很不错哦!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!这个js技巧很不错哦!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'
        },
        {
          state: 1, // 是否显示，数据库不会真的删除
          hasReported: false, // 是否被举报
          showIcons: false,
          showComment: false,
          articleID: '12344',
          articleTitle: '粉彩',
          replyID: '111',
          replyName: 'Amy Cooper',
          replyAvatar:
            'https://gss0.baidu.com/-Po3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/8cb1cb13495409231efd8e7d9458d109b3de4919.jpg',
          replyTime: '12小时前',
          replyContent: '哈哈哈!',
          likes: [],
          beReplyName: 'Emma',
          beReplyContent: '',
          bloggerReply: '' // 博主回复， 用于textarea的v-model绑定
        },
        {
          state: 1, // 是否显示，数据库不会真的删除
          hasReported: false, // 是否被举报
          showIcons: false,
          showComment: false,
          articleID: '12344',
          articleTitle: '粉彩',
          replyID: '111',
          replyName: 'Amy Cooper',
          replyAvatar:
            'https://gss0.baidu.com/-Po3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/8cb1cb13495409231efd8e7d9458d109b3de4919.jpg',
          replyTime: '12小时前',
          replyContent: '哈哈哈!',
          likes: [],
          beReplyName: 'Emma',
          beReplyContent: '这个js技巧很不错哦!',
          bloggerReply: '' // 博主回复， 用于textarea的v-model绑定
        },
        {
          state: 1, // 是否显示，数据库不会真的删除
          hasReported: false, // 是否被举报
          showIcons: false,
          showComment: false,
          articleID: '12344',
          articleTitle: '粉彩',
          replyID: '111',
          replyName: 'Amy Cooper',
          replyAvatar:
            'https://gss0.baidu.com/-Po3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/8cb1cb13495409231efd8e7d9458d109b3de4919.jpg',
          replyTime: '12小时前',
          replyContent: '哈哈哈!',
          likes: [],
          beReplyName: 'Emma',
          beReplyContent: '这个js技巧很不错哦!',
          bloggerReply: '' // 博主回复， 用于textarea的v-model绑定
        } */
      ],
      submitComData: {
        PaPaCommentId: '',
        userId: this.$store.state.user.userId,
        commentId: '',
        articleId: '',
        blogId: this.$route.params.blogId,
        time: '',
        content: '',
        likes: [],
        reports: [],
        name: this.$store.state.user.name,
        avatar: this.$store.state.user.avatar,
        beReply: {
          name: '',
          content: ''
        }
      }
    }
  },
  created () {
  },
  watch: {
    requireComments: {
      handler: function (newV, oldV) {
        if (newV === oldV || !newV) return
        this.comments = []
        if (newV === 'all') {
          fetchPacomment({ blogId: this.$store.state.user.blogId }).then(paC => {
            if (paC.data.length !== 0) {
              this.comments = this.comments.concat(paC.data)
              // console.log(this.commentsPaPaMsg, 'this.commentsPaPaMsg')
              // this.commentsPaPaMsg.reverse()
            }
          }).then(res => {
            fetchSoncomment({ blogId: this.$store.state.user.blogId }).then(sonC => {
              if (sonC.data.length !== 0) {
                this.comments = this.comments.concat(sonC.data)
              }
            }).then(res => {
              for (let i = 0; i <= this.comments.length - 1; i++) {
                this.$set(this.comments[i], 'showIcons', false)
                this.$set(this.comments[i], 'showComment', false)
                fetchArticle(this.comments[i].articleId).then(res => {
                  const content = res.data[0].content
                  const start = content.search(/>/)
                  const last = content.search(/<\/h1>/)
                  this.$set(this.comments[i], 'articleTitle', content.slice(start + 1, last))
                  // this.comments[i].articleTitle = content.slice(start + 1, last)
                  // console.log(start, last, content)
                  // console.log(res, 'blogList res')
                })
              }
              this.comments.reverse()
            })
          })
        } else {
          fetchPacomment({ blogId: this.$store.state.user.blogId }).then(paC => {
            if (paC.data.length !== 0) {
              this.comments = this.comments.concat(paC.data)
              // console.log(this.commentsPaPaMsg, 'this.commentsPaPaMsg')
              // this.commentsPaPaMsg.reverse()
            }
          }).then(res => {
            fetchSoncomment({ blogId: this.$store.state.user.blogId }).then(sonC => {
              if (sonC.data.length !== 0) {
                this.comments = this.comments.concat(sonC.data)
              }
            }).then(res => {
              this.comments.sort((a, b) => b.time - a.time)
              this.comments = this.comments.filter(item => item.reports.length !== 0)
              for (let i = 0; i <= this.comments.length - 1; i++) {
                this.$set(this.comments[i], 'showIcons', false)
                this.$set(this.comments[i], 'showComment', false)
                fetchArticle(this.comments[i].articleId).then(res => {
                  const content = res.data[0].content
                  const start = content.search(/>/)
                  const last = content.search(/<\/h1>/)
                  this.$set(this.comments[i], 'articleTitle', content.slice(start + 1, last))
                  // this.comments[i].articleTitle = content.slice(start + 1, last)
                  // console.log(start, last, content)
                  // console.log(res, 'blogList res')
                })
              }
              this.comments.reverse()
            })
          })
        }
      },
      immediate: true
    }
  },
  computed: {},
  mounted () {},
  methods: {
    submitComment (item) {
      if (!item.bloggerReply) {
        // 回复为空
        this.showNullTip = true
        return
      }
      this.submitComData.content = item.bloggerReply
      this.submitComData.time = parseTime(new Date(), '{y}/{m}/{d} {h}:{i}:{s}')
      createSoncomment(this.submitComData).then(res => {
        // console.log(res, 'sonRes')
        this.submitComData.commentId = res.data.commentId
        this.submitComData.showIcons = false
        this.submitComData.showComment = false
        console.log(this.submitComData, 'this.submitComData')
        // this.DataTransit[this.faIndex].commentsSonMsg.unshift(copyOjb)
        this.comments.unshift(this.submitComData)
        // console.log(this.submitComData, 'this.submitComData')
        item.showComment = !item.showComment
      })
    },
    /* 使用两个变量 clickReplyIndex 保存被点击的reply的index；showReplyArea 保存是否有reply框显示 */
    replyInput (e, item, index) { // 传入被评论者的数据：PaPaCommentId name content
      // 同时准备提交按钮的数据，然后通过propsData传递给子元素
      // console.log(item, 'item')
      item.showComment = !item.showComment
      this.submitComData = { // 初始化
        userId: this.$store.state.user.userId,
        articleId: item.articleId,
        commentId: '',
        blogId: this.$route.params.blogId,
        time: '',
        content: '',
        likes: [],
        reports: [],
        name: this.$store.state.user.name,
        avatar: this.$store.state.user.avatar,
        beReply: {
          name: item.name,
          content: item.content,
          commentId: item.commentId,
          userId: item.userId
        }
      }
      if (item.PaPaCommentId === undefined) {
        this.submitComData.PaPaCommentId = item.commentId
      } else {
        this.submitComData.PaPaCommentId = item.PaPaCommentId
      }
      // // console.log(parent.className, 'e')
    },
    requestComments (e) {
      this.requireComments = e.target.dataset.request
    },
    deleteComment () {
      this.comments[this.deleteIndex].state = 0 // 不显示
      this.comments.splice(this.deleteIndex, 1)
      this.showDeleteTip = false
      console.log('发送数据库请求')
    },
    deleteAReportCom () {
      this.comments[this.deleteIndex].state = 0 // 不显示
      this.comments[this.deleteIndex].hasReported = true // 举报
      this.showDeleteTip = false
      this.comments.splice(this.deleteIndex, 1)
      console.log('发送数据库请求')
    },
    reply (item, index) {
      if (!item.bloggerReply) {
        // 回复为空
        this.showNullTip = true
        return
      }
      const data = {
        hasReported: false, // 是否被举报
        showIcons: false,
        showComment: false,
        articleID: item.articleID,
        articleTitle: item.articleTitle,
        replyID: '1234', // 获取用户id
        replyName: 'Amy Cooper', // 获取用户名称
        replyAvatar:
          'https://gss0.baidu.com/-Po3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/8cb1cb13495409231efd8e7d9458d109b3de4919.jpg', // 获取用户头像
        replyTime: '12小时前',
        replyContent: item.bloggerReply,
        likes: [],
        beReplyName: item.replyName,
        beReplyContent: item.replyContent,
        bloggerReply: '' // 博主回复， 用于textarea的v-model绑定
      }
      this.comments[index].showComment = false
      console.log(data, '发送数据data')
      Message({ // 数据库插入成功后返回msg后出现
        message: '回复成功',
        type: 'success',
        duration: 3 * 1000
      })
    }
  },
  components: {
    configHeader
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

.comments-settings {
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9999;
    opacity: 0;
  }
  .nullTip,
  .DeleteTip {
    width: 350px;
    padding: 22px 33px;
    position: fixed;
    z-index: 10000;
    top: 244px;
    left: 20px;
    box-shadow: $shadow;
    font-size: 12px;
    color: #3e3e3e;
    background: #f6f6f6;
    text-align: center;
    border: 1px solid #e4e4e4;
    border-radius: 5px;
    .title {
      margin-bottom: 11px;
      font-weight: 600;
    }
  }
  .DeleteTip {
    .btnWrap {
      height: 54px;
      display: flex;
      margin: 22px -33px -22px;
      border-top: 1px solid #e4e4e4;
      .cancel,
      .delete,
      .delete0Report {
        padding: 22px 33px;
        width: 33.3%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-right: 1px solid #e4e4e4;
      }
      .delete0Report {
        border-right: none;
      }
      .cancel:hover,
      .delete0Report:hover {
        background: white;
      }
      .delete:hover {
        background: $font_error;
        color: white;
      }
    }
  }
  .nullTip {
    .btnWrap {
      border-top: 1px solid #e4e4e4;
      display: flex;
      margin: 22px -33px -22px;
      .ok {
        margin: 0 auto;
        padding: 10px 0;
      }
    }
    .btnWrap:hover {
      background: white;
      cursor: pointer;
    }
  }
  .tabbar {
    line-height: 44px;
    margin: 0 -33px;
    margin-top: 11px;
    display: flex;
    font-size: 12px;
    border-bottom: 2px solid #e4e4e4;
    text-align: center;
    .item {
      width: 50%;
      border-left: 1px solid #f6f6f6;
      cursor: pointer;
      border-radius: 3px;
    }
    .item:hover, .active {
      background: #e4e4e4;
    }
  }
  .commentWrap {
    border-bottom: 1px solid #e4e4e4;
    margin: 0 -33px;
    padding: 0 33px 0;
    overflow-y: auto;
    overflow-x: hidden;
    background: #f6f6f6;
    .item {
      position: relative;
      margin: 0 -33px;
      padding: 22px 33px 11px;
      letter-spacing: 0.5px;
      border-top: 1px solid #e4e4e4;
      cursor: pointer;
      overflow: hidden;
      .header {
        .avatar {
          display: inline-block;
          width: 44px;
          height: 44px;
          .img {
            display: inline-block;
            width: 44px;
            height: 44px;
            border-radius: 50%;
          }
        }
        .detailMag {
          display: inline-block;
          margin-left: 22px;
          margin-top: 5px;
          font-size: 11px;
          color: #999999;
          vertical-align: top;
          .name {
            font-size: 16px;
            color: #3e3e3e;
          }
          .tipMsg {
            margin: 2px 0;
          }
          .beReply {
            padding: 2px 4px;
            max-width: 249px;
            line-height: 14px;
            background: #a1a1a1;
            color: white;
            border-radius: 4px;
            .content {
              text-overflow: -o-ellipsis-lastline;
              word-break: break-all;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }
          }
        }
      }
      .replyContent {
        margin: 5px 0 12px 66px;
        font-size: 12px;
      }
      .icons {
        position: absolute;
        right: 20px;
        top: 20px;
        .icon {
          margin-left: 10px;
          font-size: 18px;
          vertical-align: middle;
        }
        .bin:hover .svg-icon {
          fill: $font_error;
        }
      }
      .replyArea {
        .textArea {
          padding: 11px;
          line-height: 22px;
          height: 155px;
          width: 100%;
          color: #3e3e3e;
          border: none;
          background-color: #fff;
          resize: vertical;
          font-size: 12px;
        }
        .replyBtn {
          display: inline-block;
          margin: 3px 0;
          padding: 11px;
          background: #3e3e3e;
          color: white;
          font-size: 12px;
        }
        .replyBtn:hover {
          background: black;
        }
      }
    }
    .item:hover {
      background-color: rgba(0, 0, 0, 0.025);
    }
  }
}
</style>
