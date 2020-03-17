<template>
  <div class="itemInput">
    <input v-model="data" :type="type" :name="name" :placeholder="placeholder" @focus="focusE" @blur="blusE" />
    <div class="line" :style="`${onFocus ? 'background-color: #bbd3f9' : ''}; ${error ? 'background-color: #f56c6c' : ''}`"></div>
    <transition name="slide-fade">
      <div v-if="error" class="errorTip">{{errorTip}}</div>
    </transition>
  </div>
</template>
<script>
export default {
  name: 'itemInput',
  props: {
    name: String,
    placeholder: String,
    RegExp: RegExp,
    errorTip: String,
    type: String
  },
  data () {
    return {
      onFocus: false,
      error: false,
      data: ''
    }
  },
  watch: {
    data (newV, oldV) {
      this.$emit('setFormData', this.name, newV)
    }
  },
  created () {},
  computed: {},
  mounted () {},
  methods: {
    focusE () {
      this.onFocus = true
      this.error = false
      this.$emit('update:hasFocus', true)
    },
    blusE () {
      this.onFocus = false
      const reg = new RegExp(this.RegExp)
      this.error = !this.data.match(reg)
      this.$emit('validForm', !this.error)
    }
  },
  components: {}
}
</script>
<style lang="scss" scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: transform 0.2s linear;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active 用于 2.1.8 以下版本 */ {
  transform: translateY(5px);
  opacity: 0;
}
.itemInput {
  text-align: center;
  position: relative;
  input {
    width: 90%;
    height: 30px;
    border: none;
    outline: none;
    background: transparent;
    border-radius: 10px;
  }
  input::-moz-placeholder {
    font-size: 12px;
  }
  input::-webkit-input-placeholder {
    font-size: 12px;
  }
  input::-ms-input-placeholder {
    font-size: 12px;
  }
  .line {
    width: 90%;
    height: 1.5px;
    background: $font_tip;
    margin: 0 auto;
    transition: background-color 0.5s;
  }
  .errorTip {
    position: absolute;
    top: 100%;
    padding-top: 2px;
    text-align: left;
    text-indent: 16px;
    color: $font_error;
    font-size: 12px;
  }
}
</style>
