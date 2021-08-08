// +----------------------------------------------------------------------
// | CCMiniCloud [ Cloud Framework ]
// +----------------------------------------------------------------------
// | Copyright (c) 2021 www.code942.com All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: 明章科技
// +----------------------------------------------------------------------

/**
 * Notes: 后台管理模块
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-10-22 07:48:00 
 */

const BaseCCMiniService = require('./base_ccmini_service.js');

const ccminiDbUtil = require('../framework/database/ccmini_db_util.js');
const ccminiStrUtil = require('../framework/utils/ccmini_str_util.js');

const ccminiCloudUtil = require('../framework/cloud/ccmini_cloud_util.js');
const ccminiCloudBase = require('../framework/cloud/ccmini_cloud_base.js');
const ccminiUtil = require('../framework/utils/ccmini_util.js');
const ccminiTimeUtil = require('../framework/utils/ccmini_time_util.js');
const ccminiAppCode = require('../framework/handler/ccmini_app_code.js');

const ccminiConfig = require('../comm/ccmini_config.js');

const SetupModel = require('../model/setup_model.js');
const UserModel = require('../model/user_model.js');
const AdminModel = require('../model/admin_model.js');
const NewsModel = require('../model/news_model.js');

class AdminService extends BaseCCMiniService {

	async isAdmin(token) {
		let where = {
			ADMIN_TOKEN: token,
			ADMIN_TOKEN_TIME: ['>', ccminiTimeUtil.time() - ccminiConfig.CCMINI_ADMIN_LOGIN_EXPIRE * 1000],
			ADMIN_STATUS: 1,
		}
		let admin = await AdminModel.getOne(where);
		if (!admin)
			this.ccminiAppError('管理员不存在', ccminiAppCode.ADMIN_ERROR);

		return admin;
	}

	async adminHome() {
		let where = {};


		let userCnt = await UserModel.count(where);
		let newsCnt = await NewsModel.count(where);

		return {

			userCnt,
			newsCnt,
			projectVerCloud: ccminiConfig.PROJECT_VER,
			projectSource: ccminiConfig.PROJECT_SOURCE
		}
	}

	async adminLogin(cloudID) {

		let cloud = ccminiCloudBase.getCloud();
		let res = await cloud.getOpenData({
			list: [cloudID], // 假设 event.openData.list 是一个 CloudID 字符串列表
		});

		let phone = '';
		if (res && res.list && res.list[0] && res.list[0].data) {
			phone = res.list[0].data.phoneNumber;
		} else
			this.ccminiAppError('手机号码错误')

		if (phone.length < 5)
			this.ccminiAppError('手机号码错误');

		if (phone != ccminiConfig.CCMINI_ADMIN_MOBILE)
			this.ccminiAppError('管理员手机号码不正确');

		// 判断是否存在
		let where = {
			ADMIN_STATUS: 1
		}
		let fields = 'ADMIN_PHONE,ADMIN_ID,ADMIN_NAME,ADMIN_TYPE,ADMIN_LOGIN_TIME,ADMIN_LOGIN_CNT';
		let admin = await AdminModel.getOne(where, fields);
		if (!admin)
			this.ccminiAppError('管理员不存在');

		let cnt = admin.ADMIN_LOGIN_CNT;

		// 生成token
		let token = ccminiStrUtil.genRandomString(32);
		let tokenTime = ccminiTimeUtil.time();
		let data = {
			ADMIN_TOKEN: token,
			ADMIN_PHONE: ccminiConfig.CCMINI_ADMIN_MOBILE,
			ADMIN_TOKEN_TIME: tokenTime,
			ADMIN_LOGIN_TIME: ccminiTimeUtil.time(),
			ADMIN_LOGIN_CNT: cnt + 1
		}
		await AdminModel.edit(where, data);

		let name = admin.ADMIN_NAME;
		let type = admin.ADMIN_TYPE;
		let last = (!admin.ADMIN_LOGIN_TIME) ? '尚未登录' : ccminiTimeUtil.timestamp2Time(admin.ADMIN_LOGIN_TIME);


		return {
			token,
			name,
			type,
			last,
			cnt
		}


	}



