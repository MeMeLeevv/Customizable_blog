//components/Icon-svg
<template>
  <svg class="svg-icon" aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
</template>

<script>
export default {
  name: 'icon-svg',
  props: {
    iconClass: {
      type: String,
      required: true
    }
  },
  computed: {
    iconName () {
      return `#icon-${this.iconClass}`
    }
  },
  mounted () {
    this.$nextTick(function () {
      // document.body.style.setProperty('--color-primary', '#000000')
      /* setTimeout(() => {
        console.log(document.body.style.getPropertyValue('--color-primary'))
      }, 1000) */
    })
  }
}
</script>

<style lang="scss">
.svg-icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  overflow: hidden;
}
</style>
