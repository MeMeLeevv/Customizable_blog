<template>
  <div class="replyTextarea" id="replyTextarea">
    <div class="input">
      <textarea v-model="replyContent" name id></textarea>
    </div>
    <div class="submit">
      <span class="btn" @click="submit">回复</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'replyTextarea',
  props: {
    submitComData: Object
  },
  data () {
    return {
      replyContent: '',
      submitReply: false
    }
  },
  created () {},
  watch: {},
  computed: {},
  mounted () {
    this.$nextTick(function (params) {
    })
  },
  methods: {
    submit () {
      if (this.replyContent) { // 如果为空则不提交
        // 上传数据
        this.submitComData.content = this.replyContent
        this.submitReply = true
        // console.log(this.submitComData, 'submitComData')
        // this.$emit('submitReply', this.replyContent)
      } else {
        this.$message.error('内容不能为空哦')
      }
    }
  },
  components: {}
}
</script>
<style lang="scss" scoped>
.replyTextarea {
  width: 400px;
  margin-top: 10px;
  border-radius: 3px;
  background: white;
  border: 1px solid #eaeaea;
  .input {
    textarea {
      width: 100%;
      height: 100px;
      padding: 15px;
      line-height: 1.5em;
    }
  }
  .submit {
    height: 50px;
    text-align: right;
    padding: 10px;
    position: relative;
    .btn {
      position: absolute;
      bottom: 0;
      right: 0;
      padding: 1em 2em;
      font-size: 15px;
      background: #a8a6a1;
      color: white;
      text-align: center;
      cursor: pointer;
      font-weight: 500;
      letter-spacing: 0.02em;
      font-size: 16px;
    }
  }
}
</style>
