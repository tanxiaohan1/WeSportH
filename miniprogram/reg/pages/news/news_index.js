const NewsBiz = require('../../biz/news_biz.js');
const ccminiPageHelper = require('../../helper/ccmini_page_helper.js');
const PassportBiz = require('../../biz/passport_biz.js');
const AdminNewsBiz = require('../../biz/admin_news_biz.js');

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

		//设置搜索菜单
		this.setData(await NewsBiz.getSearchMenu());
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: async function () {
		PassportBiz.loginSilence(this);

		// 获取当前小程序的页面栈
		let pages = getCurrentPages();
		// 数组中索引最大的页面--当前页面
		let currentPage = pages[pages.length - 1];
		// 附加参数 
	 
		if (currentPage.options && currentPage.options.cate) {
			let cate = AdminNewsBiz.CATE_OPTIONS[currentPage.options.cate];
			wx.setNavigationBarTitle({
				title: cate
			});
			this.setData({
				_params: {
					cate
				}
			});
		}

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

})