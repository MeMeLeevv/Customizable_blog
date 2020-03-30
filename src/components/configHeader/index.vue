<template>
  <div class="configHeader">
    <div class="back" @click="$router.push(backRouter)">
      <span class="svg">
        <svg-icon class="arrow" icon-class="arrow" />
        <svg-icon class="minus" icon-class="minus" />
      </span>
      {{lastTitle}}
    </div>
    <h2 class="title">{{nowTitle}}</h2>
  </div>
</template>
<script>
export default {
  name: 'configHeader',
  data () {
    return {}
  },
  props: {
    backRouter: String,
    lastTitle: String,
    nowTitle: String
  },
  created () {},
  computed: {},
  mounted () {},
  methods: {},
  components: {}
}
</script>
<style lang="scss" scoped>
.configHeader {
  .back {
    height: 22px;
    vertical-align: top;
    .svg {
      position: relative;
      margin-right: 17px;
      vertical-align: top;
      font-weight: 700;
      font-size: 18px;
      line-height: 22px;
      .arrow {
        transform: rotate(180deg);
        vertical-align: top;
        position: absolute;
        left: 0;
        top: 1px;
        transition: left 0.4s;
      }
      .minus {
        position: absolute;
        vertical-align: top;
        left: -6px;
        top: 1px;
        transform: scaleX(0);
        transition: transform 0.4s;
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
