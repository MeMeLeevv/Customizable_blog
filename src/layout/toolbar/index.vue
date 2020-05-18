<template>
  <div class="toolbar">
    <button class="edit">编辑</button>
    <div class="title">
      <div class="blogger">meme</div>
      <div class="status">博客·已发布</div>
    </div>
    <div class="icons">
      <!-- <button>
        <svg-icon icon-class="phone" />
      </button> -->
      <button @click.stop="$emit('fullpage')">
        <svg-icon class="reverse" icon-class="fullArrow" />
      </button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'toolbar',
  data () {
    return {}
  },
  created () {},
  computed: {},
  mounted () {},
  methods: {
  }
}
</script>
<style lang="scss" scoped>
.toolbar {
  height: $toolbarHeight;
  padding: 9px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-weight: 600;
  letter-spacing: 0.5px;
  border-bottom: 1px solid $border_color;
  .edit {
    padding: 0 13px;
    font-size: 12.5px;
    text-transform: uppercase;
    font-weight: 600;
  }
  .title {
    font-size: 12px;
    line-height: 16px;
    .blogger {
      text-align: center;
    }
    .status {
      color: $font_tip;
    }
  }
  .icons {
    position: relative;
    margin-top: 3px;
    font-size: 22px;
    button {
      margin: 0 4px;
      .reverse {
        transform: rotate(180deg);
      }
    }
  }
}
</style>
