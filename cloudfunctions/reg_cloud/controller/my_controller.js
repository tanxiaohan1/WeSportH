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
 * Notes: 用户中心模块控制器
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-11-04 04:00:00
 * Version : CCMiniCloud Framework Ver 2.0.1 ALL RIGHTS RESERVED BY 明章科技
 */

const BaseCCMiniController = require('./base_ccmini_controller.js'); 
const UserService = require('../service/user_service.js'); 
const InfoService = require('../service/info_service.js');
const AlbumService = require('../service/album_service.js');
const MeetService = require('../service/meet_service.js');
const ccminiTimeUtil = require('../framework/utils/ccmini_time_util.js');
const ccminiStrUtil = require('../framework/utils/ccmini_str_util.js'); 
const ccminiContentCheck = require('../framework/validate/ccmini_content_check.js'); 

class MyController extends BaseCCMiniController {
 
	async getMyInviteList() {
		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			whereEx: 'object|name=附加查询条件',
			page: 'required|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.ccminiValidateData(rules);

		let service = new UserService();
		let result = await service.getMyInviteList(this._userId, input);

		// 数据格式化
		let list = result.list;
		for (let k in list) {
			list[k].USER_LOGIN_TIME = ccminiTimeUtil.timestamp2Time(list[k].USER_LOGIN_TIME, 'Y-M-D');
			list[k].USER_BIRTH = ccminiTimeUtil.getAge(list[k].USER_BIRTH);
		}
		result.list = list;

		return result;
	}

 
	async getMyInfoList() {
		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			whereEx: 'object|name=附加查询条件',
			page: 'required|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.ccminiValidateData(rules);

		let service = new InfoService();
		let result = await service.getMyInfoList(this._userId, input);

		// 数据格式化
		let list = result.list;
		for (let k in list) {
			list[k].INFO_ADD_TIME = ccminiTimeUtil.timestamp2Time(list[k].INFO_ADD_TIME);
			list[k].INFO_EXPIRE_TIME = ccminiTimeUtil.timestamp2Time(list[k].INFO_EXPIRE_TIME, 'Y-M-D');
 
		}
		result.list = list;

		return result;
	}
 
	async getMyMeetList() {
		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			whereEx: 'object|name=附加查询条件',
			page: 'required|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.ccminiValidateData(rules);

		let service = new MeetService();
		let result = await service.getMyMeetList(this._userId, input);

		// 数据格式化
		let list = result.list;
		for (let k in list) {
			list[k].MEET_ADD_TIME = ccminiTimeUtil.timestamp2Time(list[k].MEET_ADD_TIME);
			list[k].MEET_EXPIRE_TIME = ccminiTimeUtil.timestamp2Time(list[k].MEET_EXPIRE_TIME);
			list[k].MEET_DAY = ccminiTimeUtil.timestamp2Time(list[k].MEET_DAY, 'Y-M-D');

			// 地区
			let area = '';
			if (list[k].MEET_REGION_CITY != '全部') {
				area = list[k].MEET_REGION_CITY;
				area += (list[k].MEET_REGION_COUNTY != '全部') ? ' ' + list[k].MEET_REGION_COUNTY : '';
			} else {
				area = list[k].MEET_REGION_PROVINCE;
				area += (list[k].MEET_REGION_CITY != '全部') ? ' ' + list[k].MEET_REGION_CITY : '';
				area += (list[k].MEET_REGION_COUNTY != '全部') ? ' ' + list[k].MEET_REGION_COUNTY : '';
			}
			list[k].MEET_REGION = area;
		 
		}
		result.list = list;

		return result;
	}
 
	async getMyAlbumList() {
		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			sortType: 'string|name=搜索类型',
			sortVal: 'name=搜索类型值',
			orderBy: 'object|name=排序',
			whereEx: 'object|name=附加查询条件',
			page: 'required|int|default=1',
			size: 'int',
			isTotal: 'bool',
			oldTotal: 'int',
		};

		// 取得数据
		let input = this.ccminiValidateData(rules);

		let service = new AlbumService();
		let result = await service.getMyAlbumList(this._userId, input);

		// 数据格式化
		let list = result.list;
		for (let k in list) {
			list[k].ALBUM_ADD_TIME = ccminiTimeUtil.timestamp2Time(list[k].ALBUM_ADD_TIME, 'Y-M-D');

			// 默认图片
			list[k].ALBUM_PIC = ccminiStrUtil.getArrByKey(list[k].ALBUM_PIC, 'cloudId');

		}
		result.list = list;

		return result;
	}

}

module.exports = MyController;