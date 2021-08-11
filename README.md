
# 项目介绍


- 但是由于年代久远，学校又经历了多次合并发展，有些校友毕业后流动等原因，目前还有很多校友的信息校友分会没有掌握，这极大地影响了校友分会向更多的校友提供母校发展的最新信息并提供更为贴心的服务，

- 有鉴于此，校友会决定开展校友信息登记工作。这次信息登记。
- 各位校友所登记的信息也将仅用于校友相关事宜，不会被用于商业用途，亦不用担心信息外泄等。

- 同时，恳请各位向同班、同届和认识的其他校友广为推介这次校友信息登记活动，让更多的校友加入校友会这个大家庭。 

# 功能说明
![输入图片说明](https://images.gitee.com/uploads/images/2021/0811/232035_9d7ddf06_9240987.gif "func导图1 (2).gif")

### 特色特点
 
- 简约：不臃肿，主打内容极简，功能简洁直击痛点
- 安全：保护校友的信息安全，隐私内容仅后台管理员后可见。
- 方便：上传自己的个人信息，方便在需要时取得联系。小程序无需下载APP随用随走。


# 技术运用

- 项目使用微信小程序平台进行开发。
- 使用腾讯云开发技术，免费资源配额，	无需域名和服务器即可搭建。
- 小程序本身的即用即走，适合小工具的使用场景，也适合程序的开发。

# 项目效果截图
![输入图片说明](https://images.gitee.com/uploads/images/2021/0811/232056_48f31e74_9240987.png "微信图片_20210811225606.png")
![输入图片说明](https://images.gitee.com/uploads/images/2021/0811/232105_d1d7cd20_9240987.png "微信图片_20210811225626.png")
![输入图片说明](https://images.gitee.com/uploads/images/2021/0811/232116_f278b8af_9240987.png "微信图片_20210811225643.png")
![输入图片说明](https://images.gitee.com/uploads/images/2021/0811/232126_88c21bfc_9240987.png "微信图片_20210811225640.png")  
![输入图片说明](https://images.gitee.com/uploads/images/2021/0811/232134_3e5b1cae_9240987.png "微信图片_20210811225638.png")
 ![输入图片说明](https://images.gitee.com/uploads/images/2021/0811/232229_a44d6e86_9240987.png "微信图片_20210811225638.png")

# 项目后台截图
![输入图片说明](https://images.gitee.com/uploads/images/2021/0811/232238_78252824_9240987.png "微信图片_20210811225702.png")
![输入图片说明](https://images.gitee.com/uploads/images/2021/0811/232256_945dfdc7_9240987.png "微信图片_20210811225629.png")
![输入图片说明](https://images.gitee.com/uploads/images/2021/0811/232308_24f19ffc_9240987.png "微信图片_20210811225632.png")

# 部署教程：

### 1 源码导入微信开发者工具
![输入图片说明](https://images.gitee.com/uploads/images/2021/0811/232342_af110aec_9240987.png "导入.png")
  

 

### 2 开通云开发环境
 -  参考微信官方文档：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html
- 在使用云开发能力之前，需要先开通云开发。 
- 在开发者工具的工具栏左侧，点击 “云开发” 按钮即可打开云控制台，根据提示开通云开发，并且创建一个新的云开发环境。
![输入图片说明](https://images.gitee.com/uploads/images/2021/0811/232537_8a27b61c_9240987.png "云开发开通环境.png")
- 每个环境相互隔离，拥有唯一的环境 ID(拷贝此ID，后面配置用到)，包含独立的数据库实例、存储空间、云函数配置等资源；
 

#### 3 云函数及配置
- 本项目使用到了一个云函数reg_cloud
![输入图片说明](https://images.gitee.com/uploads/images/2021/0811/232556_f00b3f17_9240987.png "云函数出示0.png")


- 在云函数cloudfunctions文件夹下选择云函数reg_cloud , 右键选择在终端中打开,然后执行 
- npm install –product
![输入图片说明](https://images.gitee.com/uploads/images/2021/0811/232701_836c8850_9240987.png "云函数初始化1.png") 

![输入图片说明](https://images.gitee.com/uploads/images/2021/0811/232711_58121526_9240987.png "云函数初始化.png")


 

- 打开cloudfunctions/reg_cloud/comm/ccmini_config.js文件，配置环境ID和后台管理员手机号码

 ![输入图片说明](https://images.gitee.com/uploads/images/2021/0811/232806_b0477e47_9240987.png "云函数配置.png")


 


#### 4  客户端配置
- 打开miniprogram/app.js文件，配置环境ID

 ![输入图片说明](https://images.gitee.com/uploads/images/2021/0811/232832_6053aae0_9240987.png "客户端配置.png")


#### 5  云函数配置
- 在微信开发者工具-》云开发-》云函数-》对指定的函数添加环境变量 
- [服务端时间时区TZ] =>Asia/Shanghai
- [函数内存] =>128M   
- [函数超时时间] => 20秒
![输入图片说明](https://images.gitee.com/uploads/images/2021/0811/233416_4497ac7b_9240987.png "云函数配置参数.png")

 

#### 6  设置图片域名信任关系
- 进入小程序 开发管理=》开发设置=》服务器域名 =》downloadFile合法域名	
- 添加2个域名：
- 1）你的云存储域名，格式类似：https://1234-test-pi5po-1250248.tcb.qcloud.la
- 2）微信头像域名：https://thirdwx.qlogo.cn 
![输入图片说明](https://images.gitee.com/uploads/images/2021/0811/233716_fccfac0e_9240987.png "业务域名.png")

#### 7  上传云函数&指定云环境ID
![输入图片说明](https://images.gitee.com/uploads/images/2021/0811/235027_bcc3d94b_9240987.png "上传.png")

### 至此完全部署配置完毕。

### 在线演示：
 
![输入图片说明](https://images.gitee.com/uploads/images/2021/0811/233918_96b29222_9240987.jpeg "Free版-QR.jpg")
 


### 如有疑问，欢迎骚扰联系我鸭： 
### 俺的微信:  cclinux0730


