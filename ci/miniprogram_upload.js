const ci = require('miniprogram-ci')

let { version: version, description: desc } = require('../package.json')

if (!version) version = 'v1.0.0'
if (!desc) desc = new Date() + '上传'

// 用于将代码上传，可以在小程序管理后台——版本管理中进行设置
const project = new ci.Project({
    appid: 'wxbdb0ec541c32f104',
    type: 'miniProgram',
    projectPath: '../',
    privateKeyPath: '/var/jenkins_home/secrets/miniprogram_upload_key/private.wxbdb0ec541c32f104.key',
    ignores: ['node_modules/**/*'],
  })

ci.upload({
    project,
    version,
    desc,
    setting: {
      es6: true,
      minify: true,
      autoPrefixWXSS: true,
    },
  }).then(res => {
    console.log("success res:", res)
    console.log('上传成功')
    process.exit(0)
  }).catch(error => {
    if (error.errCode == -1) {
      console.log("error", error)
      console.log('上传成功')
    }
    console.log("error:", error)
    console.log('上传失败')
    process.exit(-1)
  })