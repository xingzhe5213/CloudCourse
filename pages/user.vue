<template>
    <view class="container">
        <view class="user-info">
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
				<view>
					<view class="iconfont iconmail info-item">{{data.email||'未知'}}</view>
					<view class="iconfont iconphone info-item">{{data.phoneNumber||'未知'}}</view>
					<view class="iconfont iconshenfen info-item">{{data.lecturer=="true"?"教师":"学生"}}</view>
				</view>
			</view>
    	</view>

		<view class="sys-exit-box">
			<button class="btn_exit">
				退出登录
			</button>
		</view>
	</view>
</template>
<script>
export default {
		data() {
			return {
				data:{}
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
					console.log(res.data.data)
				}
				
				console.log(res);
			});
		},
		methods: {
			gotoLoginPage(){
				console.log("跳转到登录界面")
				uni.navigateTo({
					url:"login"
				})
			}
		}
	}

</script>
<style lang="scss">

		.btn_exit{
			left: 10%;
			background-color: #fff;
			color: #f00;
			width: 80%;
			position: fixed;
			bottom: 150rpx;
		}
		.user-info{
			position: relative;
			
			.user-info-body{
				.info-item{
					width: 100%;
					height: 60rpx;
					background-color: #fff;
					border: 6rpx solid #fff;
					text-align: left;
					padding: 10rpx;
						font-size: 18px;
					
				}
				.info-item::before{
					font-size: 24px;
					padding: 20rpx;
				}
			}
			.user-info-head{
				width: 100%;
				height: 400rpx;
				position: relative;
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
					margin: 60rpx;
				}
				
				.info-plane{
					position: absolute;
					display: inline-block;
					margin-top: 100rpx;
					
					.username{
						font-size: 24px;
					}

				}
			}

		}
</style>