// pages/cart/index.js
const { default: wxp } = require("../../lib/wxp")
const util = require("../../utils/util.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoginPanel:false,
    cartIdSelectedResult:[],
    allIsSelected:false,
    editMode:false,
    carts:[],
    totalPrice: 0
  },

  onSelectGoodsItem(e) {
    let cartIdSelectedResult = e.detail
    this.setData({
      cartIdSelectedResult,
    })
    this.calcTotalPrice()
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
      let carts = this.data.carts
      for (let j=0; j<carts.length; j++) {
        // 必须推入一个字符串类型的id
        cartIdSelectedResult.push(`${carts[j].id}`)
      } 
    }

    this.setData({
      allIsSelected,
      cartIdSelectedResult
    })

    this.calcTotalPrice()
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

      // 这里需要改变carts数组中实际的商品数量
      let carts = this.data.carts
      carts.some(item=>{
        if (item.id == cartGoodsId) {
          // item是carts中元素的引用，修改item的值，实际就修改了carts中的元素值
          item.num = num
          return true
        }
        return false
      })
      this.setData({
        carts
      })
    }

    this.calcTotalPrice()
  },

  removeCartGoods: async function(e) {
    // ids是一个数组，表示选择的集合
    let ids = this.data.cartIdSelectedResult
    if (ids.length == 0) {
      wx.showToast({
        title: '没有选择商品',
        showCancel: false
      })
      return
    }

    console.log('ids:', ids)

    let data = {ids}
    let res = await wxp.request_with_login({
      url: util.ipAddress + `/user/my/carts`,
      method: 'delete',
      data
    })

    if (res.data.msg == 'ok') {
      let carts = this.data.carts
      for (let j=0; j<ids.length; j++) {
        let id = ids[j]
        // 从carts中依次取出数据
        carts.some((item, index)=>{
          if (item.id == id) {
            carts.splice(index, 1)
            return true
          }
          return false
        })
      }
      this.setData({
        carts
      })
    }
  },

  onSubmit(e) {
    let ids = this.data.cartIdSelectedResult
    if (ids.length == 0) {
      wx.showToast({
        title: '还未选择商品',
        showCancel: false
      })
      return
    }

    // 从ids中获取商品数据信息，放置到cartData数组中
    let cartData = []
    let carts = this.data.carts
    ids.forEach(id=>{
      carts.some(item=>{
        if (item.id == id) {
          cartData.push( Object.assign({}, item))
          return true
        }
        return false
      })
    })

    // 向跳转页面发送数据
    wx.navigateTo({
      url: '/pages/confirm-order/index',
      success:res=>{
        res.eventChannel.emit('cartData', {data:cartData, totalPrice:this.data.totalPrice})
      }
    })
  },

  // 计算选择的商品总价
  calcTotalPrice() {
    let totalPrice = 0
    let carts = this.data.carts
    let ids = this.data.cartIdSelectedResult

    // 计算已选择商品的总价格
    ids.forEach(id=>{
      carts.some(item=>{
        if (item.id == id) {
          totalPrice += item.price * item.num
          return true
        }
        return false
      })
    })

    this.setData({
      totalPrice
    })
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
  onShow: async function () {
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