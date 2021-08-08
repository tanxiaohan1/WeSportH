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
 * Notes: 数据校验
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-09-05 04:00:00
 * Version : CCMiniCloud Framework Ver 2.0.1 ALL RIGHTS RESERVED BY 明章科技
 */

const ccminiUtil = require('../utils/ccmini_util.js');
const CCMiniAppError = require('../handler/ccmini_app_error.js');
const ccminiAppCode = require('../handler/ccmini_app_code.js');

function checkRequired(value, desc) {
	if (!ccminiUtil.isDefined(value) || value === '')
		return desc + '不能为空';
}

function isCheckLen(value, min, max) { //TODO 数字怎么处理
	if (!ccminiUtil.isDefined(value)) return false;
	if (typeof (value) != 'string') return false;
	if (value.length < min || value.length > max) return false;
	return true;
}

function isCheckM(value, min, max) {
	if (!ccminiUtil.isDefined(value)) return false;

	if (typeof (value) == 'string' && /^[0-9]+$/.test(value))
		value = Number(value);
	if (typeof (value) != 'number') return false;

	if (value < min || value > max) return false;
	return true;
}

function checkMin(value, len, desc) {
	if (String(value).length < len)
		return desc + '不能小于' + len + '位';
};

function checkMax(value, len, desc) {
	if (String(value).length > len)
		return desc + '不能大于' + len + '位';
};

function checkLen(value, len, desc) {
	if (Array.isArray(value) && value.length != len) {
		return desc + '必须为' + len + '位';
	} else if (!Array.isArray(value) && String(value).length != len) {
		return desc + '必须为' + len + '位';
	}

};

function checkMobile(value, desc) {
	if (!ccminiUtil.isDefined(value) || value === '') return;
	if (!/(^1[3|5|8][0-9]{9}$)/.test(value))
		return desc + '格式不正确';
}

function checkInt(value, desc) {
	if (!ccminiUtil.isDefined(value) || value === '') return;
	if (!/^[0-9]+$/.test(String(value)))
		return desc + '必须为数字';
}

function checkLetter(value, desc) {
	if (!ccminiUtil.isDefined(value) || value === '') return;
	if (!/^[A-Za-z]+$/.test(value))
		return desc + '必须为字母';
}

function checkLetterNum(value, desc) {
	if (!ccminiUtil.isDefined(value) || value == '') return;
	if (!/^\w+$/.test(value))
		return desc + '必须为字母，数字和下划线';
}

function checkId(value, desc, min = 1, max = 128) {
	if (!ccminiUtil.isDefined(value) || value === '') return;
	if (value.length < min || value.length > max) return desc + '必须为ID格式';
	//if (!/^\w+$/.test(value))
	//	return desc + '必须为ID格式';
}

function isCheckId(value, min = 1, max = 32) {
	if (!ccminiUtil.isDefined(value)) return false;
	if (typeof (value) != 'string') return false;
	if (value.length < min || value.length > max) return false;
	if (!/^\w+$/.test(value))
		return false;
	return true;
}

function checkEmail(value, desc) {
	if (!ccminiUtil.isDefined(value) || value === '') return;
	let hint = desc + '必须为邮箱格式';
	let reg = /^[A-Za-z0-9+]+[A-Za-z0-9\.\_\-+]*@([A-Za-z0-9\-]+\.)+[A-Za-z0-9]+$/;
	if (!reg.test(value)) return hint;
}

function checkDate(value, desc) {
	if (!ccminiUtil.isDefined(value) || value === '') return;
	let hint = desc + '必须为日期格式';
	if (value.length != 10) return hint;
	let r = value.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
	if (r == null) return hint;
	let d = new Date(r[1], r[3] - 1, r[4]);
	let chk = d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4];
	if (!chk)
		return hint;
}

function checkTime(value, desc) {
	if (!ccminiUtil.isDefined(value) || value === '') return;
	let hint = desc + '必须为时间格式';
	if (value.length != 8) return hint;

	let a = value.match(/^(\d{1,2})(:)?(\d{1,2})\2(\d{1,2})$/);
	if (a == null) return hint;
	if (a[1] > 24 || a[3] > 60 || a[4] > 60) return hint;
}

function checkDatimeTime(value, desc) {
	if (!ccminiUtil.isDefined(value) || value === '') return;
	let hint = desc + '必须为完整时间格式';
	if (value.length != 19) return hint;

	var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
	var r = value.match(reg);
	if (r == null) return hint;
	var d = new Date(r[1], r[3] - 1, r[4], r[5], r[6], r[7]);
	let chk = d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4] && d.getHours() == r[5] && d.getMinutes() == r[6] && d.getSeconds() == r[7];
	if (!chk) return hint;
}

