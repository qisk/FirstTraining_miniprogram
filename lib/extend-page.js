const extendPage = Page => {
  return object => {
    // 属性
    if (!object.data) object.data = {}
    object.data.extend_showLoginPanel = false 
    object.data.extend_name = "swordman"

    // 方法
    object.hi = function(name){
      console.log(`hi ${name}`);
    }

    return Page(object)
  }
}

const originalPage = Page
Page = extendPage(originalPage)
