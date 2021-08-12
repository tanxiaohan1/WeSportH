/**
 * Notes: 全局/首页模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-11-05 07:48:00 
 */

const BaseCCMiniService = require('./base_ccmini_service.js');
const SetupModel = require('../model/setup_model.js');

class HomeService extends BaseCCMiniService {


	async getSetup(fields = 'SETUP_TITLE,SETUP_REG_CHECK') {
		let where = {}
		let setup = await SetupModel.getOne(where, fields);


		return setup;

	}


}

module.exports = HomeService;