<template>
  <div class="index" id="index">
    <!-- 注意header加上博客名，搜索框也要去完善，最好给个博文列表快速浏览，在右边给个组件布局目录？点击可以快速到那边 -->
    <bloggerMsgCard></bloggerMsgCard>
    <navbar></navbar>
    <editPlus style="top: 50px" :show="showEditPlus" @clickPlus="showAddComponents = true"></editPlus><!-- 固定的，以后每增加元素，底部增加加 -->
    <transition name="slide-fade">
      <addComponents v-if="showAddComponents" @clickNewSection="clickNewSection" @closeAddComponents="showAddComponents = false"></addComponents>
    </transition>
    <div id="showBlock"></div><!-- class不行？ id才能插入 -->
  </div>
</template>
<script>
import bloggerMsgCard from '@/layout/bloggerMsgCard/index'
import navbar from '@/components/navbar'
import editPlus from '@/components/editPlus'
import addComponents from '@/components/addComponents'
import headlines from '@/components/addComponents/headlines'
import Vue from 'vue'
export default {
  name: 'index',
  data () {
    return {
      headlinesComp: null,
      showEditPlus: false,
      showAddComponents: false,
      headlines1: {
        id: '1',
        width: '454',
        height: '180',
        background:
          'https://static1.squarespace.com/static/5c5a514d65019f01a2cb2be5/t/5d24ae6a93429e0001baef62/1562688063139/20140301_Trade-151_0124-copy.jpg',
        colorClass: 'white',
        contentWidth: '',
        contentHeight: '',
        content: {
          text:
            '<div>让它脱颖而出。</div><div>无论是什么，您在网上讲故事的方式都可以发挥作用。</div>',
          Alignment: ''
        },
        buttom: {
          text: 'make it',
          backgroound: '',
          color: '',
          url: '',
          size: '',
          Alignment: ''
        }
      }
    }
  },
  watch: {
    showEditPlus (newV) {
      // console.log(newV, 'show')
    }
  },
  created () {},
  computed: {},
  mounted () {},
  methods: {
    clickNewSection (belong, id) {
      console.log(belong, id, 'sec')
      this.showAddComponents = false
      if (belong === 'headlines') {
        this.insertHeadlines()
      }
    },
    insertHeadlines () {
      const HeadlinesClass = Vue.extend(headlines)
      this.headlinesComp = new HeadlinesClass().$mount('#showBlock')
    }
  },
  components: {
    bloggerMsgCard,
    navbar,
    editPlus,
    addComponents,
    // eslint-disable-next-line vue/no-unused-components
    headlines
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

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: transform 0.2s linear;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active 用于 2.1.8 以下版本 */ {
  transform: translateY(-5px);
  opacity: 0;
}

.index {
  position: relative;
  overflow-x: hidden;
  overflow-y: visible;
  min-height: calc(
    100% - 105px
  ); /* 这里的高度可能会随屏幕大小而改动！！！记得切换设备试试 */
}
</style>
