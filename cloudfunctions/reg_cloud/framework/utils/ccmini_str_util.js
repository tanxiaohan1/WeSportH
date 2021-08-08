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
  * Notes: 字符相关操作函数
  * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
  * Date: 2020-09-05 04:00:00
  * Version : CCMiniCloud Framework Ver 2.0.1 ALL RIGHTS RESERVED BY 明章科技
  */


 const genRandomNum = (min, max) => (Math.random() * (max - min + 1) | 0) + min;

 const genRandomString = len => {
 	const text = 'abcdefghijklmnopqrstuvwxyz0123456789';
 	const rdmIndex = text => Math.random() * text.length | 0;
 	let rdmString = '';
 	for (; rdmString.length < len; rdmString += text.charAt(rdmIndex(text)));
 	return rdmString;
 }

 function str2Arr(str, sp) {
 	if (str && Array.isArray(str)) return str;

 	if (sp == undefined) sp = ',';

 	str = str.replace(/，/g, ",");
 	let arr = str.split(',');
 	for (let i = 0; i < arr.length; i++) {
 		arr[i] = arr[i].trim();

 		if (isNumber(arr[i])) {
 			arr[i] = Number(arr[i]);
 		}

 	}
 	return arr;
 }

 function isNumber(val) {
 	var reg = /^[0-9]+.?[0-9]*$/;
 	if (reg.test(val)) {
 		return true;
 	} else {
 		return false;
 	}
 }


 function getArrByKey(arr, key) {
 	if (!Array.isArray(arr)) return;
 	return arr.map((item) => {
 		return item[key]
 	});
 }

 function fmtText(content, len = -1) {
 	let str = content.replace(/[\r\n]/g, ""); //去掉回车换行
 	if (len > 0) {
 		str = str.substr(0, len);
 	}
 	return str.trim();
 }

 module.exports = {
 	str2Arr,
 	isNumber,
 	getArrByKey,
 	genRandomString,
 	genRandomNum,
 	fmtText,
 }