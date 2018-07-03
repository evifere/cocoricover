import Vue from 'vue'
import '../theme/index.css'
import '../theme/display.css'
import Element from 'element-ui'
import App from './App.vue'
Vue.config.productionTip = false

Vue.use(Element);

new Vue({
  render: h => h(App)
}).$mount('#app')
