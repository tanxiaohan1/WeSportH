// +----------------------------------------------------------------------
// | CCMiniCloud [ Cloud Framework ]
// +----------------------------------------------------------------------
// | Copyright (c) 2021 www.code942.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: 明章科技
// +----------------------------------------------------------------------
 
/**
 * Notes: 用户实体
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-10-14 19:20:00
 * Version : CCMiniCloud Framework Ver 2.0.1 ALL RIGHTS RESERVED BY 明章科技
 */


const BaseCCMiniModel = require('./base_ccmini_model.js');
class UserModel extends BaseCCMiniModel {}

// 集合名
UserModel.CL = "user";

UserModel.CCMINI_DB_STRUCTURE = {
	USER_ID: 'string|true',

	USER_NAME: 'string|true|comment=用户姓名',
	USER_PIC: 'string|true|comment=', 

	USER_PHONE_CHECKED: 'string|true|comment=', 

	USER_MINI_OPENID: 'string|true|comment=',  

	USER_STATUS: 'int|true|default=1|comment=', 

	USER_ITEM: 'string|true|comment=',
	USER_SEX: 'int|true|default=1|comment=',
	USER_BIRTH: 'string|true|comment=', 
  
	USER_MOBILE: 'string|false|comment=',
	USER_WECHAT: 'string|false|comment=',
	USER_QQ: 'string|false|comment=',
	USER_EMAIL: 'string|false',

	USER_ENROLL: 'int|true|default=0|comment=',
	USER_GRAD: 'int|true|default=0|comment=',
	USER_EDU: 'string|true|comment=',

	USER_COMPANY: 'string|false|comment=', 
	USER_COMPANY_DUTY: 'string|false|comment=',
	USER_TRADE: 'string|false|comment=',
	USER_CITY: 'string|false|comment=', 

	USER_DESC: 'string|false|comment=',
	USER_RESOURCE: 'string|false|comment=',
 
	USER_INVITE_CNT: 'int|true|default=0|comment=',
	USER_VIEW_CNT: 'int|true|default=0|comment=',
	USER_ALBUM_CNT: 'int|true|default=0|comment=',
	USER_INFO_CNT: 'int|true|default=0|comment=',
	USER_MEET_CNT: 'int|true|default=0|comment=',
	USER_MEET_JOIN_CNT: 'int|true|default=0|comment=',

	USER_WX_GENDER: 'int|true|default=0|comment=微信性别 0=未定义,1=男,2=女',
	USER_WX_AVATAR_URL: 'string|false|comment=',
	USER_WX_NICKNAME: 'string|false|comment=',
	USER_WX_LANGUAGE: 'string|false|comment=',
	USER_WX_CITY: 'string|false|comment=',
	USER_WX_PROVINCE: 'string|false|comment=',
	USER_WX_COUNTRY: 'string|false|comment=',
	USER_WX_UPDATE_TIME: 'int|false|comment=',
  
	USER_LOGIN_CNT: 'int|true|default=0|comment=',
	USER_LOGIN_TIME: 'int|false|comment=',

	USER_ADD_TIME: 'int|true',
	USER_ADD_IP: 'string|false',

	USER_EDIT_TIME: 'int|true',
	USER_EDIT_IP: 'string|false',
}

// 字段前缀
UserModel.CCMINI_FIELD_PREFIX = "USER_";

/**
 * 状态 0=待审核,1=正常,8=VIP,9=禁用,10=已删除
 */
UserModel.STATUS = {
	UNUSE: 0,
	COMM: 1,
	VIP: 8,
	PEDDING: 9,
	DEL: 10
};

UserModel.STATUS_DESC = {
	UNUSE: '待审核',
	COMM: '正常',
	VIP: 'VIP',
	PEDDING: '禁用',
	DEL: '已删除'
};



module.exports = UserModel;