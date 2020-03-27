<template>
  <div class="Fonts">
    <configHeader backRouter="/config/Design" lastTitle="设计" nowTitle="字体"></configHeader>
    <div class="tabbar" ref="tabbar" @click="switchTab">
      <span class="item" :data-index="0">无衬线字体</span>
      <span class="item" :data-index="1">衬线</span>
      <span class="item" :data-index="2">混合的</span>
      <span v-if="lineWAL[0].lineWidth" class="line" :style="`width: ${lineWAL[tabIndex].lineWidth}px; left: ${lineWAL[tabIndex].lineLeft}px`"></span>
    </div>
  </div>
</template>
<script>
import configHeader from '@/components/configHeader'

export default {
  name: 'Fonts',
  data () {
    return {
      tabsWidth: [],
      tabIndex: 0,
      lineWAL: [{
        lineWidth: 0,
        lineLeft: 0
      }]
    }
  },
  created () {
  },
  computed: {
  },
  mounted () {
    this.$nextTick(function () {
      const children = this.$refs.tabbar.children
      let left = 0
      for (let i = 0; i < children.length; i++) {
        if (children[i].className === 'item') {
          this.lineWAL[i] = {
            lineWidth: 0,
            lineLeft: 0
          }
          this.lineWAL[i].lineWidth = children[i].clientWidth
          if (i > 0) {
            left += children[i - 1].clientWidth + 16
          }
          this.lineWAL[i].lineLeft = left
        }
      }
      console.log(this.lineWAL, 'this.lineWAL')
    })
  },
  methods: {
    switchTab (e) {
      this.tabIndex = e.target.dataset.index
    }
  },
  components: {
    configHeader
  }
}
</script>
<style lang="scss" scoped>
.Fonts {
  .tabbar {
    display: flex;
    height: 55px;
    line-height: 55px;
    position: relative;
    margin-bottom: 22px;
    box-shadow: rgba(0, 0, 0, 0.06) 0px -1px 0px 0px inset;
    font-size: 14px;
    .item {
      vertical-align: middle;
      color: rgb(118, 118, 118);
      display: inline-flex;
      margin-right: 16px;
      cursor: pointer;
    }
    .line {
      width: 55px;
      position: absolute;
      bottom: 0px;
      height: 2px;
      background-color: rgb(49, 49, 49);
      transition: all 350ms cubic-bezier(0.66, 0, 0.34, 1);
    }
  }
}
</style>
