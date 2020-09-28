import {
  promisifyAll
} from 'miniprogram-api-promise';

const wxp = {}
promisifyAll(wx, wxp)

// compatible usage
// wxp.getSystemInfo({success(res) {console.log(res)}})

// 不支持登陆的网络请求：如果获取到token带上，直接发送支持cookie的请求
wxp.request_without_login = function (args) {
  let token = wx.getStorageSync('token')
  if (token) {
    if (!args.header) args.header = {}
    args.header['Authorization'] = `Bearer ${token}`
  }
  /*
  改用带cookie的requestWithCookie
  return wxp.request(args).catch(function (reason) {
    console.log('reason', reason)
  })
  */
  return new Promise((resolve, reject) => {
    let rtnObj = wx.requestWithCookie(
      Object.assign(args, {
        success: resolve,
        fail: reject
      })
    )
    if (args.onReturnObject) args.onReturnObject(rtnObj)
  })
}

// 支持登陆的网络请求：如果session过期，或者token没有获取，则自动调出登陆界面
wxp.request_with_login = async function (args) {
  // 本地token与微信服务器上的session都要进行判断
  // wxp.checkSession：调用成功说明当前 session_key 未过期，调用失败说明 session_key 已过期，具体使用详见微信开发者文档。
  let tokenIsValid = false, sessionIsValid = false
  let res0 = await getApp().wxp.checkSession().catch(err => {
    // 清理登陆状态，会触发该错误
    // checkSession:fail 系统错误，错误码：-13001,session time out…d relogin
    console.log("wxp.checkSession err", err);
    tokenIsValid = false
  })
  console.log("wxp.checkSession res0", res0);
  if (res0 && res0.errMsg === "checkSession:ok") sessionIsValid = true
  let token = wx.getStorageSync('token')
  if (token) tokenIsValid = true

  if (!tokenIsValid || !sessionIsValid) {
    let pageStack = getCurrentPages()
    if (pageStack && pageStack.length > 0) {
      let currentPage = pageStack[pageStack.length - 1]
      // 展示登陆浮窗
      currentPage.setData({
        showLoginPanel: true
      })
      return new Promise((resolve, reject) => {
        // 等待登陆成功事件返回后，才继续向服务器发送实际请求
        getApp().globalEvent.once('loginSuccess', function (e) {
          wxp.request_without_login(args).then(function (result) {
            resolve(result)
          }).catch(function (reason) {
            console.log('request2 reason', reason);
          })
        })
      })
    } else {
      reject('page valid err')
    }
  }
  return wxp.request_without_login(args).catch(function (reason) {
    console.log('request2 reason', reason);
  })
}

/*
wxp.request3 = async function (args) {
  // 本地token与微信服务器上的session要分别对待
  let tokenIsValid = false, sessionIsValid = false
  let res0 = await getApp().wxp.checkSession().catch(err => {
    // 清理登陆状态，会触发该错误
    // checkSession:fail 系统错误，错误码：-13001,session time out…d relogin
    console.log("wxp.checkSession err", err);
    tokenIsValid = false
  })
  console.log("wxp.checkSession res0", res0);
  if (res0 && res0.errMsg === "checkSession:ok") sessionIsValid = true
  let token = wx.getStorageSync('token')
  if (token) tokenIsValid = true

  if (!tokenIsValid || !sessionIsValid) {
    return new Promise((resolve, reject) => {
      let pageStack = getCurrentPages()
      if (pageStack && pageStack.length > 0) {
        let currentPage = pageStack[pageStack.length - 1]
        console.log('setData showLoginPanel true')
        currentPage.setData({
          showLoginPanel: true
        })
        console.log('getApp().globalEvent.once')
        getApp().globalEvent.once("loginSuccess", () => {
          wxp.request2(args).then(res => {
            resolve(res)
          }, err => {
            console.log('err', err);
            reject(err)
          })
        })
      } else {
        reject('page valid err')
      }
    })
  }
  return wxp.request2(args)
}
*/

// 3.9
// 整合登录
// wxp.request3 = function (args) {
//   let token = wx.getStorageSync('token')
//   if (!token) {
//     let pages = getCurrentPages()
//     let currentPage = pages[pages.length - 1]
//     // 展示登陆浮窗
//     currentPage.setData({
//       showLoginPanel: true
//     })
//     return new Promise((resolve, reject) => {
//       getApp().globalEvent.once('loginSuccess', function (e) {
//         wxp.request2(args).then(function (result) {
//           resolve(result)
//         }).catch(function (reason) {
//           console.log('reason', reason);
//         })
//       })
//     })
//   }
//   return wxp.request2(args).catch(function (reason) {
//     console.log('reason', reason);
//   })
// }

export default wxp