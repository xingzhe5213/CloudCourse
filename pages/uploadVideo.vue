<template>
	<view>
		<view class="plane-view">
			<view class="t-plane">
				<datetime  ref="myDTPicker" :isShow="item.pShowFlag" :value="item.pValue"
					:format="item.pFormat" :min="item.pMin" :max="item.pMax" :mask="pMask" :addYear="item.pAddYear"
					@cancle="pickerCancel" @confirm="pickerConfirm">
				</datetime>
				<form class="cl">
					<view class="t-a">
						<text class="txt">课时名</text>
						<input type="text" name="courseName" placeholder="请输入课时名" maxlength="20" v-model="className" />
					</view>
					
					<view class="t-a">
						<text class="txt">课时类型</text>
						<radio-group class="radio" @change="typeChange">
							<radio checked="liveType" class="item" value="live">直播</radio>
							<radio class="item" value="video">视频</radio>
						</radio-group>
					</view>
					<view class="live-plane" v-if="liveType">
						<view class="t-a">
							<text class="txt">开始时间</text>
							<button class="button" @tap="datetimePicker('0')">{{this.startDate||'选择开始时间'}}</button>
						</view>
						<view class="t-a">
							<text class="txt">结束时间</text>
							<button class="button" @tap="datetimePicker('1')">{{this.endDate||'选择结束时间'}}</button>
													
						</view>
					</view>
					<view class="video-plane" v-else>
						<text class="txt">选择视频</text>
						<view class="imguploader">
							<view v-if="!image" class="iconfont icontianjia" @tap="chooseImg"></view>
							<view v-else class="img_view">
								<image class="img_preview" :src="image" :data-src="image"  @tap="chooseImg" ></image>
							</view>
						</view>
					</view>
					<button class="reg" @click="checkForm">添 加</button>
				</form>
			</view>
		</view>
	</view>
</template>
<script>
	import permision from "@/common/permission.js"
	import datetime from "@/components/ch-datetime-picker/datetime.vue";
	export default {
		components: {
		    // 注册自定义组件 
			datetime
		},
		data() {
			return {
				className:"",
				courseId:'',
				classType:"",
				startDate:'',
				endDate:"",
				videoAddress:"",
				liveType:true,
				pMask: true,
				item:{
						start:0,
						pShowFlag: false,
						pValue: '',
						pFormat: 'yyyy-MM-dd hh:mm',
						pMin: '',
						pMax: '',
						pAddYear: null,
					}
				
			};
		},
		onUnload(e) {
			this.courseId=e.courseId;
		},
		methods:{
			fillZero:function (src, direction, digit) {
				var count = digit - src.toString().length;
				var os = new Array(count + 1).join('0');
				if (direction !== 'r') {
					return os + src;
				}
				return src + os;
			},
			formData:function (date, pattern) {
				return pattern
					.replace(/yyyy/, date.getFullYear().toString())
					.replace(/MM/, this.fillZero(date.getMonth() + 1, 'l', 2))
					.replace(/dd/, this.fillZero(date.getDate(), 'l', 2))
					.replace(/hh/, this.fillZero(date.getHours(), 'l', 2))
					.replace(/mm/, this.fillZero(date.getMinutes(), 'l', 2))
					.replace(/ss/, this.fillZero(date.getSeconds(), 'l', 2))
					.replace(/S/, date.getMilliseconds().toString());
			},
			showToast:function(msg){
				uni.showToast({
					title:msg,
					icon:'none'
				});
			},	
			typeChange:function(e){
				if(e.detail.value==="live"){
					this.liveType=true;
				}else{
					this.liveType=false;
				}
			},
			checkForm:function(){
				if(!this.courseName){
					this.showToast('请填写课时名称');
					return;
				}
				
				//检查 未完成
				this.submitForm();		//检查完成 没问题 提交表单
			},
			
			submitForm:function(){
				this.$requestData({
					url:'/lesson/create',
					data:{
							
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
				            url: this.$apiPath+'/image/upload',
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
				});
			},
			datetimePicker(value) {
				if(value==0){	//设置开始时间 ，限制必须大于当前时间
					this.item.pMin=this.formData(new Date(),'yyyy-MM-dd hh:mm:ss');
					//如果结束时间设置了，就必须小于结束时间
					if(this.endDate){
						this.item.pMax=this.formData(new Date(this.endDate),'yyyy-MM-dd hh:mm:ss');
					}
					console.log(this.item.pMin);
					console.log(this.item.pMax);
				}else{		//设置结束时间，必须大于开始时间，如果开始时间没设置，就必须大于当前时间
					if(this.startDate){
						this.item.pMin=this.formData(new Date(this.startDate),'yyyy-MM-dd hh:mm:ss');
					}else{
						this.item.pMin=this.formData(new Date(),'yyyy-MM-dd hh:mm:ss');
					}
				}
				
				this.item.start=value;
				this.$refs.myDTPicker.show();
			},
			pickerCancel(data) {
				this.item.pShowFlag = false
			},
			pickerConfirm(data) {
				//取消时间选择器选择限制
				this.item.pMax='';
				this.item.pMin='';
				this.$refs.myDTPicker.hide();
				this.item.pValue = data.value;
				console.log(data.value);
				if(this.item.start==0){
					this.startDate=data.value;
				}else{
					this.endDate=data.value;
				}
			},
		}
	};
</script>
<style>
	body{
		background: #FFF;
	}


	.radio{
		margin: 20rpx 0;
		
	}
	.item{
			margin: 15rpx 0;
			margin-right: 30rpx ;
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
		margin-top: -50rpx;
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
	/* 时间组件样式 */
	.page {
		padding: 20rpx;
	}
	
	.mask-switch {
		margin-bottom: 20rpx;
	}
	
	.desc {
		margin-top: 30rpx;
		margin-bottom: 10rpx;
		color: #ff0000;
		font-size: 12px;
		white-space: pre-line;
	}
	
	.button {
		margin-bottom: 20rpx;
	}
	
	.flex-between {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>