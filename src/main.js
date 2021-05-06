import Vue from 'vue'
import App from './App'

import store from "./store";
import config from "@/config/config.js";
import request from "@/libs/request.js";
import cuCustom from './colorui/components/cu-custom.vue'


// import ComFunJS from '@/common/comfun/ComFun'
import VueRx from "vue-rx" //rxjs

import axios from "axios";
import VueAxios from "vue-axios";

import VueTinymce from "@packy-tang/vue-tinymce"
// //安装组件
Vue.use(VueTinymce)
Vue.use(VueAxios, axios);



Vue.use(VueRx); //三方的插入
Vue.use(config);//全局可 通过 this.$config 访问 配置

// Vue.prototype.$ComFunJS = ComFunJS
Vue.prototype.$store = store;//状态管理
Vue.prototype.$request = request;//数据请求



const msg = (title, duration = 1500, mask = false, icon = 'none') => {
	//统一提示方便全局修改
	if (Boolean(title) === false) {
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}
Vue.prototype.$api = {
	msg
};


Vue.component('cu-custom',cuCustom)
Vue.config.productionTip = false
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()






/*
//PS: vue-axios des： (饥人谷的公共测试接口 )
		
// data:
// 		message: "success"
// 		result:
// 			forecasts: Array(5)
// 				0: {text_day: "多云", text_night: "多云", high: 22, low: 12, wc_day: "<3级", …}
// 				1: {text_day: "多云", text_night: "多云", high: 22, low: 13, wc_day: "<3级", …}
// 				2: {text_day: "多云", text_night: "阴", high: 21, low: 11, wc_day: "<3级", …}
// 				3: {text_day: "多云", text_night: "晴", high: 20, low: 10, wc_day: "<3级", …}
// 				4: {text_day: "晴", text_night: "晴", high: 24, low: 12, wc_day: "<3级", …}

// 			location: {country: "中国", province: "北京市", city: "北京市", name: "北京", id: "110100"} 


this.$http.get("http://api.jirengu.com/getWeather.php",{
	params:{
		city:"北京"
	}
}).then(res=>{
	console.log(res.data.result.location.city);
})

*/



