<template>
	<view class="wrapper">
		<view v-if="isHistory" class="history-box">
			<view v-if="historyList.length > 0">
				<view class="history-title">
					<text>搜索历史</text>
					<text class="iconfont iconshanchu" @click="clearSearch"></text>
				</view>
				<view class="history-content">
					<view class="history-item" v-for="(item, index) in historyList" :key="index" @click="search(item.name)">
						{{ item.name }}
					</view>
				</view>
			</view>
			<view v-else class="no-data">您还没有历史记录</view>
		</view>
		<view v-else class="history-box">
			<view v-if="dataList.length > 0">
				<view class="history-list-box">
					<view class="history-list-item" v-for="(item, index) in dataList" :key="index" @click="search(item)">
						<rich-text :nodes="item"></rich-text>
					</view>
				</view>
			</view>
			<view v-else class="no-data">没有搜索到相关内容</view>	
		</view>
	</view>
</template>

<script>
	import util from '@/components/amap-wx/js/util.js';
	export default {
		data() {
			return {
				historyList: [],
				dataList: [],
				isHistory: true,
			};
		},
		onLoad() {
			this.historyList = uni.getStorageSync('search:history');
		},
		methods: {
			/*
			* 搜索
			*/
			search(val) {
				uni.reLaunch({
					url: 'user?title='+val+'&name=1',
				})
				util.setHistory(val);
			},
			/*
			* 清理历史搜索数据
			*/
			clearSearch() {
				uni.showModal({
					title: '提示',
					content: '是否清理全部搜索历史？',
					success: res => {
						if (res.confirm) {
							this.historyList = util.removeHistory();
						}
					}
				});
			},
			/*
			* 关键字搜索
			*/
			getInputtips(val) {
				let _this = this;
				_this.$requestData({
					url:'/course/searchByName',
					data:{
						key:val
					}
				}).then((res) => {
					if(res.data.code === 200){
						console.log(res.data)
						_this.dataList=res.data.data.list;
						console.log(this.dataList)
					}
				});
			}
		},
		/*
		* 当 searchInput 输入时触发
		*/
		onNavigationBarSearchInputChanged(e) {
			let text = e.text;
			if (!text) {
				this.isHistory = true;
				this.historyList = [];
				this.historyList = uni.getStorageSync('search:history');
			
				return;
			} else {
				this.isHistory = false;
				this.getInputtips(text);
			}
		},
		/*
		* 点击软键盘搜索按键触发
		*/
		onNavigationBarSearchInputConfirmed(e) {
			let text = e.text;
			if (!text) {
				this.isHistory = true;
				this.historyList = [];
				this.historyList = uni.getStorageSync('search:history');
				uni.showModal({
					title: '提示',
					content: '请输入内容。',
					success: res => {
						if (res.confirm) {
						}
					}
				});
				return;
			} else {
				this.search(text);
			}
		},
		/*
		*  点击导航栏 buttons 时触发
		*/
		onNavigationBarButtonTap() {
			var text =document.getElementsByClassName("uni-input-input")[0].value;
			if (!text) {
				this.isHistory = true;
				this.historyList = [];
				this.historyList = uni.getStorageSync('search:history');
				uni.showModal({
					title: '提示',
					content: '请输入内容。',
					success: res => {
						if (res.confirm) {
						}
					}
				});
				return;
			} else {
				this.search(text);
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/static/css/search_detail.css";
</style>