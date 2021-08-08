/**
 * Notes: 注册模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-11-14 07:48:00 
 */

const BaseCCMiniBiz = require('./base_ccmini_biz.js');
const ccminiCacheHelper = require('../helper/ccmini_cache_helper.js');
const ccminiCloudHelper = require('../helper/ccmini_cloud_helper.js');
const ccminiHelper = require('../helper/ccmini_helper.js');
const ccminiValidate = require('../helper/ccmini_validate.js');
const ccminiPageHelper = require('../helper/ccmini_page_helper.js');

/**
 * 
 */
class RegBiz extends BaseCCMiniBiz {
	/**
	 * 判断第一步是否完成
	 */
	static isStep1() {
		let cache = ccminiCacheHelper.get(RegBiz.CACHE_REG);
		if (!cache || !cache['phone'])
			return false;
		else
			return true;
	}

	/**
	 * 判断第2步是否完成
	 */
	static isStep2() {
		let cache = ccminiCacheHelper.get(RegBiz.CACHE_REG);
		if (!cache || !cache['user'])
			return false;
		else
			return true;
	}

	static clearRegCache() {
		ccminiCacheHelper.remove(RegBiz.CACHE_REG);
	}

	/**
	 * 保存已授权或者填写的信息 phone=电话 user=微信资料 form=填写的表单  
	 * @param {*} key 
	 * @param {*} val 
	 */
	static setRegCache(key, val) {
		let cache = ccminiCacheHelper.get(RegBiz.CACHE_REG);
		if (!cache) cache = {};
		cache[key] = val;
		ccminiCacheHelper.set(RegBiz.CACHE_REG, cache, 3600 * 30);
	}

	/**
	 * 获取授权或者填写的信息
	 * @param {*} key  
	 */
	static getRegCache(key) {
		let cache = ccminiCacheHelper.get(RegBiz.CACHE_REG);
		if (cache && cache[key]) return cache[key];
		return null;
	}

 

	/**
	 * 注册第二步
	 * @param {*} e 
	 */
	static async registerStep2(e) {
		wx.getUserProfile({
			desc: '用于完善校友资料',
			success: async (res) => {
				let userInfo = res.userInfo;
				if (!ccminiHelper.isDefined(userInfo) || !userInfo)
					wx.showToast({
						title: '授权失败，请重新授权',
						icon: 'none',
						duration: 4000
					});
				else {

					let cloudID = res.cloudID;
					let params = {
						cloudID
					};
					let opt = {
						title: '请稍等'
					};
				 
					userInfo.unionId = 'unionId';
 
					// 存储 用户信息
					RegBiz.setRegCache('user', userInfo); 
					ccminiPageHelper.goto('reg_step3');
				};
			},
			fail: (err) => {
				wx.showToast({
					title: '授权失败，请重新授权',
					icon: 'none'
				});
			}
		})
	}

	/**
	 * 注册第一步
	 * @param {*} e 
	 */
	static async registerStep1(e) {
		if (e.detail.errMsg == "getPhoneNumber:ok") {
			let cloudID = e.detail.cloudID;
			let params = {
				cloudID
			};
			let opt = {
				title: '验证中'
			};
			let phone = await ccminiCloudHelper.callCloudData('passport/phone', params, opt);
			if (!phone || phone.length < 11)
				wx.showToast({
					title: '手机号码获取失败，请重新绑定手机号码',
					icon: 'none',
					duration: 4000
				});
			else {
				// 存储 手机号码
				RegBiz.setRegCache('phone', phone);
				// 判断是否手机授权
 
				ccminiPageHelper.goto('reg_step2');
			}
		} else
			wx.showToast({
				title: '手机号码获取失败，请重启绑定手机号码',
				icon: 'none'
			});

	}
}
RegBiz.CACHE_REG = 'CACHE_REG_INFO';

module.exports = RegBiz;