function checkArray(value, desc) {
	if (!ccminiUtil.isDefined(value)) return;
	if (!Array.isArray(value))
		return desc + '填写错误';
}

function checkIn(value, ref, desc) {
	if (!ccminiUtil.isDefined(value) || value === '') return;
	let arr = ref.split(',');
	if (!arr.includes(value) && !arr.includes(value + ''))
		return desc + '填写错误';
}

function isCheckIn(value, ref) {
	if (!ccminiUtil.isDefined(value)) return false;
	let arr = ref.split(',');
	if (!arr.includes(value) && !arr.includes(value + '')) return false; //字符，数字都支持
	return true;
}

function checkIds(value, desc) {}

function checkString(value, desc) {}

function checkBool(value, desc) {
	if (typeof (value) != 'boolean')
		return desc + '填写错误';
}

function check(data, rules) {
	if (data === undefined) return data;

	let returnData = {};
	for (let k in rules) {
		let arr = rules[k].split('|');
		let desc = k;
		let defVal = undefined;

		for (let i = 0; i < arr.length; i++) {
			if (arr[i].indexOf('name=') > -1) {
				desc = arr[i].replace('name=', '');
			}

			if (arr[i].indexOf('default=') > -1) {
				defVal = arr[i].replace('default=', '');
			}
		}

		let formName = k;
		let val = data[formName];

		if (val === undefined && ccminiUtil.isDefined(defVal)) {
			val = defVal;
		}
		if (typeof (val) == 'string')
			val = String(val).trim();

		for (let i = 0; i < arr.length; i++) {
			let result = '';

			let rules = arr[i].split(':');

			if (rules[0] != 'required' && val == '') continue;

			switch (rules[0]) {
				case 'required':
					result = checkRequired(val, desc);
					break;
				case 'object':
				case 'obj':
					break;
				case 'bool':
				case 'boolean':
					if (ccminiUtil.isDefined(val)) {
						if (val === 'true')
							val = true;
						else if (val === 'false')
							val = false;
						result = checkBool(val, desc);
					}
					break;
				case 'int':
					if (ccminiUtil.isDefined(val)) {
						val = Number(val);
						result = checkInt(val, desc);
					}
					break;
				case 'array':
				case 'arr':
					if (ccminiUtil.isDefined(val)) {
						result = checkArray(val, desc);
					}
					break;
				case 'date':
					if (ccminiUtil.isDefined(val)) {
						val = String(val);
						result = checkDate(val, desc);
					}
					break;
				case 'time':
					if (ccminiUtil.isDefined(val)) {
						val = String(val);
						result = checkTime(val, desc);
					}
					break;
				case 'datetime':
					if (ccminiUtil.isDefined(val)) {
						val = String(val);
						result = checkDatimeTime(val, desc);
					}

					break;
				case 'min':
					if (ccminiUtil.isDefined(val)) {
						result = checkMin(val, Number(rules[1]), desc);
					}
					break;
				case 'max':
					if (ccminiUtil.isDefined(val)) {
						result = checkMax(val, Number(rules[1]), desc);
					}
					break;
				case 'len':
				case 'length':
					if (ccminiUtil.isDefined(val)) {
						result = checkLen(val, Number(rules[1]), desc);
					}
					break;
				case 'in':
					if (ccminiUtil.isDefined(val)) {
						result = checkIn(val, rules[1], desc);
					}
					break;
				case 'email':
					if (ccminiUtil.isDefined(val)) {
						val = String(val);
						result = checkEmail(val, desc);
					}
					break;
				case 'mobile':
					if (ccminiUtil.isDefined(val)) {
						val = String(val);
						result = checkMobile(val, desc);
					}
					break;
				case 'id':
					if (ccminiUtil.isDefined(val)) {
						val = String(val);
						result = checkId(val, desc);
					}
					break;
				case 'letter':
					if (ccminiUtil.isDefined(val)) {
						val = String(val);
						result = checkLetter(val, desc);
					}
					break;
				case 'letter_num':
					if (ccminiUtil.isDefined(val)) {
						val = String(val);
						result = checkLetterNum(val, desc);
					}
					break;
			}

			if (result) {
				throw new CCMiniAppError(result, ccminiAppCode.DATA);
				return false;
			} else {

			}

		}

		returnData[k] = val;
	}
	return returnData;
}

module.exports = {
	check,
	isCheckLen,
	isCheckIn,
	isCheckM,
	isCheckId
}