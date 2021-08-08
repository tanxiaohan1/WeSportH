/**
 * Notes: 搜索模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-11-14 07:48:00 
 */

const BaseCCMiniBiz = require('./base_ccmini_biz.js');
const ccminiCacheHelper = require('../helper/ccmini_cache_helper.js');

/**
 * 
 */
class SearchBiz extends BaseCCMiniBiz {
	
	static clearHistory(key){
		ccminiCacheHelper.remove(key);
	}

	static getHistory(key)
	{
		return ccminiCacheHelper.get(key, []);

	}

	/**添加关键字缓存 
	 */
	static addHistory(key, val, size = 20, expire = 86400 * 30)  {
		if (!val || val.length == 0) return [];
		
		let his = ccminiCacheHelper.get(key, []);
		
		//查询是否存在 并删除
		let pos = his.indexOf(val);	 
		if (pos > -1) his.splice(pos, 1);
 
		// 加到头部
		his.unshift(val);
 
		// 判断个数， 多的删除
		if (his.length > size)
			his.splice(his.length - 1, 1);
			
		// 存缓存
		ccminiCacheHelper.set(key, his, expire);

		return his;
	}

}

module.exports = SearchBiz;