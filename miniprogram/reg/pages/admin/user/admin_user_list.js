const ccminiPageHelper = require('../../../helper/ccmini_page_helper.js');
const ccminiCloudHelper = require('../../../helper/ccmini_cloud_helper.js');
const AdminBiz = require('../../../biz/admin_biz.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		if (!AdminBiz.isAdmin(this)) return;

		//设置搜索菜单
		this.setData(this._getSearchMenu());
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: async function () {},

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
				await ccminiCloudHelper.callCloudSumbit('admin/user_del', params, opts).then(res => {
					ccminiPageHelper.delListNode(id, that.data.dataList.list, 'USER_MINI_OPENID');
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
			await ccminiCloudHelper.callCloudSumbit('admin/user_status', params).then(res => {
				ccminiPageHelper.modifyListNode(id, that.data.dataList.list, 'USER_STATUS', status, 'USER_MINI_OPENID');
				that.setData({
					dataList: that.data.dataList
				});
				ccminiPageHelper.showSuccToast('设置成功');
			});
		} catch (e) {
			console.log(e);
		}
	},

	_getSearchMenu: function () {
		let sortItem1 = [{
				label: '入学年份',
				type: '',
				value: 0
			},
			{
				label: '1950级以前',
				type: 'enroll',
				value: 1940
			},
			{
				label: '50～59级',
				type: 'enroll',
				value: 1950
			},
			{
				label: '60～69级',
				type: 'enroll',
				value: 1960
			},
			{
				label: '70～79级',
				type: 'enroll',
				value: 1970
			},
			{
				label: '80～89级',
				type: 'enroll',
				value: 1980
			},
			{
				label: '90～99级',
				type: 'enroll',
				value: 1990
			},
			{
				label: '00～09级',
				type: 'enroll',
				value: 2000
			},
			{
				label: '2010级以后',
				type: 'enroll',
				value: 2010
			},
		];

		let sortItems = [sortItem1];
		let sortMenus = [{
				label: '最新',
				type: 'sort',
				value: 'new'
			},
			{
				label: '最近',
				type: 'sort',
				value: 'last'
			}, 
			{
				label: '正常',
				type: 'status',
				value: 1
			},
			{
				label: 'VIP',
				type: 'status',
				value: 8
			},
			{
				label: '禁用',
				type: 'status',
				value: 9
			},
			{
				label: '全部',
				type: '',
				value: ''
			}
		]

		return {
			sortItems,
			sortMenus
		}

	}

})