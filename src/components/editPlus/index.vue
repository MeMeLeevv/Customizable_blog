<template>
  <div class="editPlus" @click="$emit('clickPlus')">
    <span :style="`${show ? 'opacity: 1' : ''};`" title="添加布局元素" class="addC">
      <svg-icon class="icon" icon-class="editAdd" />
    </span>
  </div>
</template>
<script>
export default {
  name: 'editPlus',
  data () {
    return {}
  },
  props: {
    show: Boolean
  },
  watch: {
  },
  created () {},
  computed: {},
  mounted () {},
  methods: {},
  components: {}
}
</script>
<style lang="scss" scoped>
.editPlus {
  position: relative;
  z-index: 100;
  height: 0px;
  text-align: center;
  font-size: 26px;
  .addC {
    width: 25.83px;
    height: 25.83px;
    position: absolute;
    opacity: 0;
    transform: translateY(-50%);
    background: white;
    border-radius: 50%;
    cursor: pointer;
    .icon {
      vertical-align: top;
    }
  }
  .addC:hover {
    opacity: 1;
  }
}
</style>
