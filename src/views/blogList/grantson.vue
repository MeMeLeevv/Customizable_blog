<template>
  <div></div>
</template>
<script>
export default {
  mounted () {
    const that = this
    this.$nextTick(function (params) {
      console.log(that.$attrs, 'sonAttr') // {keke: 123, yy: "00", hahha: 123} "sonAttr"
    })
  }
}
</script>
<style lang="sass">

</style>
