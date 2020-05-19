<template>
  <div class="detailBlogs">
    <navbar></navbar>
    <settingDialog
      v-bind:editSetting.sync="editSetting"
      v-bind:articleMsg.sync="articleMsg"
      @apply="apply"
    ></settingDialog>
    <div v-if="articleMsg.publicTime">
      <div class="date" v-if="articleMsg.publicTime" title="发布时间">
        <svg-icon class="icon" icon-class="time" />
        <span> : {{articleMsg.publicTime}}</span>
      </div>
      <div class="date" title="标签" v-if="articleMsg.tapsArr.length !== 0">
        <svg-icon class="icon" icon-class="tap" /> :
        <span class="tapItem" v-for="(item,index) in articleMsg.tapsArr" :key="index">{{item}}</span>
      </div>
    </div>
    <titleBlog
      :needTitle="true"
      :needContent="needContent"
      v-bind:content.sync="articleMsg.content"
    ></titleBlog>
    <div class="public" v-if="isBlogger">
      <button @click.stop="editSetting = true" title="发布">
        <svg-icon class="icon" icon-class="publish" />
      </button>
    </div>
    <div class="commentsArea">
      <h1>commentsArea({{comNums}})</h1>
      <div class="uiArea">
        <div class="input">
          <textarea :disabled="visitor" v-model="faContent" name id></textarea>
        </div>
        <div class="submit">
          <button @click.stop="submitPaCom" class="btn">发布评论</button>
        </div>
      </div>
      <comments
        v-if="commentsPaPaMsg.length"
        :needSubmit="needSubmit"
        :insertPaData="insertPaData"
        v-bind:commentsPaPaMsg.sync="commentsPaPaMsg"
        :cover="articleMsg.cover"
      ></comments>
    </div>
    <div class="pagination">
      <span class="pre">
        <svg-icon class="icon" icon-class="arrow" />
        <a href>Pastels</a>
      </span>
      <span class="next">
        <a href>Edges</a>
        <svg-icon class="icon" icon-class="arrow" />
      </span>
    </div>
  </div>
