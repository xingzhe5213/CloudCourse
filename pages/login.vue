<template>
	<view>
		<view class="img-a">
			<view class="t-b">
				您好，
				<br />
				欢迎使用云直播课堂
			</view>
		</view>
		<view class="plane-view" v-if="isLoginView">
			<view class="t-plane">
				<form class="cl">
					<view class="t-a">
						<text class="txt">用户名</text>
						<input type="text" name="user" placeholder="请输入用户名" maxlength="11" v-model="user" />
					</view>
					<view class="t-a">
						<text class="txt">密码</text>
						<input type="password" name="code" maxlength="18" placeholder="请输入密码" v-model="pwd" />
					</view>
					<view class="button">
						<button @tap="login()">登 录</button>
						<view class="reg" @tap="showRegistView()">没有账号？去注册</view>
					</view>
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
						<input type="password" name="code" maxlength="18" placeholder="请输入密码" v-model="pwd" />
					</view>
					<view class="t-a">
						<text class="txt">确认密码</text>
						<input type="password" name="code" maxlength="18" placeholder="请再次输入密码" v-model="pwd_c" />
					</view>
					<view class="t-a">
						<text class="txt">手机</text>
						<input type="text" name="phone" maxlength="18" placeholder="请输入手机" v-model="phone" />
					</view>
					<view class="t-a">
						<text class="txt">邮箱地址</text>
						<input type="text" name="email" maxlength="18" placeholder="请输入邮箱地址" v-model="email" />
					</view>
					<view class="t-a">
						<text class="txt">身份</text>
						<radio-group name="lecturer" v-model="lecturer" @change="registRadioValueChange">
							<radio class="item" value="true">教师</radio>
							<radio class="item" value="false" checked="true">学生</radio>
						</radio-group>
					</view>
					<button  @tap="reg()">注 册</button>
					<view class="reg" @click="showLoginView()" >已有账号？去登录</view>
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
					uni.showToast({ title: '请输入用户名', icon: 'none' });
					return;
				}
				if (!/^[\w\d]{4,}$/.test(that.user)) {
					uni.showToast({ title: '请输入正确用户名', icon: 'none' });
					return;
				}
				if (!that.pwd) {
					uni.showToast({ title: '请输入密码', icon: 'none' });
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
				uni.setNavigationBarTitle({
					title:'注册'
				});
				this.isLoginView=false;
			},
			showLoginView(){
				uni.setNavigationBarTitle({
					title:'登录'
				});
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
				this.$requestData({
					url:'/auth/regist',
					data:{
						userName:this.user,
						password:md5.hex_md5(this.pwd),
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
	}
</script>

<style lang="scss" scoped>
	@import "@/static/css/login.css";
</style>
