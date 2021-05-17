<template>
	<view v-if="visible" class="picker" :class="mask?'mask':''">
		<view class="picker-wrap">
			<!-- 当前选择 -->
			<view class="picker-wrap-value">{{returnValue}}</view>

			<!-- 日期选择 -->
			<picker-view class="picker-wrap-dateTime" v-if="params['y+']" indicator-class="picker-wrap-item"
				:value="dateIndexArr" @change="bindDateChange">
				<picker-view-column v-if="params['y+']" class="picker-wrap-column">
					<view class="picker-wrap-column-item" v-for="(item,index) in checkRange[0]" :key="index">{{item}}
					</view>
				</picker-view-column>
				<picker-view-column v-if="params['M+']" class="picker-wrap-column">
					<view class="picker-wrap-column-item" v-for="(item,index) in checkRange[1]" :key="index">
						{{item<10?'0'+item:item}}
					</view>
				</picker-view-column>
				<picker-view-column v-if="params['d+']" class="picker-wrap-column">
					<view class="picker-wrap-column-item" v-for="(item,index) in checkRange[2]" :key="index">
						{{item<10?'0'+item:item}}
					</view>
				</picker-view-column>
			</picker-view>

			<!-- 时间选择 -->
			<picker-view class="picker-wrap-dateTime" v-if="params['h+']" indicator-class="picker-wrap-item"
				:value="timeIndexArr" @change="bindTimeChange">
				<picker-view-column v-if="params['h+']" class="picker-wrap-column" :class="{'symbol':params['m+']}">
					<view class="picker-wrap-column-item" v-for="(item,index) in checkRange[3]" :key="index">
						{{item<10?'0'+item:item}}
					</view>
				</picker-view-column>
				<picker-view-column v-if="params['m+']" class="picker-wrap-column" :class="{'symbol':params['s+']}">
					<view class="picker-wrap-column-item" v-for="(item,index) in checkRange[4]" :key="index">
						{{item<10?'0'+item:item}}
					</view>
				</picker-view-column>
				<picker-view-column v-if="params['s+']" class="picker-wrap-column">
					<view class="picker-wrap-column-item" v-for="(item,index) in checkRange[5]" :key="index">
						{{item<10?'0'+item:item}}
					</view>
				</picker-view-column>
			</picker-view>

			<!-- 按钮 -->
			<view class="picker-wrap-btn">
				<view class="picker-wrap-btn-item" :hover-stay-time="0" hover-class="picker-wrap-btn-active"
					@tap="onCancel">取消</view>
				<view class="picker-wrap-btn-item" :hover-stay-time="0" hover-class="picker-wrap-btn-active"
					@tap="onConfirm">确定</view>
			</view>
		</view>
	</view>
</template>

