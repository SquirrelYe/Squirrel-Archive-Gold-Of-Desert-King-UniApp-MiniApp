// 获取openid   res 为 wx.login 接口调用获取的值
const host = require('./config').host
const getOpenid= (res)=>{
  uni.request({
    url: `${host}/wx/wx`,
    data: {
      judge: '0',
      appid: 'wx755d37a92190903e',
      secret: 'fe91a08b40b57a9b8bdfdc6485d90b49',
      js_code: res.code,
      grant_type: 'authorization_code'
    },
    success: (res)=> {
      var OPEN_ID = res.data.openid;
      var SESSION_KEY = res.data.session_key;
      var UNION_ID = ''

      console.log("OPEN_ID\t------>\t" + OPEN_ID);
      console.log("SESSION_KEY\t------>\t" + SESSION_KEY);
      // 写入缓存
      uni.setStorage({ key: 'openid', data: res.data.openid })
      uni.setStorage({ key: 'session_key', data: res.data.session_key })
    },
    fail: (res)=> {
      console.log(res.data);
    }
  })
}

// 获取access_taken
const getAccessTaken = ()=> {
  uni.request({      
    url: `${host}/wx/wx`,
    data: {
      judge: '1',
      appid: 'wx755d37a92190903e',
      secret: 'fe91a08b40b57a9b8bdfdc6485d90b49'
    },
    success: (res) =>{
      console.log('获取access_taken', res.data.access_token)
      // 写入缓存
      uni.setStorage({ key: 'access_taken', data: res.data.access_token })
    },
    fail: (res) =>{
      console.log(res.data);
    }
  })
}

module.exports={
  getOpenid: getOpenid,
  getAccessTaken: getAccessTaken
}