<template>
    <view>
        <view class="user-info-head">
			<image class="bg" src="/static/img/bg.png"></image>
			<image src="/static/img/head.png" mode='aspectFill' class="head-img"></image>
	        <view class="info-plane" @click="gotoLoginPage()">
	                <text class="username">{{ data.userName || '游客'}}</text>
					<view  v-if="code!=200" class="view-login-box">
						<text class="login">登录/注册</text>
					</view>
					<view v-else>
						<text class="login">ID: {{data.userId}}</text>
					</view>
	        </view>
		</view>
		<view class="user-info-body">
			<view class="user-info">
				<view class="info-item border"><span class="iconfont iconmail"></span>{{data.email||'未知'}}</view>
				<view class="info-item border"><span class="iconfont iconphone"></span>{{data.phoneNumber||'未知'}}</view>
				<view class="info-item"><span class="iconfont iconshenfen"></span>{{data.lecturer=="true"?"教师":"学生"}}</view>
			</view>
    	</view>
		<view class="sys-exit-box">
			<view class="btn_exit" @click="logout()">
				退出登录
			</view>
		</view>
	</view>
</template>
<script>
export default {
		data() {
			return {
				data:"",
				isLogin:false,
				code:0
			};
		},
		onLoad() {
			let _this = this;
			
			_this.$requestData({
				url:'/auth/info',
				data:{}
			}).then((res) => {
				if(res.data.code === 200){
					this.data=res.data.data;
					this.code=res.data.code;
					if(res.data.code===200){
						this.isLogin=true;
					}else{
						this.isLogin=false;
					}
				}
			});
		},
		methods: {
			gotoLoginPage(){
				if(this.isLogin===false){
					uni.navigateTo({
						url:"login"
					});
				}
			},
			logout(){
				if(this.isLogin==true){
					uni.removeStorageSync("token");
					//关闭所有页面打开个人中心
					uni.reLaunch({
						url:"user"
					});
				}
			}
		}
	}

</script>
<style lang="scss">
	.btn_exit{
		text-align: center;
		left: 10%;
		background-color: #fff;
		color: #f00;
		border-radius: 50rpx;
		border:0.25rpx #ccc solid;
		width: 80%;
		height: 90rpx;
		line-height: 90rpx;
		margin: 450rpx auto 0;
	}
	.user-info-body{
		width: 700rpx;
		margin: 40rpx auto;
		border-radius: 25rpx;
		background-color: #fff;
	}
	.user-info{
		width: 660rpx;
		margin: 0 25rpx;
	}
	.info-item span{
		font-size: 16px;
		padding-right: 15rpx;
		color:#5577ee;
	}
	.info-item{
		width: 620rpx;
		height: 90rpx;
		line-height: 90rpx;
		text-align: left;
		padding: 10rpx;
		font-size: 16px;
	}
	.border{
		border-bottom: 0.25rpx #ccc solid;
	}
	.info-item::before{
		font-size: 24px;
		padding: 20rpx;
	}
	.user-info-head{
		width: 100%;
		height: 400rpx;
		position: relative;
	}
	.bg{
		width: 100%;
		height: 100%;
		position: absolute;
	}
	.head-img{
		width: 190rpx;
		height:190rpx;
		border: 5rpx solid #fff;
		border-radius: 50%;
		margin: 100rpx 60rpx;
	}
	.info-plane{
		position: absolute;
		display: inline-block;
		margin-top: 120rpx;
	}
	.username{
		font-size: 22px;
		height: 50px;
		color:#fff;
		line-height: 50px;
	}
	.login{
		font-size: 14px;
		color:#ddd;
	}
</style>