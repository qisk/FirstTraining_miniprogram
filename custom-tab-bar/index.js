Component({
  data: {
    selected: 0,
    color: "#7A7E83",
    selectedColor: "#3cc51f",
    list: [{
      pagePath: "/pages/map-setting/index",
      iconPath: "/custom-tab-bar/tab-bar/component.png",
      selectedIconPath: "/custom-tab-bar//tab-bar/component-on.png",
      text: "",
      iconClass: "icon-homefill",
      iconTopClass: ""
    }, {
      pagePath: "/pages/map-tracing/index",
      iconPath: "/custom-tab-bar/tab-bar/component.png",
      selectedIconPath: "/custom-tab-bar/tab-bar/component-on.png",
      text: "index",
      iconClass: "cu-btn icon-add bg-green shadow",
      iconTopClass: "add-action"
    }, {
      pagePath: "/pages/request-login-test/index",
      iconPath: "/custom-tab-bar/tab-bar/component.png",
      selectedIconPath: "/custom-tab-bar/tab-bar/component-on.png",
      text: "request",
      iconClass: "icon-my",
      iconTopClass: ""
    }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({ url })
      this.setData({
        selected: data.index
      })
    }
  }
})