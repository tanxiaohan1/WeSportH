const AdminBiz = require('../../../biz/admin_biz.js');
const ccminiPageHelper = require('../../../helper/ccmini_page_helper.js');
const ccminiCloudHelper = require('../../../helper/ccmini_cloud_helper.js');
const ccminiValidate = require('../../../helper/ccmini_validate.js');
const PassportBiz = require('../../../biz/passport_biz.js');

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
		if (!AdminBiz.isAdmin(this)) return;

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
		let opts = {
			'title': 'bar'
		};
		let setup = await ccminiCloudHelper.callCloudData('home/setup_all', {}, opts);
		if (!setup) {
			return;
		};

		this.setData({
			isLoad: true,


			// 表单数据  
			formTitle: setup.SETUP_TITLE,
			formAbout: setup.SETUP_ABOUT,
			formRegCheck: setup.SETUP_REG_CHECK

		});
	},

	bindRegCheckChange: function (e) {
		let formRegCheck = (e.detail.value) ? 1 : 0;
		this.setData({
			formRegCheck
		});
	},



	/** 
	 * 数据提交
	 */
	bindFormSubmit: async function () {

		let data = this.data;

		// 数据校验 
		let rules = {
			title: 'formTitle|required|string|min:2|max:50|name=平台名称',
			regCheck: 'formRegCheck|required|in:0,1|name=用户注册是否需要审核',
			about: 'formAbout|required|string|min:10|max:50000|name=关于我们',

		}
		data = ccminiValidate.check(data, rules, this);
		if (!data) return;

		try {
			// 先修改，再上传 
			await ccminiCloudHelper.callCloudSumbit('admin/setup_edit', data);

			PassportBiz.clearSetup();

			let callback = function () {
				ccminiPageHelper.goto('', 'back');
			}
			ccminiPageHelper.showSuccToast('设置成功', 1500, callback);


		} catch (err) {
			console.log(err);
		}

	},

	url: function (e) {
		ccminiPageHelper.url(e, this);
	}

})