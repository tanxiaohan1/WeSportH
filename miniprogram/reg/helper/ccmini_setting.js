  /**
   * Notes: 配置文件
   * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
   * Date: 2021-07-14 07:48:00 
   */
  module.exports = {
  	PROJECT_MARK: 'reg',
  	PROJECT_COLOR: '#AE0B2A',
  	PROJECT_SWITCH: ['index_home', 'user_index', 'my_index', 'news_index', 'reg_step1'],
  	PROJECT_IS_SUB: false, // 分包
  	PROJECT_NAME: '校友登记系统',
  	PROJECT_VER: 'CCReg-Client(V1.0 Build20210807)', //升级必须，请勿修改
  	PROJECT_NEWS_CATE: '公告通知',

  	TEST_MODE: false,

  	TEST_OPEN_PAGES: true,

  	TEST_USER_ID: 'oYyk-minzonetech',
  	TEST_TOKEN: {
  		id: 'minzonetech',
  		name: '明章科技',
  		pic: '',
  		status: 1,
  		type: 1
  	},


  	IMG_UPLOAD_SIZE: 4, //图片上传大小M兆  

  	PASSPORT_TOKEN_EXPIRE: 86400,

  	ADMIN_TOKEN_EXPIRE: 3600 * 2,

  	CACHE_IS_LIST: true,
  	CACHE_LIST_TIME: 60 * 30,

  	USER_PIC_DIR: 'client/user/pic/', //用户头像图片目录 

  	INFO_PIC_DIR: 'client/info/pic/', //互助图片目录
  	INFO_MAX_EXPIRE: 86400 * 60, //互助有效期 秒
  	INFO_DEFAULT_REGION: ['广东省', '广州市', '越秀区'], //默认区域
  	INFO_MAX_PIC: 8, //互助图片上限

  	MEET_PIC_DIR: 'client/info/pic/', //活动图片目录 
  	MEET_DEFAULT_REGION: ['广东省', '广州市', '越秀区'], //默认区域
  	MEET_MAX_PIC: 8, //活动图片上限

  	ALBUM_PIC_DIR: 'client/album/pic/', //活动图片目录 
  	ALBUM_MAX_PIC: 8, //活动图片上限 

  	NEWS_PIC_DIR: 'client/news/pic/', //公告通知图片目录 
  	NEWS_MAX_PIC: 8, //公告通知图片上限 

  	CACHE_SETUP: 3600 * 1,

  }