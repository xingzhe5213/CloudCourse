import Vue from 'vue'

export const requestData=(options)=>{ //传入的options是一个json对象
	let headers={}
	// var token =uni.getStorageSync('token');
	// headers['token'] = token;
	
	headers['token'] = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXNzd29yZCI6IjEyMzQ1NiIsInJvbGUiOiJmYWxzZSIsInVzZXJOYW1lIjoiYWRtaW4iLCJleHAiOjE2MjMwNTA3OTJ9.pclB51L2Z3RcvfSdEyptrNmFJ087mvmh7488XbRTvd4";
	headers['Content-Type'] = "application/x-www-form-urlencoded";
	
	return new Promise((resolve,reject)=>{
		uni.request({
			url:Vue.prototype.$apiPath+options.url,
			method:options.methods||"POST",
			header:headers,
			data:options.data || {},
			dataType:options.dataType || "json",
			success: (res) => {
				// console.log(res)
				if(res.statusCode !== 200){
					return uni.showToast({
						title:"系统异常！"
					})
				}
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