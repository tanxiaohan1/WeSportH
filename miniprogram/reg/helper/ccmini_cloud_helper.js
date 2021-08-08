 /**
  * Notes: 云操作类库
  * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
  * Date: 2020-11-14 07:48:00 
  */

 const ccminiHelper = require('./ccmini_helper.js');
 const ccminiCacheHelper = require('./ccmini_cache_helper.js');
 const ccminiComm = require('../helper/ccmini_comm.js');
 const CCMINI_SETTING = require('../helper/ccmini_setting.js');

 const CODE = {
 	SUCC: 200,
 	SVR: 500,
 	LOGIC: 1600,
 	DATA: 1301,
 	HEADER: 1302,
 	NOT_USER: 1303,
 	USER_EXCEPTION: 1304,
 	MUST_LOGIN: 1305,
 	USER_CHECK: 1306,

 	ADMIN_ERROR: 2001
 };

 function callCloudSumbitAsync(router, params = {}, options) {
 	if (!ccminiHelper.isDefined(options)) options = {
 		hint: false
 	}
 	if (!ccminiHelper.isDefined(options.hint)) options.hint = false;
 	return callCloud(router, params, options)
 }

 async function callCloudSumbit(router, params = {}, options) {
 	if (!ccminiHelper.isDefined(options)) options = {
 		title: '提交中..'
 	}
 	if (!ccminiHelper.isDefined(options.title)) options.title = '提交中..';
 	return await callCloud(router, params, options);
 }

 async function callCloudData(router, params = {}, options) {
 	if (!ccminiHelper.isDefined(options)) options = {
 		title: '加载中..'
 	}

 	if (!ccminiHelper.isDefined(options.title)) options.title = '加载中..';
 	let result = await callCloud(router, params, options).catch(err => {
 		return null;
 	});

 	if (result && ccminiHelper.isDefined(result.data)) {
 		result = result.data;
 		if (Array.isArray(result)) {
 			// 数组处理
 		} else if (Object.keys(result).length == 0) {
 			result = null; //对象处理
 		}

 	}
 	return result;
 }

 function callCloud(router, params = {}, options) {

 	let title = '加载中';
 	let hint = true;

 	// 标题
 	if (ccminiHelper.isDefined(options) && ccminiHelper.isDefined(options.title))
 		title = options.title;

 	if (ccminiHelper.isDefined(options) && ccminiHelper.isDefined(options.hint))
 		hint = options.hint;

 	if (ccminiHelper.isDefined(options) && ccminiHelper.isDefined(options.doFail))
 		doFail = options.doFail;

 	if (hint) {
 		if (title == 'bar')
 			wx.showNavigationBarLoading();
 		else
 			wx.showLoading({
 				title: title,
 				mask: true
 			})
 	}

 	let token = '';
 	// 管理员token
 	if (router.indexOf('admin/') > -1) {
 		let admin = ccminiCacheHelper.get(ccminiComm.CACHE_ADMIN);
 		if (admin && admin.token) token = admin.token;
 	} else {
 		//正常用户
 		let user = ccminiCacheHelper.get(ccminiComm.CACHE_TOKEN);
 		if (user && user.id) token = user.id;
 	}

 	return new Promise(function (resolve, reject) {
 		wx.cloud.callFunction({
 			name: CCMINI_SETTING.PROJECT_MARK + '_cloud',
 			data: {
 				router,
 				token,
 				params
 			},
 			success: function (res) {
 				if (res.result.code == CODE.LOGIC || res.result.code == CODE.DATA) {
 					wx.showModal({
 						title: '温馨提示',
 						content: res.result.msg,
 						showCancel: false
 					});

 					reject(res.result);
 					return;
 				} else if (res.result.code == CODE.USER_EXCEPTION || res.result.code == CODE.USER_CHECK) {
 					reject(res.result);
 					return;
 				} else if (res.result.code == CODE.ADMIN_ERROR) {
 					wx.redirectTo({
 						url: '/' + CCMINI_SETTING.PROJECT_MARK + '/pages/admin/index/admin_login',
 					});
 					//reject(res.result);
 					return;
 				} else if (res.result.code != CODE.SUCC) {
 					if (hint) {
 						wx.showModal({
 							title: '温馨提示',
 							content: '系统打盹了，请稍后重试',
 							showCancel: false
 						});
 					}
 					reject(res.result);
 					return;
 				}

 				resolve(res.result);
 			},
 			fail: function (res) {
 				if (hint) {
 					wx.showModal({
 						title: '',
 						content: '网络故障，请稍后重试',
 						showCancel: false
 					});
 				}
 				reject(res.result);
 				return;
 			},
 			complete: function (res) {
 				if (hint) {
 					if (title == 'bar')
 						wx.hideNavigationBarLoading();
 					else
 						wx.hideLoading();
 				}
 				// complete
 			}
 		});
 	});
 }

 /**
  * 数据列表请求 
  */
 async function dataList(that, listName, router, params, options, isReverse = false) {

 	console.log('dataList begin');

 	if (!ccminiHelper.isDefined(that.data[listName]) || !that.data[listName]) {
 		let data = {};
 		data[listName] = {
 			page: 1,
 			size: 20,
 			list: [],
 			count: 0,
 			total: 0,
 			oldTotal: 0
 		};
 		that.setData(data);
 	}


 	if (!ccminiHelper.isDefined(params.isTotal))
 		params.isTotal = true;

 	let page = params.page;
 	let count = that.data[listName].count;
 	if (page > 1 && page > count) {
 		wx.showToast({
 			icon: 'none',
 			title: '没有更多数据了',
 		});
 		return;
 	}

 	for (let k in params) {
 		if (!ccminiHelper.isDefined(params[k]))
 			delete params[k];
 	}

 	let oldTotal = 0;
 	if (that.data[listName] && that.data[listName].total)
 		oldTotal = that.data[listName].total;
 	params.oldTotal = oldTotal;

 	await callCloud(router, params, options).then(function (res) {
 		console.log('cloud begin');

 		let dataList = res.data;
 		let tList = that.data[listName].list;

 		if (dataList.page == 1) {
 			tList = res.data.list;
 		} else if (dataList.page > that.data[listName].page) {
 			if (isReverse)
 				tList = res.data.list.concat(tList);
 			else
 				tList = tList.concat(res.data.list);
 		} else
 			return;

 		dataList.list = tList;
 		let listData = {};
 		listData[listName] = dataList;

 		that.setData(listData);

 		console.log('cloud END');
 	}).catch(err => {
 		console.log(err)
 	});

 	console.log('dataList END');

 }

 async function transTempPics(imgList, dir, id) {

 	for (let i = 0; i < imgList.length; i++) {

 		let filePath = imgList[i];
 		let ext = filePath.match(/\.[^.]+?$/)[0];

 		if (filePath.includes('tmp')) {
 			let rd = ccminiHelper.genRandomNum(100000, 999999);
 			await wx.cloud.uploadFile({
 				cloudPath: dir + id + '_' + rd + ext,
 				filePath: filePath, // 文件路径
 			}).then(res => {
 				imgList[i] = res.fileID;
 			}).catch(error => {
 				// handle error TODO:剔除图片
 			})
 		}
 	}

 	return imgList;
 }



 module.exports = {
 	CODE,
 	dataList,
 	callCloud,
 	callCloudSumbit,
 	callCloudData,
 	callCloudSumbitAsync,
 	transTempPics
 }