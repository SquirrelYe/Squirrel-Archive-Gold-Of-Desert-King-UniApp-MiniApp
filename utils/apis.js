const req = require('./req.js')

module.exports={
  // 赛事数据
  getUserInfo(user_id) { return req.get('/ass/user', { 'judge': 3, 'user_id': user_id }) },
  getTeamInfo(team_id) { return req.get('/ass/team', { 'judge': 3, 'id': team_id }) },
  // 参赛者api
  login(user,pass) { return req.get('/ent/user',{ 'judge':6,'name':user,'pass':pass }) },
  sendcode(mail, code) { return req.get('/mail', { 'judge': 0, 'mail_address': mail, 'code': code }) },
  register(name, pass, mail, openid) { return req.get('/ent/user', { 'judge': 1, 'name': name, 'pass': pass, 'mail': mail, 'type': 0, 'condition': 0, 'openid': openid }) },
  forget(mail, pass) { return req.get('/ent/user', { 'judge': 7, 'mail': mail, 'pass': pass }) },
  updateJob(id, job) { return req.get('/ent/user', { 'judge': 3, 'id': id, 'job': job }) },
  findUserById(id) { return req.get('/ent/user', { 'judge': 9, 'id': id }) },
  // 赛事列表api
  findAllGame(){ return req.get('/ass/game',{ 'judge':0 }) },
  findAllGameByCondition(condition) { return req.get('/ass/game', { 'judge': 2, 'condition': condition }) },
  findOneGameById(id) { return req.get('/ass/game', { 'judge': 1, 'game_id': id }) },
  // 队伍列表api
  joinGame(uid, gid) { return req.get('/ent/user', { 'judge': 3, 'id': uid, 'game_id': gid }) },
  joinTeam(uid, tid) { return req.get('/ent/user', { 'judge': 3, 'id': uid,'team_id':tid }) },
  createTeam(gid, n) { return req.get('/ent/team', { 'judge': 1, 'game_id': gid, 'name': n,'condition':0,'day_id':1,'map_id':42,'lose':0 }) },
  updateTeamIsDig(id,isdig){ return req.get('/ent/team', { 'judge': 3, 'id': id,'isDig':isdig } )},
  
  findAllTeam(){ return req.get('/ass/team', { 'judge': 2 }) },
  findUserByTeam(team_id){ return req.get('/ass/user',{ 'judge':4,'team_id':team_id}) },
  deleteUserTeam(user_id) { return req.get('/ass/user', { 'judge': 1,  'user_id':user_id }) },
  findAllTeamByMap(map) { return req.get('/ass/team', { 'judge': 5, 'map_id': map }) },
  // 商店信息api
  findAllShopItem() { return req.get('/ent/module', { 'judge': 0 }) },
  moduleFindOrCreate(statistic_id, module_id, number) { return req.get('/ass/statistic_module',{ 'judge': 1, 'statistic_id': statistic_id, 'module_id': module_id, 'number':number }) },
  updateModuleNumber(id, number) { return req.get('/ass/statistic_module', { 'judge': 2,'id':id,'number':number })},
  updateMoneyLoad(money, load, statistic_id) { return req.get('/ent/statistic',  { 'judge': 3, 'id': statistic_id, 'money': money, 'load': load}) },
  addOneTran(g, t, m, o, p, n, mo, c, d) { return req.get('/ent/transaction', { 'judge': 1, 'game_id': g, 'type': t, 'me': m, 'other': o, 'price': p, 'number': n, 'module_id': mo, 'condition': c, 'detail': d }) },
  // 背包api
  findAllBagByTeam(statistic_id) { return req.get('/ass/statistic_module', { 'judge': 4, 'statistic_id': statistic_id}) },
  findOneThingByStatisyicBymodule(statistic_id, module_id) {  return req.get('/ass/statistic_module', { 'judge': 5, 'statistic_id': statistic_id, 'module_id': module_id }) },
  // 天气操作
  setTeamCondition(id, condition) { return req.get('/ent/team', { 'judge': 3, 'id': id,'condition':condition }) },
  updateModuleUseNumber(id, use) { return req.get('/ass/statistic_module', { 'judge': 2, 'id': id, 'use': use }) },
  // 历史路径
  findAllRouteByTeam(id) { return req.get('/ass/route', { 'judge': 2, 'team_id': id })},
  updateTeamMapDay(id, map, day) { return req.get('/ent/team', { 'judge': 3, 'id': id, 'map_id': map,'day_id':day })},
  addTeamRoute(team_id, game_id, map_id) { return req.get('/ent/route', { 'judge': 1, 'team_id': team_id, 'game_id': game_id, 'map_id': map_id })},
  getmap() { return req.get('/ent/map', { 'judge':0 }) },
  getAllTeamByMap(map) { return req.get('/ent/team', { 'judge': 4,'map_id':map }) },
}