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
		isLoad: false
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		await PassportBiz.initPage(this); 
		this._loadDetail();
	},

	_loadDetail: async function () {
		let opts = {
			title: 'bar'
		}
		let about = await ccminiCloudHelper.callCloudData('home/setup_all', {}, opts);
		if (!about) {
			this.setData({
				isLoad: null
			});
			return;
		}

		if (about) this.setData({
			about,
			isLoad: true
		});
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
	onPullDownRefresh: function () {
		this._loadDetail();
		wx.stopPullDownRefresh();
	},


	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		return {
			title: '关于我们',
			path: '/' + CCMINI_SETTING.PROJECT_MARK + '/pages/about/about',
		}
	},

	url: function (e) {
		ccminiPageHelper.url(e, this);
	}
})