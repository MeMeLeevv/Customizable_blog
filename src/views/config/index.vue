<template>
  <div class="config-index">
    <img :src="logo" class="logo" alt="">
    <configMenu v-if="blogId" class="menu" :menuData="menuData" />
  </div>
</template>
<script>
import configMenu from '@/components/configMenu'
export default {
  name: 'config-index',
  data () {
    return {
      blogId: '',
      menuData: [],
      logo: 'https://img-blog.csdnimg.cn/20200526232259333.png'
    }
  },
  watch: {
    '$store.state.user.blogId': {
      handler (newV) {
        this.blogId = newV
        this.menuData = [
          {
            name: '博客',
            hover: false,
            path: `/${newV}/config/BlogsSettings`
          }, {
            name: '设计',
            hover: false,
            path: `/${newV}/config/Design`
          }, {
            name: '评论',
            hover: false,
            path: `/${newV}/config/CommentsSettings`
          }, {
            name: '喜欢',
            hover: false,
            path: `/${newV}/config/Likes`
          }, {
            name: '设置',
            hover: false,
            path: `/${newV}/config/BlogsSettings`
          }, {
            name: '帮助',
            hover: false,
            path: `/${newV}/config/BlogsSettings`
          }
        ]
      },
      immediate: true
    }
  },
  created () {
  },
  computed: {

  },
  mounted () {
  },
  methods: {
  },
  components: {
    configMenu
  }
}
</script>
<style lang="scss" scoped>
.config-index {
  .logo {
    display: inline-block;
    width: 70px;
    height: 50px;
    font-size: 30px;
  }
  .menu {
    padding-top: 90px;
  }
}

</style>
