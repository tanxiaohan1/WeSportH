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
 * Notes: 公告通知模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-10-29 07:48:00 
 */

const BaseCCMiniService = require('./base_ccmini_service.js');
const ccminiDbUtil = require('../framework/database/ccmini_db_util.js');
const ccminiUtil = require('../framework/utils/ccmini_util.js');
const NewsModel = require('../model/news_model.js');
class NewsService extends BaseCCMiniService {


	async viewNews(id) {

		let fields = '*';

		let where = {
			_id: id,
			NEWS_STATUS: 1
		}
		let news = await NewsModel.getOne(where, fields);
		if (!news) return null;

		NewsModel.inc(id, 'NEWS_VIEW_CNT', 1);

		return news;
	}

	async getNewsList({
		search,
		cate = '',
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
		let fields = 'NEWS_PIC,NEWS_VIEW_CNT,NEWS_TITLE,NEWS_DESC,NEWS_ADD_TIME,NEWS_ORDER,NEWS_STATUS';

		let where = {};
		where.NEWS_STATUS = 1; // 状态 

		if (cate)
			where.NEWS_CATE = cate;

		if (ccminiUtil.isDefined(search) && search) {
			where.NEWS_TITLE = {
				$regex: '.*' + search,
				$options: 'i'
			};
		} else if (sortType && ccminiUtil.isDefined(sortVal)) {
			switch (sortType) {
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


}

module.exports = NewsService;