/**
 * Notes: 注册登录模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-11-14 07:48:00 
 */

const BaseCCMiniBiz = require('./base_ccmini_biz.js');
const ccminiCacheHelper = require('../helper/ccmini_cache_helper.js');
const ccminiCloudHelper = require('../helper/ccmini_cloud_helper.js');
const CCMINI_SETTING = require('../helper/ccmini_setting.js');
const ccminiHelper = require('../helper/ccmini_helper.js');
const ccminiComm = require('../helper/ccmini_comm.js');
const ccminiPageHelper = require('../helper/ccmini_page_helper.js');
const ccminiBizHelper = require('../helper/ccmini_biz_helper.js');
const CACHE_SETUP = 'SYS_SETUP';

class PassportBiz extends BaseCCMiniBiz {

	/**
	 * 获取系统配置
	 */
	static async setSetup(that) {
		let setup = ccminiCacheHelper.get(CACHE_SETUP);
		if (!setup) {
			let opts = {
				hint: false
			}
			setup = await ccminiCloudHelper.callCloudData('home/setup', {}, opts);
			ccminiCacheHelper.set(CACHE_SETUP, setup, CCMINI_SETTING.CACHE_SETUP);
		}
		if (setup) {
			setup.ver = CCMINI_SETTING.PROJECT_VER;
			that.setData({
				setup
			});
		}
	}

	// 清除参数
	static async clearSetup() {
		ccminiCacheHelper.remove(CACHE_SETUP);
	}

	/**
	 * 页面初始化
	 * @param {*} that 
	 */
	static initPage(that) {
		if (CCMINI_SETTING.TEST_OPEN_PAGES) {
			let pages = getCurrentPages();
			console.log('PAGE length=' + pages.length)
			for (let k in pages) {
				console.log('[PAGE' + k + ']' + pages[k].route)
			}
		}

		wx.setNavigationBarColor({ //顶部
			backgroundColor: CCMINI_SETTING.PROJECT_COLOR,
			frontColor: '#ffffff',
		});

	}

	static initApp() {


	}


	static async loginMustAdminWin(that) {
		that.setData({
			isAdmin: true
		});
		return true;
	}


	static async loginMustCancelWin(that) {
		return await PassportBiz.loginCheck(true, 2, true, '', that);
	}

	static async loginMustReturnWin(that) {
		return await PassportBiz.loginCheck(true, 1, true, '', that);
	}


	static async loginMustRegWin(that) {
		return await PassportBiz.loginCheck(true, 0, true, '', that);
	}


	static async loginMustReturnPage(that) {
		return await PassportBiz.loginCheck(true, 1, false, '', that);
	}


	static async loginMustRegPage(that) {
		return await PassportBiz.loginCheck(true, 0, false, '', that);
	}


	static async loginSilence(that) {
		return await PassportBiz.loginCheck(false, 0, false, 'bar', that);
	}


	/**
	 * 是否登录
	 */
	static isLogin() {
		let id = PassportBiz.getUserId();
		return (id.length > 0) ? true : false;
	}


	/**
	 * 是否注册
	 */
	static async isRegister(that) {
		PassportBiz.clearToken();

		// 判断用户是否注册
		await PassportBiz.loginCheck(false, 0, false, '校验中', that);
		if (await PassportBiz.isLogin()) {
			wx.reLaunch({
				url: '/' + CCMINI_SETTING.PROJECT_MARK + '/pages/my/index/my_index',
			});
			return true;
		}
		return false;

	}

	/**
	 * 获取user id
	 */
	static getUserId() {
		if (CCMINI_SETTING.TEST_MODE) return CCMINI_SETTING.TEST_USER_ID;
		let token = ccminiCacheHelper.get(ccminiComm.CACHE_TOKEN);
		if (!token) return '';
		return token.id || '';
	}

	/**
	 * 获取user name
	 */
	static getUserName() {
		let token = ccminiCacheHelper.get(ccminiComm.CACHE_TOKEN);
		if (!token) return '';
		return token.name || '';
	}

	/**
	 * 获取user 头像
	 */
	static getUserPic() {
		let token = ccminiCacheHelper.get(ccminiComm.CACHE_TOKEN);
		if (!token) return '';
		return token.pic || '';
	}

