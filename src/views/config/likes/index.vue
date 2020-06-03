<template>
  <div class="Likes">
    <configHeader :backRouter="`/${this.$store.state.user.blogId}`" lastTitle="首页" nowTitle="博客"></configHeader>

    <div
      class="searchItem"
      @click.stop="goInArticle(item.articleId)"
      v-for="(item, index) in articleArr"
      :key="index"
    >
      <div class="wordWrap">
        <span class="title">{{item.title}}</span>
        <span class="desc">—— {{item.Summary}}</span>
      </div>
      <el-avatar class="avatar" shape="square" :size="50" fit="cover" :src="item.cover"></el-avatar>
    </div>
  </div>
</template>
<script>
import configHeader from '@/components/configHeader'
import { getInfo } from '@/api/user'
import { fetchArticle } from '@/api/article'
export default {
  name: 'Likes',
  data () {
    return {
      articleArr: []
    }
  },
  created () {
    getInfo(this.$store.state.user.userId)
      .then(res => {
        this.userStar = res.data.starIdArr
        for (let i = 0; i < this.userStar.length; i++) {
          fetchArticle(this.userStar[i]).then(res => {
            const content = res.data[0].content
            const start = content.search(/>/)
            const last = content.search(/<\/h1>/)
            // console.log(this.blogData[i], 'this.blogData[i]')
            res.data[0].title = content.slice(start + 1, last)
            this.articleArr.push(res.data[0])
          })
        }
      })
      .then(res => {
        console.log(this.articleArr, 'this.articleArr')
      })
  },
  computed: {},
  mounted () {},
  methods: {
    goInArticle (articleId) {
      this.$store.dispatch('user/setConfigNow', true)
      if (this.$route.params.articleId === articleId) return
      this.$router.push(
        `/${this.$store.state.user.blogId}/articles/${articleId}`
      )
    }
  },
  components: {
    configHeader
  }
}
</script>
<style lang="scss" scoped>
.Likes {
  .searchItem {
    padding: 10px;
    cursor: pointer;
    background: white;
    border-bottom: 5px solid #f3f3f3;
    transition: all .3s;
    .wordWrap {
      width: 80%;
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
    box-shadow: $shadow;
  }
}
</style>
