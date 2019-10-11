<template>
	<view class="main">
		<view class="box">
			<view class="top">
				<scroll-view scroll-x class="bg-white nav" scroll-with-animation :scroll-left="scrollLeft">
					<view class="cu-item" v-for="(item,index) in nav" :key="index"  :class="index==TabCur?'text-green cur':''" @click="tabSelect" :data-id="item.id" :data-index="index">{{ item.text }}</view>
				</scroll-view>
			</view>

			<view class="icon">
				<text class="text-sm padding bg-white">注意：赛事信息由组委会发布，若没有相关赛事，请联系组委会。</text>
				<view class="grid col-3 bg-white padding-sm">
					<view class="padding-sm" v-for="(item,index) in gameList" :key="index">
						<view class="bg-grey padding radius text-center light" @click="show" data-target="ModalBase" :data-cur="item">
							<view class="text-lg">{{ item.name }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 赛事详情 -->
		<view class="cu-modal" :class="modalName=='ModalBase'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end"><view class="content">赛事详情</view></view>
				<view class="padding-xl">
					<view class="padding-xs text-xl">{{ detail.name }}</view>
					<view class="padding-xs">{{ detail.start }}</view>
					<view class="padding-xs">{{ detail.detail }}</view>
				</view>
				<view class="cu-bar bg-white">
					<view class="action margin-0 flex-sub text-green solid-left" @click="hideModal">取消</view>
					<view class="action margin-0 flex-sub  solid-left" @click="enter">进入</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
const req = require('../../utils/req.js');
const apis = require('../../utils/apis.js');
const print = require('../../utils/print.js');
const tools = require('../../utils/tools.js');
export default {
	data() {
		return {
			// 状况（-1.暂停、0.未开始、1.开始、2.结束）
			nav: [{ id: -2, text: '全部赛事' }, { id: -1, text: '暂停' }, { id: 0, text: '未开始' }, { id: 1, text: '进行中' }, { id: 2, text: '已结束' }],
			TabCur: 0,
			scrollLeft: 0,
			gameList: [],
			modalName: null,
			detail: null
		};
	},
	onLoad: function(options) {
		this.navto(-2);
	},
	methods: {
		// 设值函数
		setData(obj) { for (let val in obj) { this[val] = obj[val]; } },
		// 选择导航条
		tabSelect(e) {
			print.log('导航索引', e.currentTarget.dataset.id);
			this.setData({
				TabCur: e.currentTarget.dataset.index,
				scrollLeft: (e.currentTarget.dataset.index - 1) * 60
			});
			// 调用方法
			this.navto(e.currentTarget.dataset.id);
		},
		// 执行导航方法
		async navto(id) {
			tools.loading.show('加载中');
			let game;
			if (id == -2) {
				game = await apis.findAllGame();
				this.gameList = game.data.rows;
				tools.loading.hide();
			} else {
				game = await apis.findAllGameByCondition(id)
				this.gameList = game.data.rows;
				tools.loading.hide();
			}
		},
		// 按压显示
		show(e) { this.showModal(e); },
		// 松开隐藏
		hide(e) { this.hideModal(e); },
		// 加入赛事
		enter() {
			let gid = this.detail.id;
			try {
				// 获取用户信息
				const info = uni.getStorageSync('info');
				if (info) {
					console.log('加入游戏','用户id',info.id,'游戏id',gid);
					// 测试
					apis.joinGame(info.id, gid).then(res => {
						console.log(res.data);
						this.hideModal();
						tools.toast.success('加入成功');
						uni.navigateTo({ url: `../teamlist/teamlist?gid=${gid}` });
					});
				}
			} catch (e) {
				tools.toast.none('操作失败');
			}
		},
		// 显示modal
		showModal(e) {
			this.setData({
				modalName: e.currentTarget.dataset.target,
				detail: e.currentTarget.dataset.cur
			});
		},
		// 隐藏modal
		hideModal(e) { this.setData({ modalName: null }); }
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
	height: 90rpx;
}
.icon {
	height: auto;
	background-color: gray;
	display: inline-flex;
	flex-direction: column;
	justify-content: center;
}
</style>
