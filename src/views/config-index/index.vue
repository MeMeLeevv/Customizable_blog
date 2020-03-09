<template>
  <div class="config-index">
    <svg-icon class="logo" icon-class="garden" />
    <configMenu class="menu" :menuData="menuData" />
  </div>
</template>
<script>
import configMenu from '@/components/configMenu'
export default {
  name: 'config-index',
  data () {
    return {
      menuData: [
        {
          name: 'Blogs',
          hover: false,
          path: '/config/BlogsSettings'
        }, {
          name: 'Design',
          hover: false,
          path: '/config/Design'
        }, {
          name: 'Comments',
          hover: false,
          path: '/config/CommentsSettings'
        }, {
          name: 'Likes',
          hover: false,
          path: '/config/Likes'
        }, {
          name: 'Settings',
          hover: false,
          path: '/config/BlogsSettings'
        }, {
          name: 'Helps',
          hover: false,
          path: '/config/BlogsSettings'
        }
      ]
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
    font-size: 30px;
  }
  .menu {
    padding-top: 90px;
  }
}

</style>
