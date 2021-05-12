<template>
	<view class="uni-margin-wrap">
		<swiper class="swiper" circular :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration">
			
			<swiper-item v-for="item in sliderData" :key="item.courseId">
				<view class="swiper-item">
					<image v-if="!item.courseSource" class="swiper_image" mode="aspectFill" :src="$imgPath+item.courseImg"></image>
					<image v-if="item.courseSource" class="swiper_image" mode="aspectFill" :src="item.courseImg"></image>
				</view>
				<view class="swiper_bg">
					<p class="swiper_name">{{item.courseName}}</p>
					<p class="swiper_course iconfont iconcaidan" v-if="item.courseSource">{{item.courseSource}}</p>
				</view>
			</swiper-item>
			
		</swiper>
		
		<view class="course_class">
			<view>
				<p class="iconfont iconyanjiusheng"></p>
				<span>考研</span>
			</view>
			<view>
				<p class="iconfont iconruanjian"></p>
				<span>计算机</span>
			</view>
			<view>
				<p class="iconfont iconyingyu"></p>
				<span>四六级</span>
			</view>
			<view>
				<p class="iconfont icongengduo"></p>
				<span>更多</span>
			</view>
		</view>
		
		<p class="courseTitle">推荐课程<span class="courseMore">更多 >></span></p>
		<CourseData :DataList='courseData'></CourseData>
		
		<p class="courseTitle">直播课程<span class="courseMore">更多 >></span></p>
		<CourseData :DataList='liveData'></CourseData>
		
	</view>
	
	
	
	
</template>

<script>
	import CourseData from '@/components/CourseData.vue'
	export default {
		components: {
		    // 注册自定义组件 
			CourseData
		},
		filters: {
			filterDate(cellValue,format) {
				return cellValue ? moment(cellValue).format(format): '';
			}
		},
		data() {
			return {
				sliderData:"",
				courseData:"",
				liveData:"",
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500
			}
		},
		/**
		 * 当 searchInput 配置 disabled 为 true 时触发
		 */
		onNavigationBarSearchInputClicked(e) {
			uni.navigateTo({
				url: '/pages/search_detail'
			});
		},
		onLoad() {
			let _this = this;
			// 轮播图
			_this.$requestData({
				url:'/course/getCourse',
				data:{
					index:1,
					pageSize:3,
					liveCourse:false
				}
			}).then((res) => {
				if(res.data.code === 200){
					_this.sliderData=res.data.data.list;
					console.log(_this.sliderData);
				}
			});
			
			// 推荐课程
			_this.$requestData({
				url:'/course/getCourse',
				data:{
					index:1,
					pageSize:6,
					liveCourse:false
				}
			}).then((res) => {
				if(res.data.code === 200){
					_this.courseData=res.data.data.list;
					console.log(_this.courseData);
				}
			});
			
			// 直播课程
			_this.$requestData({
				url:'/course/getCourse',
				data:{
					index:1,
					pageSize:6,
					liveCourse:true
				}
			}).then((res) => {
				if(res.data.code === 200){
					_this.liveData=res.data.data.list;
					
					
					console.log(_this.liveData);
				}
			});
			
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/static/css/index.css";
</style>
