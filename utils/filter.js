/*首页面格式化时间 */
var tool = {
	formatToIndex: function(time) {
		//时间操作  2019-03-16T08:18:51.000Z
		var t = time.split('T');
		var t1 = t[0].split('-');
		var t2 = t[1].split(':');
		var n = parseInt(t2[0]) + 8
		return n + ':' + t2[1];
	},
	formatType: function(type) {
		if (type == -1) return '金币';
		if (type == 0) return '食物';
		if (type == 1) return '水';
		if (type == 2) return '指南针';
		if (type == 3) return '帐篷';
		if (type == 4) return '智者密函';
		if (type == 5) return '金块';
	},
	formatLand: function(land) {
		if (land == 0) return '大本营';
		if (land == 1) return '沙漠';
		if (land == 2) return '绿洲';
		if (land == 3) return '村庄';
		if (land == 4) return '王陵';
		if (land == 5) return '藏宝山';
	},
	formatTeamCondition: function(x) {
		if (x >= 0) return '正常';
		if (x == -1) return '冻结';
		if (x == -2) return '迷路';
		if (x == -3) return '死亡';
	},
	formatWhether: function(x) {
		if (x == -1) return '大本营';
		if (x == 0) return '晴天';
		if (x == 1) return '高温';
		if (x == 2) return '沙尘暴';
		if (x == 3) return '高温沙尘暴';
	},
	formatJob: function(x) {
		if (x == 0) return '队长';
		if (x == 1) return '财务官';
		if (x == 2) return '交通官';
		if (x == 3) return '交易官';
		if (x == 4) return '气象官';
		if (x == 5) return '情报官';
	}
}

module.exports = {
	formatToIndex: tool.formatToIndex,
	formatType: tool.formatType,
	formatLand: tool.formatLand,
	formatTeamCondition: tool.formatTeamCondition,
	formatWhether: tool.formatWhether,
	formatJob: tool.formatJob
}
