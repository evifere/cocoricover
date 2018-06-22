<template>
  <div id="app">
    <img src="./assets/logo.png">
    <CocoricoEditor msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'app',
  components: {
    CocoricoEditor
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Pacifico|VT323|Quicksand|Inconsolata');

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
