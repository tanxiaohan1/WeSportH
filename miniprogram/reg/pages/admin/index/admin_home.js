const AdminBiz = require('../../../biz/admin_biz.js');
const ccminiPageHelper = require('../../../helper/ccmini_page_helper.js');
const ccminiCloudHelper = require('../../../helper/ccmini_cloud_helper.js');
const CCMINI_SETTING = require('../../../helper/ccmini_setting.js');
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		projectVer: CCMINI_SETTING.PROJECT_VER,
		projectName: CCMINI_SETTING.PROJECT_NAME
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		if (!AdminBiz.isAdmin(this)) return;

		this._loadDetail();
	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: async function () {
		await this._loadDetail();
		wx.stopPullDownRefresh();
	},

	_loadDetail: async function () {
		try {
			let opts = {
				title: 'bar'
			}
			let res = await ccminiCloudHelper.callCloudData('admin/home', {}, opts);
			this.setData({
				isLoad: true,
				data: res
			});

		} catch (err) {
			console.log(err);
		}

		let admin = AdminBiz.getAdminToken();
		this.setData({
			admin
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

	url: function (e) {
		ccminiPageHelper.url(e, this);
	},

	bindExitTap: function (e) {
		AdminBiz.clearAdminToken();
		ccminiPageHelper.goto('/pages/my/index/my_index');
	}

})