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
 * Notes: 云函数业务主逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-09-05 04:00:00
 * Version : CCMiniCloud Framework Ver 2.0.1 ALL RIGHTS RESERVED BY 明章科技
 */
const ccminiUtil = require('../utils/ccmini_util.js');
const ccminiConfig = require('../../comm/ccmini_config.js');
const ccminiRouter = require('../../comm/ccmini_router.js');
const ccminiCloudBase = require('../cloud/ccmini_cloud_base.js');
const ccminiAppCode = require('./ccmini_app_code.js');
const ccminiTimeUtil = require('../utils/ccmini_time_util.js');
const ccminiDBUtil = require('../database/ccmini_db_util.js');
const SetupModel = require('../../model/setup_model.js');
const NewsModel = require('../../model/news_model.js');
const AdminModel = require('../../model/admin_model.js');

async function ccminiApp(event, context) {

	const cloud = ccminiCloudBase.getCloud();
	const wxContext = cloud.getWXContext();
	let r = '';

	//console.log(wxContext);
	let mark = ccminiConfig.PROJECT_MARK + '_cloud';

	try {

		if (!ccminiUtil.isDefined(event.router)) {
			console.error('[' + mark + ']CC-MINI Router Not Defined');
			return handlerSvrErr();
		}

		r = event.router.toLowerCase();

		if (!ccminiUtil.isDefined(ccminiRouter[r])) {
			console.error('[' + mark + ']CCMINI Router [' + r + '] Is Not Exist');
			return handlerSvrErr();
		}

		let ccminiRouterArr = ccminiRouter[r].split('@');

		let controllerName = ccminiRouterArr[0];
		let actionName = ccminiRouterArr[1];
		let token = event.token || '';
		let params = event.params;

		console.log('');
		console.log('');
		let time = ccminiTimeUtil.time('Y-M-D h:m:s');
		console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
		console.log('[' + mark + '][' + time + '][CCMINI Request][Route=' + r + '], Controller=[' + controllerName + '], Action=[' + actionName + '], Token=[' + token + '], ###IN DATA=\r\n', JSON.stringify(params, null, 4));


		let openId = wxContext.OPENID;

		if (!openId) {
			console.error('CCMINI OPENID is unfined');
			if (ccminiConfig.CCMINI_TEST_MODE)
				openId = ccminiConfig.CCMINI_TEST_TOKEN_ID;
			else
				return handlerSvrErr();
		}

		//####
		await initSetup();

		controllerName = controllerName.toLowerCase().replace('controller', '').trim();
		const ControllerClass = require('controller/' + controllerName + '_controller.js');
		const controller = new ControllerClass(openId, params, r, token);

		let result = await controller[actionName]();

		if (!result)
			result = handlerSucc(r);
		else
			result = handlerData(result, r);

		console.log('------');
		time = ccminiTimeUtil.time('Y-M-D h:m:s');
		console.log('[' + mark + '][' + time + '][CCMINI Response][Route=' + r + '], ###OUT DATA=', result);
		console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++');
		console.log('');
		console.log('');

		return result;


	} catch (ex) {
		const log = cloud.logger();

		if (ex.name == 'CCMiniAppError') {
			log.warn({
				router: r,
				errCode: ex.code,
				errMsg: ex.message
			});
			// 自定义error处理
			return handlerAppErr(ex.message, ex.code);
		} else {
			console.log(ex);
			log.error({
				router: r,
				errCode: ex.code,
				errMsg: ex.message,
				errStack: ex.stack
			});

			// 系统error
			return handlerSvrErr();
		}
	}
}

function handlerBasic(code, msg = '', data = {}) {

	switch (code) {
		case ccminiAppCode.SUCC:
			msg = (msg) ? msg + ':ok' : 'ok';
			break;
		case ccminiAppCode.SVR:
			msg = '服务器繁忙，请稍后再试';
			break;
		case ccminiAppCode.LOGIC:
			break;
		case ccminiAppCode.DATA:
			break;
		case ccminiAppCode.USER_EXCEPTION:
			msg = msg || '用户状态异常';
			break;
		case ccminiAppCode.NOT_USER:
			msg = msg || '用户不存在';
			break;
		case ccminiAppCode.MUST_LOGIN:
			msg = msg || '需要登录';
			break;
		case ccminiAppCode.USER_CHECK:
			msg = msg || '用户审核中';
			break;
		case ccminiAppCode.ADMIN_ERROR:
			msg = msg || '管理员错误';
			break;
		default:
			msg = '服务器开小差了，请稍后再试';
			break;
	}

	return {
		code: code,
		msg: msg,
		data: data
	}

}

function handlerSvrErr(msg = '') {
	return handlerBasic(ccminiAppCode.SVR, msg);
}

function handlerSucc(msg = '') {
	return handlerBasic(ccminiAppCode.SUCC, msg);
}

function handlerAppErr(msg = '', code = ccminiAppCode.LOGIC) {
	return handlerBasic(code, msg);
}


function handlerData(data, msg = '') {
	return handlerBasic(ccminiAppCode.SUCC, msg, data);
}

async function initSetup() {
	if (await ccminiDBUtil.isExistCollection('setup')) return;

	let arr = ccminiConfig.CCMINI_COLLECTION_NAME.split('|');
	for (let k in arr) {
		if (!await ccminiDBUtil.isExistCollection(arr[k])) {
			await ccminiDBUtil.createCollection(arr[k]);
		}
	}

	if (await ccminiDBUtil.isExistCollection('setup')) {
		await ccminiDBUtil.clear('setup');
		
		let data = {};
		data.SETUP_TITLE = ccminiConfig.CCMINI_SETUP_TITLE;
		data.SETUP_ABOUT = ccminiConfig.CCMINI_SETUP_ABOUT;
		data.SETUP_REG_CHECK = 0;
		await SetupModel.insert(data);
	}

	if (await ccminiDBUtil.isExistCollection('admin')) {
		await ccminiDBUtil.clear('admin');

		let data = {};
		data.ADMIN_NAME = '系统管理员';
		data.ADMIN_PHONE = '13900000000';

		await AdminModel.insert(data);
	}

	if (await ccminiDBUtil.isExistCollection('news') && ccminiConfig.CCMINI_COLLECTION_NAME.includes('news')) {
		await ccminiDBUtil.clear('news');

		let data = {};
		data.NEWS_TITLE = ccminiConfig.CCMINI_NEWS_TITLE;
		data.NEWS_DESC = ccminiConfig.CCMINI_NEWS_DESC;
		data.NEWS_CATE = ccminiConfig.CCMINI_NEWS_CATE;
		data.NEWS_CONTENT = ccminiConfig.CCMINI_NEWS_CONTENT;

		await NewsModel.insert(data);
	}
}


module.exports = {
	ccminiApp,
	handlerBasic,
	handlerData,
	handlerSucc,
	handlerSvrErr,
	handlerAppErr
}