/**
 * Notes: 用户模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-11-14 07:48:00 
 */

const BaseCCMiniBiz = require('./base_ccmini_biz.js');
const ccminiCloudHelper = require('../helper/ccmini_cloud_helper.js');
const ccminiHelper = require('../helper/ccmini_helper.js');
const ccminiPageHelper = require('../helper/ccmini_page_helper.js');
const CCMINI_SETTING = require('../helper/ccmini_setting.js'); 
const PassportBiz = require('./passport_biz.js');

/**
 * 
 */
class UserBiz extends BaseCCMiniBiz {

	/**
	 * 修改用户头像 
	 */
	static async uploadAvatar(path, source, formId) {
 
	 

		let filePath = path;
		let ext = filePath.match(/\.[^.]+?$/)[0];
		let rd = ccminiHelper.genRandomNum(100000, 999999);
		await wx.cloud.uploadFile({
			cloudPath: CCMINI_SETTING.USER_PIC_DIR + formId + '_' + rd + ext,
			filePath: filePath, // 文件路径
		}).then(async (res) => {

			try {
				let params = {
					fileID: res.fileID, 
				};
				let opts = {
					hint: false
				}
				await ccminiCloudHelper.callCloudSumbit('passport/update_pic', params, opts).then(result => {
					// 不同来源
					if (source === 'my_base') {
						let parent = ccminiPageHelper.getPrevPage();
						parent.setData({
							formPic: result.data.url
						});
						let grandParent = ccminiPageHelper.getPrevPage(3);
						grandParent.setData({
							['user.USER_PIC']: result.data.url
						});
					} else if (source === 'my_index') {
						let parent = ccminiPageHelper.getPrevPage();
						parent.setData({
							['user.USER_PIC']: result.data.url
						});
					}
					PassportBiz.setUserPic(result.data.url);
					ccminiPageHelper.showNoneToast('头像上传成功', 1000);
					ccminiPageHelper.goto('', 'back');
				});
			} catch (e) {
				console.log(err)
			}

		}).catch(error => {
			// handle error TODO:剔除图片
		})
	}

 
	/**
	 * 搜索菜单设置
	 */
	static getSearchMenu() {
		 
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
		 

		// 分类
		let sortItem2 = [];

		let sortItems = [sortItem1];
		let sortMenus = [{
				label: '最新',
				type: 'sort',
				value: 'new'
			}, 
			{
				label: '按入学',
				type: 'sort',
				value: 'enroll'
			},
			{
				label: '按毕业',
				type: 'sort',
				value: 'grad'
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

	static getFormCheckRules() {
		 
		return {
			name: 'formName|required|string|min:2|max:20|name=姓名',

			sex: 'formSex|required|int|len:1|in:1,2|name=性别', 
			item: 'formItem|required|string|min:2|max:50|name=班级',
			birth: 'formBirth|required|date|name=生日', 
		
			enroll: 'formEnroll|required|int|len:4|name=入学年份',
			grad: 'formGrad|required|int|len:4|name=毕业年份',
			city: 'formCity|required|string|min:2|max:50|name=所在城市',
		 
			edu: 'formEdu|required|string|min:2|max:50|name=学历', 
		

			trade: 'formTrade|required|string|min:2|max:50|name=当前行业', 
			company: 'formCompany|required|string|min:2|max:50|name=工作单位', 
			companyDuty: 'formCompanyDuty|string|min:2|max:50|name=工作职位',
 
			mobile: 'formMobile|string|min:2|max:50|name=电话',
			wechat: 'formWechat|string|min:2|max:50|name=微信',
			email: 'formEmail|email|min:2|max:50|name=Email',
			qq: 'formQq|string|min:2|max:50|name=QQ',

			desc: 'formDesc|string|max:500|name=自我介绍',
			resource: 'formResource|string|max:500|name=需求与资源',
		}

	}

}

UserBiz.EDU_OPTIONS = '中学,高职,大专,本科,硕士,博士,博士后,其他'.split(',');
  

module.exports = UserBiz;