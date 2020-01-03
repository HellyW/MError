/* 

  v1.0.0

  * 推送提醒：

    服务依赖iGot小程序， 微信搜索“iGot”体验

    key的获取方式请参照：https://support.qq.com/products/111465/faqs/58267

    iGot桌面客户端 [windows && mac] 下载 ： https://github.com/wahao/Electron-iGot

  * 微信实时日志：

    开发者可从小程序管理后台“开发->运维中心->实时日志”进入日志查询页面，查看开发者打印的日志信息。


*/

// 日志实时管理- 方便排查
const realtimeLogManager = wx.getRealtimeLogManager ? wx.getRealtimeLogManager() : null
// 获取当前小程序的账户信息
const accountInfo = wx.getAccountInfoSync ? wx.getAccountInfoSync() : {};
// 获取当前系统信息
const systemInfo = wx.getSystemInfoSync ? wx.getSystemInfoSync() : {};
// 获取启动信息
const launchOptions = wx.getLaunchOptionsSync ? wx.getLaunchOptionsSync() : {};
// 请求地址


module.exports = class MError {
  constructor(key = "", title) {
    try {
      this.title = title || (accountInfo.miniProgram ? `${accountInfo.miniProgram.appId}` : `${accountInfo.plugin.appId }(${accountInfo.plugin && accountInfo.plugin.version || ""}) `) || "小程序"
      this.key = key || ""
      this.host = `https://push.hellyw.com/${this.key}`
      let self = this
      wx.onError((error) => {
        self.log(error)
      })
    } catch (err) {
      console.error(err)
    }
  }
  uploadLog(obj) {
    let self = this
    try {
      console.error(obj)
      realtimeLogManager && realtimeLogManager.error(obj)
      wx.request({
        url: self.host,
        header: {
          "content-typ": "application/json"
        },
        method: "POST",
        data: obj
      })
    } catch (err) {
      console.error(err)
    }
  }
  _getUserInfo() {
    return new Promise((resolve, reject) => {
      try {
        wx.getUserInfo({
          complete: (res) => {
            resolve(res.userInfo || {})
          }
        })
      } catch (err) {
        resolve({})
      }
    })
  }
  _getLocation() {
    return new Promise((resolve, reject) => {
      try {
        wx.getLocation({
          complete: (res) => {
            resolve(res || {})
          }
        })
      } catch (err) {
        resolve({})
      }
    })
  }
  getUser() {
    // 读取设置 - 已被允许的权限 尽可能获取
    let self = this
    return new Promise((resolve, reject) => {
      try {
        wx.getSetting({
          complete: async res => {
            try {
              if (!res.authSetting || (!res.authSetting['scope.userInfo'] && !res.authSetting['scope.userLocation'])) return resolve({})
              resolve({
                userInfo: res.authSetting['scope.userInfo'] ? await self._getUserInfo() : {},
                location: res.authSetting['scope.userLocation'] ? await self._getLocation() : {},
              })
            } catch (err) {
              resolve({})
            }
          }
        })
      } catch (err) {
        resolve({})
      }
    })
  }
  log(error) {
    try {
      let params = {
        title: this.title,
        content: `${typeof error !== 'object' ? error : '当前程序出现一个错误，请及时关注'} [更详细的错误参数可进入“iGot”小程序内查看]`,
        error: typeof error === 'object' ? error : '错误日志已打印。更多细节，请通过微信后台【“开发->运维中心->实时日志”】查看',
        extras: Object.assign({}, {
          accountInfo: accountInfo,
          systemInfo: systemInfo,
          launchOptions: launchOptions,
          storageInfo: wx.getStorageInfoSync ? wx.getStorageInfoSync() : {}
        })
      }
      this.getUser().then(userInfo => {
        params.extras = Object.assign({}, params.extras, {
          user: userInfo
        })
        this.uploadLog(params)
      })
    } catch (err) {
      console.error(err)
    }

  }
}