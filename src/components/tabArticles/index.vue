<template>
  <div class="tabArticles" v-if="blogData.length !== 0">
    <span class="delete" @click="$emit('hide')" title="删除">
      <svg-icon class="icon" icon-class="cancel" />
    </span>
    <el-divider><h4># {{activeTab}}</h4></el-divider>
    <div class="tabItem" v-for="(item, index) in blogData" :key="index">
      <el-card style="display: flex; flex-direction: row" shadow="hover">
        <el-avatar shape="square" :size="100" fit="cover" :src="item.cover"></el-avatar>
        <span class="content">
          <h4>{{item.title}}</h4>
          <p style="text-align: right">—— {{item.publicTime}}</p>
        </span>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tabArticles',
  props: {
    blogData: Array,
    activeTab: String
  },
  watch: {},
  data () {
    return {
      reverse: true,
      showData: {}
    }
  },
  created () {
    console.log(this.blogData, 'msg')
  },
  mounted () {
    this.$nextTick(function () {})
  },
  methods: {},
  components: {}
}
</script>

<style lang="scss">
.tabArticles {
  position: relative;
  margin-top: 50px;
  background: white;
  .delete {
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
    .icon {
      font-size: 18px;
    }
  }
  .tabItem {
    width: 49%;
    display: inline-block;
    cursor: pointer;
  }
  .content {
    display: inline-block;
    vertical-align: top;
    margin-left: 10px;
  }
}
</style>
