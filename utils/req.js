const conf = require('./config')
const tools = require('./tools')

const request = (url, options) => {
	return new Promise((resolve, reject) => {
		uni.request({
			url: `${conf.host}${url}`,
			method: options.method,
			data: options.method === 'GET' ? options.data : JSON.stringify(options.data),
			header: {
				'Content-Type': 'application/json; charset=UTF-8',
				'x-token': 'x-token' // 看自己是否需要
			},
			success: (res) => {
				let code = res.statusCode
				if ( code === 200) {
					resolve(res)
				} else {
					tools.toast.none(`网络开小差了,${code}`)
					reject(res)
				}
			},
			fail: (err) => {
				tools.toast.none('网络开小差了')
				reject(err)
			}
		})
	})
}

const get = (url, options = {}) => {
	return request(url, {
		method: 'GET',
		data: options
	})
}

const post = (url, options) => {
	return request(url, {
		method: 'POST',
		data: options
	})
}

const put = (url, options) => {
	return request(url, {
		method: 'PUT',
		data: options
	})
}

// 不能声明DELETE（关键字）
const remove = (url, options) => {
	return request(url, {
		method: 'DELETE',
		data: options
	})
}

module.exports = {
	get,
	post,
	put,
	remove
}
