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
 * Notes: 内容审核
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-09-05 04:00:00
 * Version : CCMiniCloud Framework Ver 2.0.1 ALL RIGHTS RESERVED BY 明章科技
 */

const CCMiniAppError = require('../handler/ccmini_app_error.js'); 
const ccminiCloudBase = require('../cloud/ccmini_cloud_base.js');
const ccminiConfig = require('../../comm/ccmini_config.js');
 

/**
 * 后台把输入数据里的文本数据提交内容审核
 * @param {*} input 
 */
async function checkTextMultiAdmin(input) {
	if (!ccminiConfig.CCMINI_ADMIN_CHECK_CONTENT) return;
	return checkTextMulti(input);
}

/**
 * 前台把输入数据里的文本数据提交内容审核
 * @param {*} input 
 */
async function checkTextMultiClient(input) {
	if (!ccminiConfig.CCMINI_CLIENT_CHECK_CONTENT) return;
	return checkTextMulti(input);
}

/**
 * 把输入数据里的文本数据提交内容审核
 * @param {*} input 
 */
async function checkTextMulti(input) { 
	let txt = '';
	for (let k in input) {
		if (typeof (input[k]) === 'string')
			txt += input[k];
	}
	await checkText(txt);
}
/**
 * 后台校验文字信息
 * @param {*}  
 */
async function checkTextAdmin(txt) {
	if (!ccminiConfig.CCMINI_ADMIN_CHECK_CONTENT) return;
	return checkText(txt);
}

/**
 * 前台校验文字信息
 * @param {*}  
 */
async function checkTextClient(txt) {
	if (!ccminiConfig.CCMINI_CLIENT_CHECK_CONTENT) return;
	return checkText(txt);
}

/**
 * 校验文字信息
 * @param {*}  
 */
async function checkText(txt) {  
	if (!txt) return;

	let cloud = ccminiCloudBase.getCloud();
	try {
		const result = await cloud.openapi.security.msgSecCheck({
			content: txt

		})
		 
		if (!result || result.errCode !== 0) {
			throw new CCMiniAppError('文字内容不合适，请修改或者重试');
		}

	} catch (err) {
		console.log('checkText ex', err);
		throw new CCMiniAppError('文字内容不合适，请修改或者重试');
	}

}

module.exports = { 
	checkTextMulti,
	checkTextMultiClient,
	checkTextMultiAdmin,
	checkText,
	checkTextClient,
	checkTextAdmin
}