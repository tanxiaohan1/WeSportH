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
 * Notes: 数据库基本操作
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-09-05 04:00:00
 * Version : CCMiniCloud Framework Ver 2.0.1 ALL RIGHTS RESERVED BY 明章科技
 */

const ccminiUtil = require('../utils/ccmini_util.js');
const ccminiStrUtil = require('../utils/ccmini_str_util.js');

const ccminiCloudBase = require('../cloud/ccmini_cloud_base.js');
const ccminiConfig = require('../../comm/ccmini_config.js');

const MAX_RECORD_SIZE = 100;
const DEFAULT_RECORD_SIZE = 20;

const cloud = ccminiCloudBase.getCloud();
const db = cloud.database();
const dbCmd = db.command;
const dbAggr = dbCmd.aggregate;


async function clear(collectionName) {
	collectionName = fmtCollectionName(collectionName);
	await db.collection(collectionName).where({
		_id: dbCmd.neq(1)
	}).remove().then(res => {

	});
}
async function isExistCollection(collectionName) {
	collectionName = fmtCollectionName(collectionName);
	try {
		await getOne(collectionName, {});
		return true;

	} catch (err) {
		return false;
	}
}

async function createCollection(collectionName) {
	collectionName = fmtCollectionName(collectionName);
	try {
		await db.createCollection(collectionName);

		console.log('>> Create New Collection [' + collectionName + '] Succ, OVER.');
		return true;

	} catch (err) {
		console.error('>> Create New Collection [' + collectionName + '] Failed, Code=' + err.errCode + '|' + err.errMsg);
		return false;
	}

}

function fmtCollectionName(name) {
	if (!name.includes(ccminiConfig.PROJECT_MARK + '_')) {
		name = ccminiConfig.PROJECT_MARK + '_' + name;
	}
	return name;
}

async function insert(collectionName, data) {
	collectionName = fmtCollectionName(collectionName);

	let query = await db.collection(collectionName).add({
		data
	});
	return query._id;
}


async function edit(collectionName, where, data) {
	collectionName = fmtCollectionName(collectionName);

	let query = await db.collection(collectionName);

	if (ccminiUtil.isDefined(where)) {
		if (typeof (where) == 'string' || typeof (where) == 'number')
			query = await query.doc(where);
		else
			query = await query.where(fmtWhere(where));
	}

	query = await query.update({
		data
	});

	return query.stats.updated;
}


async function inc(collectionName, where, field, val = 1) {
	collectionName = fmtCollectionName(collectionName);

	let query = await db.collection(collectionName);

	if (ccminiUtil.isDefined(where)) {
		if (typeof (where) == 'string' || typeof (where) == 'number')
			query = await query.doc(where);
		else
			query = await query.where(fmtWhere(where));
	}

	query = await query.update({
		data: {
			[field]: dbCmd.inc(val)
		}
	});

	return query.stats.updated;
}


async function del(collectionName, where) {
	collectionName = fmtCollectionName(collectionName);

	let query = await db.collection(collectionName);

	if (ccminiUtil.isDefined(where)) {
		if (typeof (where) == 'string' || typeof (where) == 'number')
			query = await query.doc(where);
		else
			query = await query.where(fmtWhere(where));
	}

	query = await query.remove();
	return query.stats.removed;
}

async function count(collectionName, where) {
	collectionName = fmtCollectionName(collectionName);

	let query = await db.collection(collectionName);

	if (typeof (where) == 'string' || typeof (where) == 'number')
		query = await query.doc(where);
	else
		query = await query.where(fmtWhere(where));

	query = await query.count();
	return query.total;
}


async function getListJoin(collectionName, joinParams, where, fields, orderBy, page = 1, size = DEFAULT_RECORD_SIZE, isTotal = true, oldTotal = 0, is2Many = false) {
	collectionName = fmtCollectionName(collectionName);

	page = Number(page);
	size = Number(size);

	if (size > MAX_RECORD_SIZE) size = MAX_RECORD_SIZE;

	data = {
		page: page,
		size: size
	}

	let offset = 0;

	if (isTotal) {
		let queryCnt = await db.collection(collectionName)
			.aggregate()
			.lookup(joinParams);

		if (ccminiUtil.isDefined(where))
			queryCnt = await queryCnt.match(fmtWhere(where));

		let total = await queryCnt.count('total').end();
		if (!total.list.length)
			total = 0;
		else
			total = total.list[0].total;

		data.total = total;
		data.count = Math.ceil(total / size);

		if (page > 1 && oldTotal > 0) {
			offset = data.total - oldTotal
			if (offset < 0) offset = 0;
		}
	}

	let query = await db.collection(collectionName)
		.aggregate()
		.lookup(joinParams);


	if (ccminiUtil.isDefined(where))
		query = await query.match(fmtWhere(where));

	if (ccminiUtil.isDefined(fields) && fields != '*')
		query = await query.project(fmtFields(fields));

	if (ccminiUtil.isDefined(orderBy)) {
		query = await query.sort(fmtJoinSort(orderBy));
	}

	query = await query.skip((page - 1) * size + offset).limit(size);

	query = await query.end();
	data.list = query.list;

	if (!is2Many) {
		for (let k in data.list) {
			if (ccminiUtil.isDefined(data.list[k][joinParams.as])) {
				if (Array.isArray(data.list[k][joinParams.as]) &&
					data.list[k][joinParams.as].length > 0)
					data.list[k][joinParams.as] = data.list[k][joinParams.as][0];
				else {
					data.list[k][joinParams.as] = {};
				}
			}
		}
	}

	return data;
}

