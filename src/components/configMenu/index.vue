<template>
  <div class="ConfigMenu">
    <div class="menu_item" :style="subMenu ? 'font-size: 16px;font-weight: 500;' : ''" v-for="(item, index) in menuData" :key="index">
      <router-link v-if="!isAddComponents" :to="item.path">
        <div @mouseenter="toggleHover(index)" @mouseleave="toggleHover(index)">
          <span ref="text">{{item.name}}</span>
          <div
            v-if="showLine"
            class="slide_line"
            :style="`width: ${item.hover ? item.width: '0'}px;${subMenu ? 'border-bottom: 2px solid color(primary);' : ''}`"
          ></div>
        </div>
      </router-link>
      <div v-else>
        <div @mouseenter="toggleHover(index)" @mouseleave="toggleHover(index)" @click="clickItem(index)">
          <span ref="text">{{item.name}}</span>
          <div
            v-if="showLine"
            class="slide_line"
            :style="`width: ${item.hover || activeItem === item.path? item.width: '0'}px;border-bottom: 2px solid rgb(49, 49, 49);`"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ConfigMenu',
  props: {
    menuData: Array,
    subMenu: {
      type: Boolean,
      default: false
    },
    isAddComponents: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showLine: false,
      activeItem: ''
    }
  },
  created () {
    if (this.isAddComponents) {
      this.activeItem = this.menuData[0].path
    }
  },
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
    },
    clickItem (index) {
      this.activeItem = this.menuData[index].path
      this.$emit('menuClick', this.activeItem)
    }
  }
}
</script>

<style lang="scss">
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
    .slide_line {
      width: 0px;
      height: 0px;
      overflow: hidden;
      border-bottom: 4px solid color(primary);
      transition: width 0.3s;
    }
  }
  .menu_item:hover {
    cursor: pointer;
  }
}
</style>
