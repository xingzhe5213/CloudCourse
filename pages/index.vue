<template>
	<view class="uni-margin-wrap">
		<swiper class="swiper" circular :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration">
			<swiper-item v-for="item in sliderData" :key="item.courseId" @click="ToVideo(item.courseId)">
				<view class="swiper-item">
					<image v-if="!item.courseImg.startsWith('http')" class="swiper_image" mode="aspectFill" :src="$imgPath+item.courseImg"></image>
					<image v-if="item.courseImg.startsWith('http')" class="swiper_image" mode="aspectFill" :src="item.courseImg"></image>
				</view>
				<view class="swiper_bg">
					<p class="swiper_name">{{item.courseName}}</p>
					<p class="swiper_course iconfont iconcaidan" v-if="item.courseSource">{{item.courseSource}}</p>
				</view>
			</swiper-item>
		</swiper>
		<view class="course_class">
			<view @click="more('考研')">
				<p class="iconfont iconyanjiusheng"></p>
				<span>考研</span>
			</view>
			<view @click="more('计算机')">
				<p class="iconfont iconruanjian"></p>
				<span>计算机</span>
			</view>
			<view @click="more('四六级')">
				<p class="iconfont iconyingyu"></p>
				<span>四六级</span>
			</view>
			<view @click="more('')">
				<p class="iconfont icongengduo"></p>
				<span>更多</span>
			</view>
		</view>
		<p class="courseTitle" v-if="courseData.length>0">推荐课程<span class="courseMore" @click="more('')">更多 >></span></p>
		<CourseData :DataList='courseData' edit='0'></CourseData>
		<p class="courseTitle" v-if="liveData.length>0">直播课程<span class="courseMore" @click="more('')">更多 >></span></p>
		<CourseData :DataList='liveData' edit='0'></CourseData>
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
				}
			});
			
		},
		methods: {
			more(val){
				uni.navigateTo({
					url: 'CourseList?title='+val+'&search=0',
				})
			},
			ToVideo(val){
				let _this = this;
				
				let videoID="";
				let initialTime="";
				_this.$requestData({
					url:'/ca/isMyCourse',
					data:{
						courseId:val
					}
				}).then((res) => {
					if(res.data.data){
						videoID=res.data.data.videoId;
						initialTime=res.data.data.videoProgress;
					}
					uni.navigateTo({
						url: 'CourseDetails?courseID='+val+'&videoID='+videoID+'&initialTime='+initialTime,
					})
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/static/css/index.css";
</style>
