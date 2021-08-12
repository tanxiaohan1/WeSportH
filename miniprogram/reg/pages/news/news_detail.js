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
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		await PassportBiz.initPage(this);

		PassportBiz.loginSilence(this);
		if (!ccminiPageHelper.getId(this, options)) return;

		this._loadDetail();

	},

	_loadDetail: async function () {
		let id = this.data.id;
		if (!id) return;

		let params = {
			id,
		};
		let opt = {
			hint: false
		};
		let news = await ccminiCloudHelper.callCloudData('news/view', params, opt);
		if (!news) {
			this.setData({
				isLoad: null
			})
			return;
		}

		this.setData({
			isLoad: true,
			news,

		});


	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

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

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	url: function (e) {
		ccminiPageHelper.url(e);
	},

	onPageScroll: function (e) {
		// 回页首按钮
		ccminiPageHelper.showTopBtn(e, this);

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function (res) {
		return {
			title: this.data.news.NEWS_TITLE,
			path: '/' + CCMINI_SETTING.PROJECT_MARK + '/pages/news/news_detail?id=' + this.data.id,
		}
	},

})