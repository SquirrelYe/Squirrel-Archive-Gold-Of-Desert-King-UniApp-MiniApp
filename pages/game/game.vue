<template>
	<view class="main">
		<!-- 抽屉菜单 -->
		<view class="cu-modal drawer-modal justify-start" :class="Drawer=='DrawerL'?'show':''" @click="hideDrawer">
			<view class="cu-dialog basis-sm" @tap.stop="" style="height: 100vh; width: 40vw;">
				
				<view class="left">
					<view class="l-top">
						<view class="show1">
							<text class="text-xs">{{ userinfo.team.name }}—{{ userinfo.fjob }}</text>
						</view>
					</view>
					<view class="l-item">
						<view class="show1">
							<view class="map">
								<view class="cu-list grid col-3">
									<view class="c-item" v-for="(item, index) in iconList" :key="index" @click="show" :data-item="item">
										<view :class="[item.icon, item.color]"></view>
										<text class="text-xs">{{ item.name }}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 操作面板 -->		
		<view class="box">
			<!-- 地图区域 -->
			<view class="right">
				<!-- 状态栏 -->
				<view class="r-top">
					<view class="show1">
						<view class="icon-pullright text-green drawer-open" @click="showDrawer"></view>
						<block v-if="gameinfo.condition == 1">
							<text class="text-xs">金币：{{ teaminfo.statistic.money }}、承载：{{ teaminfo.statistic.load }}、状态：</text>
							<text class="text-xs text-green">{{ teaminfo.fcondition }}</text>
						</block>
						<block v-else>
							<text class="text-xs">赛事{{gameCondition.state}}</text>
						</block>
					</view>
				</view>
				<!-- 右部单元 -->
				<view class="r-item">
					<view class="show1">
						<view class="map">
							<!-- 地图 -->
							<block v-if="judge == -1" v-for="(item, index) in map" :key="index">
								<!-- 沙漠 -->
								<view class="m-item" v-if="item.land == 1" @click="lchoose" :data-item="item" style="background-image:url('../../static/desert.png')">
									<text class="text-xs text-green" v-if="teaminfo.map.id == item.id">{{ item.id }} ★</text>
									<text class="text-xs text-white" v-else>{{ item.id }}</text>
								</view>

								<!-- 大本营 -->
								<view class="m-item" v-if="item.land == 0" @click="lchoose" :data-item="item" style="background-image:url('../../static/home.png')">
									<text class="text-xs text-green" v-if="teaminfo.map.id == item.id">{{ item.id }} ★</text>
									<text class="text-xs text-white" v-else>{{ item.id }}</text>
								</view>

								<!-- 绿洲 -->
								<view class="m-item" v-if="item.land == 2" @click="lchoose" :data-item="item" style="background-image:url('../../static/oasis.png')">
									<text class="text-xs text-green" v-if="teaminfo.map.id == item.id">{{ item.id }} ★</text>
									<text class="text-xs text-white" v-else>{{ item.id }}</text>
								</view>

								<!-- 村庄 -->
								<view class="m-item" v-if="item.land == 3" @click="lchoose" :data-item="item" style="background-image:url('../../static/village.png')">
									<text class="text-xs text-green" v-if="teaminfo.map.id == item.id">{{ item.id }} ★</text>
									<text class="text-xs text-white" v-else>{{ item.id }}</text>
								</view>

								<!-- 古墓 -->
								<view class="m-item" v-if="item.land == 4" @click="lchoose" :data-item="item" style="background-image:url('../../static/tomb.png')">
									<text class="text-xs text-green" v-if="teaminfo.map.id == item.id">{{ item.id }} ★</text>
									<text class="text-xs text-white" v-else>{{ item.id }}</text>
								</view>

								<!-- 藏宝山 -->
								<view class="m-item" v-if="item.land == 5" @click="lchoose" :data-item="item" style="background-image:url('../../static/gold.png')">
									<text class="text-xs text-green" v-if="teaminfo.map.id == item.id">{{ item.id }} ★</text>
									<text class="text-xs text-white" v-else>{{ item.id }}</text>
								</view>
							</block>
							<!-- 操作 -->
							<!-- 团队 -->
							<view v-if="judge == 0" class="shop">
								<text class="text-xs text-red">当前所处团队：{{ teaminfo.name }}</text>
								<text class="text-xs">队员人数：{{ team.count }}</text>
								<scroll-view scroll-y style="margin:1%;width:100%;height:60vh">
									<view class="table">
										<view class="tr bg-w text-xs">
											<view class="th">用户ID</view>
											<view class="th">名称</view>
											<view class="th ">职位</view>
											<view class="th ">操作</view>
										</view>
										<block v-for="(item, index) in team.rows" :key="index">
											<view class="tr bg-g text-xs">
												<view class="td">{{ item.id }}</view>
												<view class="td">{{ item.name }}</view>
												<view class="td">{{ item.fjob }}</view>
												<view class="td">
													<text class="text-green" @click="showModal" :data-id="-1" :data-item="item">职位</text>
													<text class="text-red" @click="deleteUser" :data-item="item">删除</text>
												</view>
											</view>
										</block>
									</view>
								</scroll-view>
							</view>
							<!-- 商城 -->
							<view v-if="judge == 1" class="shop">
								<text class="text-xs text-red">当前所处位置：{{ teaminfo.map.fland }}</text>
								<scroll-view scroll-y style="margin:1%;width:100%;height:55vh" v-if="teaminfo.map.land == 0">
									<view class="table">
										<view class="tr bg-w text-xs">
											<view class="th">名称</view>
											<view class="th ">单价</view>
											<view class="th ">重量</view>
											<view class="th ">操作</view>
										</view>
										<block v-for="(item, index) in shop.rows" :key="index">
											<view class="tr bg-g text-xs" v-if="item.id != -1 && item.id != 5">
												<!--过滤金币、金块-->
												<view class="td">{{ item.ftype }}</view>
												<view class="td">{{ item.price }}</view>
												<view class="td">{{ item.weight }}</view>
												<view class="td text-red" @click="showModal" :data-id="10" :data-item="item">购买</view>
											</view>
										</block>
									</view>
								</scroll-view>
								<view class="about"><text style="font-size:15rpx">此处为大本营购物，村庄购物转移至操作->地形->物资补给</text></view>
							</view>
							<!-- 背包 -->
							<view v-if="judge == 2" class="shop">
								<text class="text-xs">当前所处团队：{{ teaminfo.name }}</text>
								<scroll-view scroll-y style="margin-top:1%;width:100%;height:65vh">
									<view class="table">
										<view class="tr bg-w text-xs">
											<view class="th">编号</view>
											<view class="th">物品</view>
											<view class="th ">数量</view>
											<view class="th ">剩余次数</view>
											<view class="th ">操作</view>
										</view>
										<block v-for="(item, index) in bag.modules" :key="index" v-if="item.statistic_module.number != 0">
											<view class="tr bg-g text-xs">
												<view class="td">{{ item.statistic_module.id }}</view>
												<view class="td">{{ item.name }}</view>
												<view class="td">{{ item.statistic_module.number }}</view>
												<view class="td" v-if="item.type == 3">{{ item.statistic_module.use }}</view>
												<view class="td" v-else></view>
												<view class="td">
													<view class="text-red" @click="showModal" :data-id="11" :data-item="item" v-if="item.type != 4">丢弃</view>
													<view class="text-green" @click="usesecret" :data-item="item" v-else>使用</view>
												</view>
											</view>
										</block>
									</view>
								</scroll-view>
							</view>
							<!-- 交易 -->
							<view class="shop" v-if="judge == 3">
								<!-- 相同位置的两支队伍进行物品交易 -->
								<text class="text-xs text-green">注意：同一位置队伍可进行物品交易,使用过的⛺不允许交易。️</text>
								<view class="list-msg">
									<!-- 队伍下拉框  -->
									<view class="list-msg1">
										<text class="text-xs">选择交易队伍：</text>
										<view class="list-msg2" @click="showTranTeam">
											<text class="text-xs">{{ tran_team.name || '请选择' }}</text>
										</view>
									</view>
									<!-- 下拉需要显示的队伍 -->
									<scroll-view scroll-y class="select_box" v-if="judgeteam">
										<block v-for="(item, index) in tran" :key="index" v-if="item.id != teaminfo.id">
											<view class="select_one text-xs" @click="chooseteam" :data-item="item">{{ item.name }}</view>
										</block>
									</scroll-view>

									<!-- 物品下拉框  -->
									<view class="list-msg1">
										<text class="text-xs">选择交易物品：</text>
										<view class="list-msg2" @click="showTranThing">
											<text class="text-xs">{{ tran_thing.name }}</text>
										</view>
									</view>
									<!-- 下拉需要显示的物品 -->
									<scroll-view scroll-y class="select_box" v-if="judgething">
										<!-- 不允许交易 智者密函 金块 -->
										<block v-for="(item, index) in tranItems" :key="index" v-if="item.type != 4 && item.type != 5">
											<view class="select_one text-xs" @click="choosething" :data-item="item">{{ item.name }}</view>
										</block>
									</scroll-view>
									<view class="list-msg1">
										<text class="text-xs">输入交易数量：</text>
										<view class="list-msg2"><input placeholder="0" type="number" @input="getNumber" v-model="number" class="input_number text-xs" /></view>
									</view>
									<button type="primary" class="sub" @click="send_tran">发送交易</button>
								</view>
							</view>
							<!-- 操作 -->
							<view class="tool" v-if="judge == 4">
								<view class="tool_item">
									<view class="whether" @click="getwhether"><text class="text-xs">天气</text></view>
									<view class="whether"><text class="text-xs" @click="getland">地形</text></view>
									<view class="whether"><text class="text-xs" @click="getinfo">说明</text></view>
								</view>
								<view class="tool_content">
									<view class="land" v-if="whether">
										<!-- 1.使用指南针 -->
										<!-- 2.使用帐篷 -->
										<text class="text-xs text-red">当前所处天气：{{ cwhetherName }}</text>
										<block v-if="cwhether == 2 || cwhether == 3">
											<text class="text-xs padding" @click="usecompose">使用指南针</text>
											<text class="text-xs" @click="usetent">使用帐篷</text>
										</block>
										<view class="about"><text class="text-green padding" style="font-size:15rpx">大本营天气与村庄一致</text></view>
									</view>
									<view class="land" v-if="land">
										<!-- 3.绿洲取水 -->
										<!-- 4.村庄购买 -->
										<!-- 5.藏宝山挖金 -->
										<text class="text-xs text-red">当前所处地形：{{ teaminfo.map.fland }}</text>
										<text class="text-xs padding" @click="showModal" :data-id="0" v-if="teaminfo.map.land == 2">绿洲取水</text>
										<text class="text-xs padding" @click="showModal" :data-id="1" v-if="teaminfo.map.land == 3">物资补给</text>
										<text class="text-xs padding" @click="showModal" :data-id="2" v-if="teaminfo.map.land == 5">藏宝山掘金</text>
									</view>
									<view class="land" v-if="info">
										<!-- 1.使用指南针 -->
										<!-- 2.使用帐篷 -->
										<text class="text-xs text-red">相关介绍</text>
										<text class="text-xs">①.天气：</text>
										<text style="font-size:15rpx">沙尘暴、高温沙尘暴能够使用指南针、帐篷</text>
										<text style="font-size:15rpx">指南针只能使用一次，帐篷能够使用三次，次数用完自动丢弃。</text>
										<text class="text-xs">②.地形：</text>
										<text style="font-size:15rpx">绿洲免费取水，村庄可以购物，藏宝山挖掘金子</text>
										<text style="font-size:15rpx">取水数量受承载重量限制，村庄购物价格翻倍，到达藏宝山第二天才能挖掘金子。</text>
									</view>
								</view>
							</view>
							<!-- 路径 -->
							<view v-if="judge == 5" class="shop">
								<text class="text-xs">当前所处团队：{{ teaminfo.name }}</text>
								<scroll-view scroll-y style="margin-top:1%;width:100%;height:60vh">
									<view class="table">
										<view class="tr bg-w text-xs">
											<view class="th">位置编号</view>
											<view class="th">名称</view>
											<view class="th ">时间</view>
										</view>
										<block v-for="(item, index) in route" :key="index">
											<view class="tr bg-g text-xs">
												<view class="td">{{ item.map.id }}</view>
												<view class="td">{{ item.map.land | formatLand }}</view>
												<view class="td">{{ item.ftime }}</view>
											</view>
										</block>
									</view>
								</scroll-view>
							</view>
							<!-- 玩法介绍 -->
							<view v-if="judge == 6" class="shop">
								<text class="text-xs text-green">玩法介绍</text>
								<scroll-view scroll-y style="height:70vh">
									<!-- <view class="about"><text style="font-size:15rpx">详细请见赛制指引</text></view> -->
									<text style="font-size:15rpx; text-align: center;">	1、	每队项目正式开始前有25分钟的决策时间；
											2、	每天每队最多只能沿着地图行进一个方格；
											3、	在出发前，每队拥有夺宝基金1000元，最大载重能力1000磅；
											4、	在到达大山的第一天起可以挖掘金币，并且每天只能挖掘一枚金币；
											5、	在项目进行的25天内，每队每天都将消耗食物和水，能够购买食物和水的地方为大本营和村庄。如果某一队在夺宝过程中，到达某地时所剩的食物或者水出现零值时（即使该地点正处于水源或食物供应处），该探险队仍将被掩埋在沙漠中无法生还；
											6、	在大山中每天只能挖一块金币，每块金币重50磅，每磅金币价值100元。
											第一队返回大本营获得现金为：金币数量*50磅*100元*100%+剩余钱币，
											第二组所获积分为：金币数量*50磅*100元*90%+剩余钱币，
											第三队所获积分为：金币数量*50磅*100元*80%+剩余钱币，
											以此类推逐步递减，在整个夺宝过程中，金币是不可以使用的；
									</text>
								</scroll-view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 提示框 -->
		<!-- 操作弹窗 -->
		<view>
			<view class="modal-mask" v-if="isShowModal">
				<view class="modal-content">
					<!-- 小组职位 -->
					<scroll-view scroll-y class="main-content" v-if="showland == -1">
						<view class="text-xs text-red">更改成员职位</view>
						<text class="text-xs">成员名称：{{ showitem.name }}</text>
						<view class="list-msg1">
							<text class="text-xs">输入职位编号：</text>
							<view class="list-msg2"><input placeholder="0" type="number" @input="getNumber" v-model="number" class="input_number text-xs" /></view>
						</view>
						<view class="text-xs text-red">职位编号介绍</view>
						<text style="font-size:15rpx">0.队长，1.财务官，2.交通官，3.交易官，4.气象官，5.情报官</text>
					</scroll-view>
					<!-- 绿洲取水 -->
					<scroll-view scroll-y class="main-content" v-if="showland == 0">
						<view class="text-xs text-red">绿洲区域可以免费取水</view>
						<view class="text-xs">水的重量为:50/份</view>
						<view class="list-msg1" style="margin-top:10rpx">
							<text class="text-xs">输入拾取份数：</text>
							<view class="list-msg2"><input placeholder="0" type="number" @input="getNumber" v-model="number" class="input_number text-xs text-green" /></view>
						</view>
					</scroll-view>
					<!-- 村庄购物 -->
					<scroll-view scroll-y class="main-content" v-if="showland == 1">
						<view class="text-xs text-red">村庄区域可以购物</view>
						<view class="text-xs">背包剩余载重为：{{ teaminfo.statistic.load }}</view>
						<scroll-view scroll-y style="margin-top:1%;width:100%;height:30vh">
							<view class="table">
								<view class="tr bg-w text-xs">
									<view class="th">名称</view>
									<view class="th ">单价</view>
									<view class="th ">重量</view>
								</view>
								<view class="tr bg-g text-xs">
									<view class="td">食物</view>
									<view class="td">20</view>
									<view class="td">10</view>
								</view>
								<view class="tr bg-g text-xs">
									<view class="td">水</view>
									<view class="td">50</view>
									<view class="td">100</view>
								</view>
							</view>
						</scroll-view>
						<!-- 物品下拉框  -->
						<view class="list-msg1">
							<text class="text-xs">选择交易物品：</text>
							<view class="list-msg2" @click="showVillageItem">
								<text class="text-xs text-red">{{ village_thingName }}</text>
							</view>
							<text class="text-xs" style="margin-left:20rpx;">购买数量：</text>
							<view class="list-msg2"><input placeholder="0" type="number" @input="getNumber" v-model="number" class="input_number text-xs text-red" /></view>
						</view>
						<!-- 下拉需要显示的物品 -->
						<scroll-view scroll-y class="select_box" v-if="judgevillage">
							<view class="select_one text-xs" @click="chooseVillageItem" :data-name="0">食物</view>
							<view class="select_one text-xs" @click="chooseVillageItem" :data-name="1">水</view>
						</scroll-view>
					</scroll-view>
					<!-- 藏宝山挖金 -->
					<scroll-view scroll-y class="main-content" v-if="showland == 2">
						<view class="text-xs text-red">藏宝山区域可以挖掘金块</view>
						<view class="text-xs">背包剩余载重为：{{ teaminfo.statistic.load }}</view>
						<view class="text-xs text-red">每天只能挖掘一块金块</view>
						<view class="text-xs">点击确定即可挖掘当天一块金块</view>
					</scroll-view>
					<!-- 商店购物 -->
					<scroll-view scroll-y class="main-content" v-if="showland == 10">
						<view class="text-xs text-red">商店交易信息</view>
						<view class="list-msg1">
							<text class="text-xs">输入购买数量：</text>
							<view class="list-msg2"><input placeholder="0" type="number" @input="getNumber" v-model="number" class="input_number text-xs" /></view>
						</view>
					</scroll-view>
					<!-- 背包丢弃 -->
					<scroll-view scroll-y class="main-content" v-if="showland == 11">
						<view class="text-xs text-red">丢弃物品来获取载重</view>
						<view class="list-msg1">
							<text class="text-xs">输入丢弃数量：</text>
							<view class="list-msg2"><input placeholder="0" type="number" @input="getNumber" v-model="number" class="input_number text-xs" /></view>
						</view>
					</scroll-view>
		
					<view class="modal-footer">
						<view class="cancel-btn" @click="icancel">取消</view>
						<view class="confirm-btn" @click="iconfirm">确定</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 地图弹窗 -->
		<view class="modal-mask" v-if="map_show">
			<view class="modal-content">
				<text class="text-xs">位置编号：{{ chooseland.id }}</text>
				<text class="text-xs">地形：{{ chooseland.fland }}</text>
				<view class="action">
					<text class="text-xs margin-right-sm">查看当前位置团队信息</text>
					<switch class="sm text-xs" @change="showmapteam"></switch>
				</view>
				<scroll-view scroll-y style="margin-top:1%;width:100%;height:30vh" v-if="mapteam">
					<view class="table">
						<view class="tr bg-w text-xs">
							<view class="th">队伍编号</view>
							<view class="th ">名称</view>
						</view>
						<block v-for="(item, index) in mapteamitem" :key="index">
							<view class="tr bg-g text-xs">
								<view class="td">T{{ item.id }}</view>
								<view class="td">{{ item.name }}</view>
							</view>
						</block>
					</view>
				</scroll-view>
				<view class="modal-footer">
					<view class="cancel-btn" @click="icancel">关闭</view>
					<view class="confirm-btn" @click="judgeEnter">进入</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<!-- 提去js文件到外部 -->
<script src="./game.js"></script>

<style>
@import 'modal.css';
@import '../../css/ripples.css';
@import 'game.css';
</style>
