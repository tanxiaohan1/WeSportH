 /**
 * Notes: UGC内容校验
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-11-14 07:48:00 
 */

const ccminiCloudHelper = require('../helper/ccmini_cloud_helper.js'); 

/**
 * 图片类型校验
 * @param {*} fileName 
 * @param {*} type 
 */
function imgTypeCheck(path, type = ['jpg', 'jpeg', 'png']) {
	let fmt = path.split(".")[(path.split(".")).length - 1];
	if (type.indexOf(fmt) > -1)
		return true;
	else
		return false;
}

/**
 * 图片大小校验
 * @param {*} size 
 * @param {*} maxSize 
 */
function imgSizeCheck(size, maxSize) {
	return size < maxSize;
}
 


module.exports = { 
	imgTypeCheck,
	imgSizeCheck
}