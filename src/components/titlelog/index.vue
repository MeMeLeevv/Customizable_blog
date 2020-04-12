<template>
  <div v-if="show" class="titlelog">
    <div class="quit" @click="$emit('updateShow', false)">
      <svg-icon icon-class="quit" />
    </div>
    <p class="title">{{title}}</p>
    <div class="contain">
      <div class="content">{{content}}</div>
      <div class="bottom">
        <span class="choice" @click="$emit('clickBtn1')">{{button1}}</span>
        or
        <span class="choice" @click="$emit('clickBtn2')">{{button2}}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'titlelog',
  props: {
    title: String,
    button1: String,
    button2: String,
    content: String,
    show: Boolean
  },
  data () {
    return {}
  },
  watch: {},
  created () {},
  computed: {},
  mounted () {},
  methods: {}
}
</script>
<style lang="scss" scoped>
.titlelog {
  width: 200px;
  padding: 10px;
  text-align: center;
  box-shadow: $shadow;
  background:white;
  .quit {
    position: absolute;
    top: 3px;
    right: 3px;
    padding: 5px;
    font-size: 18px;
  }
  .quit:hover {
    cursor: pointer;
    color: $font_color;
  }
  .title {
    margin: 10px 10px 20px 10px;
    font-size: 24px;
    color: $font_color;
  }
  .contain {
    color: $font_tip;
    font-size: 16px;
    .content {
      margin-bottom: 20px;
      word-wrap: break-word;
      line-height: 22px;
    }
    .bottom {
      height: 34px;
      .choice {
        padding: 8px;
        background: $darkMColor;
        border-radius: 5px;
        color: white;
        font-weight: 600;
        cursor: pointer;
      }
    }
  }
}
</style>
