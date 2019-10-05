<template>
	<view class="main">
		<view class="box">
			<view class="top"></view>
			<view class="icon"><image :src="logo" mode="aspectFit" class="logo"></image></view>
			<view class="login">
				<view class="cu-form-group margin-top">
					<view class="title">账号</view>
					<input placeholder="请输入账号" class="radius" confirm-type="next" name="input" v-model="name" />
				</view>
				<view class="cu-form-group" style="border-bottom: 1rpx solid #eee;">
					<view class="title">密码</view>
					<input placeholder="请输入密码" class="radius" password confirm-type="done" name="input" v-model="pass" />
				</view>
				<view class="padding flex flex-direction">
					<button class="cu-btn lg bg-blue" open-type="getUserInfo" lang="zh_CN" @click="login()">登录</button>
				</view>
			</view>

			<view class="choose">
				<text @click="showModal" data-target="Modal" data-id="1">忘记密码？</text>
				<text @click="showModal" data-target="Modal" data-id="2">新用户注册</text>
			</view>

			<view class="low">
				<view>
					<text>登录即代表阅读并同意</text>
					<text class="text-red" @click="showModal" data-target="ModalBase" data-id="0">服务条款</text>
				</view>
			</view>
		</view>

		<!-- model模态展示层 -->
		<view class="cu-modal" :class="modalName == 'Modal' ? 'show' : ''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">{{ modalId == 1 ? '重置密码' : '用户注册' }}</view>
					<view class="action" @click="hideModal"><text class="icon-close text-red"></text></view>
				</view>
				<!-- 判断为重置密码 -->
				<view class="" v-if="modalId == 1">
					<view class="cu-form-group">
						<view class="title">账号</view>
						<input placeholder="请输入账号" class="radius" :class="codeCondition !=0?'disabled':''" confirm-type="next" name="input" v-model="name" />
					</view>
					<view class="cu-form-group" v-if="codeCondition == 0 || codeCondition == 1">
						<view class="title">邮箱</view>
						<input placeholder="请输入邮箱验证" class="radius" :class="codeCondition !=0?'disabled':''" name="input" v-model="mail" />
						<button class="cu-btn bg-green shadow" @click="sendcode" v-if="codeCondition != 2">验证</button>
					</view>
					<view class="cu-form-group" style="border-bottom: 1rpx solid #eee;" v-if="codeCondition == 1">
						<view class="title">验证</view>
						<input placeholder="请输入验证码" class="radius" type="number" confirm-type="done" @input="getcode" />
					</view>
					<view class="cu-form-group" v-if="codeCondition == 2">
						<view class="title">密码</view>
						<input placeholder="请输入新密码" class="radius" confirm-type="done" name="input" v-model="pass" />
					</view>
				</view>
				<!-- 判断为注册 -->
				<view class="" v-if="modalId == 2">
					<view class="cu-form-group">
						<view class="title">账号</view>
						<input placeholder="请输入账号" class="radius" confirm-type="next" name="input" v-model="name" />
					</view>
					<view class="cu-form-group">
						<view class="title">密码</view>
						<input placeholder="请输入密码" class="radius" confirm-type="done" name="input" v-model="pass" />
					</view>
					<view class="cu-form-group">
						<view class="title">邮箱</view>
						<input placeholder="请输入邮箱验证" class="radius" :class="codeCondition !=0?'disabled':''" name="input" v-model="mail" />
						<button class="cu-btn bg-green shadow" @click="sendcode" v-if="codeCondition != 2">验证</button>
					</view>
					<view class="cu-form-group" style="border-bottom: 1rpx solid #eee;" v-if="codeCondition == 1">
						<view class="title">验证</view>
						<input placeholder="请输入验证码" class="radius" type="number" confirm-type="done" @input="getcode" />
					</view>
				</view>
				<view class="cu-bar bg-white">
					<view class="action margin-0 flex-sub text-green solid-left" @click="hideModal">取消</view>
					<view class="action margin-0 flex-sub  solid-left" @click="forget" v-if="modalId == 1">重置密码</view>
					<view class="action margin-0 flex-sub  solid-left" @click="register" v-if="modalId == 2">注册</view>
				</view>
			</view>
		</view>

		<!-- 服务条款 -->
		<view class="cu-modal" :class="modalName == 'ModalBase' ? 'show' : ''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">服务条款</view>
					<view class="action" @click="hideModal"><text class="icon-close text-red"></text></view>
				</view>
				<view class="padding-xl">Modal 内容。</view>
			</view>
		</view>
	</view>
</template>

