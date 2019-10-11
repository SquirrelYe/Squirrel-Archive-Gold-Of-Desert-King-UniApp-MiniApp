const req = require('../../utils/req.js');
const apis = require('../../utils/apis.js');
const print = require('../../utils/print.js');
const tools = require('../../utils/tools.js');
const conf = require('../../utils/config.js');
// 引入过滤器
const filter = require('../../utils/filter.js');
// 对象方法过滤
const format = require('./format.js');
export default {
	data() {
		return {
			CustomBar: 0,
			Drawer:null,
			gameCondition:null,
			// 前几个页面获取的信息
			uid: 1,
			tid: 1,
			gid: 1,

			map: [],
			judge: -1,

			// 测试数据
			userinfo: { job:0 },
			teaminfo: { condition : 0},
			gameinfo: null,

			iconList: [
				{ icon: 'icon-roundright', color: 'text-red', judge: -1, name: '地图' },
				{ icon: 'icon-friend', color: 'text-green', judge: 0, name: '团队' },
				{ icon: 'icon-shop', color: 'text-orange', judge: 1, name: '商店' },
				{ icon: 'icon-cascades', color: 'text-orange', judge: 2, name: '背包' },
				{ icon: 'icon-pay', color: 'text-yellow', judge: 3, name: '交易' },
				{ icon: 'icon-more', color: 'text-olive', judge: 4, name: '操作' },
				{ icon: 'icon-footprint', color: 'text-cyan', judge: 5, name: '路径' },
				{ icon: 'icon-info', color: 'text-grey', judge: 6, name: '介绍' }
			],

			// 地图操作
			shownext: false,

			map_show: false,
			chooseland: { land: 0},
			mapteam: false,
			mapteamitem:[],

			tranItems:[],
			judgeteam: false,
			judgething: false,
			tran_team: null,
			tran_thing: { id: -1 },

			judgevillage: false,
			village_thing: 0,
			village_thingName: '请选择',

			whether: false,
			land: false,
			info: false,

			isShowModal: false, // 显示modal弹窗
			single: false, // false 只显示一个按钮，如果想显示两个改为true即可

			showland: null,
			showitem: { type : 0},
			number: 0,

			team: { count: 0, rows: [] },
			shop: { count: 0, rows: [] },
			bag: { count: 0, rows: [] },
			tran: [],
			route: [],

			isWeather:0,  // 0.未开启天气显示，1.开启天气显示
			cwhether: null,
			cwhetherName:''
		};
	},
	onLoad: function(options) {
		// 前面页面传递参数
		let info = JSON.parse(options.info);
		console.log('参数传递', info);
		this.setData({ uid: info.id, gid: info.game_id, tid: info.team_id });

		this.getmap();
		this.getCurInfo();
		// 定时刷新数据
		setInterval(() => {
			this.reFresh();
		}, 10000);
	},
	filters: { ...filter },
	methods: {
		// 对象过滤器展开为方法
		...format,
		// 设值函数
		setData(obj) { for (let val in obj) { this[val] = obj[val]; } },
		// 定时刷新
		async reFresh(){
			this.getCurInfo();
			// 小组状态（0.正常、-1.冻结、-2.迷路、-3.死亡、1.使用帐篷、2.使用指南针、3.使用智者密函、4.达到大本营，游戏结束）
			// 权限控制 (0.队长、1.财务官、2.交通官、3.交易官、4.气象官、5.情报官)  此处 job 应该 2
			if (this.gameinfo.day.day > this.teaminfo.day.day && this.userinfo.job == 0 && this.teaminfo.condition != -3 && this.teaminfo.condition != 4 && !this.shownext) {
				let [err,succ] = await uni.showModal({
					title: '时间天数已更新',
					content: '你现在可以进入下一个位置',
				})
				if(succ.confirm){ this.shownext = true; }
			} else if (this.gameinfo.day.day == this.teaminfo.day.day) {
				this.setData({ shownext: false });
			}	
		},
		// 获取当前比赛信息
		getCurInfo() {
			this.getCurUserInfo();
			this.getCurTeamInfo();
			this.getCurGameInfo();			
		},
		// 获取用户信息
		getCurUserInfo(){		
			apis.getUserInfo(this.uid).then(res => {
				let user = this.fJob(res.data,res.data.condition);   // 对象过滤器
				this.userinfo = user;
			});	
		},
		// 获取团队信息
		getCurTeamInfo(){	
			apis.getTeamInfo(this.tid).then(res => {
				let team = this.fCondition(res.data,res.data.condition);   // 对象过滤器
				let map = this.fLand(res.data.map,res.data.map.land);
				this.teaminfo = team;
				console.log(team)
			});
		},
		// 获取赛事信息
		getCurGameInfo(){
			apis.findOneGameById(this.gid).then(res => {
				this.gameinfo = res.data;
				this.gameCondition = this.judgeGameCondition();
			});
		},
		// 判断点击
		show(e) {
			let condition = this.teaminfo.condition; // 小组状态（0.正常、-1.冻结、-2.迷路、-3.死亡、1.使用帐篷、2.使用指南针、3.使用智者密函、4.达到大本营，游戏结束）
			let job = this.userinfo.job; // 权限控制 (0.队长、1.财务官、2.交通官、3.交易官、4.气象官、5.情报官)
			let j = e.currentTarget.dataset.item.judge;
			console.log(condition,job, j);
			if (j == -1) {
				this.showGame();
				this.setData({ judge: j });
			} else if (j == 0 && job == 0) this.showTeam(j);
			// 队长
			else if (j == 1 && job == 0) this.showShop(j);
			// 交易官
			else if (j == 2 && job == 0) this.showBag(j);
			// 财务官
			else if (j == 3 && job == 0) this.showTrade(j);
			// 交易官
			else if (j == 4 && job == 0) this.showTool(j);
			// 气象官
			else if (j == 5 && job == 0) this.showRoute(j);
			// 交通官
			else if (j == 6) {
				this.showAbout();
				this.setData({ judge: j });
			} else tools.toast.none('没有权限进入操作');
		},
		showGame() {
			this.getmap();
		},
		// 获取地图
		getmap() {
			apis.getmap().then(res => {
				this.setData({ map: res.data.rows });
				print.log(res.data);
			});
		},
		// 点击地图
		lchoose(e) {
			let choose = e.currentTarget.dataset.item
			let land = this.fLand(choose,choose.land)
			print.log('lchoose',land );
			this.setData({ map_show: !this.map_show, chooseland: land, mapteam: false });
			
		},
		// 进入地图权限判断
		judgeEnter() {
			// 交通官 2
			if (this.userinfo.job != 0) {
				tools.toast.none('无操作权限');
				return;
			}
			let cur = this.teaminfo.map.id;
			let to = this.chooseland.id;
			print.log(cur,to);
			if( cur == to ){
				this.enter();
				return;
			}
			// 周围全地图 9-13  16-20  23-27  30-34  37-41
			if(cur >= 9 && cur <= 13 || cur >= 16 && cur <= 20 || cur >= 23 && cur <= 27 || cur >= 30 && cur <= 34 || cur >= 37 && cur <= 41 ){
				console.log('全地图');
				if( to >= cur-8 && to <= cur-6 || to >= cur-1 && to <= cur+1 || to >= cur+6 && to <= cur+8  ){
					this.enter();
				}else tools.toast.none('位置非法！');
			}
			// 四角 1、7、43、49
			if( cur == 1){ 
				console.log('左上')
				if( to == cur+1 || to >= cur+7 && to <= cur+8  ){
					this.enter();
				}else tools.toast.none('位置非法！');
			}
			if( cur == 7){ 
				console.log('右上') 
				if( to == cur-1 || to >= cur+6 && to <= cur+7  ){
					this.enter();
				}else tools.toast.none('位置非法！');
			}
			if( cur == 43){ 
				console.log('左下') 
				if( to == cur+1 || to >= cur-7 && to <= cur-6  ){
					this.enter();
				}else tools.toast.none('位置非法！');
			}
			if( cur == 49){ 
				console.log('右下') 
				if( to == cur-1 || to >= cur-8 && to <= cur-7  ){
					this.enter();
				}else tools.toast.none('位置非法！');
			}			
			// 上 2-6 、下 44-48 、左 8,15,22,29,36 、右边 14,21,28,35,42
			if( cur >= 2 && cur <= 6){ 
				console.log('上部') 
				if( to >= cur-1 && to <= cur+1  || to >= cur+6 && to <= cur+8  ){
					this.enter();
				}else tools.toast.none('位置非法！');
			}
			if( cur >= 44 && cur <= 48){ 
				console.log('下部') 
				if( to >= cur-1 && to <= cur+1  || to >= cur-8 && to <= cur-6  ){
					this.enter();
				}else tools.toast.none('位置非法！');
			}
			if( [8,15,22,29,36].indexOf(cur) != -1 ){ 
				console.log('左部') 
				if( to >= cur-7 && to <= cur-6  || to >= cur+7 && to <= cur+8  || to == cur+1){
					this.enter();
				}else tools.toast.none('位置非法！');
			}
			if( [14,21,28,35,42].indexOf(cur) != -1 ){ 
				console.log('右部') 
				if( to >= cur-8 && to <= cur-7  || to >= cur+6 && to <= cur+7  || to == cur-1){
					this.enter();
				}else tools.toast.none('位置非法！');
			}
			
		},
		// 进入地图
		async enter() {
			tools.loading.show('加载中')
			print.log(this.chooseland, this.teaminfo);
			let cland = this.chooseland.id;  // 当前位置
			let tland = this.teaminfo.map.id;	// 下一步位置
			let clandType = this.chooseland.land;  //  land: 0 大本营，4 古墓（王陵）
			// 第一天不允许在大本营，死亡，达到大本营 不允许操作
			if(this.gameinfo.day.day == 2 && clandType ===0 || this.teaminfo.condition == 4 || this.teaminfo.condition == -3){
				tools.toast.none('操作不允许');
				return;				
			}
			// 未迷路
			if (this.teaminfo.lose == 0) {
				if (this.gameinfo.day.day > this.teaminfo.day.day) {
					// 更新位置
					await apis.updateTeamMapDay(this.teaminfo.id, cland, this.gameinfo.day_id);
					// 记录轨迹
					await apis.addTeamRoute(this.teaminfo.id, this.gameinfo.id, cland);
				} else {
					tools.toast.none('未开启下一天，无法进入');
					return;
				}
			}
			// 迷路，点击原地
			else if (this.teaminfo.lose != 0 && this.chooseland.id == this.teaminfo.map_id) {
				if (this.gameinfo.day.day > this.teaminfo.day.day) {
					// 更新位置
					await apis.updateTeamMapDay(this.teaminfo.id, cland, this.gameinfo.day_id);
					// 记录轨迹
					await apis.addTeamRoute(this.teaminfo.id, this.gameinfo.id, cland);
				} else {
					tools.toast.none('未开启下一天，无法进入');
					return;
				}
			} 
			// 迷路未点击原地
			else {
				tools.toast.none('迷路状态只能呆在原地！');
				return;
			}
			
			// 到达大本营 游戏结束
			if(clandType === 0){
				console.log('到达大本营,游戏结束');
				await apis.setTeamCondition(this.teaminfo.id, 4);
				tools.toast.none('到达大本营,游戏结束');
				// 记录排名
				let rank = await apis.createRank(this.teaminfo.id, this.gameinfo.id)
				console.log('记录排名信息',rank.data)
			}			
			// 到达古墓 获得一个 智者密函
			if(clandType == 4){
				console.log('到达古墓，奖励智者密函*1');
				// 获取路径信息 一直呆在古墓，不会一直发放
				let route = await apis.findAllRouteByTeam(this.userinfo.team_id)
				const { count,rows } = route.data;
				if(rows[count-2].map_id != rows[count-1].map_id){
					let statistic_id = this.teaminfo.statistic_id;
					let tid = this.teaminfo.id;
					let gid = this.gameinfo.id;
					this.updateModuleNumber(statistic_id, 4, 1);
					await apis.addOneTran(gid, -1, tid, tid, 0, 1, 4, 1, `到达古墓，奖励智者密函*1`);
					tools.toast.none('到达古墓，奖励智者密函*1');
				}
			}
			
			tools.toast.success('位置更新成功！');
			this.hideModal();
			this.getCurTeamInfo();
		},
		// 获取相同位置上的队伍信息
		showmapteam(e) {
			this.setData({ mapteam: e.detail.value });
			if (e.detail.value) {
				apis.getAllTeamByMap(this.chooseland.id).then(res => {
					this.setData({ mapteamitem: res.data.rows });
				});
			} 
		},
		// 获取团队信息
		async showTeam(j) {
			this.judge = j;
			let res = await apis.findUserByTeam(this.userinfo.team_id)			
			let rows = res.data.rows.filter(item=>{
				//添加不同状态下团队的表现形式
				return this.fJob(item,item.job);
			});
			this.team = Object.assign(res.data,{ rows })
		},
		// 删除队内成员
		deleteUser(e) {
			let _this = this;
			let item = e.currentTarget.dataset.item;
			print.log(item);
			uni.showModal({
				title: `你确定要删除${item.name}?`,
				content: '删除之后请重新登录，选择加入队伍',
				success(res) {
					if (res.confirm) {
						console.log('用户点击确定');
						apis.deleteUserTeam(item.id).then(res => {
							tools.toast.success('删除成功！');
							_this.showTeam();
						});
					}
				}
			});
		},
		// 获取商店信息
		async showShop(j) {
			this.judge = j;
			let res = await apis.findAllShopItem();
			let rows = res.data.rows.filter(item=>{
				//添加不同状态下团队的表现形式
				return this.fType(item,item.type);
			});
			this.shop = Object.assign(res.data,{ rows })
			console.log(res.data.rows);
		},
		// 购买加入库存
		async buy() {
			if(this.number < 1){
				tools.toast.none('数量输入有误');
				return;
			}
			tools.loading.show('加载中');
			apis.findAllBagByTeam(this.teaminfo.statistic_id).then( async(res) => {
				print.log(res.data, this.showitem);
				// 计算负载、金币
				let load = res.data.load - this.showitem.weight * this.number;
				let money = res.data.money - this.showitem.price * this.number;
				if (load >= 0 && money >= 0) {
					// 更新资产
					await apis.updateMoneyLoad(money, load, this.teaminfo.statistic_id);
					this.updateModuleNumber(this.teaminfo.statistic_id, this.showitem.id, this.number);
					await apis.addOneTran(this.gid, 0, this.tid, this.tid, this.showitem.price, this.number, this.showitem.id, 1, `大本营购买，物品id为${this.showitem.id}`);
					this.getCurTeamInfo();
				} else {
					tools.toast.none('金币或载重不足！');
				}
			});
		},
		// 显示背包信息
		async showBag(j) {
			this.judge = j;
			let res = await apis.findAllBagByTeam(this.teaminfo.statistic_id);
			this.bag = res.data
			print.log('背包信息',res.data);
		},
		// 丢弃物品
		async free() {
			print.log('物品', this.showitem, '数量', this.number);
			tools.loading.show('加载中');
			if (this.number > 0 && this.number <= this.showitem.statistic_module.number) {
				let sum = Number(this.showitem.statistic_module.number) - Number(this.number);
				// 更新数量
				let res = await apis.updateModuleNumber(this.showitem.statistic_module.id, sum);
				if (res.data.affectRows[0] != 0) {
					// 更新资产
					let bag = await apis.findAllBagByTeam(this.teaminfo.statistic_id);
					// 计算负载、金币
					let load = Number(bag.data.load) + Number(this.showitem.weight * this.number);
					let money = bag.data.money;
					// 丢弃帐篷
					if (this.showitem.id == 3) {
						let use = 3 * (this.showitem.statistic_module.number - 1);   // 丢弃帐篷表示 剩余 use 为 数量减一 * 可使用次数
						apis.findOneThingByStatisyicBymodule(this.teaminfo.statistic_id, 3).then(res => {
							apis.updateModuleUseNumber(res.data.id, use).then(res => {
								apis.updateMoneyLoad(money, load, this.teaminfo.statistic_id).then(res => {
									tools.toast.success('丢弃成功！');
									this.hideModal();
									this.showBag();
									this.getCurTeamInfo();
								});
							});
						});
					} else {
						apis.updateMoneyLoad(money, load, this.teaminfo.statistic_id).then(res => {
							tools.toast.success('丢弃成功！');
							this.hideModal();
							this.showBag();
							this.getCurTeamInfo();
						});
					}
				} else {
					tools.toast.none('丢弃失败！');
					this.hideModal();
				}
			} else {
				tools.toast.none('数量输入不合法');
			}
		},
		// 使用智者密函
		usesecret(e) {
			let item = e.currentTarget.dataset.item;
			let that = this;
			console.log(item);
			uni.showModal({
				title: '确定使用智者密函吗',
				content: '使用智者密函可能给你带来某些好处',
				success: function(res) {
					if (res.confirm) {
						let sum = Number(item.statistic_module.number) - 1;
						// 智者密函无重量
						apis.updateModuleNumber(item.statistic_module.id, sum).then(res => {
							if (res.data.affectRows[0] != 0) {
								// 更新资产
								that.showBag();
								apis.findAllBagByTeam(that.teaminfo.statistic_id).then(res => {
									let secret = Math.floor(Math.random() * (32 + 1));
									uni.showModal({
										title: `你获得的智者密函信息编号为：${secret}`,
										content: '展示此信息，联系组委会换取好处'
									});
								});
							}
						});
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		},
		// 交易获取团队列表
		async showTrade(j) {
			this.judge = j;
			this.tran_team = null;
			let map = this.teaminfo.map_id;
			let res = await apis.findAllTeamByMap(map);
			this.tran = res.data.rows
			console.log('当前位置',map,'存在队伍',this.tran);
			// 展示背包已有的物品 + 金币信息	
			let bag = await apis.findAllBagByTeam(this.teaminfo.statistic_id);
			this.tranItems = bag.data.modules.concat({ id: -1,name: '金币', type: -1 })
			console.log('显示交易信息',this.tranItems)
		},
		showTranTeam() { this.setData({ judgeteam: !this.judgeteam }); },
		chooseteam(e) { this.setData({ tran_team: e.currentTarget.dataset.item, judgeteam: false }); },
		showTranThing() { this.setData({ judgething: !this.judgething }); },
		choosething(e) { this.setData({ tran_thing: e.currentTarget.dataset.item, judgething: false }); },
		// 发送交易 (不允许交易 金块、智者密函)
		// 金币 无重量
		async send_tran() {
			print.log(this.tran_team, this.tran_thing, this.number);
			tools.loading.show('加载中');
			if (this.tran_team == null || this.tran_thing == null || this.number <= 0 || this.tran_team.id == this.teaminfo.id) {
				tools.toast.none('操作不被支持');
				return;
			} else {
				if (this.tran_thing.type == -1) {
					// 获取背包信息
					let res = await apis.findAllBagByTeam(this.teaminfo.statistic_id);
					print.log('金币交易',res.data);
					// 计算负载、金币
					let money = Number(res.data.money) - Number(this.number);
					let load = Number(res.data.load);
					console.log('己方减少',res.data.money,money);
					if (money >= 0) {
						// 减少自己金币 【金币无重量】
						await apis.updateMoneyLoad(money, load, this.teaminfo.statistic_id);
						
						/*  ----  */
						// 增加对方金币
						let other = await apis.findAllBagByTeam(this.tran_team.statistic.id);
						// 计算负载、金币
						let omoney = Number(other.data.money) + Number(this.number);
						console.log('对方增加',other.data.money,omoney);
						await apis.updateMoneyLoad(omoney, other.data.load, this.tran_team.statistic.id);
						
						// 写入交易
						await apis.addOneTran(this.gid, 1, this.tid, this.tran_team.id, 1, this.number, -1, 1, `相同位置交易，物品金币`);
						tools.toast.success('交易成功');
						this.getCurTeamInfo();
					} else {
						tools.toast.none('金币数量不足');
						return;
					}
				} else {
					// 获取自己库存信息->减少自己库存
					let res = await apis.findOneThingByStatisyicBymodule(this.teaminfo.statistic_id, this.tran_thing.id);
					print.log(this.tran_thing,'其他物品交易',res.data);
					// 减少库存
					let sum = Number(res.data.number) - Number(this.number);
					let meid = res.data.id;  // 自己 中间表 id
					// 帐篷⛺️ 获取 use 值
					let use = res.data.use || 0;
					if (sum < 0){
						tools.toast.none('库存不足！');
						return;
					} else {
						tools.loading.hide();
						// 如果交易物品为 帐篷 计算 use 值，当仅剩下最后 一套⛺️时，如果使用过（use！= 3）则不允许交易；
						// 更新 己方 的 use 值
						if(this.tran_thing.type == 3){
							console.log('交易物品 ⛺️',sum);
							let nowMeUse = use - Number(this.number)*3;
							if(sum >= 1){
								let meuse = await apis.updateModuleUseNumber(meid,nowMeUse);
								console.log(use,'交易⛺️ use值-->',nowMeUse,'结果',meuse);
							}else{
								if(use >= 3){  // 帐篷未使用
									let meuse = await apis.updateModuleUseNumber(meid,nowMeUse);
									console.log(use,'me 交易⛺️ use值-->',nowMeUse,'结果',meuse);									
								}else{
									tools.toast.none('帐篷已被使用，不允许交易！');
									return;
								}
							}							
						}
						
						// 减少自己库存
						await apis.updateModuleNumber(meid, sum);
						let res = await apis.findAllBagByTeam(this.teaminfo.statistic_id);
						// 增加负载
						let load = Number(res.data.load) + Number(this.number * this.tran_thing.weight);
						await apis.updateMoneyLoad(res.data.money, load, this.teaminfo.statistic_id);
						
						/*  ----  */
						// 增加对方库存
						let ores = await apis.moduleFindOrCreate(this.tran_team.statistic.id, this.tran_thing.type, this.number);
						print.log('获取到对方信息',ores.data);
						// 获取 use 值
						let otherid = ores.data[0].id;
						let ouse = ores.data[0].use || 0;
						let nowOtherUse = ouse + Number(this.number)*3;
						let otheruse = await apis.updateModuleUseNumber(otherid,nowOtherUse);
						console.log(ouse,'other 交易⛺️ use值-->',nowOtherUse,'结果',otheruse);
						// 更新数量
						if (!ores.data[1]) {
							// 库存存在此产品，更新数量
							let sum = Number(ores.data[0].number) + Number(this.number);
							let module = await apis.updateModuleNumber(otherid, sum);
							// 增加对方库存
							await apis.updateModuleNumber(module.data.id, sum);
						}
						// 减少负载
						let otherTeamBag = await apis.findAllBagByTeam(this.tran_team.statistic.id);
						let deload = Number(otherTeamBag.data.load) - Number(this.number * this.tran_thing.weight);
						await apis.updateMoneyLoad(otherTeamBag.data.money, deload, this.tran_team.statistic.id);
												
						// 写入交易
						await apis.addOneTran(this.gid, 1, this.tid, this.tran_team.id, 0, this.number, this.tran_thing.type, 1, `相同位置交易，物品为${this.tran_thing.name}`);
						tools.toast.success('交易成功');
						this.getCurTeamInfo();
					}
				}
			}
		},
		// 获取当前天气信息
		showTool(j) {
			this.setData({ judge: j, isWeather: this.gameinfo.judgewhether });
			let land = this.teaminfo.map.land;
			if (land == 0) this.setData({ cwhether: this.teaminfo.day.whether_village }); // 大本营天气与村庄一样
			if (land == 1) this.setData({ cwhether: this.teaminfo.day.whether_desert });
			if (land == 2) this.setData({ cwhether: this.teaminfo.day.whether_oasis });
			if (land == 3) this.setData({ cwhether: this.teaminfo.day.whether_village });
			if (land == 4) this.setData({ cwhether: this.teaminfo.day.whether_tomb });
			if (land == 5) this.setData({ cwhether: this.teaminfo.day.whether_gold });
			this.getWeatherName();
		},
		getWeatherName(){
			let x = this.cwhether;
			let w;
			if (x == -1) w = '大本营';
			if (x == 0) w = '晴天';
			if (x == 1) w = '高温';
			if (x == 2) w = '沙尘暴';
			if (x == 3) w = '高温沙尘暴';	
			this.cwhetherName = w;
		},
		// 展示路径
		async showRoute(j) {			
			this.judge = j;
			let res = await apis.findAllRouteByTeam(this.userinfo.team_id)			
			let rows = res.data.rows.filter(item=>{
				//添加不同状态下团队的表现形式
				let map = this.fLand(item.map,item.map.land)
				let root = this.fToIndex(item,item.updated_at);
				return Object.assign(root,{ map })
			});
			this.route = rows
			print.log('route',rows)
		},
		// 显示介绍信息
		showAbout() {
			this.reFresh();
			print.log('参赛者', this.userinfo, '团队', this.teaminfo, '赛事', this.gameinfo);
		},
		// 显示操作菜单内容
		getwhether() { this.setData({ whether: true, land: false, info: false }); },
		getland() { this.setData({ whether: false, land: true, info: false }); },
		getinfo() { this.setData({ whether: false, land: false, info: true }); },
		// 使用指南针
		async usecompose() {
			let [err,succ] = await uni.showModal({
				title: '使用指南针',
				content: '点击确定来使用指南针',
			})
			if(succ.confirm){
				tools.loading.show('加载中');
				// 减少库存
				let res = await apis.findOneThingByStatisyicBymodule(this.teaminfo.statistic_id, 2);
				print.log('减少库存',res.data);
				// 减少库存
				let sum = Number(res.data.number) - 1;
				if (sum < 0) tools.toast.none('库存不足！');
				else {
					await apis.updateModuleNumber(res.data.id, sum);
					let bag = await apis.findAllBagByTeam(this.teaminfo.statistic_id);
					// 增加负载
					const { compose } = conf.modules;
					let load = Number(bag.data.load) + compose.weight;
					await apis.updateMoneyLoad(bag.data.money, load, this.teaminfo.statistic_id);
					await apis.setTeamCondition(this.teaminfo.id, 2);
					// 更新团队信息
					this.getCurTeamInfo();
					tools.toast.success('使用成功！');
				}
			}
		},
		// 使用帐篷
		async usetent() {
			let [err,succ] = await uni.showModal({
				title: '使用帐篷',
				content: '点击确认使用帐篷，每顶帐篷可以使用3次',
			})
			if(succ.confirm){
				tools.loading.show('加载中');
				// 减少库存
				let res = await apis.findOneThingByStatisyicBymodule(this.teaminfo.statistic_id, 3);
				print.log('减少库存',res.data);
				// 减少使用次数
				let smid = res.data.id;
				let use = Number(res.data.use) - 1;
				let sum = Number(res.data.number) - 1;
				if (use < 0) tools.toast.none('使用次数不足！');
				else {
					if (use <= sum * 3) {
						print.log('帐篷使用次数用完，丢弃帐篷');
						// 更新use
						await apis.updateModuleUseNumber(smid, use);
						// 丢弃帐篷
						await apis.updateModuleNumber(smid, sum);
						let bag = await apis.findAllBagByTeam(this.teaminfo.statistic_id);
						// 增加负载
						const { tent } = conf.modules;
						let load = Number(bag.data.load) + tent.weight;
						apis.updateMoneyLoad(bag.data.money, load, this.teaminfo.statistic_id);
					} else {
						print.log('帐篷使用次数未用完');
						await apis.updateModuleUseNumber(smid, use);
					}
					// 更新状态
					await apis.setTeamCondition(this.teaminfo.id, 1);
					// 更新团队信息
					this.getCurTeamInfo();
					tools.toast.success('使用成功！');
				}
			}
		},
		showVillageItem(e) { this.setData({ judgevillage: !this.judgevillage }); },
		chooseVillageItem(e) {
			this.setData({ village_thing: e.currentTarget.dataset.name, judgevillage: false });
			// 村庄只能交易 食物 和 水
			let x = this.village_thing;			
			if (x == 6) this.village_thingName = '食物';
			if (x == 1) this.village_thingName = '水';			
		},
		// 更新职位
		updateJob() {
			console.log(this.number, this.showitem);
			apis.updateJob(this.showitem.id, this.number).then(res => {
				tools.toast.success('职位更新成功');
				this.showTeam();
				this.hideModal();
			});
		},
		// 绿洲取水
		async getWater() {
			if(this.number <= 0){
				tools.toast.none('输入非法！');
				return;
			}
			tools.loading.show('加载中');
			let res = await apis.findAllBagByTeam(this.teaminfo.statistic_id);
			// 增加负载
			const { water } = conf.modules;
			let load = Number(res.data.load) - Number(water.weight * this.number);
			console.log(res.data.load,'--->',load)
			if (load < 0) tools.toast.none('载重不足！');
			else {
				this.updateModuleNumber(this.teaminfo.statistic_id, water.id, this.number);
				await apis.updateMoneyLoad(res.data.money, load, this.teaminfo.statistic_id);
				// 更新团队信息
				this.getCurTeamInfo();
				tools.toast.success('获取成功！');
			}
		},
		// 村庄购物 * 数据写死 后期维护注意观察*
		async villageBuy() {
			if(this.number <= 0){
				tools.toast.none('输入非法！');
				return;
			}
			tools.loading.show('加载中');
			let res = await apis.findAllBagByTeam(this.teaminfo.statistic_id);
			// village_thing 1水 6食物
			// 计算负载
			let load = 0;
			if (this.village_thing == 6) load = Number(res.data.load) - Number(10 * this.number);
			if (this.village_thing == 1) load = Number(res.data.load) - Number(100 * this.number);
			// 计算金币
			let price;
			let money = 0;
			if (this.village_thing == 6){
				price = 20;
				money = Number(res.data.money) - Number(20 * this.number);
			}
			if (this.village_thing == 1){
				price = 50;
				money = Number(res.data.money) - Number(50 * this.number);
			}
			if (load < 0) {
				tools.toast.none('载重不足！');
				return;
			}
			this.updateModuleNumber(this.teaminfo.statistic_id, this.village_thing, this.number);
			await apis.updateMoneyLoad(money, load, this.teaminfo.statistic_id);
			// 写入交易
			await apis.addOneTran(this.gid, 3, this.tid, this.tid, price, this.number, this.village_thing, 1, `村庄交易，物品为${this.village_thingName}`);
			// 更新团队信息
			this.getCurTeamInfo();
			this.hideModal();
			tools.toast.success('获取成功！');
		},
		// 挖取金块
		async getgold() {
			// 获取路径信息
			let route = await apis.findAllRouteByTeam(this.userinfo.team_id)
			const { count,rows } = route.data;
			if(rows[count-2].map_id != rows[count-1].map_id){
				tools.toast.none('到达第二天才能挖掘金块！');
				return;
			}
			if(this.teaminfo.isDig != 0){
				tools.toast.none('今天已经挖掘过了！');
				return;
			}
			tools.loading.show('加载中');
			let res = await apis.findAllBagByTeam(this.teaminfo.statistic_id);
			// 增加负载
			const { gold } = conf.modules;
			let money = res.data.money;
			let load = Number(res.data.load) - gold.weight;
			if (load < 0) tools.toast.none('载重不足！');
			else {
				this.updateModuleNumber(this.teaminfo.statistic_id, gold.id, 1); // 每次挖掘一块
				await apis.updateMoneyLoad(money, load, this.teaminfo.statistic_id);	
				await apis.updateTeamIsDig(this.userinfo.team_id,1); 	// 是否挖掘金块（0.未挖掘、1.已挖掘）
				// 更新团队信息
				this.getCurTeamInfo();
				this.hideModal();
				tools.toast.success('获取成功！');
			}
		},
		// 物品数量模板
		async updateModuleNumber(statistic_id, module_id, number) {
			console.log('物品变化',statistic_id, module_id, number)
			if (Number(number) > 0) {
				// 更新库存数量
				let res = await apis.moduleFindOrCreate(statistic_id, module_id, number);
				print.log('物品数量模板',res.data);
				// 库存存在此产品，更新数量
				if (!res.data[1]) {
					let sum = Number(res.data[0].number) + Number(number);
					let get = await apis.updateModuleNumber(res.data[0].id, sum);
					if (get.data.affectRows[0] != 0) {
						tools.toast.success('获取成功！');
						this.hideModal();
					} else {
						tools.toast.none('获取失败！');
						this.hideModal();
					}
				} else {
					tools.toast.success('获取成功！');
					this.hideModal();
				}
				// 若为帐篷，则更新 use 值
				if( module_id==3 ){
					const { id,use=0 } = res.data[0];
					console.log('更新use',id,use);
					let curUse = Number(use) + Number(number*3);
					await apis.updateModuleUseNumber(id,curUse);
				}
			} else {
				tools.toast.none('数量必须大于0');
			}
		},
		// 输入数字（过滤小数）
		getNumber(e){
			let value = Number(e.detail.value);
			if(Math.round(value) !== value || value < 1){
				tools.toast.none('输入非法');
				this.number = 0;
			}
		},
		// 显示modal
		showModal(e) {
			console.log(e.currentTarget.dataset)
			this.setData({
				isShowModal: true,
				showland: e.currentTarget.dataset.id,
				showitem: e.currentTarget.dataset.item,
				number: 0
			});
		},
		hideModal() { this.setData({ isShowModal: false, map_show: false }); },
		// 在抽屉显示隐藏时 更新 队伍信息  this.reFresh();
		showDrawer(){ 
			this.reFresh();
			if(this.judgeGameCondition().condition == 1) this.Drawer = 'DrawerL'; 
			else tools.toast.none('赛事'+this.judgeGameCondition().state);
		},
		// 赛事状态 （-1.暂停、0.未开始、1.进行中、2.结束）
		judgeGameCondition(){
			let condition = this.gameinfo.condition
			console.log('game状态',condition)
			let state;
			switch(+condition){
				case -1: state = '暂停'; break;
				case 0: state = '未开始'; break;
				case 1: state = '进行中'; break;
				case 2: state = '已结束'; break;
			}
			return Object.assign({ condition,state });
		},
		hideDrawer(){ this.Drawer = null; this.reFresh(); },
		// 点击取消按钮的回调函数
		icancel(e) { this.hideModal(); },
		// 点击确定按钮的回调函数
		iconfirm(e) {
			print.log(this.showland,this.number);
			if (this.showland == -1) this.updateJob();
			if (this.showland == 0) this.getWater();
			if (this.showland == 1) this.villageBuy();
			if (this.showland == 2) this.getgold();
			if (this.showland == 10) this.buy();
			if (this.showland == 11) this.free();
		}
	}
};