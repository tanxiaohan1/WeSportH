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
 * Notes: 系统设置实体
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-11-05 19:20:00
 * Version : CCMiniCloud Framework Ver 2.0.1 ALL RIGHTS RESERVED BY 明章科技
 */


const BaseCCMiniModel = require('./base_ccmini_model.js');

class SetupModel extends BaseCCMiniModel {

}

// 集合名
SetupModel.CL = "setup";

SetupModel.CCMINI_DB_STRUCTURE = {
	SETUP_ID: 'string|true',
	
	SETUP_TITLE: 'string|false|comment=网站名称',
	SETUP_ABOUT: 'string|false|comment=',
 
	SETUP_REG_CHECK : 'int|true|default=0|comment=',

	SETUP_ADD_TIME: 'int|true',
	SETUP_EDIT_TIME: 'int|true', 
	SETUP_ADD_IP: 'string|false',
	SETUP_EDIT_IP: 'string|false',
};

// 字段前缀
SetupModel.CCMINI_FIELD_PREFIX = "SETUP_";

 

 
 

module.exports = SetupModel;