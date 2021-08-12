const ccminiCloudHelper = require('../../helper/ccmini_cloud_helper.js');
const ccminiHelper = require('../../helper/ccmini_helper.js');
const ccminiBizHelper = require('../../helper/ccmini_biz_helper.js');
const ccminiPageHelper = require('../../helper/ccmini_page_helper.js');
const PassportBiz = require('../../biz/passport_biz.js'); 
const CCMINI_SETTING = require('../../helper/ccmini_setting.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isLoad: false,
 
		isFav: -1, 
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		await PassportBiz.initPage(this); 

		if (!await PassportBiz.loginMustRegWin(this)) return;
		if (!ccminiPageHelper.getId(this, options)) return;

		this._loadDetail();
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		
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
		await this._loadDetail();
		wx.stopPullDownRefresh();
	},

	_loadDetail: async function () {
		let id = this.data.id;
		if (!id) return;

		let params = {
			userId: id, 
		};
		let opt = {
			hint: false
		};
		let user = await ccminiCloudHelper.callCloudData('user/view', params, opt);
		if (!user) {
			this.setData({
				isLoad: null
			})
			return;
		}

		user.USER_LOGIN_TIME = ccminiHelper.timestamp2Time(user.USER_LOGIN_TIME, 'Y-M-D');

	 
 

		this.setData({
			isLoad: true,
			user, 
		});
 

		 
	},

	 

	bindShowTap: function () {
		this.setData({
			isShowBase: !this.data.isShowBase
		});
	},

	 

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		return {
			title: PassportBiz.getUserName() + '向您推荐了校友' + this.data.user.USER_NAME,
			path: '/' + CCMINI_SETTING.PROJECT_MARK + '/pages/user/user_detail?id=' + this.data.id,
		}
	},

	url: function (e) {
		ccminiPageHelper.url(e);
	},

	top: function (e) {
		// 回页首事件
		ccminiPageHelper.top();
	},

	onPageScroll: function (e) {
		// 回页首按钮
		ccminiPageHelper.showTopBtn(e, this);

	},
})