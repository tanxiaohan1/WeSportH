const PassportBiz = require('../../../biz/passport_biz.js');
const CCMINI_SETTING = require('../../../helper/ccmini_setting.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		await PassportBiz.initPage(this);
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: async function () {

		PassportBiz.clearToken();
		await PassportBiz.loginSilence();

		wx.reLaunch({
			url: '/' + CCMINI_SETTING.PROJECT_MARK + '/pages/my/index/my_index',
		})

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

})