<script>
	const DateTools = {
		// 格式
		commonFmt: 'yyyy-MM-dd hh:mm:ss',
		commonMin: '1990-01-01 00:00:00',
		// 序列化日期
		stringify(date, fmt) {
			fmt = fmt || this.commonFmt
			let ret;

			date = date || new Date()
			const opt = {
				"y+": date.getFullYear().toString(), // 年
				"M+": (date.getMonth() + 1).toString(), // 月
				"d+": date.getDate().toString(), // 日
				"h+": date.getHours().toString(), // 时
				"m+": date.getMinutes().toString(), // 分
				"s+": date.getSeconds().toString() // 秒
				// 有其他格式化字符需求可以继续添加，必须转化成字符串
			};
			for (let k in opt) {
				ret = new RegExp("(" + k + ")").exec(fmt);
				if (ret) {
					fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
				};
			};
			return fmt;
		},
		// 解析字符串
		parse(str) {
			// ios的Date只识别 /
			let tmp_value = str.replace(/(年|月|-)/g, '/')
				.replace(/(日)/g, '')
				.replace(/(时|分|点)/g, ':')
				.replace(/(秒)/g, '');
			let result = new Date(tmp_value)
			return result
		},
		// 格式化字符串,例如只有时分秒没有年月日,这种数据无法转化内Date数据,需要补充
		format(str) {
			let date = new Date()
			const opt = {
				"y+": date.getFullYear().toString(), // 年
				"M+": (date.getMonth() + 1).toString(), // 月
				"d+": date.getDate().toString(), // 日
				"h+": date.getHours().toString(), // 时
				"m+": date.getMinutes().toString(), // 分
				"s+": date.getSeconds().toString() // 秒
				// 有其他格式化字符需求可以继续添加，必须转化成字符串
			};
			for (let k in opt) {
				ret = new RegExp("(" + k + ")").exec(this.commonFmt);
				if (ret) {
					fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
				};
			};

		},
		// 初始化时间
		// date: 当前时间或选择的时间或传入的时间
		// minDate: 最小可选时间
		// maxDate: 最大可选时间
		// idx: 从第几项开始初始化---年0，月1，日2，时3，分4，秒5
		initDateTime(date, minDate, maxDate, checkRange, checkIndexRange, idx = 0) {
			const t_date = DateTools.parse(date)
			const t_minDate = DateTools.parse(minDate)
			const t_maxDate = DateTools.parse(maxDate)
			const lastDay = new Date(t_date.getFullYear(), t_date.getMonth() + 1, 0).getDate()
			const t_bData = [t_minDate.getFullYear(), 1, 1, 0, 0, 0]
			const t_eData = [t_maxDate.getFullYear(), 12, lastDay, 23, 59, 59]
			const t_valueData = [
				t_date.getFullYear(), t_date.getMonth() + 1, t_date.getDate(),
				t_date.getHours(), t_date.getMinutes(), t_date.getSeconds()
			]
			const t_minData = [
				t_minDate.getFullYear(), t_minDate.getMonth() + 1, t_minDate.getDate(),
				t_minDate.getHours(), t_minDate.getMinutes(), t_minDate.getSeconds()
			]
			const t_maxData = [
				t_maxDate.getFullYear(), t_maxDate.getMonth() + 1, t_maxDate.getDate(),
				t_maxDate.getHours(), t_maxDate.getMinutes(), t_maxDate.getSeconds()
			]

			let t_checkRange = []
			let t_checkIndexRange = []
			let t_begin, t_end;

			t_checkRange = checkRange.slice(0, idx)
			t_checkIndexRange = checkIndexRange.slice(0, idx)

			for (let i = idx; i < 6; i++) {
				let t_arr = [],
					t_index

				// 如果是年,直接循环插入,如果不是,要进行判断
				if (i === 0) {
					t_begin = t_minData[i]
					t_end = t_maxData[i]
				} else {
					// 求当前值的最小可选项，先判断他之前的值是不是最大最小值
					let minFlag = t_checkRange.map((item, index) => {
						if (t_valueData[index] === item[0]) {
							return 0
						} else {
							return 1
						}
					})
					let maxFlag = t_checkRange.map((item, index) => {
						if (t_valueData[index] === item[item.length - 1]) {
							return 0
						} else {
							return 1
						}
					})

					// 如果和为不为0,说明范围内存在不是最大值或最小值的值
					if (eval(minFlag.join('+'))) {
						t_begin = t_bData[i]
					} else {
						t_begin = t_minData[i]
					}
					if (eval(maxFlag.join('+'))) {
						t_end = t_eData[i]
					} else {
						t_end = t_maxData[i]
					}
				}

				for (let j = t_begin; j <= t_end; j++) {
					t_arr.push(j)
					if (j === t_valueData[i]) {
						t_index = t_arr.length - 1
					}
				}
				if (t_valueData[i] < t_begin) {
					t_index = t_arr.indexOf(t_begin)
				}
				if (t_valueData[i] > t_end) {
					t_index = t_arr.indexOf(t_end)
				}
				t_checkRange.push(t_arr)
				t_checkIndexRange.push(t_index)
			}

			const t_date_1 = this.mergeDateArr(t_checkRange, t_checkIndexRange)
			if (idx < 6 && date != t_date_1) {
				const res = this.initDateTime(t_date_1, minDate, maxDate, t_checkRange, t_checkIndexRange, ++idx)
				t_checkRange = res.checkRange
				t_checkIndexRange = res.checkIndexRange
			}
			return {
				checkRange: t_checkRange,
				checkIndexRange: t_checkIndexRange,
			}
		},
		// 合并选择框的数据，以生成当前选择的时间
		mergeDateArr(range, indexRange, fmt) {
			fmt = fmt || this.commonFmt
			let ret;
			const lastDay = new Date(range[0][indexRange[0]], range[1][indexRange[1]], 0).getDate()
			const opt = {
				"y+": range[0][indexRange[0]].toString(), // 年
				"M+": range[1][indexRange[1]].toString(), // 月
				"d+": range[2][indexRange[2]] > lastDay ? lastDay.toString() : range[2][indexRange[2]]
					.toString(), // 日
				"h+": range[3][indexRange[3]].toString(), // 时
				"m+": range[4][indexRange[4]].toString(), // 分
				"s+": range[5][indexRange[5]].toString() // 秒
				// 有其他格式化字符需求可以继续添加，必须转化成字符串
			};
			for (let k in opt) {
				ret = new RegExp("(" + k + ")").exec(fmt);
				if (ret) {
					fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
				};
			};
			return fmt;
		},
	}
	export default {
		props: {
			//是否显示
			isShow: {
				type: Boolean,
				default: false
			},
			//初始值 yyyy-MM-dd hh:mm:ss
			value: {
				type: String,
				default: ''
			},
			//最小可选日期 yyyy-MM-dd hh:mm:ss
			min: {
				type: String,
				default: DateTools.commonMin
			},
			//最大可选日期 yyyy-MM-dd hh:mm:ss
			max: {
				type: String,
				default: ''
			},
			//如果不设置最大可选日期，可设置最大可选时间在当前年份再往后推几年
			addYear: {
				type: Number,
				default: 0
			},
			// 格式
			format: {
				type: String,
				default: 'yyyy-MM-dd hh:mm:ss'
			},
			// 遮罩层
			mask: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				visible: false,
				checkedValue: null, //当前选择日期的字符串形式
				returnValue: null, //当前选择日期的字符串形式
				minDate: null, //最小日期（String型）
				maxDate: null, ////最大日期（String型）
				checkRange: [],
				checkIndexRange: [],
				dateIndexArr: [0, 0, 0],
				timeIndexArr: [0, 0, 0],

				params: {
					'y+': true,
					'M+': true,
					'd+': true,
					'h+': true,
					'm+': true,
					's+': true,
				},
			}
		},
		destroyed() {
			this.hide()
		},
		watch: {
			isShow(newVal, oldVal) {
				this.visible = newVal
				if (newVal) {
					this.init()
				}
			},
			checkedValue(newVal, oldVal) {
				this.returnValue = DateTools.stringify(DateTools.parse(newVal), this.format)
			}
		},
		methods: {
			show() {
				this.visible = true
				this.init()
			},
			hide() {
				this.visible = false
			},
			init() {
				this.setFormat()
				this.setMin(this.min)
				this.setMax(this.max)
				this.setValue(this.value)
				const res = DateTools.initDateTime(this.checkedValue, this.minDate, this.maxDate, this.checkRange,
					this.checkIndexRange)
				this.checkRange = res.checkRange
				this.checkIndexRange = res.checkIndexRange

				this.dateIndexArr = res.checkIndexRange.slice(0, 3)
				this.timeIndexArr = res.checkIndexRange.slice(3, 6)
			},
			setFormat() {
				let ret, t_params = JSON.parse(JSON.stringify(this.params))
				for (let k of Object.entries(t_params)) {
					ret = new RegExp('(' + k[0] + ')').exec(this.format);
					t_params[k[0]] = ret ? true : false
				}

				this.params = t_params
			},
			setValue(val) {
				let t_checkedValue = ''
				if (!val) {
					t_checkedValue = DateTools.stringify();
				} else {
					// 如果有默认值,要看当前默认值是否完整,比如有时分秒但是没有年月日,这种数据是无法转换为Date格式的
					if (val.split(' ').length === 2) {
						t_checkedValue = !this.params['m+'] && !this.params['s+'] ? (val + ':00') : val
					} else {
						t_checkedValue = this.params['y+'] ? val : '01 ' + val
					}
				}
				let t_checkedDate = DateTools.parse(t_checkedValue)
				// 如果当前时间小于最小可选时间,t_checkedValue为最小可选时间
				if (this.min && t_checkedDate < DateTools.parse(this.min)) {
					t_checkedValue = this.min
				}
				// 如果当前时间大于最大可选时间,t_checkedValue为最大可选时间
				if (this.max && t_checkedDate > DateTools.parse(this.max)) {
					t_checkedValue = this.max
				}
				this.checkedValue = DateTools.stringify(DateTools.parse(t_checkedValue))
			},
			setMin(val) {
				let tmp_val
				if (!val) {
					tmp_val = DateTools.commonMin
				} else {
					tmp_val = DateTools.stringify(DateTools.parse(val))
				}
				this.minDate = tmp_val
			},
			setMax(val) {
				let tmp_val
				if (!val) {
					let curDate = new Date()
					tmp_val = new Date(curDate.getFullYear() + this.addYear, 12, 0)
					tmp_val = new Date(tmp_val.getTime() + 1000 * 60 * 60 * 24 - 1000)
				} else {
					// ios的Date只识别 /
					// 这时要判断一下时间那部分是不是 00:00:00,如果是,当前日期要加1天再减去1秒钟
					tmp_val = DateTools.parse(val)
					if (tmp_val.getHours() === 0 && tmp_val.getMinutes() === 0 && tmp_val.getSeconds() === 0) {
						tmp_val = new Date(tmp_val.getTime() + 1000 * 60 * 60 * 24 - 1000)
					}
				}

				// 判断最小可选时间是否小于最大可选时间，如果不是，则最大可选时间等于最小可选时间
				if (DateTools.parse(this.minDate) < tmp_val) {
					this.maxDate = DateTools.stringify(tmp_val)
				} else {
					this.maxDate = this.minDate
				}
			},
			bindDateChange(e) {
				let t_value = e.detail.value
				let t_checkIndexRange = t_value.concat(this.timeIndexArr)
				let t_dateIndexArr = JSON.parse(JSON.stringify(this.dateIndexArr))
				let t_checkedValue = DateTools.mergeDateArr(this.checkRange, t_checkIndexRange)

				t_value.forEach((item, index) => {
					if (item !== t_dateIndexArr[index]) {
						const res = DateTools.initDateTime(t_checkedValue, this.minDate, this.maxDate,
							this.checkRange, t_checkIndexRange, index + 1)
						this.checkRange = res.checkRange
						this.checkIndexRange = res.checkIndexRange
						this.dateIndexArr = res.checkIndexRange.slice(0, 3)
						this.timeIndexArr = res.checkIndexRange.slice(3, 6)
					}
				})
				this.checkedValue = t_checkedValue
			},
			bindTimeChange(e) {
				let t_value = e.detail.value
				let t_checkIndexRange = this.dateIndexArr.concat(t_value)
				let t_timeIndexArr = JSON.parse(JSON.stringify(this.timeIndexArr))
				let t_checkedValue = DateTools.mergeDateArr(this.checkRange, t_checkIndexRange)

				t_value.forEach((item, index) => {
					if (item !== t_timeIndexArr[index]) {
						const res = DateTools.initDateTime(t_checkedValue, this.minDate, this.maxDate,
							this.checkRange, t_checkIndexRange, index + 3 + 1)
						this.checkRange = res.checkRange
						this.checkIndexRange = res.checkIndexRange
						this.timeIndexArr = res.checkIndexRange.slice(3, 6)
					}
				})
				this.checkedValue = t_checkedValue
			},
			onCancel() {
				this.visible = false
				this.$emit('cancle', false)
			},
			onConfirm() {
				let datetime = DateTools.parse(this.checkedValue)
				const array = {
					"year": !this.params['y+'] ? null : datetime.getFullYear(), // 年
					"month": !this.params['M+'] ? null : (datetime.getMonth() + 1), // 月
					"day": !this.params['d+'] ? null : datetime.getDate(), // 日
					"hour": !this.params['h+'] ? null : datetime.getHours(), // 时
					"minute": !this.params['m+'] ? null : datetime.getMinutes(), // 分
					"second": !this.params['s+'] ? null : datetime.getSeconds() // 秒
					// 有其他格式化字符需求可以继续添加，必须转化成字符串
				};
				let result = {
					value: this.returnValue,
					array: array,
				}
				this.$emit('confirm', result)
			},
		}
	}
