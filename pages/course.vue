<template>
	<view class="uni-margin-wrap">
		<p class="courseNone" v-if="login&&courseData.length==0&&liveCourse.length==0&&teacher==0">未参加任何课程</p>
		<p class="courseNone" v-if="login&&courseData.length==0&&liveCourse.length==0&&teacher==1">未创建任何课程</p>
		<p class="courseNone" v-if="!login">未登录</p>
		<view  v-if="courseData.length>0">
			<p class="courseTitle">课程<span class="editbutton" @click="EditData" v-if="edit==0">编辑</span><span class="editbutton" @click="complete" v-if="edit==1">完成</span></p>
			<CourseData :DataList='courseData' :edit="edit"></CourseData>
			<view class="courMore" v-if="CouCount!=Couindex" @click="getCou(Couindex+5)">加载更多</view>
		</view>
		<view v-if="liveCourse.length>0">
			<p class="courseTitle">直播<span class="editbutton" @click="EditData" v-if="edit==0&&courseData.length==0">编辑</span><span class="editbutton" @click="complete" v-if="edit==1&&courseData.length==0">完成</span></p>
			<CourseData :DataList='liveCourse' :edit="edit"></CourseData>
			<view class="courMore" v-if="LivCount!=Livindex" @click="getLiv(Livindex+5)">加载更多</view>
		</view>
		<view class="Addcour" @click="Addcour" v-if="teacher==1">添加课程</view>
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
				login:true,
				edit:0,
				teacher:0
			}
		},
		onShow() {
			this.getCouDataList(5);
			this.getLivDataList(5);
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
			},
			EditData(){
				this.edit=1;
			},
			complete(){
				this.edit=0;
			},
			Addcour(){
				uni.navigateTo({
					url: 'addcourse'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/static/css/course.css";
</style>
