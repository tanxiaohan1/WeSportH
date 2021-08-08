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
 * Notes: passport模块控制器
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-09-10 19:52:00
 * Version : CCMiniCloud Framework Ver 2.0.1 ALL RIGHTS RESERVED BY 明章科技
 */

const BaseCCMiniController = require('./base_ccmini_controller.js');
const PassportService = require('../service/passport_service.js'); 
const ccminiContentCheck = require('../framework/validate/ccmini_content_check.js'); 

class PassportController extends BaseCCMiniController {
 
	async getPhone() {

		// 数据校验
		let rules = {
			cloudID: 'required|string|min:1|max:200|name=cloudID',
		};

		// 取得数据
		let input = this.ccminiValidateData(rules);

		let service = new PassportService();
		return await service.getPhone(input.cloudID);
	}
 
	async register() {
		// 数据校验
		let rules = {
			phone: 'required|string',
			formData: 'required|object', 
			wechatData: 'required|object',
		};

		// 取得数据
		let input = this.ccminiValidateData(rules);

		await ccminiContentCheck.checkTextMultiClient(input.formData);

		let service = new PassportService();
		return await service.register(this._userId, input);
	}
 
	async modifyBase() {
		// 数据校验
		let rules = {
			formData: 'required|object',
		};

		// 取得数据
		let input = this.ccminiValidateData(rules);
 
		await ccminiContentCheck.checkTextMultiClient(input.formData);

		let service = new PassportService();
		return await service.modifyBase(this._userId, input);
	}
 
	async login() {
		// 数据校验
		let rules = {};

		// 取得数据
		let input = this.ccminiValidateData(rules);

		let service = new PassportService();
		return await service.login(this._userId);
	}
 
	async updatePic() {
		// 数据校验
		let rules = {
			fileID: 'required|string',
		};

		// 取得数据
		let input = this.ccminiValidateData(rules);

		let service = new PassportService();
		return await service.updatePic(this._userId, input.fileID);
	}

}

module.exports = PassportController;