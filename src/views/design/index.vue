<template>
  <div class="Design">
    <configMenu class="menu" :menuData="menuData" />
  </div>
</template>
<script>
export default {
  name: 'Design',
  data () {
    return {
      menuData: [
        {
          name: 'Fonts',
          hover: false
        },
        {
          name: 'Colors',
          hover: false
        },
        {
          name: 'Cartoons',
          hover: false
        },
        {
          name: 'Cursors',
          hover: false
        }
      ]
    }
  },
  created () {},
  computed: {},
  mounted () {},
  methods: {}
}
</script>
<style lang="scss" scoped>

</style>
