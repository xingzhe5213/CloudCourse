<!-- 蓝色登录页面2 -->
<template>
	<view>
		<view class="img-a">
			<view class="t-b">
				您好，
				<br />
				欢迎使用云课堂
			</view>
		</view>
		<view class="login-view">
			<view class="t-login">
				<form class="cl">
					<view class="t-a">
						<text class="txt">用户名</text>
						<input type="text" name="user" placeholder="请输入您的用户名" maxlength="11" v-model="user" />
					</view>
					<view class="t-a">
						<text class="txt">密码</text>
						<input type="password" name="code" maxlength="18" placeholder="请输入您的密码" v-model="pwd" />
					</view>
					<button @tap="login()">登 录</button>
					<view class="reg" @tap="reg()">注 册</view>
				</form>
			</view>
		</view>
		
		<view class="login-view" style="display: none;">
			<view class="t-login">
				<form class="cl">
					<view class="t-a">
						<text class="txt">用户名</text>
						<input type="text" name="user" placeholder="请输入您的用户名" maxlength="11" v-model="user" />
					</view>
					<view class="t-a">
						<text class="txt">密码</text>
						<input type="password" name="code" maxlength="18" placeholder="请输入您的密码" v-model="pwd" />
					</view>
					<view class="t-a">
						<text class="txt">手机</text>
						<input type="text" name="phone" maxlength="18" placeholder="请输入您的手机" v-model="phone" />
					</view>
					<view class="t-a">
						<text class="txt">邮箱地址</text>
						<input type="text" name="email" maxlength="18" placeholder="请输入您的邮箱地址" v-model="email" />
					</view>
	
					<view class="t-a">
						<text class="txt">是否教师</text>
						<radio-group name="lecturer">
							<radio name="lecturer" v-model="lecturer">是</radio>
							<radio name="lecturer" v-model="lecturer">否</radio>
						</radio-group>

					</view>
					<button class="reg" @tap="reg()">注 册</button>
				</form>
			</view>
		</view>
	</view>
</template>
<script>
export default {
	data() {
		return {
			phone: '', //手机号码
			pwd: '' //密码
		};
	},
	onLoad() {},
	methods: {
		//当前登录按钮操作
		login() {
			var that = this;
			if (!that.user) {
				uni.showToast({ title: '请输入您的用户名', icon: 'none' });
				return;
			}
			if (!/^[\w\d]{4,}$/.test(that.user)) {
				uni.showToast({ title: '请输入正确用户名', icon: 'none' });
				return;
			}
			if (!that.pwd) {
				uni.showToast({ title: '请输入您的密码', icon: 'none' });
				return;
			}
			console.log("登录");
			let _this = this;
			_this.$requestData({
				url:'/auth/login',
				data:{
					userName:that.user,
					password:that.pwd
				}
			}).then((res) => {
				if(res.data.code === 200){
					this.data=res.data.data;
					this.code=res.data.code;
					uni.setStorageSync("token",this.data.token);
					//关闭所有页面重新打开个人中心
					uni.reLaunch({
						url:"user"
					});
				}else{
					
				}
			});
			
		},
		//注册按钮点击
		reg() {
			uni.showToast({ title: '注册跳转', icon: 'none' });
		}
	}
};
</script>
<style>
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

.login-view {
	width: 100%;
	position: relative;
	margin-top: -120rpx;
	background-color: #ffffff;
	border-radius: 8% 8% 0% 0;
}

.t-login {
	width: 600rpx;
	margin: 0 auto;
	font-size: 28rpx;
	padding-top: 80rpx;
}

.t-login button {
	font-size: 28rpx;
	background: #57e;
	color: #fff;
	height: 90rpx;
	line-height: 90rpx;
	border-radius: 50rpx;
	font-weight: bold;
}

.t-login input {
	height: 90rpx;
	line-height: 90rpx;
	margin-bottom: 50rpx;
	border-bottom: 1px solid #e9e9e9;
	font-size: 28rpx;
}

.t-login .t-a {
	position: relative;
}

.t-b {
	text-align: left;
	font-size: 42rpx;
	color: #ffffff;
	padding: 130rpx 0 0 70rpx;
	font-weight: bold;
	line-height: 70rpx;
}

.t-login .t-c {
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

.t-login .t-d {
	text-align: center;
	color: #999;
	margin: 80rpx 0;
}

.t-login .t-e {
	text-align: center;
	width: 250rpx;
	margin: 80rpx auto 0;
}

.t-login .t-g {
	float: left;
	width: 50%;
}

.t-login .t-e image {
	width: 50rpx;
	height: 50rpx;
}

.t-login .t-f {
	text-align: center;
	margin: 150rpx 0 0 0;
	color: #666;
}

.t-login .t-f text {
	margin-left: 20rpx;
	color: #aaaaaa;
	font-size: 27rpx;
}

.t-login .uni-input-placeholder {
	color: #aeaeae;
}

.cl {
	zoom: 1;
}

.cl:after {
	clear: both;
	display: block;
	visibility: hidden;
	height: 0;
	content: '\20';
}
</style>
