//app.js
import "./lib/any"
import wxp from './lib/wxp'
import Event from './lib/event'
import "weapp-cookie"

App({
  wxp: (wx.wxp = wxp),
  globalEvent: (wx.globalEvent = new Event()),

  globalData: {
    userInfo: null
  },

  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  // 用来计算可用屏幕的高度
  testHeight() {
    // 64、44
    // 右上角胶囊按钮
    var data = wx.getMenuButtonBoundingClientRect()
    console.log('胶囊按钮', data);
    console.log('胶囊按钮高度：', data.height) //32
    console.log('上边界坐标：', data.top) //24
    console.log('下边界坐标：', data.bottom) //56

    // 48
    let res = wx.getSystemInfoSync()
    console.log("screenHeight", res.screenHeight);
    console.log("statusBarHeight", res.statusBarHeight);
    console.log("windowHeight", res.windowHeight);
  }
})