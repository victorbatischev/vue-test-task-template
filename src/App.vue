<template>
  <div id="app">
    <CategoryTableMatrix />
  </div>
</template>

<script>
import CategoryTableMatrix from '@/components/CategoryTableMatrix'

export default {
  components: { CategoryTableMatrix }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
