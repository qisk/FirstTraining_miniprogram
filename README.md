  ## 工程配置
  ### 在app.json中加入如下语句，即可切换为支持自定义tabBar。
  ```
  "tabBar": {
    "custom":true,
    "list": [
      {
        "pagePath": "pages/vant-test/index",
        "iconPath": "custom-tab-bar/tab-bar/component.png",
        "selectedIconPath": "custom-tab-bar/tab-bar/component-on.png",
        "text": "首页"
      },
      {
        "pagePath": "pages/extend-page/index",
        "iconPath": "custom-tab-bar/tab-bar/component.png",
        "selectedIconPath": "custom-tab-bar/tab-bar/component-on.png",
        "text": "第二页"
      },
      {
        "pagePath": "pages/request-login-test/index",
        "iconPath": "custom-tab-bar/tab-bar/component.png",
        "selectedIconPath": "custom-tab-bar/tab-bar/component-on.png",
        "text": "第三页"
      }
    ]
  }
  ```
