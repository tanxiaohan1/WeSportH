const RegBiz = require('../../biz/reg_biz.js');
const PassportBiz = require('../../biz/passport_biz.js');
const ccminiPageHelper = require('../../helper/ccmini_page_helper.js');

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
		
		if (await PassportBiz.isRegister(this)) return;

		// 判断是否有phone认证
		if (!RegBiz.isStep1()) 
			return ccminiPageHelper.goto('reg_step1' , 'back');
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

	getUserProfile: async function (e) {
		await RegBiz.registerStep2(e);
	},

	url: function (e) {
		ccminiPageHelper.url(e, this);
	} 

})