<template>
  <div class="Design">
    <configHeader :backRouter="`/${this.$store.state.user.blogId}`" lastTitle="首页" nowTitle="设计"></configHeader>
    <configMenu :subMenu="true" class="menu" :menuData="menuData" />
  </div>
</template>
<script>
import configMenu from '@/components/configMenu'
import configHeader from '@/components/configHeader'

export default {
  name: 'Design',
  data () {
    return {
      menuData: [
        {
          name: '字体',
          hover: false,
          path: `/${this.$store.state.user.blogId}/config/Design/Fonts`
        },
        {
          name: '颜色',
          hover: false,
          path: `/${this.$store.state.user.blogId}/config/Design/Colors`
        },
        {
          name: 'live2d看板娘',
          hover: false,
          path: `/${this.$store.state.user.blogId}/config/Design/Cartoons`
        }
      ]
    }
  },
  created () {},
  computed: {},
  mounted () {},
  methods: {},
  components: {
    configMenu, configHeader
  }
}
</script>
<style lang="scss" scoped>
.Design {

}
</style>
