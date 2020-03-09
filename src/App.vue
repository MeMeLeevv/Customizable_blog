<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  watch: {
    '$route' (to, from) { // 记录路由的来源和去路,及时修改路由index.js对应路由下main的component
      this.from = from.path
      this.to = to.path
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
