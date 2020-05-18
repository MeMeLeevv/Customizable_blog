<template>
  <div class="colors">
    <configHeader
      :backRouter="`/${this.$store.state.user.blogId}/config/Design`"
      lastTitle="设计"
      nowTitle="主题色"
    ></configHeader>
    <div class="colorWrap">
      <span class="title" style="margin-right: 10px">主题色选择 :</span>
      <themePicker size="medium"></themePicker>
    </div>
  </div>
</template>
<script>
import themePicker from './themePicker'
import configHeader from '@/components/configHeader'
export default {
  name: 'Colors',
  data () {
    return {}
  },
  created () {},
  computed: {},
  mounted () {},
  methods: {},
  components: {
    themePicker,
    configHeader
  }
}
</script>
<style lang="scss" scoped>
.el-color-picker {
  vertical-align: middle;
}
.colors {
  .colorWrap{
    line-height: 40px;
    .title {
      margin: 10px 0;
      font-size: 15px;
      font-weight: 500;
      letter-spacing: 0.5px;
  }
  }
}
</style>
