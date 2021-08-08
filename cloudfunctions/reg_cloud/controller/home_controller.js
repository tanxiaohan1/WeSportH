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
 * Notes: 全局或者主页模块控制器
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-11-05 10:20:00
 * Version : CCMiniCloud Framework Ver 2.0.1 ALL RIGHTS RESERVED BY 明章科技
 */

const BaseCCMiniController = require('./base_ccmini_controller.js');
const HomeService = require('../service/home_service.js');
const ccminiTimeUtil = require('../framework/utils/ccmini_time_util.js');

class HomeController extends BaseCCMiniController {
	 
 
 
	async getSetup() {

		// 数据校验
		let rules = {};

		// 取得数据
		let input = this.ccminiValidateData(rules);

		let service = new HomeService();
		let result = await service.getSetup();

		return result;

	}
 
	async getSetupAll() {

		// 数据校验
		let rules = {};

		// 取得数据
		let input = this.ccminiValidateData(rules);

		let service = new HomeService();
		let result = await service.getSetup('*');

		return result;

	}

}

module.exports = HomeController;