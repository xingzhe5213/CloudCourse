<template>
	<view class="uni-margin-wrap">
		<p class="courseNone" v-if="login&&courseData.length==0&&liveCourse.length==0">未参加任何课程</p>
		<p class="courseNone" v-if="!login">未登录</p>
		
		<view  v-if="courseData.length>0">
			<p class="courseTitle">课程</p>
			<CourseData :DataList='courseData'></CourseData>
			<view class="courMore" v-if="CouCount!=Couindex" @click="getCou(Couindex+5)">加载更多</view>
		</view>
		
		<view v-if="liveCourse.length>0">
			<p class="courseTitle">直播</p>
			<CourseData :DataList='liveCourse'></CourseData>
			<view class="courMore" v-if="LivCount!=Livindex" @click="getLiv(Livindex+5)">加载更多</view>
		</view>
	</view>
</template>


<script>
	import CourseData from '@/components/CourseData.vue'
	export default {
		components: {
		    // 注册自定义组件 
			CourseData
		},
		data() {
			return {
				courseData:"",
				CouCount:5,
				Couindex:"",
				liveCourse:"",
				LivCount:5,
				Livindex:"",
				login:true
			}
		},
		onLoad() {
			this.getCouDataList(5);
			this.getLivDataList(5);
		},
		methods: {
			/*
			* 课程
			*/
			getCouDataList(index){
				let _this = this;
				_this.$requestData({
					url:'/ca/getOpt',
					data:{
						index:1,
						pageSize:index,
						live:false
					}
				}).then((res) => {
					if(res.data.code === 200){
						console.log(res)
						_this.CouCount=res.data.data.count;
						_this.Couindex=res.data.data.list.length;
						_this.courseData=res.data.data.list;
					}
					if(res.statusCode==403){
						_this.login=false;
					}
				});
			},
			/*
			* 直播
			*/
			getLivDataList(index){
				let _this = this;
				_this.$requestData({
					url:'/ca/getOpt',
					data:{
						index:1,
						pageSize:index,
						live:true
					}
				}).then((res) => {
					if(res.data.code === 200){
						_this.LivCount=res.data.data.count;
						_this.Livindex=res.data.data.list.length;
						_this.liveCourse=res.data.data.list;
					}
					if(res.statusCode==403){
						_this.login=false;
					}
				});
			},
			getCou(val){
				this.getCouDataList(val);
			},
			getLiv(val){
				this.getLivDataList(val);
			}
		}
	}
</script>

<style>
.uni-margin-wrap {
	width: 700rpx;
	margin:20rpx auto;
	border-radius: 25rpx;
}
.courseTitle{
	font-size:18px;
	margin: 30rpx 10rpx;
}
.courseNone{
	text-align: center;	
	color:#999;
	width:100%;
	margin:100rpx auto;
}
.courMore{
	text-align: center;
	color:#999;
	width:75%;
	height:55rpx;
	line-height: 55rpx;
	color:#5577ee;
	border-radius: 25rpx;
	border: 1rpx #5577ee solid;
	margin:10rpx auto;
}
</style>
