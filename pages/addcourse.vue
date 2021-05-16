<!-- 蓝色登录页面2 -->
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
						<text class="txt">课程来源</text>
						<input type="text" name="courseSource" maxlength="200" placeholder="请输入课程来源" v-model="courseSource" />
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
				courseSource:"",
				courseImg:"",
				imgArr:[],
				image:false,
				uploadImgInfo:null
			};
		},
		onUnload() {
			
		},
		methods:{
			showToast:function(msg){
				uni.showToast({
					title:msg,
					icon:'none'
				});
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
				if(!this.courseSource){
					this.showToast('请填写课程来源');
					return;
				}
				if(!this.courseImg){
					console.log(this.courseImg);
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
						courseSource:this.courseSource,
						courseImg:this.courseImg,
					}
				}).then(function(res){
					if(res.data.code==200){
						uni.showToast({
							title:'创建成功！',
							icon:'none'
						});
						//跳转到课程详情界面
						console.log(res.data);
						console.log('关闭当前界面，跳转到课程详情界面');
						uni.redirectTo({
							url:''
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
<style>
	body{
		background: #FFF;
	}


	.icontianjia{
		font-size: 100rpx;
		color: rgba(0,0,0,0.5);
		padding: 65rpx 0;
	}
	.img_preview{
		height: 230rpx;
		width: 408rpx;
	}
	.imguploader{
		height: 230rpx;
		width: 408rpx;
		background-color: rgb(197, 197, 197);
		text-align: center;
	}
	.txt {
		font-size: 32rpx;
		font-weight: bold;
		color: #333333;
	}
	.img-a {
		width: 100%;
		height: 450rpx;
		background-color:#57e;
		background-size: 100%;
	}
	.reg {
		font-size: 28rpx;
		color: #fff;
		height: 90rpx;
		line-height: 90rpx;
		border-radius: 50rpx;
		font-weight: bold;
		background: #f5f6fa;
		color: #000000;
		text-align: center;
		margin-top: 30rpx;
	}
	
	.plane-view {
		width: 100%;
		position: relative;
		margin-top: -120rpx;
		background-color: #ffffff;
		border-radius: 8% 8% 8% 8%;
		padding: 10rpx 0rpx 80rpx 0rpx;
	}
	
	.t-plane {
		width: 600rpx;
		margin: 0 auto;
		font-size: 28rpx;
		padding-top: 80rpx;
	}
	
	.t-plane button {
		font-size: 28rpx;
		background: #57e;
		color: #fff;
		height: 90rpx;
		line-height: 90rpx;
		border-radius: 50rpx;
		font-weight: bold;
	}
	
	.t-plane input {
		height: 90rpx;
		line-height: 90rpx;
		margin-bottom: 50rpx;
		border-bottom: 1px solid #e9e9e9;
		font-size: 28rpx;
	}
	
	.t-plane .t-a {
		position: relative;
	}

	.t-plane .t-c {
		position: absolute;
		right: 22rpx;
		top: 22rpx;
		background: #5677fc;
		color: #fff;
		font-size: 24rpx;
		border-radius: 50rpx;
		height: 50rpx;
		line-height: 50rpx;
		padding: 0 25rpx;
	}
	
	.t-plane .t-d {
		text-align: center;
		color: #999;
		margin: 80rpx 0;
	}
	
	.t-plane .t-e {
		text-align: center;
		width: 250rpx;
		margin: 80rpx auto 0;
	}
	
	.t-plane .t-g {
		float: left;
		width: 50%;
	}
	
	.t-plane .t-e image {
		width: 50rpx;
		height: 50rpx;
	}
	
	.t-plane .t-f {
		text-align: center;
		margin: 150rpx 0 0 0;
		color: #666;
	}
	
	.t-plane .t-f text {
		margin-left: 20rpx;
		color: #aaaaaa;
		font-size: 27rpx;
	}
	
	.t-plane .uni-input-placeholder {
		color: #aeaeae;
	}
	
</style>