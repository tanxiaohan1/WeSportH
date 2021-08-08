const AdminBiz = require('../../../biz/admin_biz.js');
const ccminiPageHelper = require('../../../helper/ccmini_page_helper.js'); 
const ccminiCloudHelper = require('../../../helper/ccmini_cloud_helper.js');
const ccminiValidate = require('../../../helper/ccmini_validate.js'); 
const AdminNewsBiz = require('../../../biz/admin_news_biz.js');
const ccminiHelper = require('../../../helper/ccmini_helper.js');

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
		if (!AdminBiz.isAdmin(this)) return;
		if (!ccminiPageHelper.getId(this, options)) return;

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

	model: function (e) {
		ccminiPageHelper.model(this, e);
	},

	_loadDetail: async function () {
		let id = this.data.id;
		if (!id) return;

		if (!this.data.isLoad) this.setData(await AdminNewsBiz.initFormData(id)); // 初始化表单数据

		let params = {
			id
		};
		let opt = {
			hint: false
		};
		let news = await ccminiCloudHelper.callCloudData('admin/news_detail', params, opt);
		if (!news) {
			this.setData({
				isLoad: null
			})
			return;
		};
 

		this.setData({
			isLoad: true,

			imgList: news.NEWS_PIC,

			// 表单数据   

			formTitle: news.NEWS_TITLE,
			formCate: news.NEWS_CATE,
			formContent: news.NEWS_CONTENT,

		});
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
		data.desc = ccminiHelper.fmtText(data.content, 100);

		try {
			let newsId = this.data.id;
			data.id = newsId;

			// 先修改，再上传 
			await ccminiCloudHelper.callCloudSumbit('admin/news_edit', data);

			// 图片 提交处理 
			wx.showLoading({
				title: '提交中...',
				mask: true
			});


			let imgList = this.data.imgList;
			await AdminNewsBiz.updateNewsPic(newsId, imgList);


			let callback = async function () {
				// 更新列表页面数据
				ccminiPageHelper.modifyPrevPageListNode(newsId, 'NEWS_TITLE', data.title); 
				ccminiPageHelper.modifyPrevPageListNode(newsId, 'NEWS_CATE', data.cate);
				ccminiPageHelper.goto('', 'back');

			}
			ccminiPageHelper.showSuccToast('修改成功', 2000, callback);

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