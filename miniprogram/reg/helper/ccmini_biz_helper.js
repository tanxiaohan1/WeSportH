/**
 * Notes: 业务通用
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-11-14 07:48:00 
 */

const ccminiCacheHelper = require('./ccmini_cache_helper.js');
const CCMINI_SETTING = require('./ccmini_setting.js');

function isCacheList(key) {
	key = key.toUpperCase();
	if (CCMINI_SETTING.CACHE_IS_LIST)
		return ccminiCacheHelper.get(key + '_LIST');
	else
		return false;
}

function removeCacheList(key) {
	key = key.toUpperCase();
	if (CCMINI_SETTING.CACHE_IS_LIST)
		ccminiCacheHelper.remove(key + '_LIST');
}

function setCacheList(key, time = CCMINI_SETTING.CACHE_LIST_TIME) {
	key = key.toUpperCase();
	if (CCMINI_SETTING.CACHE_IS_LIST)
		ccminiCacheHelper.set(key + '_LIST', 'TRUE', time);
}


module.exports = {
	isCacheList,
	removeCacheList,
	setCacheList
}