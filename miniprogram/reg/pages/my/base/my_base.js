const ccminiCloudHelper = require('../../../helper/ccmini_cloud_helper.js');
const ccminiHelper = require('../../../helper/ccmini_helper.js');
const ccminiPageHelper = require('../../../helper/ccmini_page_helper.js');
const UserBiz = require('../../../biz/user_biz.js');
const PassportBiz = require('../../../biz/passport_biz.js');
const ccminiValidate = require('../../../helper/ccmini_validate.js'); 

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		isLoad: false,

		eduOptions: UserBiz.EDU_OPTIONS, 

		formEduIndex: 0, 
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		await PassportBiz.initPage(this);
		
		if (!await PassportBiz.loginMustReturnWin(this)) return;

		// 取得用户信息 
		let params = {
			fields: 'USER_EDU,USER_ITEM,USER_ID,USER_PIC,USER_NAME,USER_WORK,USER_BIRTH,USER_SEX,USER_CITY,USER_MOBILE,USER_QQ,USER_WECHAT,USER_EMAIL,USER_ENROLL,USER_GRAD,USER_COMPANY,USER_COMPANY_DUTY,USER_TRADE,USER_CITY,USER_DESC,USER_RESOURCE'
		};
		let opts = {
			title: 'bar'
		}
		let user = await ccminiCloudHelper.callCloudData('user/my_detail', params, opts);
		user = ccminiHelper.model2Form(user);

		let formEduIndex = UserBiz.EDU_OPTIONS.indexOf(user.formEdu);
		formEduIndex = (formEduIndex < 0) ? 0 : formEduIndex;
 

		this.setData({
			...user,
			isLoad: true,
			formEduIndex, 
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

	bindSubmitForm: async function (e) {
		let data = this.data;
		data.formEdu = UserBiz.EDU_OPTIONS[data.formEduIndex]; 

		// 数据清洗与校验  
		let checkRules = UserBiz.getFormCheckRules();


		data = ccminiValidate.check(data, checkRules, this);
		if (!data) return;
		if (Number(data.enroll) > Number(data.grad))
			return ccminiPageHelper.showModal('入学年份不能早于毕业年份');

		let params = {
			formData: data
		};
		await ccminiCloudHelper.callCloudSumbit('passport/modify', params).then(result => {
			 
			ccminiPageHelper.goto('../reload/my_reload' , 'relaunch');
		}).catch(err => {
			console.log(err);
		});

	},


	model: function (e) {
		let that = this;
		ccminiPageHelper.model(that, e);
	},

 

})