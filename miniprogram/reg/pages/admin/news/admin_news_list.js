const NewsBiz = require('../../../biz/news_biz.js');
const AdminNewsBiz = require('../../../biz/admin_news_biz.js');
const AdminBiz = require('../../../biz/admin_biz.js');
const ccminiPageHelper = require('../../../helper/ccmini_page_helper.js');
const ccminiCloudHelper = require('../../../helper/ccmini_cloud_helper.js'); 

Page({

	/**
	 * 页面的初始数据
	 */
	data: { 
		modalName: ''
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		if (!AdminBiz.isAdmin(this)) return;
		
		//设置搜索菜单
		await this._getSearchMenu(); 
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

	bindShowDetailTap: async function (e) {
		this.setData({
			detail: ''
		});
		let id = e.currentTarget.dataset.id;
		if (!id) return;

		let params = {
			id
		}

		let news = await ccminiCloudHelper.callCloudData('admin/news_detail', params);
		if (!news) {
			ccminiPageHelper.showNoneToast('记录不存在或者已删除')
			return;
		}

		this.setData({
			detail: news
		})
	}, 

	bindSortTap: async function (e) {
		let id = e.currentTarget.dataset.id;
		let sort = e.currentTarget.dataset.sort;
		if (!id || !sort) return;

		let params = {
			id,
			sort
		}

		let that = this;
		try {
			await ccminiCloudHelper.callCloudSumbit('admin/news_sort', params).then(res => {
				ccminiPageHelper.modifyListNode(id, that.data.dataList.list, 'NEWS_ORDER', sort);
				that.setData({
					dataList: that.data.dataList
				});
			});
		} catch (e) {
			console.log(e);
		}
	},

	bindDelTap: async function (e) {

		let id = e.currentTarget.dataset.id; 
 
		if (!id) return;

		let params = {
			id
		}

		let that = this;
		let callback = async function () {
			try {
				let opts = {
					title: '删除中'
				}
				await ccminiCloudHelper.callCloudSumbit('admin/news_del', params, opts).then(res => {
					ccminiPageHelper.delListNode(id, that.data.dataList.list, '_id');
					that.data.dataList.total--;
					that.setData({
						dataList: that.data.dataList
					});
					ccminiPageHelper.showSuccToast('删除成功');
				});
			} catch (e) {
				console.log(e);
			}
		}
		ccminiPageHelper.showConfirm('确认删除？删除不可恢复', callback);

	},

	bindHideDetailModalTap: function () {
		this.setData({
			detail: ''
		});
	},

	bindStatusTap: async function (e) {
		let id = e.currentTarget.dataset.id;
		let status = e.currentTarget.dataset.status;
		if (!id || !status) return;
		status = Number(status);

		let params = {
			id,
			status
		}

		let that = this;
		try {
			await ccminiCloudHelper.callCloudSumbit('admin/news_status', params).then(res => {
				ccminiPageHelper.modifyListNode(id, that.data.dataList.list, 'NEWS_STATUS', status,'_id');
				that.setData({
					dataList: that.data.dataList
				});
				ccminiPageHelper.showSuccToast('设置成功');
			});
		} catch (e) {
			console.log(e);
		}
	},

	_getSearchMenu: async function () {   
		 
		let sortItems = [];
		let sortMenus = [ 
			{
				label: '正常',
				type: 'status',
				value: 1
			}, 
			{
				label: '停用',
				type: 'status',
				value: 0
			},
			{
				label: '全部',
				type: '',
				value: ''
			}
		];

		let arr = AdminNewsBiz.CATE_OPTIONS;
	 
		for (let k in arr) {
			sortMenus.push({
				label: arr[k],
				type: 'cate',
				value: arr[k]
			});
		} 
		
		this.setData({
			sortItems,
			sortMenus
		}) 	
		

	}
 
})