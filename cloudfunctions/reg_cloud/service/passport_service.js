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
 * Notes: passport模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-10-14 07:48:00 
 */

const BaseCCMiniService = require('./base_ccmini_service.js'); 
const ccminiCloudUtil = require('../framework/cloud/ccmini_cloud_util.js');
const ccminiCloudBase = require('../framework/cloud/ccmini_cloud_base.js');
const UserModel = require('../model/user_model.js');
const SetupModel = require('../model/setup_model.js');
const ccminiAppCode = require('../framework/handler/ccmini_app_code.js');

class PassportService extends BaseCCMiniService {
 
 

	async modifyBase(userId, {
		formData
	}) {

		// 表单值
		let data = {};

		this.fmtUserFormData(data, formData);


		let where = {
			USER_MINI_OPENID: userId
		};
		await UserModel.edit(where, data);


	} 

	fmtUserFormData(data, formData) {

		data.USER_NAME = formData.name;

		data.USER_SEX = formData.sex;
		data.USER_ITEM = formData.item;
		data.USER_BIRTH = formData.birth;

		data.USER_ENROLL = formData.enroll;
		data.USER_GRAD = formData.grad;
		data.USER_CITY = formData.city;
 
		data.USER_EDU = formData.edu;

 
		data.USER_MOBILE = formData.mobile;
		data.USER_WECHAT = formData.wechat;
		data.USER_EMAIL = formData.email;
		data.USER_QQ = formData.qq;

		data.USER_COMPANY = formData.company; 
		data.USER_COMPANY_DUTY = formData.companyDuty;
		data.USER_TRADE = formData.trade; 

		data.USER_RESOURCE = formData.resource;
		data.USER_DESC = formData.desc;

	} 

	async register(userId, {
		phone,
		formData, 
		wechatData
	}) {
		let whereCnt = {
			USER_MINI_OPENID: userId
		}
		let cnt = await UserModel.count(whereCnt);
		if (cnt) {
			return await this.login(userId);
		}
 

		let setup = await SetupModel.getOne({}, 'SETUP_REG_CHECK,SETUP_TITLE');

		if (!setup)
			this.ccminiAppError('系统故障');

		// 表单值
		let data = {};

		// 设定值    
		data.USER_PHONE_CHECKED = phone; // 已校验的手机号码
		data.USER_PIC = wechatData.avatarUrl; //默认头像 
		data.USER_MINI_OPENID = userId; 

		data.USER_STATUS = (setup.SETUP_REG_CHECK == 1) ? UserModel.STATUS.UNUSE : UserModel.STATUS.COMM;

		this.fmtUserFormData(data, formData);

		data.USER_WX_GENDER = wechatData.gender;
		data.USER_WX_AVATAR_URL = wechatData.avatarUrl;
		data.USER_WX_NICKNAME = wechatData.nickName;
		data.USER_WX_LANGUAGE = wechatData.language;
		data.USER_WX_CITY = wechatData.city;
		data.USER_WX_PROVINCE = wechatData.province;
		data.USER_WX_COUNTRY = wechatData.country;
		data.USER_WX_UPDATE_TIME = this._timestamp;

		await UserModel.insert(data);


		if (setup.SETUP_REG_CHECK == 1) {
			return 'CODE_WAITCHECK';
		} else {

		}

		return await this.login(userId);
	}



	/**
	 * 登录
	 */
	async login(userId) {

		let where = {
			'USER_MINI_OPENID': userId
		};
		let fields = 'USER_ID,USER_SEX,USER_MINI_OPENID,USER_ITEM,USER_NAME,USER_PIC,USER_STATUS,USER_WORK';
		let user = await UserModel.getOne(where, fields);


		let token = {};
		if (user) {
			if (user.USER_STATUS == UserModel.STATUS.PEDDING || user.USER_STATUS == UserModel.STATUS.DEL)
				this.ccminiAppError('用户状态异常，无法登陆', ccminiAppCode.USER_EXCEPTION);

			if (user.USER_STATUS == UserModel.STATUS.UNUSE)
				this.ccminiAppError('用户审核中', ccminiAppCode.USER_CHECK);

			token.id = user.USER_MINI_OPENID;
			token.key = user.USER_ID;
			token.name = user.USER_NAME;
			token.pic = user.USER_PIC;
			token.status = user.USER_STATUS;
			token.item = user.USER_ITEM;
			token.sex = user.USER_SEX;

			// 异步更新最近更新时间
			let dataUpdate = {
				USER_LOGIN_TIME: this._timestamp
			};
			UserModel.edit(where, dataUpdate);
			UserModel.inc(where, 'USER_LOGIN_CNT', 1);

		} else
			token = null;

		return {
			token
		};
	}

	/**
	 * 获取手机号码
	 */
	async getPhone(cloudID) {
		let cloud = ccminiCloudBase.getCloud();
		let res = await cloud.getOpenData({
			list: [cloudID], // 假设 event.openData.list 是一个 CloudID 字符串列表
		});
		if (res && res.list && res.list[0] && res.list[0].data) {
			return res.list[0].data.phoneNumber;
		} else
			return '';
	}


}

module.exports = PassportService;