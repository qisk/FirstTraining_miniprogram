// pages/cart/index.js
const { default: wxp } = require("../../lib/wxp")
const util = require("../../utils/util.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartIdSelectedResult:[],
    allIsSelected:false,
    editMode:false,
    carts:[],
  },

  onSelectGoodsItem(e) {
    let cartIdSelectedResult = e.detail
    this.setData({
      cartIdSelectedResult,
    })
  },

  changeEditMode(e) {
    let editMode = !this.data.editMode
    this.setData({
      editMode
    })
  },

  onSelectAll(e) {
    let allIsSelected = e.detail
    let cartIdSelectedResult = []
    //let cartIdSelectedResult = this.data.cartIdSelectedResult
    //cartIdSelectedResult.length = 0

    // 全选，将所有checkbox name塞入cartIdSelectedResult
    if (allIsSelected) {
      cartIdSelectedResult.push("1")
      cartIdSelectedResult.push("2")
    }

    this.setData({
      allIsSelected,
      cartIdSelectedResult
    })
  },

  async onCartGoodsNumChanged(e) {
    let cartGoodsId = e.currentTarget.dataset.id
    // 自定义数据中的num，是修改之前的数据
    let oldNum = parseInt(e.currentTarget.dataset.num)
    console.log('e.detail', typeof e.detail, cartGoodsId, oldNum)
    // e.detail是修改之后的数据，已经是数值类型，只有e.currentTarget.dataset中传递的自定义类型都是字符串，有可能需要转类型
    let num = e.detail
    let data = {num}

    let res = await wxp.request_with_login({
      url: util.ipAddress + `/user/my/carts/${cartGoodsId}`,
      method: 'put',
      data
    })

    if (res.data.msg == 'ok') {
      wx.showToast({
        title: num > oldNum ? '增加成功' : '减少成功',
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 拉取购物车数据
    let res = await wxp.request_with_login({
      url: util.ipAddress + `/user/my/cart`
    })
    if (res.data.msg == "ok") {
      let carts = res.data.data
      this.setData({
        carts
      })
    }
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