	async setupEdit({
		title,
		regCheck,
		about
	}) {

		let data = {
			SETUP_TITLE: title,
			SETUP_REG_CHECK: regCheck,
			SETUP_ABOUT: about
		}
		await SetupModel.edit({}, data);
	}


	/************** 系统设置 END ********************* */





	/************** 用户 BEGIN ********************* */
	async getUser({
		userId,
		fields = '*'
	}) {
		let where = {
			USER_MINI_OPENID: userId,
		}
		return await UserModel.getOne(where, fields);
	}

	async getUserList(userId, {
		search,
		sortType,
		sortVal,
		orderBy,
		whereEx,
		page,
		size,
		oldTotal = 0
	}) {

		orderBy = orderBy || {
			USER_ADD_TIME: 'desc'
		};
		let fields = 'USER_ADD_TIME,USER_VIEW_CNT,USER_EDU,USER_ITEM,USER_INFO_CNT,USER_ALBUM_CNT,USER_MEET_CNT,USER_NAME,USER_BIRTH,USER_SEX,USER_PIC,USER_STATUS,USER_CITY,USER_COMPANY,USER_TRADE,USER_COMPANY_DUTY,USER_ENROLL,USER_GRAD,USER_LOGIN_TIME,USER_MINI_OPENID';


		let where = {};
		where.and = {
			//USER_STATUS: UserModel.STATUS.COMM, 
		};

		if (ccminiUtil.isDefined(search) && search) {
			where.or = [{
					USER_NAME: ['like', search]
				},
				{
					USER_CITY: ['like', search]
				},
				{
					USER_ITEM: ['like', search]
				},
				{
					USER_TRADE: ['like', search]
				},
			];

		} else if (sortType && ccminiUtil.isDefined(sortVal)) {
			switch (sortType) {
				case 'enroll':
					switch (sortVal) {
						case 1940:
							where.and.USER_ENROLL = ['<', 1950];
							break;
						case 1950:
							where.and.USER_ENROLL = [
								['>=', 1950],
								['<=', 1959]
							];
							break;
						case 1960:
							where.and.USER_ENROLL = [
								['>=', 1960],
								['<=', 1969]
							];
							break;
						case 1970:
							where.and.USER_ENROLL = [
								['>=', 1970],
								['<=', 1979]
							];
							break;
						case 1980:
							where.and.USER_ENROLL = [
								['>=', 1980],
								['<=', 1989]
							];
							break;
						case 1990:
							where.and.USER_ENROLL = [
								['>=', 1990],
								['<=', 1999]
							];
							break;
						case 2000:
							where.and.USER_ENROLL = [
								['>=', 2000],
								['<=', 2009]
							];
							break;
						case 2010:
							where.and.USER_ENROLL = ['>=', 2010];
							break;
					}
					break;
				case 'sort':
					if (sortVal == 'new') { //最新
						orderBy = {
							'USER_ADD_TIME': 'desc'
						};
					}
					if (sortVal == 'last') { //最近
						orderBy = {
							'USER_LOGIN_TIME': 'desc',
							'USER_ADD_TIME': 'desc'
						};
					}
					if (sortVal == 'enroll') { //入学  
						orderBy = {
							'USER_ENROLL': 'asc',
							'USER_LOGIN_TIME': 'desc'
						};
					}
					if (sortVal == 'info') {
						orderBy = {
							'USER_INFO_CNT': 'desc',
							'USER_LOGIN_TIME': 'desc'
						};
					}
					if (sortVal == 'album') {
						orderBy = {
							'USER_ALBUM_CNT': 'desc',
							'USER_LOGIN_TIME': 'desc'
						};
					}
					if (sortVal == 'meet') {
						orderBy = {
							'USER_MEET_CNT': 'desc',
							'USER_LOGIN_TIME': 'desc'
						};
					}
					break;
			}
		}
		let result = await UserModel.getList(where, fields, orderBy, page, size, true, oldTotal);


		return result;
	}

	async statusUser(id, status) {
		status = Number(status)
		let data = {
			USER_STATUS: status
		}
		let where = {
			'USER_MINI_OPENID': id
		}
		await UserModel.edit(where, data);



	}

	async delUser(id) {
		let whereUser = {
			USER_MINI_OPENID: id
		}


		UserModel.del(whereUser);



	}
	/************** 用户 END ********************* */



	/************** 资讯主体 BEGIN ********************* */

