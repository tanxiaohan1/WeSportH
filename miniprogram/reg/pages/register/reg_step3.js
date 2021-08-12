const ccminiPageHelper = require('../../helper/ccmini_page_helper.js');
const ccminiValidate = require('../../helper/ccmini_validate.js');
const UserBiz = require('../../biz/user_biz.js');
const RegBiz = require('../../biz/reg_biz.js');
const ccminiCloudHelper = require('../../helper/ccmini_cloud_helper.js');
const PassportBiz = require('../../biz/passport_biz.js');
const ccminiCacheHelper = require('../../helper/ccmini_cache_helper.js');
const CCMINI_SETTING = require('../../helper/ccmini_setting.js');
const ccminiHelper = require('../../helper/ccmini_helper.js');
const ccminiComm = require('../../helper/ccmini_comm.js');

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		formSex: 1,

		eduOptions: UserBiz.EDU_OPTIONS,

		formEduIndex: 3,

	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: async function (options) {
		await PassportBiz.initPage(this);

		if (await PassportBiz.isRegister(this)) return;

		// 判断是否有phone认证
		if (!RegBiz.isStep1())
			return ccminiPageHelper.goto('reg_step1', 'relaunch');

		if (!RegBiz.isStep2())
			return ccminiPageHelper.goto('reg_step2', 'back');
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
		let that = this;
		ccminiPageHelper.model(that, e);
	},

	bindSubmitForm: async function (e) {
		let data = this.data;
		data.formEdu = UserBiz.EDU_OPTIONS[data.formEduIndex];

		// 判断是否有phone认证和微信授权
		if (!RegBiz.isStep1() || !RegBiz.isStep2())
			return ccminiPageHelper.goto("reg_step1", 'relaunch');

		// 数据清洗与校验
		let checkRules = UserBiz.getFormCheckRules();


		data = ccminiValidate.check(data, checkRules, this);
		if (!data) return;
		if (Number(data.enroll) > Number(data.grad))
			return ccminiPageHelper.showModal('入学年份不能早于毕业年份');

		let opt = {
			title: '注册中'
		};
		let params = {};
		params.wechatData = RegBiz.getRegCache('user');
		params.phone = RegBiz.getRegCache('phone');
		params.formData = data;


		await ccminiCloudHelper.callCloudSumbit('passport/reg', params, opt).then(result => {
			ccminiCacheHelper.clear();
			if (result && ccminiHelper.isDefined(result.data.token) && result.data.token) {
				ccminiCacheHelper.set(ccminiComm.CACHE_TOKEN, result.data.token, CCMINI_SETTING.PASSPORT_TOKEN_EXPIRE);

				// 清除注册缓存
				RegBiz.clearRegCache();
				ccminiPageHelper.showSuccToast('注册成功！');

				setTimeout(() => {
					return ccminiPageHelper.goto('/pages/my/reload/my_reload', 'relaunch');
				}, 1500);

			} else if (result && result.data && result.data === 'CODE_WAITCHECK') {
				ccminiPageHelper.hint('注册成功！正在等待系统审核', 'reLaunch');
			} else
				ccminiPageHelper.showModal('注册遇到了一点小问题，请重新提交');
		}).catch(err => {
			console.log(err)
		});

	},
})