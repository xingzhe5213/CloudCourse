import Vue from 'vue'

export const requestData=(options)=>{ //传入的options是一个json对象
	let headers={}
	var token =uni.getStorageSync('token');
	
	headers['token'] = token;
	headers['Content-Type'] = "application/x-www-form-urlencoded";
	
	return new Promise((resolve,reject)=>{
		uni.request({
			url:Vue.prototype.$apiPath+options.url,
			method:options.methods||"POST",
			header:headers,
			data:options.data || {},
			dataType:options.dataType || "json",
			success: (res) => {
				resolve(res)
			},
			fail: (err) => {
				uni.showToast({
					title:"系统异常！"
				})
				reject(err)
			}
		})
	})
}