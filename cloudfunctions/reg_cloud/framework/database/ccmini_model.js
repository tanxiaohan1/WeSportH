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
 * Notes: 数据持久化与操作模块
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-09-04 04:00:00
 * Version : CCMiniCloud Framework Ver 2.0.1 ALL RIGHTS RESERVED BY 明章科技
 */

const ccminiDbUtil = require('./ccmini_db_util.js');
const ccminiUtil = require('../utils/ccmini_util.js');
const ccminiTimeUtil = require('../utils/ccmini_time_util.js');
const CCMiniAppError = require('../handler/ccmini_app_error.js');
const ccminiCloudBase = require('../cloud/ccmini_cloud_base.js');

class CCMiniModel {

	/**
	 * 构造当前ID
	 */
	static makeID() {
		let id = ccminiTimeUtil.time('YMDhms') + ''; //秒

		//毫秒3位
		let miss = ccminiTimeUtil.time() % 1000 + '';
		if (miss.length == 0)
			miss = '000';
		else if (miss.length == 1)
			miss = '00' + miss;
		else if (miss.length == 2)
			miss = '0' + miss;

		return id + miss;
	}

	/**
	 * 获取单个object
	 * @param {*} where 
	 * @param {*} fields 
	 * @param {*} orderBy 
	 * @returns object or null
	 */
	static async getOne(where, fields = '*', orderBy = {}) {
		return await ccminiDbUtil.getOne(this.CL, where, fields, orderBy);
	}

	/**
	 * 修改
	 * @param {*} where 
	 * @param {*} data 
	 */
	static async edit(where, data) {
		// 更新时间
		if (this.UPDATE_TIME) {
			let editField = this.CCMINI_FIELD_PREFIX + 'EDIT_TIME';
			if (!ccminiUtil.isDefined(data[editField])) data[editField] = ccminiTimeUtil.time();
		}

		// 更新IP
		if (this.UPDATE_IP) {
			let cloud = ccminiCloudBase.getCloud();
			let ip = cloud.getWXContext().CLIENTIP;


			let editField = this.CCMINI_FIELD_PREFIX + 'EDIT_IP';
			if (!ccminiUtil.isDefined(data[editField])) data[editField] = ip;
		}

		// 数据清洗
		data = this.clearEditData(data);

		return await ccminiDbUtil.edit(this.CL, where, data);
	}

	/**
	 * 计算总数
	 * @param {*} where 
	 */
	static async count(where) {
		return await ccminiDbUtil.count(this.CL, where);
	}

	/**
	 * 插入数据
	 * @param {*} data 
	 */
	static async insert(data) {
		if (this.ADD_ID) {
			let idField = this.CCMINI_FIELD_PREFIX + 'ID';
			if (!ccminiUtil.isDefined(data[idField])) data[idField] = CCMiniModel.makeID();
		}

		if (this.UPDATE_TIME) {
			let timestamp = ccminiTimeUtil.time();
			let addField = this.CCMINI_FIELD_PREFIX + 'ADD_TIME';
			if (!ccminiUtil.isDefined(data[addField])) data[addField] = timestamp;

			let editField = this.CCMINI_FIELD_PREFIX + 'EDIT_TIME';
			if (!ccminiUtil.isDefined(data[editField])) data[editField] = timestamp;
		}

		if (this.UPDATE_IP) {
			let cloud = ccminiCloudBase.getCloud();
			let ip = cloud.getWXContext().CLIENTIP;

			let addField = this.CCMINI_FIELD_PREFIX + 'ADD_IP';
			if (!ccminiUtil.isDefined(data[addField])) data[addField] = ip;

			let editField = this.CCMINI_FIELD_PREFIX + 'EDIT_IP';
			if (!ccminiUtil.isDefined(data[editField])) data[editField] = ip;
		}

		data = this.clearCreateData(data);

		return await ccminiDbUtil.insert(this.CL, data);
	}

	static async clear() {
		return await ccminiDbUtil.clear(this.CL);
	}

	static async del(where) {
		return await ccminiDbUtil.del(this.CL, where);
	}

	static async inc(where, field, val) {
		return await ccminiDbUtil.inc(this.CL, where, field, val);
	}

	static async getAll(where, fields, orderBy, size = 100) {
		return await ccminiDbUtil.getAll(this.CL, where, fields, orderBy, size);
	}

	static async getList(where, fields, orderBy, page, size, isTotal, oldTotal) {
		return await ccminiDbUtil.getList(this.CL, where, fields, orderBy, page, size, isTotal, oldTotal);
	}

