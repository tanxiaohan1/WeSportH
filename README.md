
### 项目介绍


但是由于年代久远，学校又经历了多次合并发展，有些校友毕业后流动等原因，
目前还有很多校友的信息校友分会没有掌握，这极大地影响了校友分会向更多的
校友提供母校发展的最新信息并提供更为贴心的服务，

有鉴于此，校友会决定开展校友信息登记工作。这次信息登记。
各位校友所登记的信息也将仅用于校友相关事宜，不会被用于商业用途，亦不用担心信息外泄等。

同时，恳请各位向同班、同届和认识的其他校友广为推介这次校友信息登记活动，让更多的校友加入校友会这个大家庭。谢谢！

### 功能说明


### 特色特点
 
简约：不臃肿，主打内容极简，功能简洁直击痛点
安全：保护校友的信息安全，隐私内容仅后台管理员后可见。
方便：上传自己的个人信息，方便在需要时取得联系。小程序无需下载APP随用随走。


### 技术运用

项目使用微信小程序平台进行开发。
使用腾讯云开发技术，免费资源配额，	无需域名和服务器即可搭建。
小程序本身的即用即走，适合小工具的使用场景，也适合程序的开发。

### 项目效果截图

 

      

### 部署教程：

#### 1 源码解压
 

#### 2 在微信小程序开发工具中导入 解压后的文件夹
![输入图片说明](https://images.gitee.com/uploads/images/2020/1122/060102_2f8d8f02_1810934.png "导入.png")


 

#### 3 开通云开发环境
  参考微信官方文档：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html

 

#### 5 云函数及配置
本项目使用到了一个云函数reg_cloud
在云函数cloudfunctions文件夹下选择云函数reg_cloud , 右键选择在终端中打开,然后执行 
npm install –product

![输入图片说明](https://images.gitee.com/uploads/images/2020/1122/060144_cb89de4a_1810934.png "云函数.png")



 

打开cloudfunctions/cloud/comm/config.js文件，配置环境ID

![输入图片说明](https://images.gitee.com/uploads/images/2020/1122/060154_ea7c36a1_1810934.png "云函数配置.png")


 


#### 6  客户端配置
打开miniprogram/helper/setting.js文件，配置环境ID

![输入图片说明](https://images.gitee.com/uploads/images/2020/1122/060203_71503106_1810934.png "客户端配置.png")


#### 7  内容安全
  腾讯对小程序有严格的审核机制，每个小程序都要接入内容安全校验，

打开https://developers.weixin.qq.com/community/servicemarket/detail/000a246b6fca70b76a896e6a25ec15 页面，点击购买（实际免费）

![输入图片说明](https://images.gitee.com/uploads/images/2020/1122/060221_e5bc208f_1810934.png "内容安全.png")
 



至此完全配置完毕。

#### 在线演示：
 ![输入图片说明](https://images.gitee.com/uploads/images/2021/0719/100637_5429f9d1_9240987.jpeg "ccplat-小程序QR.jpg")

 


#### 如有疑问，欢迎骚扰联系我鸭： 
#### 俺的微信:  cclinux0730


