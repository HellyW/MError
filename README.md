
### 配置域名

> 打开微信小程序后台 , 配置下方域名为合法域名
> 

```https://push.hellyw.com```

![](https://mmbiz.qpic.cn/mmbiz_png/icWtmsIaSA69ibd71LIw9X2wsaNLXLAxlQOpQfJA94bpl97holPE1JkjfTO82VKic3iaBqXR0nJLmWPibebFMuK8YRQ/0?wx_fmt)

 需要借助iGot聚合推送实现错误消息的即时送达
 
 ### 引入js文件
 
[点击下载](./src/MError.js)

**为方便接入，建议更名为`MError.js`文件**

### 部署代码

> 在 `app.json` 中引入该js文件 
>

```
const MError = require('/utils/MError')
```

> ~~在`onLaunch`内加入如下代码，`key`更换为您自己的key~~
> 在`app.js`的`App({})`内加入如下代码，`key`更换为您自己的key
> **建议使用临时key，如需项目组多人接收，建议使用不公开的订阅链接key。获取方式：https://support.qq.com/products/111465/faqs/58267**
> 

```
~~!this.mError && ( this.mError = new MError(key,'推送标题') )~~
$mError: new MError(key,'推送标题')
```

> 在需要输出错误日志的地方也可以通过`app.$mError.log(error)`的方式标记

### 效果

至此，就已经成功实现了 。   来看看效果吧！！！
![ ](https://mmbiz.qpic.cn/mmbiz_jpg/icWtmsIaSA69ibd71LIw9X2wsaNLXLAxlQ3iamJwvZ0ckUUEM6n3wfSF86qwNHwAXoKibUMSBXDIt8ycYC7xrQ46hA/0?wx_fmt=jpeg)

手机端成功接收。