	static converDBStructure(stru) {
		let newStru = {};
		for (let k in stru) {
			newStru[k] = {};

			let arr = stru[k].split('|');
			for (let key in arr) {

				let val = arr[key].toLowerCase().trim();
				let orginal = arr[key];

				let type = 'string';
				if (val === 'float' || val === 'int' || val === 'string' || val === 'array' || val === 'object') {
					type = val;
					newStru[k]['type'] = type;
					continue;
				}

				if (val === 'true' || val === 'false') {
					let required = (val === 'true') ? true : false;
					newStru[k]['required'] = required;
					continue;
				}

				if (val.startsWith('default=') && ccminiUtil.isDefined(newStru[k]['type'])) {
					let defVal = orginal.replace('default=', '');
					switch (newStru[k]['type']) {
						case 'int':
						case 'float':
							defVal = Number(defVal);
							break;
						case 'array':
							defVal = defVal.replace('[', '');
							defVal = defVal.replace(']', '').trim();
							if (!defVal)
								defVal = [];
							else
								defVal = defVal.split(',');
							break;
						default:
							defVal = String(defVal);
					}
					newStru[k]['defVal'] = defVal;
					continue;
				}

				if (val.startsWith('comment=')) {
					let comment = orginal.replace('comment=', '');
					newStru[k]['comment'] = comment;
					continue;
				}

				if (val.startsWith('length=')) {
					let length = orginal.replace('length=', '');
					length = Number(length);
					newStru[k]['length'] = length;
					continue;
				}

			}

			if (!newStru[k]['required'] && !ccminiUtil.isDefined(newStru[k]['defVal'])) {
				let defVal = '';
				switch (newStru[k]['type']) {
					case 'int':
					case 'float':
						defVal = Number(0);
						break;
					case 'array':
						defVal = [];
						break;
					case 'object':
						defVal = {};
						break;
					default:
						defVal = String('');
				}
				newStru[k]['defVal'] = defVal;
			}

			if (!ccminiUtil.isDefined(newStru[k]['length'])) {
				let length = 20;
				switch (newStru[k]['type']) {
					case 'int':
					case 'float':
						length = 30;
						break;
					case 'array':
						length = 1500;
						break;
					default:
						length = 300;
				}
				newStru[k]['length'] = length;
			}
		}
		return newStru;
	}


	static clearDirtyData(data) {
		for (let k in data) {
			if (!this.CCMINI_DB_STRUCTURE.hasOwnProperty(k)) {
				console.log('脏数据:' + k);
				throw new CCMiniAppError('脏数据');
			}
		}
	}


	static converDataType(data, dbStructure) {
		for (let k in data) {
			if (dbStructure.hasOwnProperty(k)) {
				let type = dbStructure[k].type.toLowerCase();
				switch (type) {
					case 'string':
						data[k] = String(data[k]);
						break;
					case 'float':
					case 'int':
						data[k] = Number(data[k]);
						break;
					case 'array':
						if (data[k].constructor != Array)
							data[k] = [];
						break;
					case 'object':
						if (data[k].constructor != Object)
							data[k] = {};
						break;
					default:
						console.log('字段类型错误：' + k + dbStructure[k].type)
						throw new CCMiniAppError("字段类型错误");
				}
			}
		}

		return data;
	}


	static clearCreateData(data) {

		let dbStructure = CCMiniModel.converDBStructure(this.CCMINI_DB_STRUCTURE);

		for (let k in dbStructure) {

			if (!ccminiUtil.isDefined(dbStructure[k].type)) {
				console.log('[数据填写错误1]字段类型未定义：' + k);
				throw new CCMiniAppError('数据填写错误1');
			}

			if (!ccminiUtil.isDefined(dbStructure[k].required)) {
				console.log('[数据填写错误2]required未定义：' + k);
				throw new CCMiniAppError('数据填写错误2');
			}

			if (!data.hasOwnProperty(k)) {
				if (dbStructure[k].required) {
					if (ccminiUtil.isDefined(dbStructure[k].defVal))
						data[k] = dbStructure[k].defVal;
					else {
						console.log('[数据填写错误3]字段未填写：' + k);
						throw new CCMiniAppError('数据填写错误3');
					}
				} else {
					if (!ccminiUtil.isDefined(dbStructure[k].defVal)) {
						console.log('[数据填写错误4]非必填字段必须有缺省值：' + k);
						throw new CCMiniAppError('数据填写错误4');
					}
					data[k] = dbStructure[k].defVal;
				}
			}
		}

		this.clearDirtyData(data, dbStructure);

		data = this.converDataType(data, dbStructure);

		return data;
	}


	static clearEditData(data) {
		let dbStructure = CCMiniModel.converDBStructure(this.CCMINI_DB_STRUCTURE);

		this.clearDirtyData(data, dbStructure);

		data = this.converDataType(data, dbStructure);

		return data;
	}

	static getDesc(enumName, val) {
		let baseEnum = this[enumName];
		let descEnum = this[enumName + '_DESC']
		let enumKey = '';

		for (let k in baseEnum) {
			if (baseEnum[k] === val) {
				enumKey = k;
				break;
			}
		}
		if (enumKey == '') return 'unknown';

		return descEnum[enumKey];
	}

}

CCMiniModel.CL = 'no-collection';

CCMiniModel.CCMINI_DB_STRUCTURE = 'no-dbStructure';

CCMiniModel.CCMINI_FIELD_PREFIX = 'NO_';

CCMiniModel.UPDATE_TIME = true;

CCMiniModel.UPDATE_IP = true;

CCMiniModel.ADD_ID = true;

CCMiniModel.ORDER_BY = {
	_id: 'desc'
}

module.exports = CCMiniModel;