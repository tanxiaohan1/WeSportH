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
 * Notes: 业务基类
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-09-05 04:00:00 
 */

const CCMiniAppError = require('../framework/handler/ccmini_app_error.js');
const ccminiAppCode = require('../framework/handler/ccmini_app_code.js');
const ccminiTimeUtil = require('../framework/utils/ccmini_time_util.js');
const UserModel = require('../model/user_model.js');
const ccminiConfig = require('../comm/ccmini_config.js');

class BaseCCMiniService {
	constructor() {
		// 当前时间戳
		this._timestamp = ccminiTimeUtil.time();

	}

	/**
	 * 抛出异常
	 * @param {*} msg 
	 * @param {*} code 
	 */
	ccminiAppError(msg, code = ccminiAppCode.LOGIC) {
		throw new CCMiniAppError(msg, code);
	}

	getJoinUserParams(localField = '_openid') {
		return {
			from: ccminiConfig.PROJECT_MARK + '_user',
			localField: localField,
			foreignField: 'USER_MINI_OPENID',
			as: 'USER_DETAIL',
		};
	}

	getJoinUserFields() {
		return 'USER_DETAIL.USER_ITEM,USER_DETAIL.USER_NAME,USER_DETAIL.USER_PIC,USER_DETAIL.USER_MINI_OPENID,USER_DETAIL.USER_SEX';
	}

	getJoinUserFieldsAdmin() {
		return 'USER_DETAIL.USER_ITEM,USER_DETAIL.USER_NAME,USER_DETAIL.USER_MINI_OPENID,USER_DETAIL.USER_SEX';
	}

	getUserFields() {
		return 'USER_NAME,USER_PIC,USER_SEX,USER_MINI_OPENID,USER_ITEM';
	}

	async getUserMyBase(userId, fields = this.getUserFields()) {
		let where = {
			USER_MINI_OPENID: userId
		}
		return await UserModel.getOne(where, fields);
	}

	async getUserOne(userId, fields = this.getUserFields()) {
		let where = {
			USER_MINI_OPENID: userId
		}
		return await UserModel.getOne(where, fields);
	}


}

module.exports = BaseCCMiniService;