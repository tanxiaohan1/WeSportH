 /**
 * Notes: 通用类库
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-11-14 07:48:00 
 */

 
function isDefined(val) {
	// ==  不能判断是否为null
	if (val === undefined)
		return false;
	else
		return true;
}

 
function isObjectNull(obj) {
	return (Object.keys(obj).length == 0);
}
 
const genRandomNum = (min, max) => (Math.random() * (max - min + 1) | 0) + min;

 
const genRandomString = len => {
	const text = 'abcdefghijklmnopqrstuvwxyz0123456789';
	const rdmIndex = text => Math.random() * text.length | 0;
	let rdmString = '';
	for (; rdmString.length < len; rdmString += text.charAt(rdmIndex(text)));
	return rdmString;
}

function sleep(time) {
	return new Promise((resolve) => setTimeout(resolve, time));
};

 
function timestamp2Time(unixtime, format = 'Y-M-D h:m:s') {
	let formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
	let returnArr = [];
	let date = new Date(unixtime);
	returnArr.push(date.getFullYear());
	returnArr.push(formatNumber(date.getMonth() + 1));
	returnArr.push(formatNumber(date.getDate()));
	returnArr.push(formatNumber(date.getHours()));
	returnArr.push(formatNumber(date.getMinutes()));
	returnArr.push(formatNumber(date.getSeconds()));
	for (let i in returnArr) {
		format = format.replace(formateArr[i], returnArr[i]);
	}
	return format;
}
 
function time(fmt, step = 0) {
	let t = 0;
	if (isDefined(fmt)) {
		let t = new Date().getTime() + step * 1000;
		return timestamp2Time(t, fmt);
	}
	return new Date().getTime() + t * 1000;
}
 
function time2Timestamp(date) {
	if (date.length < 10) {
		let arr = date.split('-');
		if (arr[1].length == 1) arr[1] = '0' + arr[1];
		if (arr[2].length == 1) arr[2] = '0' + arr[2];
		date = arr[0] + '-' + arr[1] + '-' + arr[2];
	}
	if (date.length == 10) date = date + ' 00:00:00';
	let d = new Date(date.replace(/-/g, "/"));
	return d.getTime();
}

function formatNumber(n) {
	n = n.toString()
	return n[1] ? n : '0' + n
}

 
function  getOptionsIdx(options, val) {
	for (let i = 0; i < options.length; i++) {
		if (options[i].value === val)
			return i;
	}
	return 0;
}

 
function model2Form(model) {
	let newModel = {};
	for (let k in model) {
		let arr = k.split('_');
		let result = '';
		for (let i = 1; i < arr.length; i++) {
			let name = arr[i].toLowerCase();
			name = name.charAt(0).toUpperCase() + name.slice(1);
			result = result + name;
		}

		newModel['form' + result] = model[k];
	}
	return newModel;
}
 
function getAge(birth, isMonth = false) {
	var returnAge = '';
	var mouthAge = '';
	var arr = birth.split("-");
	var birthYear = arr[0];
	var birthMonth = arr[1];
	var birthDay = arr[2];
	var d = new Date();
	var nowYear = d.getFullYear();
	var nowMonth = d.getMonth() + 1;
	var nowDay = d.getDate();
	if (nowYear == birthYear) { 
		var monthDiff = nowMonth - birthMonth;  
		if (monthDiff < 0) {} else {
			mouthAge = monthDiff + '个月';
		}
	} else {
		var ageDiff = nowYear - birthYear;  
		if (ageDiff > 0) {
			if (nowMonth == birthMonth) {
				var dayDiff = nowDay - birthDay; 
				if (dayDiff < 0) {
					returnAge = ageDiff - 1 + '岁';
				} else {
					returnAge = ageDiff + '岁';
				}
			} else {
				var monthDiff = nowMonth - birthMonth; //月之差 
				if (monthDiff < 0) {
					returnAge = ageDiff - 1 + '岁';
				} else {
					mouthAge = monthDiff + '个月';
					returnAge = ageDiff + '岁';
				}
			}
		} else {
			returnAge = -1;  
		}
	}
	if (isMonth)
		return returnAge + mouthAge;  
	else
		return returnAge;
}

function timestame2Ago(dateTimeStamp, fmt = 'Y-M-D', diff = 0) {  
	let minute = 1000 * 60;  
	let hour = minute * 60;
	let day = hour * 24;
	let week = day * 7;
	let month = day * 30;
	let now = new Date().getTime(); //获取当前时间毫秒

	let diffValue = now - dateTimeStamp; //时间差

	if (diffValue < 0) {
		return;
	}
	let minC = diffValue / minute; //计算时间差的分，时，天，周，月
	let hourC = diffValue / hour;
	let dayC = diffValue / day;

	let result = '';
	let weekC = diffValue / week;
	let monthC = diffValue / month;
	if (monthC >= 1 && monthC <= 3) {
		result = ' ' + parseInt(monthC) + '月前'
	} else if (weekC >= 1 && weekC <= 3) {
		result = ' ' + parseInt(weekC) + '周前'
	} else if (dayC >= 1 && dayC <= 6) {
		result = ' ' + parseInt(dayC) + '天前'
	} else if (hourC >= 1 && hourC <= 23) {
		result = ' ' + parseInt(hourC) + '小时前'
	} else if (minC >= 1 && minC <= 59) {
		result = ' ' + parseInt(minC) + '分钟前'
	} else if (diffValue >= 0 && diffValue <= minute) {
		result = '刚刚'
	} else {
		result = timestamp2Time(dateTimeStamp, fmt, diff);

	}
	return result;
}

 
function fmtText(content, len = -1) {
	let str = content.replace(/[\r\n]/g, ""); //去掉回车换行
	if (len > 0) {
		str = str.substr(0, len);
	}
	return str.trim();
}

 function calDay(day) {
	 let arrDay = day.split('-');
 	let t1 = arrDay[0] + "/" + arrDay[1] + "/" + arrDay[2];
 	let dateBegin = new Date(t1);

 	let date = new Date();
 	let result = date.getTime() - dateBegin.getTime();
 	return Math.abs(Math.floor(result / (24 * 3600 * 1000)));
 }

module.exports = {
	isDefined,
	isObjectNull,
	genRandomString,
	genRandomNum,
	sleep,
	time2Timestamp,
	timestamp2Time,
	time,
	getAge,
	timestame2Ago,
 	calDay,

	getOptionsIdx,
	model2Form, 

	fmtText
}