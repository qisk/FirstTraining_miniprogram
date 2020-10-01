const { default: wxp } = require("../../lib/wxp")

Page({
  data: {
    vtabs: [],
    activeTab: 0,
    showLoginPanel: false,
    goodsListMap: {},
    lastIndexForLoadMore:-1, // 记录当前左边类别的索引位置
    _heightRecords:-1, // 记录当前的记录的总高度，过滤重复的scrolltoindexlower事件
    loading: true, // 开启骨架屏标示
  },

  onLoad() {
    wx.showLoading({
      title: '加载中...',
    })

    let that = this
    setTimeout(async function(){
      let categoriesData = await wxp.request_with_login({
        url: 'http://192.168.31.115:3000/goods/categories',
      })
      if (categoriesData) {
        // 注意，拿到categories要用两个data才能拿到
        categoriesData = categoriesData.data.data;
      }
      console.log(categoriesData);
  
      // const titles = ['热搜推荐', '手机数码', '家用电器',
      //   '生鲜果蔬', '酒水饮料', '生活美食', 
      //   '美妆护肤', '个护清洁', '女装内衣', 
      //   '男装内衣', '鞋靴箱包', '运动户外', 
      //   '生活充值', '母婴童装', '玩具乐器', 
      //   '家居建材', '计生情趣', '医药保健', 
      //   '时尚钟表', '珠宝饰品', '礼品鲜花', 
      //   '图书音像', '房产', '电脑办公']
  
      /*
      // 这种方式，会造成vtabs跳转位置不对，详见 http://localhost:88/web/#/page/edit/70/1717
      const vtabs = categoriesData.map(item => {
        this.getGoodsListByCategory(item.id)
        return ({title: item.category_name, id: item.id})
      })
  
      this.setData({vtabs})
      */
  
      let vtabs = []
      for (let j = 0; j < categoriesData.length; j++) {
        let item = categoriesData[j]
        // 仅加载前三个类别的商品
        if (j<3) that.getGoodsListByCategory(item.id, j)
        // await this.getGoodsListByCategory(item.id)
        vtabs.push({ title: item.category_name, id: item.id })
      } 
      that.setData({ 
        vtabs,
        loading: false 
      })
      wx.hideLoading()
  
      that.setData({ test: 111 })
      console.log("this.data.test:", that.data.test)  
    }, 2000)
  },

  onTabClick(e) {
    const index = e.detail.index
    console.log('tabClick', index)
    this.onCategoryChanged(index)
  },

  onChange(e) {
    const index = e.detail.index
    console.log('change', index)
    this.onCategoryChanged(index)
  },

  onCategoryChanged(index){
    let cate = this.data.vtabs[index]
    let categoryId = cate.id
    // 如果该类比为空，才调用getGoodsListByCategory进行加载
    if (!this.data.goodsListMap[categoryId]){
      this.getGoodsListByCategory(categoryId,index)
    }
  },

  onScrollToIndexLower(e){
    console.log("scroll to index lower",e.detail, "lastIndexForLoadMore:", this.data.lastIndexForLoadMore)
    let index = e.detail.index
    let _heightRecords = e.detail._heightRecords
    // 这是一个多发事件
    // 判断当前类别索引是否改变，如果改变则重新获取商品信息
    // 如果这样写，只能动态加载一次，当第二次滑倒内容边缘时，index和lastIndexForLoadMore均未被改变，就无法触发再次加载。
    if ( (index != this.data.lastIndexForLoadMore) || (_heightRecords != this.data._heightRecords)) {
      console.log("************** exec getGoodsListByCategory *************")
      let cate = this.data.vtabs[index]
      let categoryId = cate.id
      this.getGoodsListByCategory(categoryId,index, true)
      this.data.lastIndexForLoadMore = index
      this.data._heightRecords = _heightRecords 
    }
  },

  // 重新计算高度
  reClacChildHeight(index) {
    // 获取vtabs组件，调用扩展函数calcChildHeight
    const goodsContent = this.selectComponent(`#goods-content${index}`)
    console.log(goodsContent);

    const categoryVtabs = this.selectComponent('#category-vtabs')
    categoryVtabs.calcChildHeight(goodsContent)
    //console.log("categoryVtabs.hello:", categoryVtabs.hello(100))
  },

  /* 4.17实现：根据类别获取商品列表，未实现分类加载，仅加载第一页的前20跳数据
  async getGoodsListByCategory(categoryId, index) {
    let goodsData = await wxp.request_with_login({
      url: `http://192.168.31.115:3000/goods/goods?page_index=1&page_size=20&category_id=${categoryId}`,
    })
    if (goodsData) {
      goodsData = goodsData.data.data.rows;
    }

    console.log("before setData categoryId=", categoryId, ",", this.data.goodsListMap[categoryId]);

    this.setData({
      [`goodsListMap[${categoryId}]`]: goodsData
    })

    console.log("after setData categoryId=", categoryId, ",", this.data.goodsListMap[categoryId]);

    // qisk：这一句可以去掉，setData会自动更新
    //this.data.goodsListMap[categoryId] = goodsData

    // 重新计算右侧的高度
    this.reClacChildHeight(index)
  }
  */

  // 实现分类加载
  // categoryId：类别id
  // index：类别在vtabs左侧的索引值
  // loadNextPage：是否需要加载下一页（默认不加载）
  async getGoodsListByCategory(categoryId, index, loadNextPage = false) {
    console.log(categoryId, index, loadNextPage);

    const pageSize = 5
    let pageIndex = 1

    // 将当前加载的商品数据，赋值给listMap
    let listMap = this.data.goodsListMap[categoryId]
    console.log("init listMap:", listMap);

    if (listMap) {
      console.log(listMap.count);

      // 加载完了，就不要重复加载了
      // listMap通过服务端接口获取，指的是每个类别的商品总数量
      if (listMap.rows.length >= listMap.count) {
        console.log("*********** all data load completly! ***********")
        return
      }
      if (listMap.pageIndex) {
        pageIndex = listMap.pageIndex
        // 如果loadNextPage为false，仅加载当前页面的数据，
        // 目前的代码场景，走到这里loadNextPage都是true，不会是false
        if (loadNextPage) {
          pageIndex++
        } else {
          console.log("******** process loadNextPage==false, index:", pageIndex);
        }
      }
    }
    let goodsData = await wxp.request_with_login({
      url: `http://192.168.31.115:3000/goods/goods?page_index=${pageIndex}&page_size=${pageSize}&category_id=${categoryId}`,
    })
    if (goodsData) {
      goodsData = goodsData.data.data;
    }
    console.log(categoryId, index, loadNextPage, goodsData, goodsData.count);
    if (listMap) {
      listMap.pageIndex = pageIndex
      listMap.count = goodsData.count
      listMap.rows.push(...goodsData.rows)
      console.log("get response data listMap:", listMap);

      // 这里扩展了goodsListMap，加入了如下内容：
      // goodsListMap[${categoryId}].pageIndex:当前已加载的商品pageIndex
      // goodsListMap[${categoryId}].count:当前类别的商品总数量；
      // goodsListMap[${categoryId}].rows:当前已加载的商品数据。
      this.setData({
        [`goodsListMap[${categoryId}]`]: listMap
      })
    } else {
      // 当第一次加载该类别数据时，还没有listMap，直接将数据赋给goodsListMap
      console.log("listMap is null");
      goodsData.pageIndex = pageIndex
      this.setData({
        [`goodsListMap[${categoryId}]`]: goodsData
      })
    }

    // this.data.goodsListMap[categoryId] = goodsData
    this.reClacChildHeight(index)
  }
})
