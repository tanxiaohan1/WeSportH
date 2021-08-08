const PassportBiz = require('../../../biz/passport_biz.js');
const UserBiz = require('../../../biz/user_biz.js');
const ccminiCacheHelper = require('../../../helper/ccmini_cache_helper.js');
const ccminiCloudHelper = require('../../../helper/ccmini_cloud_helper.js');
const ccminiComm = require('../../../helper/ccmini_comm.js');
const ccminiPageHelper = require('../../../helper/ccmini_page_helper.js');
const CCMINI_SETTING = require('../../../helper/ccmini_setting.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		user: null,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		PassportBiz.initApp();
		PassportBiz.initPage(this);

		await this._login();
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: async function () {
		PassportBiz.setSetup(this);

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: async function () {
		await this._login();
		wx.stopPullDownRefresh();
	},

	//登录
	_login: async function () {
		await PassportBiz.loginSilence(this);

		// 取得token里的信息
		let token = PassportBiz.getToken();
		if (token) { // 已登录
			// 先用token里信息渲染
			let user = {};
			user.USER_PIC = token.pic;
			user.USER_NAME = token.name;
			user.USER_ITEM = token.item;
			user.USER_SEX = token.sex;
			user.USER_STATUS = token.status;

			this.setData({
				user
			});

			// 再调用服务器信息渲染
			this._getUserInfo();

		} else {
			// 未登录下  获取用户账号信息 
			let params = {
				fields: 'USER_TYPE,USER_PIC,USER_NAME,USER_ITEM,USER_PIC,USER_NAME,USER_SEX,USER_STATUS'
			};
			let opts = {
				title: 'bar'
			}
			let user = await ccminiCloudHelper.callCloudData('user/my_detail', params, opts);
			if (user)
				this.setData({
					user
				});
		}
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	_getUserInfo: async function () {
		if (!PassportBiz.isLogin()) return;

		// 取得用户信息
		let opt = {
			title: 'bar'
		};
		let user = await ccminiCloudHelper.callCloudData('user/my_detail', {}, opt);
		if (!user || user.USER_STATUS == 0 || user.USER_STATUS == 9) {
			ccminiPageHelper.reload();
		}
		this.setData({
			user
		});
	},

	url: function (e) {
		ccminiPageHelper.url(e);
	},



	bindSetTap: async function (e) {
		wx.showActionSheet({
			itemList: ['清除缓存', '重新登录', '退出登录'],
			success: async res => {
				let idx = res.tapIndex;
				if (idx == 0) {
					let token = PassportBiz.getToken();
					ccminiCacheHelper.clear();
					ccminiCacheHelper.set(ccminiComm.CACHE_TOKEN, token);
				}
				if (idx == 1) {
					await this._login();
				}
				if (idx == 2) {
					ccminiCacheHelper.clear();
					this.setData({
						user: null
					});
				}

			},
			fail: function (res) {}
		})
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function (res) {
		return {
			title: '向您推荐' + this.data.setup.SETUP_TITLE,
			path: '/' + CCMINI_SETTING.PROJECT_MARK + '/pages/index/index_home',
		}
	},
})