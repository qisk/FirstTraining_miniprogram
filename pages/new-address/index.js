const { default: wxp } = require("../../lib/wxp")
const util = require("../../utils/util.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    telNumber: '',
    region: ['广东省', '广州市', '海珠区'],
    detailInfo: '',
  },

  bindRegionChange(e) {
    this.setData({
      region: e.detail.value
    })
  },

  async save(e) {
    let data = this.data
    let res = await wxp.request_with_login({
      url: util.ipAddress + '/user/my/address',
      method: 'post',
      data
    })
    if (res.data.msg == 'ok') {
      // 发送event channel数据
      let opener = this.getOpenerEventChannel()
      let address = res.data.data
      opener.emit("savedNewAddress", address)
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.showToast({
        title: '添加失败',
      })
    }
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

  }
})