async function getList(collectionName, where, fields = '*', orderBy = {}, page = 1, size = DEFAULT_RECORD_SIZE, isTotal = true, oldTotal = 0) {
	collectionName = fmtCollectionName(collectionName);

	page = Number(page);
	size = Number(size);
	if (size > MAX_RECORD_SIZE) size = MAX_RECORD_SIZE;

	let data = {
		page: page,
		size: size
	}

	let offset = 0;

	if (isTotal) {
		let total = await count(collectionName, where);
		data.total = total;
		data.count = Math.ceil(total / size);

		if (page > 1 && oldTotal > 0) {
			offset = data.total - oldTotal
			if (offset < 0) offset = 0;

		}
	}

	let query = await db.collection(collectionName)
		.skip((page - 1) * size + offset)
		.limit(size);


	if (ccminiUtil.isDefined(where) && where)
		query = await query.where(fmtWhere(where));

	if (ccminiUtil.isDefined(fields) && fields != '*')
		query = await query.field(fmtFields(fields));

	if (ccminiUtil.isDefined(orderBy)) {
		query = await fmtOrderBy(query, orderBy);
	}

	query = await query.get();

	data.list = query.data;

	return data;
}


async function getAll(collectionName, where, fields = '*', orderBy, size = MAX_RECORD_SIZE) {
	collectionName = fmtCollectionName(collectionName);

	size = Number(size);
	if (size > MAX_RECORD_SIZE) size = MAX_RECORD_SIZE;

	let query = await db.collection(collectionName).limit(size);

	if (where)
		query = await query.where(fmtWhere(where));

	if (fields && fields != '*')
		query = await query.field(fmtFields(fields));

	if (orderBy) {
		query = await fmtOrderBy(query, orderBy);
	}

	query = await query.get();
	return query.data;
}

async function getOne(collectionName, where, fields = '*', orderBy = {}) {
	collectionName = fmtCollectionName(collectionName);

	if (typeof (where) == 'string' || typeof (where) == 'number') {
		where = {
			_id: where
		};
	}

	let query = await db.collection(collectionName)
		.where(fmtWhere(where))
		.limit(1);

	if (fields != '*')
		query = await query.field(fmtFields(fields));

	if (orderBy)
		query = await fmtOrderBy(query, orderBy);

	query = await query.get();

	if (query && query.data.length > 0) {
		return query.data[0];
	} else
		return null;
}


async function fmtOrderBy(query, orderBy) {
	for (let k in orderBy) {
		query = await query.orderBy(k, orderBy[k].toLowerCase())
	}
	return query;
}

function fmtJoinSort(sort) {
	for (let k in sort) {
		let v = sort[k];
		if (typeof (v) == 'string') {
			v = v.toLowerCase();
			if (v === 'asc')
				v = 1;
			else
				v = -1;
		}
		sort[k] = v;
	}
	return sort;
}

function fmtFields(fields) {
	if (typeof (fields) == 'string') {
		let obj = {};
		fields = fields.replace(/，/g, ",");
		let arr = fields.split(',');
		for (let i = 0; i < arr.length; i++) {
			obj[arr[i].trim()] = true;
		}
		return obj;
	}

	return fields;
}

function fmtWhere(where) {
	if (ccminiUtil.isDefined(where.and) || ccminiUtil.isDefined(where.or)) {
		let whereEx = null;
		if (ccminiUtil.isDefined(where.and))
			whereEx = dbCmd.and(fmtWhere(where.and));

		if (ccminiUtil.isDefined(where.or)) {
			if (whereEx)
				whereEx = whereEx.and(dbCmd.or(fmtWhere(where.or)));
			else
				whereEx = dbCmd.or(fmtWhere(where.or));
		}
		return whereEx;
	}
	if (Array.isArray(where)) {
		for (let i = 0; i < where.length; i++)
			where[i] = fmtWhere(where[i]);
	}

	for (let k in where) {

		if (Array.isArray(where[k])) {
			let op = where[k][0];
			let w = null;

			if (!Array.isArray(op)) {
				w = fmtWhereSimple(where[k]);
			} else {
				for (let i = 0; i < where[k].length; i++) {
					let wTemp = fmtWhereSimple(where[k][i]);
					w = (w) ? w.and(wTemp) : wTemp;
				}
			}
			where[k] = w;

		}
	}
	return where;
}

function fmtWhereSimple(arr) {
	let op = arr[0].toLowerCase().trim();
	let val = arr[1];
	let where = {};
	switch (op) {
		case '=':
			where = dbCmd.eq(val);
			break;
		case '!=':
		case '<>':
			where = dbCmd.neq(val);
			break;
		case '<':
			where = dbCmd.lt(val);
			break;
		case '<=':
			where = dbCmd.lte(val);
			break;
		case '>':
			where = dbCmd.gt(val);
			break;
		case '>=':
			where = dbCmd.gte(val);
			break;
		case 'like':
			if (!ccminiUtil.isDefined(val) || !val) break;
			where = {
				$regex: val,
				$options: 'i'
			}
			break;
		case 'in':
			val = ccminiStrUtil.str2Arr(val);
			where = dbCmd.in(val);
			break;
		case 'not in':
			val = ccminiStrUtil.str2Arr(val);
			where = dbCmd.nin(val);
			break;
		default:
			break;
	}
	return where;
}

module.exports = {
	insert,
	edit,
	del,
	count,
	inc,
	getOne,
	getAll,
	getList,
	getListJoin,
	isExistCollection,
	clear,
	createCollection,
	MAX_RECORD_SIZE,
	DEFAULT_RECORD_SIZE
}