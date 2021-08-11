const AdminBiz = require('../../../biz/admin_biz.js');
const ccminiPageHelper = require('../../../helper/ccmini_page_helper.js');
const ccminiBizHelper = require('../../../helper/ccmini_biz_helper.js');
const ccminiCloudHelper = require('../../../helper/ccmini_cloud_helper.js');
const ccminiValidate = require('../../../helper/ccmini_validate.js'); 
const AdminNewsBiz = require('../../../biz/admin_news_biz.js');

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

		this.setData(await AdminNewsBiz.initFormData()); // 初始化表单数据
		this.setData({
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

	model: function (e) {
		ccminiPageHelper.model(this, e);
	},
 
	 
	bindMyPickerCateEventListener: function (e) {
		let formCate = e.detail;
		this.setData({
			formCate
		})
	},

	/** 
	 * 数据提交
	 */
	bindFormSubmit: async function () {

		let data = this.data; 

		// 数据校验 
		data = ccminiValidate.check(data, AdminNewsBiz.CHECK_FORM, this);
		if (!data) return;

		try {
			// 先创建，再上传 
			let result = await ccminiCloudHelper.callCloudSumbit('admin/news_insert', data);

			// 图片 提交处理
			let imgList = this.data.imgList;
			if (imgList.length > 0) {
				wx.showLoading({
					title: '提交中...',
					mask: true
				});

				let newsId = result.data.id;
				await AdminNewsBiz.updateNewsPic(newsId, imgList);
			}

			let callback = async function () {
				ccminiBizHelper.removeCacheList('admin_news'); 
				ccminiPageHelper.goto('admin_news_list');

			}
			ccminiPageHelper.showSuccToast('发布成功', 2000, callback);

		} catch (err) {
			console.log(err);
		}

	},


	bindMyImgUploadListener: function (e) {
		this.setData({
			imgList: e.detail
		});
	}

})