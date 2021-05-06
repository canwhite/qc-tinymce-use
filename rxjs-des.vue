<template>
  <view>
	
	<view class="box"> 
		--------lesson 1: 基础操作和带参---------
	</view>

	<!-- 方法带参 -->
	<button @click="setName($event,'test')">点击设置name的值</button>
	<view>
		年龄：{{ age$ }}
	</view>
	<view>
		名字：{{ name$ }}
	</view> 
	<view>{{interval$}}---{{timesTwo$}}---{{timesThree$}}</view>



	<view class="box"> 
		--------lesson 2：数据请求---------
	</view>
	<view>{{beijing$}} </view> 

	<view class="box"> 
		--------lesson 3: 请求单子---------
	</view>
	<button @click="click" :disabled="disabled$">{{buttonText$}}</button>
    <p v-if="Boolean(location$)">{{city$}}</p>

	<view class="box"> 
		--------lesson 4：merge竞赛关系---------
	</view>
	<!-- 用merge可以吐真 -->
	<view> {{cityBox$}} </view>

	<view>{{luke$}}</view>
	<view>{{newLuke$}}</view>

	<view class="box"> 
		--------lesson 5：将watch映射为stream---------
	</view>

	<input 
		type="text"
		v-model="myin"
		placeholder="请输入内容"
		/>
	<view>输入的内容:{{activeInput$}}</view>


	
	<view class="box"> 
		--------lesson 6：组合多个数据---------
	</view>
	<view> {{obj3$}} </view>

		
	<view class="box"> 
		--------lesson 7：from  Promise 手动触发---------
	</view>


	<view class="box"> 
		--------lesson 8：加cache 有缓存拿缓存---------
	</view>


	<view class="box"> 
		--------lesson 9：combineLatest还可以直接使用---------
	</view>
	
	<!-- 
		
	const luke$ = combineLatest(
      activeTab$, 
      people$,
      (tabId, people) => people[tabId].id,
    ).pipe(
      map(id => `https://starwars.egghead.training/people/${id}`),
      switchMap(cachePerson(cache)),
      catchError(() => of({ name: "This is an error :(" })),
      share(),
    ); 
	  
	-->


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


const data$ = of(123);

