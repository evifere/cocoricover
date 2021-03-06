import Vue from 'vue'
import VueRouter from 'vue-router'
import VueMq from 'vue-mq'
import '../theme/index.css'
import '../theme/display.css'
import Element from 'element-ui'
import locale from 'element-ui/lib/locale/lang/fr'
import App from './App.vue'

const CocoricoEditor = () => import(/* webpackChunkName: "cocoricover" */ './components/CocoricoEditor.vue')
const CocoricoQotEditor = () => import(/* webpackChunkName: "cocoricoqot" */ './components/CocoricoQotEditor.vue')

Vue.config.productionTip = false


Vue.use(VueMq, {
  breakpoints: { // default breakpoints - customize this
    sm: 450,
    md: 1250,
    lg: Infinity,
  },
  defaultBreakpoint: 'sm' // customize this for SSR
});

Vue.use(Element,{locale});
Vue.use(VueRouter);

// 2. Define some routes
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// `Vue.extend()`, or just a component options object.
// We'll talk about nested routes later.
const routes = [
  { path: '/', component: CocoricoEditor ,alias: '/cocoricover',name:'cocoricover'},
  { path: '/cocoricoQot', component: CocoricoQotEditor,name:'cocoricoQot' },

]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
  routes // short for `routes: routes`
})
new Vue({
  render: h => h(App),
  router
}).$mount('#app')
