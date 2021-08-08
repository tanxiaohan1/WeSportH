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
 * Notes: 系统管理员实体
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-10-16 19:20:00
 * Version : CCMiniCloud Framework Ver 2.0.1 ALL RIGHTS RESERVED BY 明章科技
 */


const BaseModel = require('./base_ccmini_model.js');

class AdminModel extends BaseModel {

}

// 集合名
AdminModel.CL = "admin";

AdminModel.CCMINI_DB_STRUCTURE = {
	ADMIN_ID: 'string|true',
	ADMIN_NAME: 'string|true',
	ADMIN_PHONE: 'string|true|comment=登录电话',
	ADMIN_STATUS: 'int|true|default=1|comment=状态：0=禁用 1=启用',

	ADMIN_LOGIN_CNT: 'int|true|default=0|comment=', 
	ADMIN_LOGIN_TIME: 'int|true|default=0|comment=',
	ADMIN_TYPE: 'int|true|default=1|comment=类型', 

	ADMIN_TOKEN :'string|false|comment=', 
	ADMIN_TOKEN_TIME :'int|true|default=0|comment=', 

	ADMIN_ADD_TIME: 'int|true',
	ADMIN_EDIT_TIME: 'int|true', 
	ADMIN_ADD_IP: 'string|false',
	ADMIN_EDIT_IP: 'string|false',
};

// 字段前缀
AdminModel.CCMINI_FIELD_PREFIX = "ADMIN_";

  

module.exports = AdminModel;