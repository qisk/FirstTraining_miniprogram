const { default: wxp } = require("../../lib/wxp")

// pages/request-login-test/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoginPanel:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      console.log("page set selected:", 1)
      this.getTabBar().setData({
        selected: 2
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  async exec_request_without_login(e) {
    // 如果缺少token，返回401错误，未进行鉴权
    let res = await getApp().wxp.request_without_login({
      url: 'http://localhost:3000/user/home',
    })
    if (res) console.log('res=', res)
  },

  async exec_request_with_login(e) {
    // 如果缺少token，弹出登陆框
    console.log('e=', e)
    let res = await getApp().wxp.request_with_login({
      url: 'http://localhost:3000/user/home',
    })
    if (res) console.log('res=', res)
  },

  async exec_request_with_login_callback(e) {
    // 如果缺少token，弹出登陆框，并对返回的RequestTask对象进行处理
    let res = await getApp().wxp.request_with_login({
      url: 'http://localhost:3000/user/home',
      onReturnObject(rtn) {
        rtn.abort()
      }
    }).catch(err => {
      console.log('requestHomeApiByReq4 err', err);
    })
    if (res) console.log('res=', res)
  },

  async execwxreqeust(e) {
    // 使用miniprogram-api-promise中的wxp.request测试支持携带cookie的请求
    let res = await wxp.request({
      url: 'http://localhost:3000'
    }).catch(function (reason) {
      console.log('reason', reason)
    })

    if (res) console.log('res=', res)
    
    /*
    // 安装weapp-cookie以后，使用微信自带wx.request测试支持携带cookie的请求
    wx.request({
      url: 'http://localhost:3000', success: function(res) {
        console.log("execwxreqeust res:" + res)
      }
    })
    */
  },

  execwxrequestWithCookie(e) {
    wx.requestWithCookie({
      url: 'http://localhost:3000', success: function(res) {
        console.log("execwxrequestWithCookie res.data:" + res.data + ",res.cookies:" + res.cookies)
      }
    })
  }
})