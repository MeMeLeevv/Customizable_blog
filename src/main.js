import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'normalize.css'
import './assets/css/iconfont/iconfont.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/theme/index.css'
import '@/styles/index.scss' // global css

import './icons' // icon

Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
