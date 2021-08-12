const ccminiPageHelper = require('../../helper/ccmini_page_helper.js');
const PassportBiz = require('../../biz/passport_biz.js'); 
const CCMINI_SETTING = require('../../helper/ccmini_setting.js');

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
		PassportBiz.initApp();
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
		await PassportBiz.setSetup(this);

		wx.setNavigationBarTitle({
			title: this.data.setup.SETUP_TITLE
		}); 

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
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {
		return {
			title: PassportBiz.getUserName() + '向您推荐' + this.data.setup.SETUP_TITLE,
			path: '/' + CCMINI_SETTING.PROJECT_MARK + '/pages/index/index_home',
		}
	},

 

	url: function (e) {
		try {
			ccminiPageHelper.url(e, this);
		}
		catch(err) {
			
		}
	}
})