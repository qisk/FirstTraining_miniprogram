// pages/goods/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsId:0,
    goodsData:{}, // res.data是一个json字符串，所以用{}定义
    goodsImages: [], // goodsImages是一个数组，所以用[]定义
    showSkuPanel: false, // 商品规格选择面板
    goodsContentInfo:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options.goodsId,就是前面navigateTo中url传递的参数
    this.data.goodsId = options.goodsId
    // 接收goodsData事件，将商品数据设置到页面上
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('goodsData', (res)=> {
      console.log("goods page onLoad:", res)
      // 过滤出
      let goodsImages = res.data.goods_infos.filter(item=>(item.kind == 0))
      // 获取第0条商品描述信息
      let goodsContentInfo = res.data.goods_infos.filter(item=>(item.kind == 1))[0]

      this.setData({
        goodsData:res.data,
        goodsImages,
        goodsContentInfo
      })
    })
  },


  showSkuPanelPopup() {
    this.setData({showSkuPanel:true})
  },


  onCloseSkuPanel() {
    this.setData({showSkuPanel:false})
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