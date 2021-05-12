import Vue from 'vue'
import App from './App'

import { requestData } from './util/api.js'
Vue.prototype.$requestData = requestData

// 图片地址
Vue.prototype.$imgPath ="http://49.234.222.55:8081/api/image/get?name="
// 接口地址
Vue.prototype.$apiPath ="http://49.234.222.55:8081/api"

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
