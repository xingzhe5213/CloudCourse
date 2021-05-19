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
							<view class="button_time" @tap="datetimePicker('0')">{{this.startDate||'选择开始时间'}}</view>
						</view>
						<view class="t-a">
							<text class="txt">结束时间</text>
							<view class="button_time" @tap="datetimePicker('1')">{{this.endDate||'选择结束时间'}}</view>
													
						</view>
					</view>
					<view class="video-plane" v-else>
						<text class="txt">选择视频</text>
						<view class="videouploader">
							<view class="button_time" @tap="chooseVideo">{{this.videoLocalFileName||'选择视频'}}</view>
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
				image:'',
				videoLocalAddress:'',
				videoLocalFileName:'',
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
		onLoad(e) {
			this.courseId=e.courseId;
		},
		onBackPress(e){
			uni.redirectTo({
				url: 'CourseDetails?courseID='+this.courseId+'&videoID=&initialTime=0'
			});
			return true;
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
				if(!this.className){
					this.showToast('请填写课时名称');
					return;
				}
				if(this.liveType==false&&!this.videoLocalAddress){
					this.showToast('请选择视频');
					return;
				}
				if(this.liveType==false&&this.videoLocalAddress){
					this.uploadVideo();	//开始上传视频，上传完成自动提交表单
				}
				if(this.liveType==true){
					this.submitForm();	//提交表单
				}
			},
			
			submitForm:function(){
				let val=this.courseId
				this.$requestData({
					url:'/lesson/create',
					data:{
						videoName:this.className,
						live:this.liveType,
						videoAddress:this.videoAddress,
						startTime:this.startDate,
						endTime:this.endDate,
						courseId:this.courseId
					}
				}).then(function(res){
					console.log(res);
					if(res.data.code==200){
						uni.showToast({
							title:'创建成功！',
							icon:'none'
						});
						uni.redirectTo({
							url: 'CourseDetails?courseID='+val+'&videoID=&initialTime=0'
						});
					}else{
						if(res.data.code==403){
							uni.showToast({
								title:'请登录',
								icon:'none'
							});
							return;
						}
						uni.showToast({
							title:'创建失败',
							icon:'none'
						});
					}
				});
			},
			//上传视频
			uploadVideo:function(){
				uni.showLoading({
					title:'视频上传中...'
				});
				uni.uploadFile({
				            url: this.$apiPath+'/video/upload',
				            filePath: this.videoLocalAddress,
				            name: 'file',
				            success: (uploadFileRes) => {
								let uploadVideoInfo=uploadFileRes.data;	//保存上传图片返回的信息
								uploadVideoInfo=JSON.parse(uploadVideoInfo)
								if(uploadVideoInfo.code!=200){
									this.showToast('视频上传失败');
								}else{
									this.showToast('视频上传完成');
									this.videoAddress=uploadVideoInfo.data;	//上传完成 赋值form表单
									this.submitForm();		//提交表单
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
			//选择视频
			chooseVideo:function(){
				uni.chooseVideo({   //选择视频的内置方法
					count:1,
					sourceType:['album'],	//从相册选择
					success:res=>{			//选择完成
						console.log(res);
						this.videoLocalAddress=res.tempFilePath;
						this.videoLocalFileName='已选择视频';
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
				this.item.pShowFlag = false;
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
	.img_preview{
		height: 230rpx;
		width: 408rpx;
	}
	.videouploader{
		/* padding: 30rpx; */
		text-align: center;
	}
	.txt {
		display: block;
		font-size: 16px;
		font-weight: bold;
		margin: 50rpx 0 0;
		color: #333333;
	}
	.img-a {
		width: 100%;
		height: 450rpx;
		background-color:#57e;
		background-size: 100%;
	}
	.reg {
		position: fixed;
		font-size: 16px;
		background: #57e;
		color: #fff;
		height: 90rpx;
		width: 80%;
		line-height: 90rpx;
		border-radius: 50rpx;
		bottom: 50rpx;
	}
	
	.plane-view {
		width: 100%;
		position: relative;
		/* margin-top: -50rpx; */
		background-color: #ffffff;
		/* border-radius: 8% 8% 8% 8%; */
		/* padding: 10rpx 0rpx 80rpx 0rpx; */
	}
	
	.t-plane {
		width: 600rpx;
		margin: 0 auto;
		font-size: 28rpx;
		/* padding-top: 40rpx; */
	}
	
	.button_time {
		font-size: 14px;
		text-align: center;
		color: #ccc;
		height: 70rpx;
		line-height: 70rpx;
		border-bottom: 0.25rpx #dddddd solid;
	}
	
	.t-plane input {
		height: 90rpx;
		line-height: 90rpx;
		/* margin-bottom: 50rpx; */
		border-bottom: 1px solid #e9e9e9;
		font-size: 14px;
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
		font-size: 28rpx;
		background: #57e;
		color: #fff;
		height: 90rpx;
		line-height: 90rpx;
		border-radius: 50rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
	}
	
	.flex-between {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.item{
		margin-right: 100rpx;
		margin-top: 24rpx;
	}
</style>