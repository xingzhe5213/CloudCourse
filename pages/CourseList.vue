<template>
	<view class="uni-margin-wrap">
		<view class="tags" v-if="search==0">
			<span @click="Switch('考研')" class="tag">考研</span>
			<span @click="Switch('英语四级')" class="tag">英语四级</span>
			<span @click="Switch('计算机')" class="tag">计算机</span>
			<span @click="Switch('英语六级')" class="tag">英语六级</span>
			<span @click="Switch('会计')" class="tag">会计</span>
			<span @click="Switch('金融')" class="tag">金融</span>
			<span @click="Switch('人工智能')" class="tag">人工智能</span>
			<span @click="Switch('心理学')" class="tag">心理学</span>
			<span @click="Switch('高等数学')" class="tag">高等数学</span>
			<span @click="Switch('法律')" class="tag">法律</span>
		</view>
		
		<p class="courseNone" v-if="courseData.length==0">未找到相关课程</p>
		<view v-if="courseData.length>0">
			<p class="courseTitle" v-if="search==0">{{title||'课程'}}</p>
			<CourseData :DataList='courseData' edit="0"></CourseData>
			<view class="courMore" v-if="CouCount!=Couindex" @click="getCou(Couindex+5)">加载更多</view>
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
				title:"",
				search:"0"
			}
		},
		onLoad(e){
			console.log(e)
		    this.title=e.title;
			this.search=e.search;
			this.getCouDataList(5);
		},
		methods: {
			/*
			* 课程
			*/
			getCouDataList(index){
				let _this = this;
				_this.$requestData({
					url:'/course/findCourse',
					data:{
						index:1,
						pageSize:index,
						keyWord:_this.title
					}
				}).then((res) => {
					if(res.data.code === 200){
						_this.CouCount=res.data.data.count;
						_this.Couindex=res.data.data.list.length;
						_this.courseData=res.data.data.list;
					}
				});
			},
			getCou(val){
				this.getCouDataList(val);
			},
			Switch(val){
				this.title=val;
				this.getCouDataList(5);
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
.tags{
	text-align: center;
}
.tag{
	display: inline-block;
	height: 40rpx;
	line-height: 40rpx;
	width: auto;
	padding: 5rpx 20rpx;
	margin: 10rpx 10rpx;
	color: #969896;
	font-size: 12px;
	background-color: #fff;
	border: 1px #969896 solid;
	border-radius: 30rpx;
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
