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
							<view class="img_view">
								<image class="img_preview" :src="image" :data-src="image" @tap="previewImage"></image>
							</view>
						</view>
					</view>
					<button class="reg" @tap="reg()">创建课程</button>
				</form>
			</view>
		</view>
	</view>
</template>
<script>
	import permision from "@/common/permission.js"
	var sourceType = [
		['camera'],
		['album'],
		['camera', 'album']
	]
	var sizeType = [
		['compressed'],
		['original'],
		['compressed', 'original']
	]
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
				image:'https://th.bing.com/th/id/R02f5ef9d57f682e27d6d2ede79c054ec?rik=6%2bOkmRgdRreyPw&riu=http%3a%2f%2fbpic.588ku.com%2felement_pic%2f01%2f37%2f84%2f72573c64827f532.jpg&ehk=khoFsEZdtMf%2f8Z30wnc5rBApFWkB75v1iTOlcC9Qf7Y%3d&risl=&pid=ImgRaw'
				
			};
		},
		onUnload() {
			
		},
		methods: {
			chooseImage: async function() {
				// TODO 选择相机或相册时 需要弹出actionsheet，目前无法获得是相机还是相册，在失败回调中处理
				if (this.sourceTypeIndex !== 2) {
					let status = await this.checkPermission();
					if (status !== 1) {
						return;
					}
				}
		
				if (this.imageList.length === 9) {
					let isContinue = await this.isFullImg();
					console.log("是否继续?", isContinue);
					if (!isContinue) {
						return;
					}
				}
				uni.chooseImage({
					sourceType: sourceType[this.sourceTypeIndex],
					sizeType: sizeType[this.sizeTypeIndex],
					count: this.imageList.length + this.count[this.countIndex] > 9 ? 9 - this.imageList.length : this.count[this.countIndex],
					success: (res) => {
						this.imageList = this.imageList.concat(res.tempFilePaths);
					},
					fail: (err) => {
						console.log("err: ",err);
						if (err['code'] && err.code !== 0 && this.sourceTypeIndex === 2) {
							this.checkPermission(err.code);
						}
						if(err.errMsg.indexOf('cancel') !== '-1'){
							return;
						}
						uni.getSetting({
							success: (res) => {
								let authStatus = false;
								switch (this.sourceTypeIndex) {
									case 0:
										authStatus = res.authSetting['scope.camera'];
										break;
									case 1:
										authStatus = res.authSetting['scope.album'];
										break;
									case 2:
										authStatus = res.authSetting['scope.album'] && res.authSetting['scope.camera'];
										break;
									default:
										break;
								}
								if (!authStatus) {
									uni.showModal({
										title: '授权失败',
										content: 'Hello uni-app需要从您的相机或相册获取图片，请在设置界面打开相关权限',
										success: (res) => {
											if (res.confirm) {
												uni.openSetting()
											}
										}
									})
								}
							}
						})
					}
				})
			},
			previewImage: function(e) {
				var current = e.target.dataset.src
				uni.previewImage({
					current: current,
					urls: this.imageList
				})
			},
			async checkPermission(code) {
				let type = code ? code - 1 : this.sourceTypeIndex;
				let status = permision.isIOS ? await permision.requestIOS(sourceType[type][0]) :
					await permision.requestAndroid(type === 0 ? 'android.permission.CAMERA' :
						'android.permission.READ_EXTERNAL_STORAGE');
		
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
			chooseImg:function(){
				console.log('上传图片'),
				uni.chooseImage({   //上传图片的内置方法
					count:5, //在h5浏览器限制不住
					success:res=>{
						// console.log(this)
						this.imgArr=res.tempFilePaths  //返回的图片路径将他保存到imgArr中
						//注意这里有两坑，1.这里要使用箭头函数，指向外层，普通函数就指向success这个方法
						//2.这里的imgArr是数组不能直接绑定到src上面由于第一次我只上传一张图片，没发现这个问题，报错了
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

	.img_preview{
		width: 230rpx;
		height: 230rpx;
	}
	.imguploader{
		height: 230rpx;
		background-color: rgb(197, 197, 197);
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