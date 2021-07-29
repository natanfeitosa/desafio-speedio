import Vue from 'vue'
import App from './App.vue'
import store from './store'

Vue.config.devtools = process.env.NODE_ENV === 'development'
Vue.config.productionTip = false

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app')
