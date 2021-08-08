const AdminBiz = require('../../../biz/admin_biz.js');
const ccminiCloudHelper = require('../../../helper/ccmini_cloud_helper.js');
const ccminiPageHelper = require('../../../helper/ccmini_page_helper.js');
const CCMINI_SETTING = require('../../../helper/ccmini_setting.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		name: CCMINI_SETTING.PROJECT_NAME,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		AdminBiz.clearAdminToken();
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

	bindGetPhoneNumber: async function (e) {
		if (e.detail.errMsg != "getPhoneNumber:ok") {
			wx.showToast({
				title: '手机号码获取失败，请重启绑定手机号码',
				icon: 'none'
			});
			return;
		}

		let cloudID = e.detail.cloudID;
		let params = {
			cloudID
		};
		let opt = {
			title: '验证中'
		};

		try {
			await ccminiCloudHelper.callCloudSumbit('admin/login', params, opt).then(res => {
				if (res && res.data && res.data.name) AdminBiz.adminLogin(res.data);

				ccminiPageHelper.goto('admin_home', 'relaunch');
			});
		} catch (e) {
			console.log(e);
		}

	}

})