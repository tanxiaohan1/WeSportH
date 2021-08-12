const UserBiz = require('../../biz/user_biz.js');
const ccminiPageHelper = require('../../helper/ccmini_page_helper.js');
const PassportBiz = require('../../biz/passport_biz.js');
const ccminiCacheHelper = require('../../helper/ccmini_cache_helper.js');

const CACHE_SHOW_USER_TYPE = 'USER_SHOW_TYPE';

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		showUserType: 1, //默认展示风格
		showUserTypeBtn: ['详细模式', '简明模式']
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		await PassportBiz.initPage(this);

		//设置搜索菜单
		this.setData(UserBiz.getSearchMenu());

		let showUserType = ccminiCacheHelper.get(CACHE_SHOW_USER_TYPE);
		if (showUserType) {
			this.setData({
				showUserType
			});
		}

		this.setData({
			isLogin: true
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
	onShow: async function () {
		PassportBiz.loginSilence(this); 
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

	url: async function (e) {
		ccminiPageHelper.url(e);
	},

	myCommListListener: function (e) {
		ccminiPageHelper.commListListener(this, e);
	},

	bindChangeTap: function () {
		let showUserType = (this.data.showUserType == 0) ? 1 : 0;
		ccminiCacheHelper.set(CACHE_SHOW_USER_TYPE, showUserType);
		this.setData({
			showUserType
		});
	}

})