</script>

<style lang="scss">
	$mskColor:#000000;
	$btnColor:#007AFF;
	$mskAlpha:0.4;
	$wrapWeight: 500rpx;
	$wrapHeight: 330rpx;
	

	.picker {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 10;

		&-wrap {
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
			margin-left: (750rpx - $wrapWeight) / 2;
			padding: 30rpx 0;
			background-color: #FFFFFF;
			border-radius: 18rpx;

			&-value {
				padding: 0 40rpx;
				color: #a7a7a7;
				font-size: 28rpx;
			}

			&-dateTime {
				height: $wrapHeight;
				width: $wrapWeight;
				margin: 30rpx 0;
				display: flex;
				justify-content: center;
			}

			&-column {
				width: $wrapWeight/3;
				flex: none;
				-webkit-box-flex: unset;

				&.symbol {
					&::after {
						content: ":";
						position: absolute;
						top: 50%;
						right: 0;
						transform: translateY(-50%) scale(0.8);
						color: #999999;
					}
				}

				&-item {
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 28rpx;
				}
			}

			&-btn {
				display: flex;
				justify-content: flex-end;

				&-item {
					margin-right: 28rpx;
					padding: 28rpx;
					font-size: 28rpx;
					color: rgba($color: $btnColor, $alpha: 0.66);
					font-weight: bold;
					border-radius: 8rpx;
				}

				&-active {
					background-color: #e1e1e1;
					transition: all 0.5s;
				}
			}

			/deep/ &-item {
				height: 110rpx;
				text-align: center;
			}
		}
	}

	.mask {
		background-color: rgba($mskColor, $mskAlpha);
	}

	/deep/.uni-picker-view-wrapper::after {
		content: ":";
		position: absolute;
		left: 0;
		right: 0;
		// height: 1px;
		color: #999999;
	}

	/deep/.uni-picker-view-indicator::before,
	/deep/.uni-picker-view-indicator::after {
		margin: 0 20rpx;
		transform: scaleY(2);
		border-color: #999999;
	}
</style>
