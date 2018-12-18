<template>
  <div id="app">
    <CocoricoEditor msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import CocoricoEditor from './components/CocoricoEditor.vue'

export default {
  name: 'app',
  components: {
    CocoricoEditor
  }
}

</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Pacifico|VT323|Quicksand|Inconsolata|Ubuntu|Galada|Lobster|Noto Sans Egyptian Hieroglyphs');

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
