/**
 * Notes: 基础模块业务逻辑
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-11-14 07:48:00 
 */

class CCMiniBaseBiz {
	// 取得可选options
	static options(str) {
		if (!str)
			return [];
		else
			return str.split(',')
	}
}

module.exports = CCMiniBaseBiz;