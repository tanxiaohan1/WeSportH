/**
 * Notes: 后台管理模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-11-14 07:48:00 
 */

const BaseCCMiniBiz = require('./base_ccmini_biz.js');
const ccminiCacheHelper = require('../helper/ccmini_cache_helper.js');
const ccminiCloudHelper = require('../helper/ccmini_cloud_helper.js');
const CCMINI_SETTING = require('../helper/ccmini_setting.js');
const ccminiComm = require('../helper/ccmini_comm.js');
const ccminiPageHelper = require('../helper/ccmini_page_helper.js');


class AdminBiz extends BaseCCMiniBiz {

	static adminLogin(admin) {
		ccminiCacheHelper.set(ccminiComm.CACHE_ADMIN, admin, CCMINI_SETTING.ADMIN_TOKEN_EXPIRE);
	}

	static clearAdminToken() {
		ccminiCacheHelper.remove(ccminiComm.CACHE_ADMIN);
	}

	static getAdminToken() {
		return ccminiCacheHelper.get(ccminiComm.CACHE_ADMIN);
	}

	static getAdminName() {
		let admin = ccminiCacheHelper.get(ccminiComm.CACHE_ADMIN);
		if (!admin) return '';
		return admin.name;
	}

	static isSuperAdmin() {
		let admin = ccminiCacheHelper.get(ccminiComm.CACHE_ADMIN);
		if (!admin) return false;
		return (admin.type == 1);
	}

	static isAdmin(that) {
		if (CCMINI_SETTING.TEST_OPEN_PAGES) {
			let pages = getCurrentPages();
			console.log('PAGE length=' + pages.length)
			for (let k in pages) {
				console.log('[PAGE' + k + ']' + pages[k].route)
			}
		}
		
		let admin = ccminiCacheHelper.get(ccminiComm.CACHE_ADMIN);
		if (!admin) {
			ccminiPageHelper.goto('/pages/admin/index/admin_login', 'relaunch');
			return false;
		}

		that.setData({
			isAdmin: true
		});
		return true;
	}

	 
}

module.exports = AdminBiz;