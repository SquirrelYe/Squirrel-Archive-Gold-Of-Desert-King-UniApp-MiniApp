<template>
	<view class="main">
		<view class="box">
			<view class="icon">
				<text class="text-sm padding bg-white">注意：只能加入一支队伍，若为团队负责人请新建团队。</text>
				<view class="grid col-3 bg-white padding-sm">
					<view class="padding-sm" v-for="(item,index) in teamList" :key="index" >
						<view class="bg-grey padding radius text-center light" @click="show" :data-cur="item">
							<view class="text-lg">{{ item.name }}</view>
						</view>
					</view>
				</view>
			</view>

			<view class="add"><text class="text-bold" @click="showModal" data-target="Modal" data-cur="">+ 新建队伍</text></view>
		</view>

		<!-- model模态展示层 -->
		<view class="cu-modal" :class="modalName=='Modal'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">新建队伍</view>
					<view class="action" @click="hideModal"><text class="icon-close text-red"></text></view>
				</view>
				<view class="">
					<view class="cu-form-group">
						<view class="title">名称</view>
						<input placeholder="请输入小组名称" class="radius" confirm-type="next" v-model="name" />
					</view>
				</view>
				<view class="cu-bar bg-white">
					<view class="action margin-0 flex-sub text-green solid-left" @click="hideModal">取消</view>
					<view class="action margin-0 flex-sub  solid-left" @click="create">创建</view>
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
			gid: null,
			teamList: [],
			modalName: null,
			name: null
		};
	},
	onLoad: function(options) {
		let gid = options.gid || uni.getStorageSync('info').game_id;
		this.setData({ gid: gid });
		this.init();
	},
	async onPullDownRefresh() {
		this.init();
	},
	methods: {
		// 设值函数
		setData(obj) { for (let val in obj) { this[val] = obj[val]; } },
		// 初始化
		init(){			
			apis.findAllTeam().then(res => {
				print.log('team', res.data);
				this.setData({ teamList: res.data.rows });
				uni.stopPullDownRefresh();
			});
		},
		// 按压显示
		show(e) {
			let that = this;
			uni.showModal({
				title: '确认加入？',
				content: `团队名称： ${e.currentTarget.dataset.cur.name}`,
				success(res) {
					if (res.confirm) that.enter(e.currentTarget.dataset.cur.id);
				}
			});
		},
		// 松开隐藏
		hide(e) { this.hideModal(e); },
		// 加入队伍
		async enter(id) {
			console.log('加入队伍',id);
			tools.loading.show('加载中');
			try {
				const info = uni.getStorageSync('info');
				if (info) {
					apis.joinTeam(info.id, id).then(res => {
						console.log(res.data);
						this.hideModal();
						tools.toast.success('加入成功');
						// 更新用户信息
						apis.findUserById(info.id).then(res => {
							try {
								uni.setStorageSync('info', res.data);   // 更新用户信息
								uni.redirectTo({ url: `../game/game?info=${JSON.stringify(res.data)}` });    // 跳转 game 页面
							} catch (e) {
								tools.toast.none('加入失败');
							}
						});
					});
				}
			} catch (e) {
				tools.toast.none('操作失败');
			}
		},
		// 创建队伍
		async create() {
			let userid = uni.getStorageSync('info').id;
			console.log(this.name);
			tools.loading.show('加载中');
			if (this.name) {
				let res = await apis.createTeam(this.gid, this.name)
				console.log(res.data)
				if (res.data) {
					// 自动加入
					await apis.joinTeam(userid, res.data.id);
					// 修改职务 队长
					await apis.updateJob(userid, 0);
					// 跳转赛事大厅
					let info = await apis.findUserById(userid);		
					tools.toast.success('创建成功');			
					uni.setStorageSync('info', info.data);   // 更新用户信息
					uni.redirectTo({ url: `../game/game?info=${JSON.stringify(info.data)}` });    // 跳转 game 页面
				}
			} else {
				tools.toast.none('填写不能为空');
			}
		},
		// 显示modal
		showModal(e) {
			console.log(e.currentTarget.dataset.target)
			this.setData({
				modalName: e.currentTarget.dataset.target
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
.add {
	height: 8vh;
	width: 100vw;
	position: fixed;
	background-color: white;
	bottom: 0;
	display: flex;
	justify-content: center;
}
</style>
