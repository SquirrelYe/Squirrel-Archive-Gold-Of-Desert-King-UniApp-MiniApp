/*首页面格式化时间 */
var tool = {
	formatToIndex: function(obj,x) {
		//时间操作  2019-03-16T08:18:51.000Z
		var t = x.split('T');
		var t1 = t[0].split('-');
		var t2 = t[1].split(':');
		var n = parseInt(t2[0]) + 8
		let ftime = n + ':' + t2[1];		
		return Object.assign(obj,{ ftime });
	},
	formatType: function(obj,x) {
		let ftype;
		if (x == -1) ftype = '金币';
		if (x == 0) ftype = '食物';
		if (x == 1) ftype = '水';
		if (x == 2) ftype = '指南针';
		if (x == 3) ftype = '帐篷';
		if (x == 4) ftype = '智者密函';
		if (x == 5) ftype = '金块';
		return Object.assign(obj,{ ftype });
	},
	formatLand: function(obj,x) {
		let fland;
		if (x == 0) fland = '大本营';
		if (x == 1) fland = '沙漠';
		if (x == 2) fland = '绿洲';
		if (x == 3) fland = '村庄';
		if (x == 4) fland = '王陵';
		if (x == 5) fland = '藏宝山';
		return Object.assign(obj,{ fland });
	},
	formatCondition: function(obj,x) {
		let fcondition;
		if (x >= 0) fcondition = '正常';
		if (x == -1) fcondition = '冻结';
		if (x == -2) fcondition = '迷路';
		if (x == -3) fcondition = '死亡';
		if (x == 1) fcondition = '使用帐篷中';
		if (x == 2) fcondition = '使用指南针中';
		if (x == 4) fcondition = '达到大本营，游戏结束';
		return Object.assign(obj,{ fcondition });
	},
	formatWhether: function(obj,x) {
		let fwhether;
		if (x == -1) fwhether = '大本营';
		if (x == 0) fwhether = '晴天';
		if (x == 1) fwhether = '高温';
		if (x == 2) fwhether = '沙尘暴';
		if (x == 3) fwhether = '高温沙尘暴';
		return Object.assign(obj,{ fwhether });
	},
	formatJob: function(obj,x) {
		let fjob;
		if (x == 0) fjob = '队长';
		if (x == 1) fjob = '财务官';
		if (x == 2) fjob = '交通官';
		if (x == 3) fjob = '交易官';
		if (x == 4) fjob = '气象官';
		if (x == 5) fjob = '情报官';
		return Object.assign(obj,{ fjob });
	}
}

module.exports = {
	fToIndex: tool.formatToIndex,
	fType: tool.formatType,
	fLand: tool.formatLand,
	fCondition: tool.formatCondition,
	fWhether: tool.formatWhether,
	fJob: tool.formatJob
}
