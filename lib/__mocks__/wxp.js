const addressList = [{
		"id":1,
		"userId":1,
		"userName":"小林哈哈",
		"telNumber":"123456",
		"region":["广东省","广州市","海珠区"],
		"detailInfo":"7890哈啊111222333",
		"createdAt":"2020-11-11T02:50:42.000Z","updatedAt":"2020-11-11T12:57:15.000Z"
	},{
		"id":2,
		"userId":1,
		"userName":"李四",
		"telNumber":"1234567",
		"region":["福建省","厦门市","思明区"],"detailInfo":"7654321","createdAt":"2020-11-11T06:40:36.000Z","updatedAt":"2020-11-11T06:40:36.000Z"
	},{
		"id":6,
		"userId":1,
		"userName":"张三",
		"telNumber":"020-81167888",
		"region":["广东省","广州市","海珠区"],
		"detailInfo":"新港中路397号",
		"createdAt":"2020-11-11T07:47:46.000Z","updatedAt":"2020-11-11T07:47:46.000Z"
	},{
		"id":7,
		"userId":1,
		"userName":"小林",
		"telNumber":"1234567890",
		"region":["广东省","广州市","海珠区"],
		"detailInfo":"7890",
		"createdAt":"2020-11-11T12:47:46.000Z","updatedAt":"2020-11-11T12:47:46.000Z"
	}]

/*
wxp.request_without_login = function (args) {
	// 做假请求
	return new Promise((resolved, reject) => {
		resolved("(function(){return '123'})()")
	})
}

wxp.request_with_login = async function (args) {
	console.log("request_with_login args=", args)

	if ((args.url.search("/user/my/address") != -1) && (args.method == "get")) {
		  // 做假请求
			return new Promise((resolved, reject) => {
				var temp = {
					data: {
						code: 200,
						data: addressList,	
						msg: "ok",
					},
					statusCode: 200,
					errMsg: "request:ok"
				};
				
				resolved(temp)
			})
	} else {
			return new Promise((resolved, reject) => {
				resolved("(function(){return '123'})()")
			})
	}
}

//export default wxp


*/
export default {
	request_without_login(args) {
		// 做假请求
		return new Promise((resolved, reject) => {
			resolved("(function(){return '123'})()")
		})
	},
	
	async request_with_login(args) {
		console.log("request_with_login args=", args)
	
		if ((args.url.search("/user/my/address") != -1) && (args.method == "get")) {
				// 做假请求
				return new Promise((resolved, reject) => {
					var temp = {}
					console.log("TestConfig.fakeResponse_normal=", TestConfig.fakeResponse_normal)
					if (TestConfig.fakeResponse_normal) {
						temp = {
							data: {
								code: 200,
								data: addressList,	
								msg: "ok",
							},
							statusCode: 200,
							errMsg: "request:ok"
						};
					} else {
						temp = {
							data: {
								code: 400,	
								msg: "error",
							},
							statusCode: 400,
							errMsg: "request error"
						};
					}
					resolved(temp)
				})
		} else if ((args.url.search("/user/my/address") != -1) && (args.method == "delete")) {
			// 做假请求
			return new Promise((resolved, reject) => {
				var temp = {}
				console.log("TestConfig.fakeResponse_normal=", TestConfig.fakeResponse_normal)
				if (TestConfig.fakeResponse_normal) {
					temp = {
						data: {
							code: 200,	
							msg: "ok",
						},
						statusCode: 200,
						errMsg: "request:ok"
					};
				} else {
					temp = {
						data: {
							code: 200,	
							msg: "",
						},
						statusCode: 200,
						errMsg: "request error"
					};
				}
				resolved(temp)
			})
		} else {
				return new Promise((resolved, reject) => {
					resolved("(function(){return '123'})()")
				})
		}
	},

	addressList: addressList
}