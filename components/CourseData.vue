<template>
	<view class="course_bg" v-if="DataList.length>0">
		<view class="course" :class="{'border':index<DataList.length-1}" v-for="(item,index) in DataList" :key="item.courseId" @click="ToVideo(item.courseId)">
			<view class="cour_L">
				<image v-if="!item.courseImg.startsWith('http')" class="cour_img" mode="aspectFill" :src="$imgPath+item.courseImg"></image>
				<image v-if="item.courseImg.startsWith('http')" class="cour_img" mode="aspectFill" :src="item.courseImg"></image>
			</view>
			<view class="cour_R">
				<p class="cour_title">{{item.courseName}}</p>
				<p class="cour_source"><span class="iconfont iconcaidan">{{item.courseSource}}</span></p>
				<p class="cour_info"><span class="cour_name iconfont iconuser">{{item.courseTeacher}}</span><span class="cour_time iconfont icontime-circle">{{item.referTime|filterDate}}</span></p>
			</view>
			<view class="edit iconfont iconshanchu" v-if="edit==1" @click="deleteCou(item.courseName,item.courseId)"></view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "CourseData",
		filters: {
			filterDate(value) {
				var date = new Date(Number.parseInt(value)*1000);
				var month = date.getMonth() + 1;
				var time = date.getFullYear() + "-" + month + "-" + date.getDate();
				return time;
			}
		},
		data() {
			return {
				teacher:0,
			};
		},
		onLoad() {
			let _this=this;
			
			_this.$requestData({
				url:'/auth/info'
			}).then((res) => {
				if(res.data.code === 200&&res.data.data.lecturer=='true'){
					_this.teacher=1;
				}
			});
		},
		props: ['DataList','edit'],
		methods:{
			ToVideo(val){
				if(this.edit==0){
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
			},
			deleteCou(name,val){
				let _this=this;
				_this.$requestData({
					url:'/auth/info'
				}).then((res) => {
					if(res.data.code === 200&&res.data.data.lecturer=='true'){
						_this.teacher=1;
						if(this.teacher==0){
							uni.showModal({
								title: '提示',
								content: '是否退选课程：'+name+'？',
								success: res => {
									if (res.confirm) {
										this.$requestData({
											url:'/ca/unselect',
											data:{
												courseId:val
											}
										}).then((res) => {
											if(res.data.code === 0){
												uni.showToast({
													title:"删除成功！"
												});
												uni.reLaunch({
												    url: 'course'
												});
											}
										});
									}
								}
							});
						}else{
							uni.showModal({
								title: '提示',
								content: '是否删除课程：'+name+'？',
								success: res => {
									if (res.confirm) {
										this.$requestData({
											url:'/course/deleteCourse',
											data:{
												courseId:val
											}
										}).then((res) => {
											if(res.data.code === 0){
												uni.showToast({
													title:"删除成功！"
												});
												uni.reLaunch({
												    url: 'course'
												});
											}
										});
									}
								}
							});
						}
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/static/css/CourseData.css";
</style>
