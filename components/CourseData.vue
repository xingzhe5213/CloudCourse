<template>
	<view class="course_bg">
		<view class="course" :class="{'border':index<DataList.length-1}" v-for="(item,index) in DataList" :key="item.courseId">
			<view class="cour_L">
				<image v-if="!item.courseSource" class="cour_img" mode="aspectFill" :src="$imgPath+item.courseImg"></image>
				<image v-if="item.courseSource" class="cour_img" mode="aspectFill" :src="item.courseImg"></image>
			</view>
			<view class="cour_R">
				<p class="cour_title">{{item.courseName}}</p>
				<p class="cour_source"><span class="iconfont iconcaidan">{{item.courseSource}}</span></p>
				<p class="cour_info"><span class="cour_name iconfont iconuser">{{item.courseTeacher}}</span><span class="cour_time iconfont icontime-circle">{{item.referTime}}</span></p>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "CourseData",
		data() {
			return {
				
			};
		},
		onLoad() {
			console.log(DataList);
			},
		props: ['DataList']
	}
</script>

<style lang="scss" scoped>
	@import "@/static/css/CourseData.css";
</style>
