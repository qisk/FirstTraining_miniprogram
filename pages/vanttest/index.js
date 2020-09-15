//index.js
import area from "../../lib/area"

//获取应用实例
const app = getApp()

Page({
  data: {
    // areaList数据直接给vant area组件使用
    areaList: area,
    show: false,
    progress: 0,
    stopcircle: false,
    province:"unknown",
    city:"unknown",
    area:"unknown",
    /* template code ++
    motto: 'First Training',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
    template code -- */
  },

  // 每次增加20，刷新环形进度条
  incressProgress(e) {
    this.data.stopcircle = false

    this.setData({ progress: 0 });
    let progress = this.data.progress
    let i = 0

    while (true) {
      progress = progress + 10;
      i = i + 1;
      console.log("progress=" + progress + ",i=" + i )
      if (progress > 100) {
        break
      }

      setTimeout(() => {
        let progress = this.data.progress
        progress = progress + 10
        if (progress <= 100) {
          this.setData({ progress: progress });
        }
      }, 500 * i)
    }
  },

  // 关闭popup
  onClose(e) {
    this.setData({ show: false })
  },

  // 点击按钮，显示省市区组件
  onTap(e) {
    this.setData({
      show: true
    })
  },

  onAreaConfirm(e) {
    console.log(e.detail);
    this.setData({ province: e.detail.values[0].name })
    this.setData({ city: e.detail.values[1].name })
    this.setData({ area: e.detail.values[2].name })
    this.onClose()
  },

  onLoad: function () {

  }

  /* template code ++
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
  template code -- */
})
