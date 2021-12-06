<template>
	<view class="vk-data-verification-code">
		<view @click="sendSmsCode" :style="customStyle">
			<slot :tips="tips" :sec-num="secNum">{{ tips }}</slot>
		</view>
	</view>
</template>

<script>
/**
 * verificationCode 验证码输入框
 * @property {String} mobile 接收短信的手机号
 * @property {String} type 短信类型，如 register、login
 * @property {Number String} seconds 倒计时所需的秒数（默认60）
 * @property {Object String} customStyle 自定义样式
 * @property {String} start-text 开始前的提示语，见官网说明（默认获取验证码）
 * @property {String} change-text 倒计时期间的提示语，必须带有字母"x"，见官网说明（默认X秒重新获取）
 * @property {String} end-text 倒计结束的提示语，见官网说明（默认重新获取）
 * @property {Boolean} keep-running 是否在H5刷新或各端返回再进入时继续倒计时（默认false）
 * @event {Function} change 倒计时期间，每秒触发一次
 * @event {Function} start 开始倒计时触发
 * @event {Function} end 结束倒计时触发
 * @example <vk-data-verification-code  seconds="60" :mobile="form1.mobile" type="register" custom-style="font-size: 28rpx;"></vk-data-verification-code>
 */
export default {
	name: 'vk-data-verification-code',
	emits: ['start', 'end', 'change'],
	props: {
		// 接收短信的手机号
		mobile: {
			type: String
		},
		// 短信类型，如 register、login
		type: {
			type: String,
			default: 'login'
		},
		customStyle: {
			type: [String,Object]
		},
		// 倒计时总秒数
		seconds: {
			type: [String, Number],
			default: 60
		},
		// 尚未开始时提示
		startText: {
			type: String,
			default: '获取验证码'
		},
		// 正在倒计时中的提示
		changeText: {
			type: String,
			default: 'X秒重新获取'
		},
		// 倒计时结束时的提示
		endText: {
			type: String,
			default: '重新获取'
		},
		// 是否在H5刷新或各端返回再进入时继续倒计时
		keepRunning: {
			type: Boolean,
			default: false
		},
		// 为了区分多个页面，或者一个页面多个倒计时组件本地存储的继续倒计时变了
		uniqueKey: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			secNum: this.seconds,
			timer: null,
			canGetCode: true, // 是否可以执行验证码操作
			tips: ''
		};
	},
	mounted() {
		this.checkKeepRunning();
	},
	watch: {
		seconds: {
			immediate: true,
			handler(n) {
				this.secNum = n;
			}
		}
	},
	methods: {
		checkKeepRunning() {
			// 获取上一次退出页面(H5还包括刷新)时的时间戳，如果没有上次的保存，此值可能为空
			let lastTimestamp = Number(uni.getStorageSync(this.uniqueKey + '_$uCountDownTimestamp'));
			if (!lastTimestamp) return this.changeEvent(this.startText);
			// 当前秒的时间戳
			let nowTimestamp = Math.floor(+new Date() / 1000);
			// 判断当前的时间戳，是否小于上一次的本该按设定结束，却提前结束的时间戳
			if (this.keepRunning && lastTimestamp && lastTimestamp > nowTimestamp) {
				// 剩余尚未执行完的倒计秒数
				this.secNum = lastTimestamp - nowTimestamp;
				// 清除本地保存的变量
				uni.removeStorageSync(this.uniqueKey + '_$uCountDownTimestamp');
				// 开始倒计时
				this.start();
			} else {
				// 如果不存在需要继续上一次的倒计时，执行正常的逻辑
				this.changeEvent(this.startText);
			}
		},
		// 开始倒计时
		start() {
			// 防止快速点击获取验证码的按钮而导致内部产生多个定时器导致混乱
			if (this.timer) {
				clearInterval(this.timer);
				this.timer = null;
			}
			this.$emit('start');
			this.canGetCode = false;
			// 这里放这句，是为了一开始时就提示，否则要等setInterval的1秒后才会有提示
			this.changeEvent(this.changeText.replace(/x|X/, this.secNum));
			this.setTimeToStorage();
			this.timer = setInterval(() => {
				if (--this.secNum) {
					// 用当前倒计时的秒数替换提示字符串中的"x"字母
					this.changeEvent(this.changeText.replace(/x|X/, this.secNum));
				} else {
					clearInterval(this.timer);
					this.timer = null;
					this.changeEvent(this.endText);
					this.secNum = this.seconds;
					this.$emit('end');
					this.canGetCode = true;
				}
			}, 1000);
		},
		// 重置，可以让用户再次获取验证码
		reset() {
			this.canGetCode = true;
			clearInterval(this.timer);
			this.secNum = this.seconds;
			this.changeEvent(this.endText);
		},
		changeEvent(text) {
			this.codeChange(text);
			this.$emit('change', text);
		},
		// 保存时间戳，为了防止倒计时尚未结束，H5刷新或者各端的右上角返回上一页再进来
		setTimeToStorage() {
			if (!this.keepRunning || !this.timer) return;
			// 记录当前的时间戳，为了下次进入页面，如果还在倒计时内的话，继续倒计时
			// 倒计时尚未结束，结果大于0；倒计时已经开始，就会小于初始值，如果等于初始值，说明没有开始倒计时，无需处理
			if (this.secNum > 0 && this.secNum <= this.seconds) {
				// 获取当前时间戳(+ new Date()为特殊写法)，除以1000变成秒，再去除小数部分
				let nowTimestamp = Math.floor(+new Date() / 1000);
				// 将本该结束时候的时间戳保存起来 => 当前时间戳 + 剩余的秒数
				uni.setStorage({
					key: this.uniqueKey + '_$uCountDownTimestamp',
					data: nowTimestamp + Number(this.secNum)
				});
			}
		},
		// 倒计时进行时
		codeChange(text) {
			this.tips = text;
			this.$emit('codeChange', text);
		},
		// 发送短信验证码
		sendSmsCode() {
			let that = this;
			let vk = uni.vk;
			let mobile = that.mobile;
			let type = that.type;
			if (!vk.pubfn.checkStr(mobile, 'mobile')) {
				vk.toast('请输入正确的手机号码', 'none');
				return;
			}
			if (that.canGetCode) {
				that.tips = "发送中...";
				vk.userCenter.sendSmsCode({
					needAlert: false,
					data: {
						mobile,
						type
					},
					success: function(data) {
						vk.toast('验证码已发送');
						that.start();
					},
					fail: function(err) {
						that.tips = that.startText;
						if (err.errMsg && err.errMsg.indexOf('触发天级流控') > -1) {
							vk.alert('短信发送频繁，请明日再试！');
						} else if (err.errMsg && err.errMsg.indexOf('触发小时级流控') > -1) {
							vk.alert('短信发送频繁，请过1小时后再试！');
						} else if (err.errMsg && err.errMsg.indexOf('触发分钟级流控') > -1) {
							vk.alert('短信发送频繁，请稍后再试！');
						} else if (err.msg) {
							vk.alert(err.msg);
						} else {
							vk.alert('短信发送频繁，请稍后再试！');
						}
					}
				});
			} else {
				vk.toast(`${that.secNum}秒后再重试`, 'none');
			}
		}
	},
	// 组件销毁的时候，清除定时器，否则定时器会继续存在，系统不会自动清除
	// #ifndef VUE3
	beforeDestroy() {
		this.setTimeToStorage();
		clearTimeout(this.timer);
		this.timer = null;
	},
	// #endif

	// #ifdef VUE3
	beforeUnmount() {
		this.setTimeToStorage();
		clearTimeout(this.timer);
		this.timer = null;
	}
	// #endif
};
</script>

<style lang="scss" scoped></style>
