import Vue from 'vue'
import App from './App'

import { requestData } from './util/api.js'
Vue.prototype.$requestData = requestData

// 接口地址 
Vue.prototype.$apiPath ="http://192.168.43.165:8081/api"

// Vue.prototype.$apiPath ="http://49.234.222.55:8081/api"

// 图片地址
Vue.prototype.$imgPath =Vue.prototype.$apiPath+"/image/get?name="
// 视频地址
Vue.prototype.$videoPath=Vue.prototype.$apiPath+"/video/play?name="


Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
