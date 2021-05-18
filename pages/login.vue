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
		<view class="plane-view" v-if="isLoginView">
			<view class="t-plane">
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
					<view class="reg" @tap="showRegistView()">注 册</view>
				</form>
			</view>
		</view>
		
		<view v-else class="plane-view">
			<view class="t-plane">
				<form class="cl">
					<view class="t-a">
						<text class="txt">用户名</text>
						<input type="text" name="user" placeholder="请输入用户名" maxlength="11" v-model="user" />
					</view>
					<view class="t-a">
						<text class="txt">密码</text>
						<input type="password" name="code" maxlength="18" placeholder="请输入您的密码" v-model="pwd" />
					</view>
					<view class="t-a">
						<text class="txt">确认密码</text>
						<input type="password" name="code" maxlength="18" placeholder="请再次输入您的密码" v-model="pwd_c" />
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
						<text class="txt">身份</text>
						<radio-group name="lecturer" v-model="lecturer" @change="registRadioValueChange">
							<radio value="true">教师</radio>
							<radio value="false" checked="true">学生</radio>
						</radio-group>
					</view>
					<button class="reg" @tap="reg()">注 册</button>
					<text @click="showLoginView()" >已有账号 去登录</text>
				</form>
			</view>
		</view>
	</view>
</template>
<script>
	import md5 from "../util/md5.js";
export default {
	data() {
		return {
			user:'',
			pwd_c:'',
			email:'',
			phone: '', //手机号码
			pwd: '', //密码
			lecturer:'',
			isLoginView:true
		};
	},
	onLoad() {},
	methods: {
		registRadioValueChange(evt){
			this.lecturer=evt.detail.value;
		},
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
			let _this = this;
			_this.$requestData({
				url:'/auth/login',
				data:{
					userName:that.user,
					password:md5.hex_md5(that.pwd),
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
					uni.showToast({
						title:'账号或密码不正确',
						icon:'none'
					});
				}
			});
			
		},
		showRegistView(){
			this.isLoginView=false;
		},
		showLoginView(){
			this.isLoginView=true;
		},
		//注册按钮点击
		reg() {
			if(!/^[\d\w]{4,}$/.test(this.user)){
				uni.showToast({ title: '请输入用户名', icon: 'none' });
				return;
			}
			
			if(this.pwd.length<6){
				uni.showToast({
					title:'密码长度至少为6位,可包含英文字母和数字',
					icon:'none'
				});
				return;
			}
			if(!/^[\d\w]{6,}$/.test(this.pwd)){
				uni.showToast({
					title:'密码中只能包含英文字母和数字',
					icon:'none'
				});
				return;
			}
			if(this.pwd!==this.pwd_c){
				uni.showToast({
					title:'两次输入的密码不一致',
					icon:'none'
				});
				return;
			}
			if(!/^1[3-9]\d{9}$/.test(this.phone)){
				uni.showToast({
					title:'请输入正确的手机号',
					icon:'none'
				});
				return;
			}
			if(!/^([a-zA-Z0-9]+[_|_|\-|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(this.email)){
				uni.showToast({
					title:'请输入正确的邮箱地址',
					icon:'none'
				});
				return;
			}
			
			console.log('用户名',this.user);
			console.log('密码',this.pwd);
			console.log('手机号',this.phone);
			console.log('邮箱地址',this.email);
			console.log('教师身份？',this.lecturer);
			this.$requestData({
				url:'/auth/regist',
				data:{
					userName:this.user,
					password:hex_md5(that.pwd),
					phoneNumber:this.phone,
					email:this.email,
					lecturer:this.lecturer
				}
			}).then((res)=>{
				if(res.data.code==200){
					uni.showToast({
						title:'注册成功!',
						icon:'success'
					});
					this.isLoginView=true;
					//自动登录
					
				}else{
					if(res.data.code==1)
					uni.showToast({
						title:'用户名已存在',
						icon:'none'
					})
				}
			});
			
		}
	}
};
</script>
<style>
	
body{
	background: #FFF;
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

.t-b {
	text-align: left;
	font-size: 42rpx;
	color: #ffffff;
	padding: 130rpx 0 0 70rpx;
	font-weight: bold;
	line-height: 70rpx;
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
