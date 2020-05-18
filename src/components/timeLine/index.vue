<template>
  <div class="timeLine" v-if="blogData.length !== 0">
    <span class="delete" @click="$emit('hide')" title="删除">
      <svg-icon class="icon" icon-class="cancel" />
    </span>
    <div class="radio">
      排序：
      <el-radio-group v-model="reverse">
        <el-radio :label="true">倒序</el-radio>
        <el-radio :label="false">正序</el-radio>
      </el-radio-group>
    </div>
    <el-timeline :reverse="reverse">
      <el-timeline-item
        v-for="(item, index) in showData"
        :key="index"
        :timestamp="index"
        placement="top"
      >
        <el-card v-for="(itemIn, indexIn) in item" :key="indexIn" shadow="hover">
          <h4>{{itemIn.title}}</h4>
          <p style="text-align: right">—— {{itemIn.publicTime}}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
  name: 'timeLine',
  props: {
    blogData: Array
  },
  watch: {
    blogData: {
      handler (newV) {
        for (let i = 0; i < newV.length; i++) {
          const year = newV[i].publicTime.slice(0, 4)
          console.log(year)
          if (!this.showData[year]) {
            this.showData[year] = []
          }
          const content = newV[i].content
          const start = content.search(/>/)
          const last = content.search(/<\/h1>/)
          newV[i].title = content.slice(start + 1, last)
          this.showData[year].push(newV[i])
        }
        console.log(this.showData, 'showData')
      },
      immediate: true
    }
  },
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
.el-timeline-item__content {
  display: flex;
  flex-wrap: wrap;
  .el-card {
    width: 30%;
    margin: 10px;
    cursor: pointer;
    .el-card__body {
      padding: 0 10px;
    }
  }
}
.timeLine {
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
  .radio {
    margin: 10px 0 20px 20px;
    font-size: 14px;
  }
}
</style>
