import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css
import vueResource from 'vue-resource'
import App from './App'
import store from './store'
import router from './router'
// import '@/utils/rem.js'
import '@/icons' // icon
import '@/permission' // permission control
import moment from 'moment'

// import 'lib-flexible/flexible.js'

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
import { mockXHR } from '../mock'
import echarts from 'echarts'
Vue.prototype.$echarts = echarts
Vue.use(vueResource)
if (process.env.NODE_ENV === 'production') {
  mockXHR()
}
// set ElementUI lang to EN
Vue.use(ElementUI, { locale })

Vue.config.productionTip = false
Vue.prototype.$moment = moment
// new Vue({
//   el: '#app',
//   router,
//   store,
//   render: h => h(App)

// })
new Vue({
  echarts,
  router,
  store,
  render: h => h(App)
  // mounted () {
  //   var viewer = new Cesium.Viewer('cesiumContainer')
  // }

}).$mount('#app')
