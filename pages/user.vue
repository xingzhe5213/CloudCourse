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

<style lang="scss" scoped>
	@import "@/static/css/user.css";
</style>