	async insertNews(adminId, {
		title,
		cate,
		content
	}) {

		// 重复性判断
		let where = {
			NEWS_TITLE: title,
		}
		if (await NewsModel.count(where))
			this.ccminiAppError('该标题已经存在');

		// 赋值 
		let data = {};
		data.NEWS_TITLE = title;
		data.NEWS_CONTENT = content;
		data.NEWS_CATE = cate;
		data.NEWS_DESC = ccminiStrUtil.fmtText(content, 100);

		data.NEWS_ADMIN_ID = adminId;

		let id = await NewsModel.insert(data);


		return {
			id
		};
	}

	async delNews(id) {
		let where = {
			_id: id
		}

		// 取出图片数据
		let news = await NewsModel.getOne(where, 'NEWS_PIC');
		if (!news) return;

		await NewsModel.del(where);

		// 异步删除图片 
		let cloudIds = ccminiStrUtil.getArrByKey(news.NEWS_PIC, 'cloudId');
		ccminiCloudUtil.deleteFiles(cloudIds);


		return;
	}

	async getNewsDetail(id) {
		let fields = '*';

		let where = {
			_id: id
		}
		let news = await NewsModel.getOne(where, fields);
		if (!news) return null;

		let urls = ccminiStrUtil.getArrByKey(news.NEWS_PIC, 'url');
		news.NEWS_PIC = urls;

		return news;
	}


	async updateNewsPic({
		newsId,
		imgList
	}) {

		let newList = await ccminiCloudUtil.getTempFileURL(imgList);

		let news = await NewsModel.getOne(newsId, 'NEWS_PIC');

		let picList = await ccminiCloudUtil.handlerCloudFiles(news.NEWS_PIC, newList);

		let data = {
			NEWS_PIC: picList
		};
		await NewsModel.edit(newsId, data);

		let urls = ccminiStrUtil.getArrByKey(picList, 'url');

		return {
			urls
		};

	}


	async editNews({
		id,
		title,
		cate,
		content,
		desc
	}) {

		let where = {
			NEWS_TITLE: title,
			_id: ['<>', id]
		}
		if (await NewsModel.count(where))
			this.ccminiAppError('该标题已经存在');

		let data = {};
		data.NEWS_TITLE = title;
		data.NEWS_CATE = cate;
		data.NEWS_CONTENT = content;
		data.NEWS_DESC = ccminiStrUtil.fmtText(desc, 100);

		await NewsModel.edit(id, data);
	}

	async getNewsList({
		search,
		sortType,
		sortVal,
		orderBy,
		whereEx,
		page,
		size,
		isTotal = true,
		oldTotal
	}) {

		orderBy = orderBy || {
			'NEWS_ORDER': 'asc',
			'NEWS_ADD_TIME': 'desc'
		};
		let fields = 'NEWS_VIEW_CNT,NEWS_TITLE,NEWS_DESC,NEWS_ADD_TIME,NEWS_ORDER,NEWS_STATUS,NEWS_CATE';

		let where = {};

		if (ccminiUtil.isDefined(search) && search) {
			where.NEWS_TITLE = {
				$regex: '.*' + search,
				$options: 'i'
			};
		} else if (sortType && ccminiUtil.isDefined(sortVal)) {
			switch (sortType) {
				case 'cate':
					where.NEWS_CATE = sortVal;
					break;
				case 'status':
					where.NEWS_STATUS = Number(sortVal);
					break;
				case 'sort':
					if (sortVal == 'view') {
						orderBy = {
							'NEWS_VIEW_CNT': 'desc',
							'NEWS_ADD_TIME': 'desc'
						};
					}
					if (sortVal == 'new') {
						orderBy = {
							'NEWS_ADD_TIME': 'desc'
						};
					}

					break;
			}
		}

		return await NewsModel.getList(where, fields, orderBy, page, size, isTotal, oldTotal);
	}

	async statusNews(id, status) {
		let data = {
			NEWS_STATUS: status
		}
		let where = {
			_id: id,
		}
		return await NewsModel.edit(where, data);
	}

	async sortNews(id, sort) {
		sort = Number(sort)
		let data = {
			NEWS_ORDER: sort
		}
		await NewsModel.edit(id, data);
	}

}

module.exports = AdminService;