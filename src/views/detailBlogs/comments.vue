<template>
  <div class="comments">
    <div v-if="visitor" class="map"></div>
    <div class="commentItem" v-for="(item, index) in trueShowData" :key="index">
      <div class="avatar">
        <img :src="item.avatar" alt />
      </div>
      <div class="detailMsg">
        <div class="name">{{item.name}}</div>
        <div class="content">{{item.content}}</div>
        <div class="bottom" ref="iconBottom">
          <span class="time">{{item.time}}</span>
          <span class="likes" @click.stop="like(index)">
            <svg-icon class="icon" :icon-class="item.liked ? 'liked' : 'like'" />
            {{item.likes.length}}
          </span>
          <span @click.stop="replyInput.apply(this,[$event ,index, undefined, item])" class="reply" title="回复">
            <svg-icon class="icon" icon-class="comment" />
          </span>
          <span :class="`report ${item.reported}`" title="举报"  @click.stop="report(index)">
            <svg-icon class="icon" :icon-class="item.reported ? 'reported' : 'report'" />
          </span>
          <span class="delete" title="删除" @click="deleteThis(index)">
            <svg-icon class="icon" icon-class="bin" />
          </span>
        </div>
      </div>
      <div class="replyArea" v-for="(it,ix) in item.commentsSonMsg" :key="ix">
        <div class="avatar">
          <img :src="it.avatar" alt />
        </div>
        <div class="detailReply">
          <div class="top">
            <span class="name">{{it.name}}</span>
            <span v-if="it.beReply.userId !== ''">
              回复
              <span class="beReplyName">{{it.beReply.name}}</span> :
              <span class="beReplycontent">{{it.beReply.content}}</span>
            </span>
          </div>
          <div class="content">{{it.content}}</div>
          <div class="bottom">
            <span class="time">{{it.time}}</span>
            <span class="likes" @click.stop="like(index, ix)">
              <svg-icon class="icon" :icon-class="it.liked ? 'liked' : 'like'" />
              {{it.likes.length}}
            </span>
            <span class="reply" title="回复" @click.stop="replyInput.apply(this,[$event ,index, ix, it])">
              <svg-icon class="icon" icon-class="comment" />
            </span>
            <span class="report" title="举报" @click.stop="report(index, ix)">
              <svg-icon class="icon" :icon-class="it.reported ? 'reported' : 'report'" />
            </span>
            <span class="delete" title="删除" @click="deleteThis(index, ix)">
              <svg-icon class="icon" icon-class="bin" />
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { createSoncomment, updatePacomment, updateSoncomment } from '@/api/comment'
import Vue from 'vue'
import replyTextarea from './replyTextarea.vue'
import { deepClone, parseTime } from '@/utils/index.js'
import { createNotice } from '@/api/notice'
export default {
  name: 'comments',
  props: {
    commentsPaPaMsg: Array,
    insertPaData: Object,
    cover: String
  },
  data () {
    return {
      replyElem: '', // 存放reply dom元素
      visitor: true,
      showReplyArea: false, // 是否存在有reply框被打开
      faIndex: '', // 被点击的第一级index
      sonIndex: '',
      isSonReply: false, // 用户是否点击了子回复框
      userId: '666',
      DataTransit: [], // 暂时储存insertPaData，然后传给trueShowData（不用这个变量会出现第一级的评论的report图标无法双向绑定，但是数据是有变化的
      trueShowData: [],
      submitComData: {
        PaPaCommentId: this.commentsPaPaMsg[0].commentId,
        userId: this.$store.state.user.userId,
        commentId: '',
        articleId: this.$route.params.articleId,
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
  created () { // 初始化DataTransit liked/reported/userid下的name和avatar
    this.initData()
  },
  watch: {
    '$store.state.user.hasLogin': {
      handler (val) {
        this.visitor = !val
      },
      immediate: true
    },
    'replyElem.$data.submitReply' (newV, oldV) {
      if (newV) {
        this.submitComment(this.replyElem.$data.replyContent)
      }
    },
    commentsPaPaMsg: { // 初始化时根据userid拉取name和avatar，但是watch的时候就不需要
      handler (newV) {
        this.$emit('update:commentsPaPaMsg', newV)
        // console.log(newV, 'commentData')
        this.initData()
      },
      deep: true
    },
    insertPaData: {
      handler (newV) {
        const anewV = deepClone(newV)
        anewV.liked = false
        anewV.reported = false
        this.DataTransit.unshift(anewV)
      },
      deep: true
    },
    DataTransit: {
      handler (newV) {
        this.trueShowData = deepClone(newV)
        // console.log(newV, 'newV')
      },
      deep: true,
      immediate: true
    }
  },
  computed: {},
  mounted () {},
  methods: {
    initData () {
      this.DataTransit = deepClone(this.commentsPaPaMsg)

      if (this.DataTransit.length === 0) return
      for (let i = 0; i < this.DataTransit.length; i++) {
        if (this.DataTransit[i].likes.indexOf(this.userId) !== -1) {
          this.DataTransit[i].liked = true
        }
        if (this.DataTransit[i].reports.indexOf(this.userId) !== -1) {
          this.DataTransit[i].reported = true
        }
        for (let j = 0; j < this.DataTransit[i].commentsSonMsg.length; j++) {
          if (
            this.DataTransit[i].commentsSonMsg[j].likes.indexOf(
              this.userId
            ) !== -1
          ) {
            this.DataTransit[i].commentsSonMsg[j].liked = true
          }
          if (
            this.DataTransit[i].commentsSonMsg[j].reports.indexOf(
              this.userId
            ) !== -1
          ) {
            this.DataTransit[i].commentsSonMsg[j].reported = true
          }
        }
      }
    },
    submitComment (content) {
      this.submitComData.content = content
      this.submitComData.time = parseTime(new Date(), '{y}/{m}/{d} {h}:{i}:{s}')
      createSoncomment(this.submitComData).then(res => {
        console.log(res, 'sonRes')
        this.submitComData.commentId = res.data.commentId
        this.removeReply('replyTextarea')
        const copyOjb = deepClone(this.submitComData)
        copyOjb.liked = false
        copyOjb.reported = false
        console.log(this.submitComData, 'this.submitComData')
        // this.DataTransit[this.faIndex].commentsSonMsg.unshift(copyOjb)
        this.commentsPaPaMsg[this.faIndex].commentsSonMsg.unshift(this.submitComData)
        // console.log(this.submitComData, 'this.submitComData')
      })
    },
    /* 使用两个变量 clickReplyIndex 保存被点击的reply的index；showReplyArea 保存是否有reply框显示 */
    replyInput (e, index, ix, item) { // 传入被评论者的数据：PaPaCommentId name content
      // // console.log(e, index, ix, 'e, index, ix')
      if (this.faIndex + this.sonIndex + '' === index + ix + '') {
        // 点击相同的按钮
        if (this.showReplyArea) {
          // 如果开启了reply，需要关闭
          this.removeReply('replyTextarea')
          return
        } else {
          // 再次开启
        }
      } else {
        // 点击了不同按钮
        this.faIndex = index
        this.sonIndex = ix
        if (this.showReplyArea) {
          // 但是上一个reply还没关掉
          this.removeReply('replyTextarea')
        }
      }
      let parent = e.target.parentNode
      while (parent.className !== 'bottom') {
        parent = parent.parentNode
      }
      // 同时准备提交按钮的数据，然后通过propsData传递给子元素
      // console.log(item, 'item')
      this.submitComData = { // 初始化
        PaPaCommentId: this.commentsPaPaMsg[0].commentId,
        userId: this.$store.state.user.userId,
        articleId: this.$route.params.articleId,
        commentId: '',
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
      this.submitComData.beReply.name = item.name
      this.submitComData.beReply.content = item.content
      this.submitComData.beReply.commentId = item.commentId
      this.submitComData.beReply.userId = item.userId
      if (ix === undefined) {
        this.submitComData.PaPaCommentId = item.commentId
      } else {
        this.submitComData.PaPaCommentId = item.PaPaCommentId
      }
      // // console.log(parent.className, 'e')
      const ReplyClass = Vue.extend(replyTextarea)
      this.replyElem = new ReplyClass({
        propsData: { submitComData: this.submitComData }
      }).$mount()
      parent.appendChild(this.replyElem.$el)
      this.showReplyArea = true
    },
    removeReply (id) {
      const replyTextarea = document.getElementById(id)
      replyTextarea.remove()
      this.showReplyArea = false
    },
    deleteThis (index, sonIndex) {
      this.$confirm('此操作将永久删除此评论, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          if (sonIndex === undefined) {
            // 表示是父级被删除了
            this.commentsPaPaMsg.splice(index, 1)
            this.DataTransit.splice(index, 1)
          } else {
            this.commentsPaPaMsg[index].commentsSonMsg.splice(sonIndex, 1)
            this.DataTransit[index].commentsSonMsg.splice(sonIndex, 1)
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    report (index, sonIndex) {
      if (sonIndex === undefined) {
        // 表示是父级被举报

        this.DataTransit[index].reported = !this.DataTransit[index].reported
        // console.log(this.DataTransit[index].reported, 'this.DataTransit[index].reported')
        if (this.DataTransit[index].reported) {
          this.DataTransit[index].reports.push(this.userId)
          this.commentsPaPaMsg[index].reports.push(this.userId)
          // 加入用户的id
          /* this.$message({
            message: '已举报，感谢你的提醒^^~',
            type: 'success'
          }) */
        } else {
          const i = this.DataTransit[index].reports.indexOf(this.userId)
          this.commentsPaPaMsg[index].reports.splice(i, 1)
          this.DataTransit[index].reports.splice(i, 1)
          // 取出用户id
          /* this.$message({
            message: '已取消举报',
            type: 'success'
          }) */
        }

        updatePacomment({ reports: this.commentsPaPaMsg[index].reports, commentId: this.commentsPaPaMsg[index].commentId }).then(res => {
          // console.log(res, 'res')
        })
      } else {
        this.DataTransit[index].commentsSonMsg[sonIndex].reported = !this.DataTransit[index].commentsSonMsg[sonIndex].reported
        if (this.DataTransit[index].commentsSonMsg[sonIndex].reported) {
          this.commentsPaPaMsg[index].commentsSonMsg[sonIndex].reports.push(
            this.userId
          )
          this.DataTransit[index].commentsSonMsg[sonIndex].reports.push(
            this.userId
          )
          /* this.$message({
            message: '已举报，感谢你的提醒^^',
            type: 'success'
          }) */
          // 加入用户的id
        } else {
          const i = this.DataTransit[index].commentsSonMsg[
            sonIndex
          ].reports.indexOf(this.userId)
          this.commentsPaPaMsg[index].commentsSonMsg[sonIndex].reports.splice(
            i,
            1
          )
          this.DataTransit[index].commentsSonMsg[sonIndex].reports.splice(
            i,
            1
          )
          /* this.$message({
            message: '已取消举报',
            type: 'success'
          }) */

          // 取出用户id
        }

        updateSoncomment({ reports: this.commentsPaPaMsg[index].commentsSonMsg[sonIndex].reports, commentId: this.commentsPaPaMsg[index].commentsSonMsg[sonIndex].commentId }).then(res => {
          // console.log(res, 'res')
        })
      }
      // console.log(this.DataTransit[index], 'this.DataTransit[index]')
    },
    like (index, sonIndex) {
      let noticeContent, like
      if (sonIndex === undefined) {
        // 表示是父级被点赞了
        this.DataTransit[index].liked = !this.DataTransit[index].liked
        like = this.DataTransit[index].liked
        if (this.DataTransit[index].liked) {
          this.DataTransit[index].likes.push(this.userId)
          this.commentsPaPaMsg[index].likes.push(this.userId)
          // 加入用户的id
          /* this.$message({
            message: '作者已收到你的喜欢，感谢点赞~',
            type: 'success'
          }) */
        } else {
          const i = this.DataTransit[index].likes.indexOf(this.userId)
          this.commentsPaPaMsg[index].likes.splice(i, 1)
          this.DataTransit[index].likes.splice(i, 1)
          // 取出用户id
          /* this.$message({
            message: '已取消点赞',
            type: 'success'
          }) */
        }
        noticeContent = this.DataTransit[index].content
        updatePacomment({ likes: this.commentsPaPaMsg[index].likes, commentId: this.commentsPaPaMsg[index].commentId }).then(res => {
          // console.log(res, 'res')
        })
      } else {
        this.DataTransit[index].commentsSonMsg[sonIndex].liked = !this
          .DataTransit[index].commentsSonMsg[sonIndex].liked
        like = this.DataTransit[index].commentsSonMsg[sonIndex].liked
        if (this.DataTransit[index].commentsSonMsg[sonIndex].liked) {
          this.commentsPaPaMsg[index].commentsSonMsg[sonIndex].likes.push(
            this.userId
          )
          this.DataTransit[index].commentsSonMsg[sonIndex].likes.push(
            this.userId
          )
          // 加入用户的id
          /* this.$message({
            message: '作者已收到你的喜欢，感谢点赞~',
            type: 'success'
          }) */
        } else {
          const i = this.DataTransit[index].commentsSonMsg[
            sonIndex
          ].likes.indexOf(this.userId)
          this.commentsPaPaMsg[index].commentsSonMsg[sonIndex].likes.splice(
            i,
            1
          )
          this.DataTransit[index].commentsSonMsg[sonIndex].likes.splice(
            i,
            1
          )
          /* this.$message({
            message: '已取消点赞',
            type: 'success'
          }) */
          // 取出用户id
        }
        updateSoncomment({ likes: this.commentsPaPaMsg[index].commentsSonMsg[sonIndex].likes, commentId: this.commentsPaPaMsg[index].commentsSonMsg[sonIndex].commentId }).then(res => {
          // console.log(res, 'res')
        })

        noticeContent = this.DataTransit[index].commentsSonMsg[sonIndex].content
      }
      if (like) {
        createNotice({
          hasRead: false,
          whoDidId: this.$store.state.user.userId,
          whatReceiveId: this.$route.params.blogId,
          time: parseTime(new Date(), '{y}/{m}/{d} {h}:{i}:{s}'),
          content: noticeContent,
          action: 3,
          articleId: this.$route.params.articleId,
          cover: this.cover,
          new: true
        }).then(notice => {

        })
      }
    }
  },
  components: {
    // eslint-disable-next-line vue/no-unused-components
    replyTextarea
  }
}
</script>
<style lang="scss" scoped>
.comments {
  position: relative;
  .map {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
  .commentItem {
    .avatar {
      display: inline-block;
      vertical-align: top;
      img {
        display: inline-block;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        cursor: pointer;
      }
    }
    .detailMsg,
    .replyArea {
      display: inline-block;
      width: 90%;
      margin-left: 10px;
      .name {
        font-size: 12px;
        font-weight: 700;
        line-height: 25px;
        letter-spacing: 0.5px;
      }
      .content {
        margin-bottom: 5px;
        font-size: 14px;
        line-height: 20px;
        letter-spacing: 1px;
      }
      .bottom {
        padding-bottom: 5px;
        border-bottom: 1px solid #eaeaea;
        font-size: 12px;
        color: #99a2aa;
        .likes {
          cursor: pointer;
          margin-left: 20px;
          .icon {
            margin: 0 -1px 0 5px;
          }
        }
        .icon {
          margin: 0 5px;
          font-size: 14px;
          margin-right: 3px;
          cursor: pointer;
        }
      }
    }
    .replyArea {
      margin-left: 50px;
      margin-top: 5px;
      .avatar {
        display: inline-block;
        margin-right: 10px;
        img {
          display: inline-block;
          width: 24px;
          height: 24px;
        }
      }
      .detailReply {
        max-width: 90%;
        display: inline-block;
        font-size: 14px;
        line-height: 20px;
        letter-spacing: 1px;
        .top {
          .name,
          .beReplyName {
            font-size: 12px;
            font-weight: 700;
          }
          .beReplycontent {
            padding: 2px 5px;
            background: color(primary);
            color: white;
            border-radius: 4px;
          }
        }
        .content {
          margin: 3px 0;
        }
        .bottom {
          letter-spacing: 0.5px;
        }
      }
    }
  }
}
</style>
