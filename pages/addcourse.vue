<template>
	<view>
		<view class="plane-view">
			<view class="t-plane">
				<form class="cl">
					<view class="t-a">
						<text class="txt">课程名</text>
						<input type="text" name="courseName" placeholder="请输入课程名" maxlength="20" v-model="courseName" />
					</view>
					<view class="t-a">
						<text class="txt">标签</text>
						<input type="text" name="courseClass" maxlength="40" placeholder="请输入课程标签" v-model="courseClass" />
					</view>
					<view class="t-a">
						<text class="txt">课程介绍</text>
						<input type="text" name="courseIntroduce" maxlength="500" placeholder="请再次输入课程介绍" v-model="courseIntroduce" />
					</view>
					<view class="t-a">
						<text class="txt">课程教师</text>
						<input type="text" name="courseTeacher" maxlength="20" placeholder="请输入课程教师" v-model="courseTeacher" />
					</view>
					<view class="t-a">
						<text class="txt">教师介绍</text>
						<input type="text" name="teacherIntroduce" maxlength="500" placeholder="请输入教师介绍" v-model="teacherIntroduce" />
					</view>
					<view class="t-a">
						<text class="txt">课程类型</text>
						<radio-group @change="onCourseTypeChange">
							<radio value="false" checked="true" class="item">视频</radio>
							<radio value="true" class="item">直播</radio>
						</radio-group>
					</view>
					<view class="t-a">
						<text class="txt">课程封面</text>
						<view class="imguploader">
							<view v-if="!image" class="iconfont icontianjia" @tap="chooseImg"></view>
							<view v-else class="img_view">
								<image class="img_preview" :src="image" :data-src="image"  @tap="chooseImg" ></image>
							</view>
						</view>
					</view>
					<button class="reg" @click="checkForm">创建课程</button>
				</form>
			</view>
		</view>
	</view>
</template>

<script>
	import permision from "@/common/permission.js"
	export default {
		data() {
			return {
				courseName:"",
				courseClass:"",
				courseIntroduce:"",
				courseTeacher:"",
				teacherIntroduce:"",
				courseLive:"",
				courseImg:"",
				imgArr:[],
				image:false,
				uploadImgInfo:null
			};
		},
		methods:{
			showToast:function(msg){
				uni.showToast({
					title:msg,
					icon:'none'
				});
			},	
			onCourseTypeChange:function(e){
				this.courseLive=e.detail.value;
			},
			checkForm:function(){
				if(!this.courseName){
					this.showToast('请填写课程名称');
					return;
				}
				if(!this.courseClass){
					this.showToast('请填写课程标签');
					return;
				}
				if(!this.courseIntroduce){
					this.showToast('请填写课程介绍');
					return;
				}
				if(!this.courseTeacher){
					this.showToast('请填写课程教师');
					return;
				}
				if(!this.teacherIntroduce){
					this.showToast('请填写教师介绍');
					return;
				}
				if(!this.courseImg){
					this.showToast('请选择课程封面');
					return;
				}
				this.submitForm();		//检查完成 没问题 提交表单
			},
			submitForm:function(){
				this.$requestData({
					url:'/course/createCourse',
					data:{
						courseName:this.courseName,
						courseClass:this.courseClass,
						courseIntroduce:this.courseIntroduce,
						courseTeacher:this.courseTeacher,
						teacherIntroduce:this.teacherIntroduce,
						liveCourse:this.courseLive,
						courseImg:this.courseImg,
						courseSource:""
					}
				}).then(function(res){
					if(res.data.code==200){
						uni.showToast({
							title:'创建成功！',
							icon:'none'
						});
						uni.redirectTo({
							url: 'CourseDetails?courseID='+res.data.data.courseId+'&videoID=&initialTime=0',
						})
					}else{
						this.showToast('创建失败');
					}
				});
			},
			//上传图片
			uploadImage:function(){
				uni.uploadFile({
					url: 'http://49.234.222.55:8081/api/image/upload',
					filePath: this.image,
					name: 'file',
					success: (uploadFileRes) => {
						let uploadImgInfo=uploadFileRes.data;	//保存上传图片返回的信息
						uploadImgInfo=JSON.parse(uploadImgInfo)
						if(uploadImgInfo.code!=200){
							this.showToast('图片上传失败');
						}else{
							this.showToast('图片上传完成');
							this.courseImg=uploadImgInfo.data;	//上传图片完成 赋值form表单
						}
					},
				});
			},
			//检查权限
			checkPermission:function() {
				let status = permision.requestAndroid('android.permission.READ_EXTERNAL_STORAGE');
				if (status === null || status === 1) {
					status = 1;
				} else {
					uni.showModal({
						content: "没有开启权限",
						confirmText: "设置",
						success: function(res) {
							if (res.confirm) {
								permision.gotoAppSetting();
							}
						}
					})
				}
				return status;
			},
			//选择图片
			chooseImg:function(){
				uni.chooseImage({   //选择图片的内置方法
					count:1,
					sourceType:['album'],	//从相册选择
					success:res=>{			//图片选择完成
						this.imgArr=res.tempFilePaths;
						this.image=this.imgArr[0];	//展示图片
						this.uploadImage();			//上传图片
					}
				})
			},
		}
	};
</script>

<style lang="scss" scoped>
	@import "@/static/css/addcourse.css";
</style>