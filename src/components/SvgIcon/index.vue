//components/Icon-svg
<template>
  <svg class="svg-icon" aria-hidden="true">
    <use :xlink:href="iconName"></use>
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
  }
}
</script>

<style lang="sass">
.svg-icon
  display:inline-block
  width: 1em
  height: 1em
  vertical-align: -0.15em
  fill: #3e3e3e
  overflow: hidden

</style>
