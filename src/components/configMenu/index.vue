<template>
  <div class="ConfigMenu">
    <div class="menu_item" v-for="(item, index) in menuData" :key="index">
      <router-link :to="item.path">
        <div @mouseenter="toggleHover(index)" @mouseleave="toggleHover(index)">
          <span ref="text">{{item.name}}</span>
          <div
            v-if="showLine"
            class="slide_line"
            :style="`width: ${item.hover ? item.width: '0'}px`"
          ></div>
        </div>
      </router-link>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ConfigMenu',
  props: {
    menuData: Array
  },
  data () {
    return {
      showLine: false
    }
  },
  created () {},
  computed: {},
  mounted () {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been rendered
      this.$refs.text.forEach((el, index) => {
        this.menuData[index].width = el.offsetWidth
      })
      this.showLine = true
    })
  },
  methods: {
    toggleHover (index) {
      this.menuData[index].hover = !this.menuData[index].hover
    }
  }
}
</script>
<style lang="scss" scoped>
.ConfigMenu {
  padding-top: 22px;
  .menu_item {
    display: flex;
    flex-direction: column;
    height: 34px;
    margin: 6px 0;
    font-size: 22px;
    line-height: 28px;
    font-weight: 600;
    color: rgb(49, 49, 49);
    .slide_line {
      width: 0px;
      height: 0px;
      overflow: hidden;
      border-bottom: 3px solid rgb(49, 49, 49);
      transition: width 0.3s;
    }
  }
  .menu_item:hover {
    cursor: pointer;
  }
}
</style>
