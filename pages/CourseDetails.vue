<template>
	<view>
		<view class="video">
			<video id="myVideo" v-if="!src.startsWith('http')" :src="$videoPath+src" @error="videoErrorCallback" autoplay="true" :initial-time="initialTime" controls direction="-90" show-fullscreen-btn object-fit="contain"></video>
			<video id="myVideo" v-if="src.startsWith('http')" :src="src" @error="videoErrorCallback" autoplay="true" :initial-time="initialTime" controls direction="-90" show-fullscreen-btn object-fit="contain"></video>
		</view>
		<view v-if="course.courseSource" class="iconfont iconcaidan">{{course.courseSource}}</view>
		<view class="uni-margin-wrap">
			<p class="IntTitle" v-if="">课 程 简 介</p>
			<view class="Introduce"><p>{{course.courseIntroduce}}</p></view>
			<p class="IntTitle" v-if="">教 师 简 介</p>
			<view class="Introduce"><p>{{course.teacherIntroduce}}</p></view>
			<p class="IntTitle" v-if="">章 节 目 录</p>
			<view class="VideoList">
				<p class="iconfont iconshipin" :class="{'select':index<videos.length-1}" v-for="(item,index) in videos" @click="ToVideo(course.courseId,item.videoId)">{{item.videoName}}<span class="edit iconfont iconshanchu" v-if="Edit==1" @click="deleteVideo(item.videoName,item.videoId)"></span></p>
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
				courseId:""//课程ID
			}
		},
		onLoad(e){
			console.log(e);
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
				console.log(res)
				if(res.data.code === 200){
					_this.src=res.data.data.videoAddress;
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
				if(this.Edit==0){
					uni.redirectTo({
						url: 'CourseDetails?courseID='+courseID+'&videoID='+videoID+'&initialTime=0',
					});
				}
			},
			edit(){
				this.Edit=1;
			},
			addVideo(val){
				uni.navigateTo({
					url: 'uploadVideo?courseId='+val,
				})
			},
			complete(){
				this.Edit=0;
			},
			deleteVideo(name,val){
				this.$requestData({
					url:'/lesson/delete',
					data:{
						videoId:val
					}
				}).then((res) => {
					console.log(res)
					if(res.data.code === 0){
						uni.showModal({
							title: '提示',
							content: '是否删除课程：'+name+'？',
							success: res => {
								if (res.confirm) {
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
							}
						});
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
			}
		}
	}
</script>


<style>
	video {
		width: 100%;
	}
	.video {
		width: 100%;
		height:auto;
	}
	.iconcaidan{
		font-size:10px;
		width: 700rpx;
		margin:20rpx auto -10rpx;
	}
	.iconcaidan::before{
		padding-right: 10rpx;
	}
	.uni-margin-wrap {
		width: 700rpx;
		margin:20rpx auto;
		margin-bottom: 130rpx;
	}
	.IntTitle{
		font-size:18px;
		margin: 30rpx auto;
		padding-bottom: 10rpx;
		width: 200rpx;
		text-align: center;
		border-bottom: 3px #5577ee solid;
	}
	.Introduce{
		background-color: #fff;
		height:auto;
		border-radius: 25rpx;
		padding:30rpx 40rpx;
	}
	.Introduce p{
		line-height: 25px;
		font-size: 15px;
	}
	.VideoList{
		background-color: #fff;
		height:auto;
		border-radius: 25rpx;
		padding:30rpx 50rpx;
	}
	.VideoList p{
		font-size: 16px;
		color: #000000;
		height: 80rpx;
		line-height: 80rpx;
		width: 600rpx;
		text-overflow:ellipsis;
		white-space:nowrap;
		overflow:hidden
	}
	.VideoList p::before{
		padding-right:20rpx ;
		font-size: 20px;
		color:#5577ee;
	}
	.select{
		border-bottom: 0.5rpx #ddd solid;
	}
	.bottom{
		position: fixed;
		text-align: center;
		bottom:0;
		width: 100%;
		height: 100rpx;
		background-color: #fff;
		border-top: 0.25rpx #bbb solid;
	}
	.button{
		height: 60rpx;
		width: 200rpx;
		line-height: 60rpx;
		color: #fff;
		margin:20rpx 50rpx;
		display: inline-block;
		background-color: #5577ee;
		border-radius: 25rpx;
	}
	.button_add{
		height: 60rpx;
		width: 200rpx;
		line-height: 60rpx;
		color: #aaa;
		margin:20rpx 50rpx;
		display: inline-block;
		background-color: #eee;
		border-radius: 25rpx;
	}
	.button_create{
		height: 60rpx;
		font-size: 14px;
		width: 100%;
		line-height: 60rpx;
		color: #aaa;
		margin:20rpx auto;
		display: inline-block;
	}
	.edit{
		height: 60rpx;
		width: 60rpx;
		line-height: 60rpx;
		text-align: center;
		position: absolute;
		color:#FF0033;
		margin-top:10rpx ;
		right: 80rpx;
	}
</style>
