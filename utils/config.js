module.exports={
	edition:'1.0.0',
	// host: 'https://tree.yexuan.site/api',
	host:'http://localhost:11111',
	
	// modules 参数汇总
	modules:{
		coin:{ id:-1,type:-1,name:'金币',price:1.00,weight:0 },
		water:{ id:1,type:1,name:'水',price:25.00,weight:50 },
		compose:{ id:2,type:2,name:'指南针',price:100.00,weight:10 },
		tent:{ id:3,type:3,name:'帐篷',price:400.00,weight:60 },
		secret:{ id:4,type:4,name:'智者密函',price:10.00,weight:0 },
		gold:{ id:5,type:5,name:'金块',price:0.00,weight:50 },
		food:{ id:6,type:0,name:'食物',price:10.00,weight:10 }
	}
}