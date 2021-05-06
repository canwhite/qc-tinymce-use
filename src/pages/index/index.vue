<template>
  <view>

	<cu-custom bgColor="bg-gray" :isBack="isBack$">
		<block v-show="isBack$" slot="backText">返回</block>
		<block slot="content">#{{title$}}#</block>
	</cu-custom>
	<view class="app-container" :style="'height:'+containerHeight$+'upx'">
		
		 <vue-tinymce
            v-model="content"
            :setup="setup"
            :setting="setting"
			@change="changeClick($event)"
			
			 />		
		<view> 显示content: {{content$}}</view>
		<!-- <view> change调用:{{change$}}</view>  -->
	</view>

  </view>
</template>

<script>
import { 
	throwError,
	of,
	merge,
	race,
	from,
	isObservable,
	timer,
	interval
} from "rxjs";
import {
	pipe,
	filter,
	pluck,
	switchMap,
	map,
	mapTo,
	tap,
	catchError,
	share,
	takeUntil,
	take,
	startWith,
	exhaustMap,
	debounceTime,
	delay,
	timeout,
	repeat,
	takeWhile,
	combineLatest
} from "rxjs/operators";


export default {

	data(){
		return{

			containerHeight: 0,
			content: "<p>html content</p>",
			setting: {
				language_url: '../../static/tinymce/langs/zh_CN.js',
				language: 'zh_CN', //以上两者都需要配置
				height: 500,
				branding: false,//是否禁用Powered by TinyMCE
				menubar: false, //"tools table format view insert edit"
				// toolbar: "undo redo | fullscreen | formatselect alignleft aligncenter alignright alignjustify | link unlink | numlist bullist | image media table | fontselect fontsizeselect forecolor backcolor | bold italic underline strikethrough | indent outdent | superscript subscript | removeformat |",
				toolbar:' preview searchreplace selectall| bold italic underline strikethrough hr| fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist | outdent indent blockquote charmap| undo redo | link unlink  code uploadimage | media image table removeformat ',
				plugins: 'code toc fullpage autosave nonbreaking insertdatetime insertdatetime visualchars visualblocks visualblocks searchreplace searchreplace spellchecker pagebreak anchor hr preview print paste charmap help fullscreen image uploadimage media table lists theme contextmenu colorpicker textcolor wordcount ',
				toolbar_drawer: "sliding",
				media_live_embeds:true,
				quickbars_selection_toolbar: "removeformat | bold italic underline strikethrough | fontsizeselect forecolor backcolor",
				// plugins: "link image media table lists fullscreen quickbars",
				// media_live_embeds:true, //实时预览开关
				//添加文件加载
				file_picker_types: 'media',

				images_upload_handler: (blobInfo, success, failure) => {
					const img = 'data:image/jpeg;base64,' + blobInfo.base64()
					success(img)
				},

				file_picker_callback: function(cb, value, meta) {
					
					console.log(value);

					if (meta.filetype == 'media'){
						//创建一个隐藏的type=file的文件选择input，用这个去实现上传逻辑
						let input = document.createElement('input');
						input.setAttribute('type', 'file');
						input.setAttribute('accept', 'video/*');
						//input选中
						input.onclick=function(e){
						
						}
						input.onchange = function(e){
							let file = this.files[0];//谁唤起，this就是谁
							let onlyShow=1;//只是展示
							if(onlyShow){
								let localObjUrl=URL.createObjectURL(file);
								cb(localObjUrl, { title: file.name });

								/* 	tinymce.activeEditor.setContent(
									`<p>
									<span class="mce-preview-object mce-object-video" contenteditable="false" data-mce-object="video" data-mce-p-allowfullscreen="allowfullscreen" data-mce-p-frameborder="no" data-mce-p-scrolling="no" data-mce-p-src=${localObjUrl} data-mce-html="%20">
										<video src=${localObjUrl} width="100%" controls="controls"><source src=${localObjUrl} /></video><span class="mce-shim"></span>
									</span>		
									</p>`
								)  */

								//这样返回之后，会有一个占位符，正常如果想要看效果的话，只需要点击眼球图标，预览就可以了
								return `<p>
									<span class="mce-preview-object mce-object-video" contenteditable="false" data-mce-object="video" data-mce-p-allowfullscreen="allowfullscreen" data-mce-p-frameborder="no" data-mce-p-scrolling="no" data-mce-p-src=${localObjUrl} data-mce-html="%20">
										<video src=${localObjUrl} width="100%" controls="controls"><source src=${localObjUrl} /></video><span class="mce-shim"></span>
									</span>		
									</p>`;

							}else{
								//如果想顺势将图片上上传，请做另外操作

							}
                      
						}
						//触发点击
						input.click();
                  	}


				},
			},

		}
	},
	//vue-rx提供了一种映射方法
	observableMethods:{
		tabSelect:"tabSelect$",
		click:"click$",
		changeClick:"changeClick$"
	},

	methods:{
		setup(editor) {
			console.log(editor)
		}
	
	},
	subscriptions () {

		// const createLoader = url => from(this.$http.get(url)).pipe(pluck("data","result","location"));
		// const cache = {};
    	// const cacheData = cache => url => cache[url] || (cache[url] = createLoader(url));
		
		const title$ = of("tinymce");
		const isBack$ = of(false);

		//配置项还是用data显示

		
		//这部分相当于一个onReady的生命周期
		const myPromise = new Promise((resolve)=>{
			let sysInfo = uni.getSystemInfoSync();
			let containerHeight = sysInfo.windowHeight - this.CustomBar;//在这里可以直接使用data的数据
			resolve(containerHeight);
		})
		//promise用from
		const  containerHeight$ = from(myPromise);

		//对content作一些监听

		const content$ = this.$watchAsObservable("content",{
			immediate:true
		}).pipe(
			pluck("newValue")
		);

		//点击事件的操作
		const change$ = this.changeClick$.pipe(
			tap(e=>{
				console.log(e);
			})
		)

		//subscribe
        return {
			containerHeight$,
			title$,
			isBack$,
			content$,
			change$,
		
        }
	},

}
</script>
<style lang="scss">
	
	@import "common/base64-pic-store.scss";

	.app-container {

		$padding: 60upx;
		$bg:#ED4A4D;
		$pad:54upx;
		$line-color:#A6A6A6;
		$font-large-color:#202020;
		$font-lit-color:#999;
		width: 100%;
		min-height: 1334upx; //以iphone 6 为标准

	}
	
</style>
