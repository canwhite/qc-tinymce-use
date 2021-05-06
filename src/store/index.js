import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

const store = new Vuex.Store({
	state:{
		themeColor:'#888888',
		bannerDotColor:"#888888",
		bannerDotActiveColor:"#888888",
		tabbarTextColor:'',
		tabbarTextActiveColor:"",
		textColor:"",
		descTextColor:"",
		priceColor:"",
		articles:[],
		showLoading:false,
		tabbar:[
			{
				"iconPath": "http://cdn.gek6.cn/fr-uni-app-icon/a2.png",
				"selectedIconPath": "http://cdn.gek6.cn/fr-uni-app-icon/a1.png",
				"title": "首页",
				"page": "index"
			},
			{
				"iconPath": "http://cdn.gek6.cn/fr-uni-app-icon/b2.png",
				"selectedIconPath": "http://cdn.gek6.cn/fr-uni-app-icon/b1.png",
				"title": "产品中心",
				"page": "goods",
				"size":"big"
			},
			{
				"iconPath": "http://cdn.gek6.cn/fr-uni-app-icon/c2.png",
				"selectedIconPath": "http://cdn.gek6.cn/fr-uni-app-icon/c1.png",
				"title": "我的",
				"page": "mine",
			}
		],
		
	},
	mutations:{
		
		
	},
	actions:{
		
		
	}
})
export default store;