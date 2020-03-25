<template>
  <div class="blogs-settings">
    <span class="publish" title="发布">
      <svg-icon class="icon" icon-class="add" />
    </span>
    <configHeader backRouter="/" lastTitle="首页" nowTitle="博客"></configHeader>
    <div class="search">
      <svg-icon class="icon" icon-class="search" />
      <input placeholder="搜索项目..." type="search" />
    </div>
    <div class="tabbar" @click="requestArticle"><!-- 点击tabbar高亮，tag的界面修改 -->
      <span class="item" data-request="all">所有</span>
      <span class="item" data-request="draft">草稿</span>
      <span class="item" data-request="delete">垃圾桶</span>
      <span class="item" data-request="tags">分类</span>
    </div>
    <div class="showBlog">
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
            <span class="class">{{item.class}}</span>
            <span class="publishTime">{{item.publicTime}}</span>
          </div>
        </div>
        <div class="pic" :style="`background-image: url(${item.cover})`"></div>
        <transition name="slide-fade">
          <div v-if="blogData[index].showEditBtn" class="btn">
            <div class="edit">编辑</div>
            <div class="delete">删除</div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>
<script>
/* 路由显示文章id， for循环文章数组，如果id匹配则ACTIVE状态 */
import configHeader from '@/components/configHeader'
export default {
  name: 'blogs-settings',
  data () {
    return {
      requestClass: 'all', // draft/delete/tags
      blogData: [
        {
          title: '粉彩35344444444444444444444444444444444444444444444',
          commentNum: 1,
          class: '草稿',
          publicTime: '上星期三 13:14 pm',
          cover:
            '//static1.squarespace.com/static/5e71f7ee9363663a9a194b90/5e71f857aee185235a030786/5e71f857aee185235a0307a0/1565790249701/?format=300w',
          showEditBtn: false
        },
        {
          title: '粉彩',
          commentNum: 0,
          class: '已发布',
          publicTime: '上星期三 13:14 pm',
          cover:
            '//static1.squarespace.com/static/5e71f7ee9363663a9a194b90/5e71f857aee185235a030786/5e71f857aee185235a0307a0/1565790249701/?format=300w',
          showEditBtn: false
        },
        {
          title: '粉彩',
          commentNum: 0,
          class: '已发布',
          publicTime: '上星期三 13:14 pm',
          cover:
            '//static1.squarespace.com/static/5e71f7ee9363663a9a194b90/5e71f857aee185235a030786/5e71f857aee185235a0307a0/1565790249701/?format=300w',
          showEditBtn: false
        },
        {
          title: '粉彩',
          commentNum: 0,
          class: '已发布',
          publicTime: '上星期三 13:14 pm',
          cover:
            '//static1.squarespace.com/static/5e71f7ee9363663a9a194b90/5e71f857aee185235a030786/5e71f857aee185235a0307a0/1565790249701/?format=300w',
          showEditBtn: false
        },
        {
          title: '粉彩',
          commentNum: 0,
          class: '已发布',
          publicTime: '上星期三 13:14 pm',
          cover:
            '//static1.squarespace.com/static/5e71f7ee9363663a9a194b90/5e71f857aee185235a030786/5e71f857aee185235a0307a0/1565790249701/?format=300w',
          showEditBtn: false
        }
      ]
    }
  },
  created () {},
  computed: {},
  mounted () {},
  methods: {
    requestArticle (e) {
      console.log(e)
      console.log(e.target.dataset.request)
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
  }
  .tabbar {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    margin: 0 -32px;
    height: 44px;
    line-height: 44px;
    text-align: center;
    .item {
      width: 25%;
      display: inline-block;
      font-size: 11px;
      border-left: none;
    }
    .item:hover {
      cursor: pointer;
      background: #e4e4e4;
    }
  }
  .showBlog {
    margin: 0 -32px;
    max-height: 495px;
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
