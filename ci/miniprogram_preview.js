const ci = require('miniprogram-ci')

// 用于预览，可以在官方微信小程序“小程序助手”——版本查看——开发版列表中查看该版本
const project = new ci.Project({
    appid: 'wxbdb0ec541c32f104',
    type: 'miniProgram',
    projectPath: '../',
    privateKeyPath: '/var/jenkins_home/secrets/miniprogram_upload_key/private.wxbdb0ec541c32f104.key',
    ignores: ['node_modules/**/*'],
  })
  
  ci.preview({
    project,
    desc: 'dev preview', // 此备注将显示在“小程序助手”（是一个官方微信小程序），版本查看——开发版列表中
    setting: {
      es6: true,
      minify: true,
      autoPrefixWXSS: true,
    },
    qrcodeFormat: 'image',
    qrcodeOutputDest: process.cwd() + '/qrcode/file/destination.jpg',
    onProgressUpdate: console.log,
    // pagePath: 'pages/index/index', // 预览页面
    // searchQuery: 'a=1&b=2',  // 预览参数 [注意!]这里的`&`字符在命令行中应写成转义字符`\&`
  }).then(res => {
    console.log("success res:", res)
    console.log('预览成功')
    process.exit(0)
  }).catch(error => {
    if (error.errCode == -1) {
      console.log("error:", error)
      console.log('预览成功')
    }
    console.log("error:", error)
    console.log('预览失败')
    process.exit(-1)
  })
