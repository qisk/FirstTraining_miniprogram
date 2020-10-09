// pages/cart/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartIdSelectedResult:[],
    allIsSelected:false,
    editMode:false
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