<template>
  <div class="Design">
    <div class="back" @click="$router.push('/index')"><span class="svg"><svg-icon class="arrow" icon-class="arrow" /><svg-icon class="minus" icon-class="minus" /></span> 主页</div>
    <h2 class="title">设计</h2>
    <configMenu :subMenu="true" class="menu" :menuData="menuData" />
  </div>
</template>
<script>
import configMenu from '@/components/configMenu'

export default {
  name: 'Design',
  data () {
    return {
      menuData: [
        {
          name: '字体',
          hover: false,
          path: '/config/Design/Fonts'
        },
        {
          name: '颜色',
          hover: false,
          path: '/config/Design/Colors'
        },
        {
          name: '2.5D卡通人物',
          hover: false,
          path: '/config/Design/Cartoons'
        },
        {
          name: '鼠标箭头',
          hover: false,
          path: '/config/Design/Cursors'
        }
      ]
    }
  },
  created () {},
  computed: {},
  mounted () {},
  methods: {},
  components: {
    configMenu
  }
}
</script>
<style lang="scss" scoped>
.Design {
  .back {
    height: 22px;
    vertical-align: top;
    .svg {
    position: relative;
    margin-right: 17px;
    font-weight: 700;
    font-size: 18px;
    line-height: 22px;
    .arrow {
      transform: rotate(180deg);
      vertical-align: top;
      position: absolute;
      left: 0;
      top: 1px;
      transition: left .4s;
    }
    .minus {
      position: absolute;
      vertical-align: top;
      left: -6px;
      top: 1px;
      transform: scaleX(0);
      transition: transform .4s;
    }
  }
  }
  .back:hover {
    cursor: pointer;
    .arrow {
      left: -10px;
    }
    .minus {
      left: -6px;
      transform: scaleX(1);
    }
  }
  .title {
    margin-top: 40px;
  }
}
</style>
