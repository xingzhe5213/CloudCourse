<template>
	<view>
		<view class="video">
			<video id="myVideo" v-if="!src.startsWith('http')" :src="$videoPath+src" @timeupdate="timeupdate" @error="videoErrorCallback"  autoplay="true" :initial-time="initialTime" controls direction="-90" show-fullscreen-btn object-fit="contain"></video>
			<video id="myVideo" v-if="src.startsWith('http')" :src="src" @timeupdate="timeupdate" @error="videoErrorCallback"  autoplay="true" :initial-time="initialTime" controls direction="-90" show-fullscreen-btn object-fit="contain"></video>
		</view>
		<view v-if="course.courseSource" class="iconfont iconcaidan">{{course.courseSource}}</view>
		<view class="uni-margin-wrap">
			<p class="IntTitle" v-if="">课 程 简 介</p>
			<view class="Introduce"><p>{{course.courseIntroduce}}</p></view>
			<p class="IntTitle" v-if="">教 师 简 介</p>
			<view class="Introduce"><p>{{course.teacherIntroduce}}</p></view>
			<p class="IntTitle" v-if="">章 节 目 录</p>
			<view class="VideoList">
				<p class="iconfont iconshipin" :class="[{'select':index<videos.length-1,'play':videoID==item.videoId}]" v-for="(item,index) in videos" @click="ToVideo(course.courseId,item.videoId)">{{item.videoName}}<span class="edit iconfont iconshanchu" v-if="Edit==1" @click="deleteVideo(item.videoName,item.videoId)"></span></p>
			</view>
		</view>
		<view class="bottom" v-if="teacher==0">
			<view class="button" v-if="select==0" @click="addStudy(course.courseId)">加入学习</view>
			<view class="button_add" v-if="select==1">已添加</view>
		</view>
		<view class="bottom" v-if="teacher==1">
			<view v-if="select==1&&Edit==0">
				<view class="button" @click="edit">编  辑</view>
				<view class="button" @click="addVideo(course.courseId)">添  加</view>
			</view>
			<view class="button" v-if="select==1&&Edit==1" @click="complete">完  成</view>
			<view class="button_create" v-if="select==0">课程创建者：{{course.courseTeacher}}</view>
		</view>
		<view class="videoInfo_bg" v-if="videoInfo==true">
			<view class="videoInfo">
				<p class="live_title">直播推流地址</p>
				<p class="live_cont">{{pushAddress}}</p>
				<p class="live_title">直播推流秘钥</p>
				<p class="live_cont">{{pushKey}}</p>
				<p class="live_title">直播开始时间</p>
				<p class="live_cont">{{startTime}}</p>
				<view class="live_Bt">
					<view class="button" @click="liveover">结束直播</view>
					<view class="button" @click="back">返 回</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return{
				src:"",
				initialTime:"0",//指定视频初始播放位置，单位为秒（s）
				course:"",//课程信息
				videos:"",//视频信息
				teacher:0,//用户身份
				select:0,//是否选课
				Edit:0,//是否编辑
				courseId:"",//课程ID
				videoID:"",
				LivevideoID:"",
				pushAddress:"",
				pushKey:"",
				startTime:"",
				videoInfo:false
			}
		},
		onLoad(e){
			if(e.initialTime){
				this.initialTime=e.initialTime;
			}
			this.courseId=e.courseID;
			let _this=this;
			_this.$requestData({
				url:'/course/getCourseById',
				data:{
					courseId:e.courseID
				}
			}).then((res) => {
				if(res.data.code === 200){
					_this.course=res.data.data.course;
					_this.videos=res.data.data.videos;
					uni.setNavigationBarTitle({
						title:res.data.data.course.courseName
					})
				}
			});
			_this.$requestData({
				url:'/lesson/get',
				data:{
					videoId:e.videoID,
					courseId:e.courseID
				}
			}).then((res) => {
				if(res.data.code === 200){
					_this.src=res.data.data.videoAddress;
					_this.videoID=res.data.data.videoId;
				}
			});
			_this.$requestData({
				url:'/auth/info'
			}).then((res) => {
				if(res.data.code === 200&&res.data.data.lecturer=='true'){
					_this.teacher=1;
				}
			});
			_this.$requestData({
				url:'/ca/isMyCourse',
				data:{
					courseId:e.courseID
				}
			}).then((res) => {
				if(res.data.code === 200&&res.data.data!=false){
					_this.select=1;
				}
			});
		},
		methods: {
			videoErrorCallback: function(e) {
				uni.showToast({
					title:"视频加载失败！"
				})
			},
			ToVideo(courseID,videoID){
				let _this=this;
				_this.$requestData({
					url:'/lesson/get',
					data:{
						videoId:videoID,
						courseId:courseID
					}
				}).then((res) => {
					if(res.data.code === 200&&(res.data.data.playBack==0||res.data.data.playBack==1)){
						_this.videoInfo=true;
						_this.pushAddress=res.data.data.pushAddress;
						_this.pushKey=res.data.data.pushKey;
						_this.startTime=res.data.data.startTime;
						_this.LivevideoID=res.data.data.videoId;
					}else{
						if(this.Edit==0){
							uni.redirectTo({
								url: 'CourseDetails?courseID='+courseID+'&videoID='+videoID+'&initialTime=0',
							});
						}
					}
				});
			},
			edit(){
				this.Edit=1;
			},
			addVideo(val){
				uni.redirectTo({
					url: 'uploadVideo?courseId='+val,
				})
			},
			complete(){
				this.Edit=0;
			},
			deleteVideo(name,val){
				uni.showModal({
					title: '提示',
					content: '是否删除章节：'+name+'？',
					success: res => {
						if (res.confirm) {
							this.$requestData({
								url:'/lesson/delete',
								data:{
									videoId:val
								}
							}).then((res) => {
								if(res.data.code === 0){
									uni.showToast({
										title:"删除成功！"
									});
									this.$requestData({
										url:'/course/getCourseById',
										data:{
											courseId:this.courseId
										}
									}).then((res) => {
										if(res.data.code === 200){
											this.videos=res.data.data.videos;
										}
									});
								}
							});
						}
					}
				});
			},
			addStudy(val){
				let _this=this;
				_this.$requestData({
					url:'/ca/select',
					data:{
						courseId:val
					}
				}).then((res) => {
					if(res.data.code === 200){
						_this.select=1;
						uni.showToast({
							title:"选课成功！"
						})
					}else{
						uni.showModal({
							title: '提示',
							content: '未登录，无法选课，是否登录？',
							success: res => {
								if (res.confirm) {
									uni.navigateTo({
										url:"login"
									});
								}
							}
						});
					}
				});
			},
			liveover(){
				this.$requestData({
					url:'/live/pushend',
					data:{
						videoId:this.LivevideoID
					}
				}).then((res) => {
					if(res.data.code === 200){
						uni.showToast({
							title:"直播已结束，自动为您生成回放课程！",
							icon:"none"
						});
						this.videoInfo=false;
					}
				});
			},
			back(){
				this.videoInfo=false;
			},
			timeupdate(res){
				let time=res.detail.currentTime.toFixed(0);
				this.$requestData({
					url:'/ca/saveInfo',
					data:{
						courseId:this.courseId,
						videoId:this.videoID,
						videoProgress:time
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/static/css/CourseDetails.css";
</style>