export default {

	name: 'rx-simple',

	// uni-app不支持dom操作但是可以获取dom,也不支持自定义指令
	// 所以这种方法不能使用
    // domStreams: [
    //      'setName$'
	// ],

	data(){
		return{
			myin:""
		}
	},

	//vue-rx提供了一种映射方法
	observableMethods:{
		setName:"setName$",
		click:"click$"
	},
	//方法提供一个隐式的subscribe
    subscriptions () {

		//这种点击类的，要放初始值，变量可以给他初始值
		const name$ = this.setName$.pipe(
			tap(e=>{
			 	console.log(e);
			 	return e;
			}),//主要是为了点击的时候观察
			map(e=>e[1])

		);
		const interval$ = interval(1000);
		const timesTwo$ = interval$.pipe(map(i => i * 2));
		const timesThree$ = interval$.pipe(map(i => i * 3));
		



		//单独一个北京
		const beijing$ = from(this.$http.get("http://api.jirengu.com/getWeather.php?city=北京")).pipe(
		 	pluck("data","result","location","city")//嵌套内容的寻找，按顺序往上添加就可以了
		)

		//location一个比较总的结果
		const location$ = from(this.$http.get("http://api.jirengu.com/getWeather.php?city=北京")).pipe(
		 	pluck("data","result","location")//嵌套内容的寻找，按顺序往上添加就可以了
		)


		//点击获取一个稍微总一点的数据
		/* const luke$ = this.click$.pipe(
			//switchMap会取消前一个，相当于只返回最后一个数据，前边的被顶掉了
			switchMap(()=>location$)
		) */

		/*===================================================
		重要：趁势说一下几种map的区别
		1.concatMap:当你连续点击按钮多次获取数据时，concatMap会将获取到的数据按队列发出
		2.switchMap:当你连续点击按钮多次获取数据时，switchMap只会将最后一个点击发出的值发出，前面发出的值会被吞掉
		3.exhaustMap:当你连续点击按钮多次时，exhaustMap仅执行一次，在第一次值发出后，才可以继续点击下一次发出值
		=====================================================*/


		
		//ps,、monad，单子独立出来，很多就都可以用了
		//我这里pluck用的多了，正常到data就可以了
		const createLoader = url => from(this.$http.get(url)).pipe(pluck("data","result","location"));
		//还可以加一层缓存，然后直接缓存中找
		const cache = {};
    	const cacheData = cache => url => cache[url] || (cache[url] = createLoader(url));
		
		//click的点击获取值
		const luke$ = this.click$.pipe(
			tap(e=>{
				console.log('----luke',e);
			}),
			mapTo("http://api.jirengu.com/getWeather.php?city=北京"),//初始值
			switchMap(cacheData(cache)),//对初始值进行再操作
			catchError(() => of({ name: "This is an error :(" })),//捕获 observable 中的错误c
			share(),//一般是被人订阅前，先把自己群播出去，这样在多次订阅的时候，以上副作用就只执行一次了	
			delay(3000)
		)




		//从location拿到city，当luke点击出现的时候，这里才有了值
		const city$ = luke$.pipe(
			pluck("city")
		);

		
		//这个是取值
		const city1$ = of().pipe(
			pluck("city1") //这里返回了一个空字符串
		);
		//取值失败之后得备份
		const city1Error$ = of("上海");

		//merge竞争，先到先得
		const cityBox$ = merge(city1$,city1Error$);

		//merge 
		//merge存在竞争关系，是并行的，谁先发出，先用谁的
		//这一点和concat作区分，
		//解释：一开始this.click$.pipe((mapTo(true))先输出
		//delay了三秒luke$先得到了请求值，然后我们才可以输出新的值
		//luke$.pipe(mapTo(false), merge这时候输出false
		//总结：记住一点 merge是竞争关系
		const disabled$ = merge(
			this.click$.pipe(mapTo(true),
			tap(e=>{console.log('click',e)})),//click上先运true
			luke$.pipe(
				mapTo(false), 


				//这里有一个问题，后输出的值为什么没有影响先输出的值,
				//操作符并不影响之前的输出，之前的输出已经完成了
				//我们通过操作符生成新值是一个新的订阅
				
				tap(e=>{console.log('luke',e)}))
			//因为上边有一个发送，等待上边的pipe信号发送完
		).pipe(
			startWith(false),
			tap(e=>{console.log('disabled',e);}))

		const buttonText$ = disabled$.pipe(
			map(bool => (bool ? "Loading..." : "Load")),
		);
		const newLuke$ = luke$.pipe(mapTo("123"));



		//watchAsObservable
		const activeInput$ = this.$watchAsObservable("myin", {
			immediate: true,
		}).pipe(pluck("newValue"));

		// combineLatest
		// 组合多个 Observables 来创建一个 Observable ，
		// 该 Observable 的值根据每个输入 Observable 的最新值计算得出的。
		// 最后一个参数是callback


		// 经常用的方法是两个，或者多个值组合使用，最后输出一个值
		// 注意interval是每秒发出自增数字
		// take是指取出第几个然后complete


		const obj1$ = interval(500).pipe(
			take(3)
		)

		const obj2$ = interval(500).pipe(
			take(4)
		)
		const obj3$ =  obj1$.pipe(
			combineLatest(obj2$,(x,y)=>{return  x+y})
		);


		//拿到promise，但是不在下边return中订阅

		const myPromise = new Promise(resolve => {
			console.log("INVOKED");

			resolve(new Date());
		});

		//可以模拟一下生命周期
		from(myPromise).subscribe(value => console.log(value));
		from(myPromise).subscribe(value => console.log(value));
		from(myPromise).subscribe(value => console.log(value));


		



		

        return {
            age$: of(23).pipe(
				mapTo(25)
			),
			name$,
			interval$,
			timesTwo$,
			timesThree$,
			beijing$,
			luke$,
			location$,
			city$,
			cityBox$,
			disabled$,
			buttonText$,
			newLuke$,
			activeInput$,
			obj3$
			
        }
	},

	onLoad(){

		data$.subscribe((res)=>{

			console.log("-----",res);
		});



		/* data:
			message: "success"
			result:
			forecasts: Array(5)
			0: {text_day: "多云", text_night: "多云", high: 22, low: 12, wc_day: "<3级", …}
			1: {text_day: "多云", text_night: "多云", high: 22, low: 13, wc_day: "<3级", …}
			2: {text_day: "多云", text_night: "阴", high: 21, low: 11, wc_day: "<3级", …}
			3: {text_day: "多云", text_night: "晴", high: 20, low: 10, wc_day: "<3级", …}
			4: {text_day: "晴", text_night: "晴", high: 24, low: 12, wc_day: "<3级", …}

			location: {country: "中国", province: "北京市", city: "北京市", name: "北京", id: "110100"} */

		/* this.$http.get("http://api.jirengu.com/getWeather.php",{
			params:{
				city:"北京"
			}
		}).then(res=>{
			console.log(res.data.result.location.city);
		}) */

	}

}
</script>
<style lang="scss" scoped>
	.box{
		display: flex;
		justify-content: center;
		align-items: center;
	}


</style>>