	/**
	 * 获取user KEY
	 */
	static getUserKey() {
		let token = ccminiCacheHelper.get(ccminiComm.CACHE_TOKEN);
		if (!token) return '';
		return token.key || '';
	}

	/**
	 * 设置user 头像
	 */
	static setUserPic(pic) {
		if (!pic) return;
		let token = ccminiCacheHelper.get(ccminiComm.CACHE_TOKEN);
		if (!token) return '';
		token.pic = pic;
		ccminiCacheHelper.set(ccminiComm.CACHE_TOKEN, token, CCMINI_SETTING.PASSPORT_TOKEN_EXPIRE);
	}

	/**
	 * 获取token
	 */
	static getToken() {
		if (CCMINI_SETTING.TEST_MODE) return CCMINI_SETTING.TEST_TOKEN;
		let token = ccminiCacheHelper.get(ccminiComm.CACHE_TOKEN);
		return token || null;
	}


	/**
	 * 清除登录缓存
	 */
	static clearToken() {
		ccminiCacheHelper.remove(ccminiComm.CACHE_TOKEN);
	}

	/**
	 * 登录判断及处理 
	 */
	static async loginCheck(mustLogin = false, returnMethod = 0, isWin = true, title = '', that = null) {
		let token = ccminiCacheHelper.get(ccminiComm.CACHE_TOKEN);
		if (token) {
			if (that)
				that.setData({
					isLogin: true
				});
			return true;
		} else {
			if (that) that.setData({
				isLogin: false
			});
		}

		let opt = {
			title: title || '登录中',
		};

		let res = await ccminiCloudHelper.callCloudSumbit('passport/login', {}, opt).then(result => {
			if (result && ccminiHelper.isDefined(result.data.token) && result.data.token) {
				// 正常用户
				ccminiCacheHelper.set(ccminiComm.CACHE_TOKEN, result.data.token, CCMINI_SETTING.PASSPORT_TOKEN_EXPIRE);

				if (that) that.setData({
					isLogin: true
				});

				return true;
			} else if (mustLogin && isWin) {
				ccminiPageHelper.goto('/pages/about/hint?type=0', 'redirect');

				return false;
			} else if (mustLogin && !isWin) {

				if (returnMethod == 0) {
					let callback = function () {
						ccminiPageHelper.goto('/pages/register/reg_step1', 'redirect');
					}
					ccminiPageHelper.showNoneToast('需要注册后使用', 1500, callback);

				} else {
					let callback = function () {
						ccminiPageHelper.goto('', 'back');
					}
					ccminiPageHelper.showNoneToast('需要注册后使用', 1500, callback);

				}

				return false;
			}

		}).catch(err => {
			PassportBiz.clearToken();
			let isReg = false;
			if (that) {
				let route = that.route;
				if (route.includes('register/reg_step1') ||
					route.includes('pages/register/reg_step2') ||
					route.includes('pages/register/reg_step3'))
					isReg = true;
			}
			console.log(err);
			if (err.code == ccminiCloudHelper.CODE.USER_EXCEPTION && (mustLogin || isReg)) {
				ccminiPageHelper.goto('/pages/about/hint?type=1', 'redirect');
			}

			// 待审核用户
			if (err.code == ccminiCloudHelper.CODE.USER_CHECK && (mustLogin || isReg)) {
				 
				if (isWin || isReg) {
					if (isReg) {
						ccminiPageHelper.hint('用户正在审核，无须重复注册');
					} else {
						ccminiPageHelper.goto('/pages/about/hint?type=2', 'redirect');
					}

				} else {
					if (returnMethod == 0) {
						let callback = function () {
							ccminiPageHelper.goto('/pages/my/index/my_index');
						}
						ccminiPageHelper.showNoneToast('正在用户审核，暂无法使用本功能', 1500, callback);

					} else {
						let callback = function () {
							ccminiPageHelper.goto('', 'back');
						}
						ccminiPageHelper.showNoneToast('正在用户审核，暂无法使用本功能', 1500, callback);

					}
				}

			}


			return false;
		});


		return res;

	}
}

module.exports = PassportBiz;