</template>
<script>
import navbar from '@/components/navbar'
import titleBlog from '@/components/addComponents/editor/index.vue'
import settingDialog from '@/views/detailBlogs/settingDialog.vue'
import comments from '@/views/detailBlogs/comments.vue'
import { parseTime } from '@/utils/index.js'
import { updateArticle, fetchArticle } from '@/api/article'
import { createPacomment, fetchPacomment, fetchSoncomment } from '@/api/comment'
export default {
  name: 'detailBlogs',
  inject: ['reload'],
  data () {
    return {
      editSetting: false,
      hideNavbar: true,
      tapString: '',
      visitor: true,
      isBlogger: false,
      needContent: false, // 是否需要去editor那里去html数据
      faContent: '',
      articleMsg: {
        blogId: this.$store.state.user.blogId,
        articleId: this.$route.params.id,
        Summary: '', // 摘要
        publicTime: '', // 最近更新时间
        tapsArr: [],
        postTypeValue: '',
        ReprintURL: '',
        commentValue: '',
        categoryValue: [],
        statusValue: '',
        cover: '',
        content: ''
      },
      comNums: 0,
      needSubmit: false, // 当有新评论（papaCom)需要插入到评论区时,提示子元素有数据加入了，需要将新数据初始化加入对应data里（liked 、reported....
      // 分两个表，一个父级的评论，不会有回复；一个是子评论，会有父级id和孙子id
      /* commentsPaPaMsg: [
        {
          id: '1',
          articleID: '1345',
          content:
            '可惜没有旧时的弹幕了“从春秋五霸变成了战国七雄”这条弹幕我现在还记得',
          time: '2017-11-30 13:52',
          userId: '667',
          likes: ['12', '23423', '45'],
          reports: ['9', '5', '4'],
          reported: false,
          hasSon: false, // 如果为true就去拉请求
          liked: false, // 判断likes数组是否有用户id，有则true，否则false
          name: '寻之言之_',
          avatar:
            'https://tse1-mm.cn.bing.net/th/id/OIP.aAjWK6W0KU48ytqCFNykUQAAAA?w=211&h=205&c=7&o=5&dpr=1.25&pid=1.7',
          commentsSonMsg: [
            {
              id: '12',
              PaPaCommentId: '1',
              userId: '7777',
              time: '2018-06-22 00:39',
              content: '鲁迅：我没说过考生：我管你说没说过',
              likes: ['12', '23423', '45', '12', '23423', '45'],
              reports: ['9', '5', '4'],
              reported: false,
              liked: false, // 判断likes数组是否有用户id，有则true，否则false
              name: '我爱impala67',
              avatar:
                'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ4h_4Ir0MoytTi1AgWDYqnRLJtyGnHApQAZBTPKOG8f-2JL2Gg&usqp=CAU',
              beReply: {
                commentId: '', // 继续在sonMsg里找 回复只取昵称和内容即可
                userId: '123',
                name: 'free记忆',
                content: '鲁迅曾经说过，一切皆有可能'
              }
            },
            {
              id: '13',
              PaPaCommentId: '1',
              userId: '999', // 取用户的name和avatar
              time: '2018-06-22 00:39',
              content: '鲁迅曾经说过，一切皆有可能',
              likes: ['12', '12', '23423', '45'],
              reports: ['9', '5', '4'],
              reported: false,
              liked: false, // 判断likes数组是否有用户id，有则true，否则false
              name: 'free记忆',
              avatar:
                'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQx4e_9fEO8XzERT-tP-r56AAbWytrEx-b3ozyBv2uNGLj9vCvp&usqp=CAU',
              beReply: {
                commentId: '', // 取用户的comment
                userId: '' // 取用户的name
              }
            }
          ]
        }
      ], */
      commentsPaPaMsg: [],
      insertPaData: {},
      faComment: {
        articleId: this.$route.params.articleId,
        commentId: '',
        content: '',
        time: '',
        userId: this.$store.state.userId,
        likes: [],
        reports: [],
        hasSon: false, // 如果为true就去拉请求
        name: '',
        avatar: '',
        commentsSonMsg: []
      }
    }
  },
  created () {

    // // console.log(titleBlog.methods.getContent(), 'titleBlog')
    /* if (!this.$route.params.id) { // 如果id为空，则表示是进入一个空白编辑页面,新增文章数据插入数据库

    } else { // 根据文章id去后台取对应博文数据

    } */
  },
  watch: {
    '$route.params.articleId': {
      handler (newV, oldV) {
        if (newV === oldV) return
        fetchArticle(this.$route.params.articleId).then((res) => {
          if (res.data.length === 0) { // 没有此文章，用户操作为新建，不需要初始化
          } else { // 初始化文章
            this.articleMsg = Object.assign(this.articleMsg, res.data[0])
            fetchPacomment(this.$route.params.articleId).then(paC => {
              if (paC.data.length !== 0) {
                for (let i = 0; i < paC.data.length; i++) {
                  fetchSoncomment(paC.data[i].commentId).then(sonC => {
                    if (sonC.data.length !== 0) {
                      paC.data[i].commentsSonMsg = paC.data[i].commentsSonMsg.concat(sonC.data)
                    }
                  })
                }
                this.commentsPaPaMsg = this.commentsPaPaMsg.concat(paC.data)
                // console.log(this.commentsPaPaMsg, 'this.commentsPaPaMsg')
                this.commentsPaPaMsg.reverse()
              }
            })
            // console.log(this.articleMsg, 'this.articleMsg')
          }
        })
      },
      immediate: true
    },
    commentsPaPaMsg: {
      handler (newV) {
        this.comNums = 0
        if (newV.length === 0) return
        for (let i = 0; i < newV.length; i++) {
          this.comNums++
          this.comNums += newV[i].commentsSonMsg.length
        }
      },
      deep: true,
      immediate: true
    },
    '$store.state.user.hasLogin': {
      handler (val) {
        this.visitor = !val
      },
      immediate: true
    },
    '$store.state.user.isBlogger': {
      handler (val) {
        this.isBlogger = val
      },
      immediate: true
    }
  },
  computed: {},
  mounted () {
  },
  methods: {
    submitPaCom () {
      // 根据
      if (!this.faContent) return
      this.faComment.content = this.faContent
      this.faComment.articleId = this.$route.params.articleId
      this.faComment.time = parseTime(new Date(), '{y}/{m}/{d} {h}:{i}:{s}')
      this.faComment.userId = this.$store.state.user.userId
      this.faComment.name = this.$store.state.user.name
      this.faComment.avatar = this.$store.state.user.avatar
      this.faComment.hasSon = false
      createPacomment(this.faComment).then(res => {
        this.faComment.commentId = res.data.commentId
        // console.log(res, 'commentRes')
        this.commentsPaPaMsg.unshift(this.faComment)
        // this.insertPaData = deepClone(this.faComment) // 最好对象的复制都用深克隆
      }).then(res => {
        this.faContent = ''
      })
    },
    apply () {
      this.needContent = true
      setTimeout(() => { // 需要延迟给editor时间去取content
        // console.log(this.articleMsg.content, 'this.articleMsg.content')
        if (this.articleMsg.content.trim() === '<h1 class="detailBlogs_title" tabindex="0"></h1><p></p>') {
          this.needContent = false
          this.$message.error('文章内容为空，请填写其内容！')
          return
        }
        // 发布或者草稿或者删除要做提醒，新增的类别要和博客的类别数组合并一下，新增的则加进去
        let text = ''
        if (this.articleMsg.statusValue === '1') {
          this.articleMsg.publicTime = parseTime(
            new Date(),
            '{y}/{m}/{d} {h}:{i}:{s}'
          )
          text = '正在加油发布中，请稍后~'
        } else text = '正在加油保存为草稿中，请稍后~'
        // eslint-disable-next-line no-unused-vars
        const loading = this.$loading({
          lock: true,
          text: text,
          background: 'rgba(255, 255, 255, 0.5)',
          customClass: 'waiting'
        })
        updateArticle(this.articleMsg).then(res => {
          loading.close()
          this.$message({
            message: '操作成功！',
            type: 'success'
          })
          this.needContent = false
          this.editSetting = false
          // console.log(res, 'res')
        })
        this.reload() // 这里发布之后要刷新页面，否则会出现评论区有bug
      }, 100)
    }
  },
  components: {
    navbar,
    titleBlog,
    settingDialog,
    comments
  }
}
</script>
<style lang="scss" scoped>
.detailBlogs {
  width: 50%;
  margin: 0 auto;
  margin-top: 70px;
  .navbar {
    top: 55px;
  }
  .public {
    position: fixed;
    right: 6vw;
    top: 48%;
    font-size: 24px;
  }
  .date {
    margin-bottom: 5px;
    font-size: 14px;
    letter-spacing: 0.01rem;
    font-weight: 400;
    line-height: 22px;
    .icon {
      font-size: 14px;
    }
    .tapItem {
      margin-left: 5px;
      padding: 2px 5px;
      background: #98c3de;
      border-radius: 5px;
      color: white;
      cursor: pointer;
    }
  }
  .uiArea {
    margin-bottom: 15px;
    border-radius: 3px;
    background: white;
    border: 1px solid #eaeaea;
    .input {
      textarea {
        width: 100%;
        height: 140px;
        padding: 15px;
        line-height: 1.5em;
      }
    }
    .submit {
      height: 59px;
      text-align: right;
      padding: 10px;
      position: relative;
      .btn {
        position: absolute;
        bottom: 0;
        right: 0;
        padding: 1em 2.004em;
        font-size: 15px;
        background: color(primary);
        color: white;
        text-align: center;
        cursor: pointer;
        font-weight: 500;
        letter-spacing: 0.02em;
        font-size: 16px;
      }
    }
  }
  .pagination {
    padding: 3vw 0 3vw;
    margin: 0 -12vw;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 33px;
    .pre {
      .icon {
        transform: rotate(180deg);
      }
    }
    .pre:hover,.next:hover {
      color: color(primary);
      .svg-icon {
        fill: color(primary);
      }
    }
  }
}
</style>
