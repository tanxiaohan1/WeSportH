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
 * Notes: 公告通知模块控制器
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-09-29 04:00:00
 * Version : CCMiniCloud Framework Ver 2.0.1 ALL RIGHTS RESERVED BY 明章科技
 */

const BaseCCMiniController = require('./base_ccmini_controller.js');
const NewsService = require('../service/news_service.js');
const ccminiTimeUtil = require('../framework/utils/ccmini_time_util.js');

class NewsController extends BaseCCMiniController {

	async getNewsList() {
		 
		// 数据校验
		let rules = {
			search: 'string|min:1|max:30|name=搜索条件',
			cate: 'string|name=分类条件',
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
		 
		let service = new NewsService();
		let result = await service.getNewsList(input);

		// 数据格式化
		let list = result.list;

		for (let k in list) {

			list[k].NEWS_ADD_TIME = ccminiTimeUtil.timestamp2Time(list[k].NEWS_ADD_TIME, 'Y-M-D');

			// 默认图片
			if (list[k].NEWS_PIC && list[k].NEWS_PIC.length > 0)
				list[k].NEWS_PIC = list[k].NEWS_PIC[0]['url'];
			else
				list[k].NEWS_PIC = '';
		}
		result.list = list;

		return result;

	} 

	async viewNews() {
		// 数据校验
		let rules = {
			id: 'required|id',
		};

		// 取得数据
		let input = this.ccminiValidateData(rules);

		let service = new NewsService();
		let news = await service.viewNews(input.id);

		if (news) {
			// 显示转换 
			news.NEWS_ADD_TIME = ccminiTimeUtil.timestamp2Time(news.NEWS_ADD_TIME, 'Y-M-D');
		}

		return news;
	}


}

module.exports = NewsController;