<script>
const wx_api = require('../../utils/wx_api.js');
const req = require('../../utils/req.js');
const apis = require('../../utils/apis.js');
const print = require('../../utils/print.js');
const tools = require('../../utils/tools.js');
export default {
	data() {
		return {
			logo: '/static/logo.png',
			// userinfo
			userinfo: null,
			// modal信息
			modalName: null,
			modalId: null,
			// 验证码状态信息
			codeCondition: 0,
			code: '',
			// 用户填写信息
			name: null,
			pass: null,
			mail: ''
		};
	},
	onLoad: function(options) {
		// 生成验证码
		this.initcode();
	},
	methods: {
		// 设值函数
		setData(obj) { for (let val in obj) { this[val] = obj[val]; } },
		// 生成验证码
		initcode() {
			var code = '';
			for (var i = 0; i <= 5; i++) {
				code += Math.floor(Math.random() * 10);
			}
			this.code = code;
			print.log(code);
		},
		// 获取注册验证码信息
		getcode(e) {
			print.log('获取验证码', e.detail.value);
			if (e.detail.value.length == 6) {
				if (e.detail.value == this.code) {
					tools.toast.success('验证成功');
					this.setData({ codeCondition: 2 });
				} else tools.toast.none('验证失败');
			}
		},
		// 获取验证码
		sendcode() {
			print.log('验证码', this.code);

			// 测试
			this.setData({ codeCondition: 1 });
			tools.loading.show('验证消息发送中');
			// tools.loading.hide();
			
			apis.sendcode(this.mail, this.code)
				.then(res => {
					print.log(res);
					if (res.data.success) {
						tools.toast.success('验证码已发送');
						this.setData({ codeCondition: 1 });
					} else tools.toast.none('请检查邮箱是否错误');
				})
		},

		// 忘记密码
		forget() {
			if (this.name == '' || this.pass == '' || this.mail == '') {
				tools.toast.none('密码校验不通过');
				return;
			} else {
				if (this.codeCondition == 2) {
					// 验证name 、mail是否对应
					apis.register(this.name, '', this.mail, '').then(res => {
						if (!res.data[1]) {
							// 修改密码
							apis.forget(this.mail, this.pass).then(res => {
								tools.toast.success('密码修改成功');
								this.hideModal();
							});
						} else tools.toast.none('账号、邮箱不对应，请检查');
					});
				} else {
					tools.toast.none('邮箱验证不通过');
				}
			}
		},
		// 注册
		register() {
			if (this.name == '' || this.pass == '' || this.mail == '') {
				tools.toast.none('输入不能为空');
			} else {
				if (this.codeCondition == 2) {
					apis.register(this.name, this.pass, this.mail, this.pass)
						.then(res => {
							print.log(res);
							if (res.data[1]) {
								tools.toast.success('注册成功');
								this.hideModal();
							} else {
								tools.toast.none('此账户已存在');
								this.hideModal();
							}
						})
				} else {
					tools.toast.none('邮箱验证不通过');
				}
			}
		},
		// 登录
		login() {
			print.log('登录', this.name, this.pass);
			if (this.name == null || this.pass == null) {
				tools.toast.none('不能输入为空喔~');
				return;
			}
			apis.login(this.name, this.pass)
				.then(res => {
					let info = res.data;
					print.log('登录', info);
					// 写入内存
					uni.setStorageSync('info', info);
					if (info) {
						// uni.navigateTo({ url: '../gamelist/gamelist' });
						if (info.game_id && info.team_id) uni.redirectTo({ url: `../game/game?info=${JSON.stringify(info)}` });
						else if (info.game_id) uni.navigateTo({ url: `../teamlist/teamlist?gid=${info.game_id}` });
						else uni.navigateTo({ url: '../gamelist/gamelist' });
					} 
					else tools.toast.none('用户名或密码错误');
				})
		},
		// 显示modal
		showModal(e) {
			this.setData({
				modalName: e.currentTarget.dataset.target,
				modalId: e.currentTarget.dataset.id,
				// 初始化状态信息
				codeCondition: 0,
				name: '',
				pass: '',
				mail: ''
			});
		},
		// 隐藏modal
		hideModal(e) {
			this.setData({ modalName: null });
			// 优化显示
			let that = this;
			setTimeout(function() {
				that.setData({ modalId: null });
			}, 500);
			// 初始化验证信息
			this.setData({ codeCondition: 0 });
			this.initcode();
		}
	}
};
</script>

<style>
.main {
	height: 100vh;
	background-color: white;
}

.box {
	display: flex;
	flex-direction: column;
}

.top {
	height: 11vh;
}
.icon {
	height: 12vh;
	display: inline-flex;
	flex-direction: column;
	justify-content: center;
}
.logo {
	height: 6vh;
	left: -30rpx;
}
.login {
	height: 28vh;
}
.choose {
	height: 3vh;
	width: 94vw;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	margin-left: 3vw;
}
.low {
	height: 40vh;
	display: flex;
	flex-direction: column-reverse;
	align-items: center;
}
.disabled {
	pointer-events: none;
	opacity: 0.5;
}
</style>
