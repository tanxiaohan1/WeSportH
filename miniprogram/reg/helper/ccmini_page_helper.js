 /**
  * Notes: 通用页面操作类库
  * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
  * Date: 2020-11-14 07:48:00 
  */

 const ccminiHelper = require('../helper/ccmini_helper.js');
 const CCMINI_SETTING = require('./ccmini_setting.js');

 function getPrevPage(deep = 2) {
 	let pages = getCurrentPages();
 	let prevPage = pages[pages.length - deep]; //上一个页面 
 	return prevPage;
 }

 function modifyListNode(id, list, valName, val, idName = '_id') {

 	if (!list || !Array.isArray(list)) return false;
 	let pos = list.findIndex(item => item[idName] === id);
 	if (pos > -1) {
 		list[pos][valName] = val;
 		return true;
 	}
 	return false;
 }


 function modifyPrevPageListNode(id, valName, val, deep = 2, listName = 'dataList', idName = '_id') {
 	let prevPage = getPrevPage(deep);
 	if (!prevPage) return;

 	let dataList = prevPage.data[listName];
 	if (!dataList) return;

 	let list = dataList['list'];
 	if (modifyListNode(id, list, valName, val, idName)) {
 		prevPage.setData({
 			[listName + '.list']: list
 		});
 	}
 }


 function delListNode(id, list, idName = '_id') {
 	if (!list || !Array.isArray(list)) return false;
 	let pos = list.findIndex(item => item[idName] === id);
 	if (pos > -1) {
 		list.splice(pos, 1);
 		return true;
 	}
 	return false;
 }

 function delPrevPageListNode(id, deep = 2, listName = 'dataList', idName = '_id') {
 	let prevPage = getPrevPage(deep);
 	let dataList = prevPage.data[listName];
 	if (!dataList) return;

 	let list = dataList['list'];
 	let total = dataList['total'] - 1;
 	if (delListNode(id, list, idName)) {
 		prevPage.setData({
 			[listName + '.list']: list,
 			[listName + '.total']: total
 		});
 	}

 }


 async function refreshPrevListNode(deep = 2, listName = 'dataList', listFunc = '_getList') {
 	let prevPage = getPrevPage(deep);
 	let dataList = prevPage.data[listName];
 	if (!dataList) return;
 	await prevPage[listFunc]();
 }

 function scrollTop(e, that) {
 	if (e.scrollTop > 100) {
 		that.setData({
 			topShow: true
 		});
 	} else {
 		that.setData({
 			topShow: false
 		});
 	}
 }


 function chooseImage(that, max = 4, imgListName = 'imgList') {
 	wx.chooseImage({
 		count: max, //默认9
 		sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
 		sourceType: ['album', 'camera'], //从相册选择
 		success: async (res) => {
 			that.setData({
 				[imgListName]: that.data[imgListName].concat(res.tempFilePaths)
 			});
 		}
 	});
 }


 function delImage(that, idx, imgListName = 'imgList') {
 	let callback = function () {
 		that.data[imgListName].splice(idx, 1);
 		that.setData({
 			[imgListName]: that.data[imgListName]
 		})
 	}
 	showConfirm('确定要删除该图片吗？', callback);
 }


 function previewImage(that, url, imgListName = 'imgList') {
 	// 图片预览
 	wx.previewImage({
 		urls: that.data[imgListName],
 		current: url
 	});
 }


 function model(that, e) {
 	let item = e.currentTarget.dataset.item;
 	that.setData({
 		[item]: e.detail.value
 	})
 }

 function showNoneToast(title = '操作完成', duration = 1500, callback) {
 	wx.showToast({
 		title: title,
 		icon: 'none',
 		duration: duration,
 		success: function () {
 			callback && (setTimeout(() => {
 				callback();
 			}, duration));
 		}
 	});
 }


 function showLoadingToast(title = '加载中', duration = 1500, callback) {
 	wx.showToast({
 		title: title,
 		icon: 'loading',
 		duration: duration,
 		success: function () {
 			callback && (setTimeout(() => {
 				callback();
 			}, duration));
 		}
 	});
 }


 function showSuccToast(title = '操作成功', duration = 1500, callback) {
 	wx.showToast({
 		title: title,
 		icon: 'success',
 		duration: duration,
 		success: function () {
 			callback && (setTimeout(() => {
 				callback();
 			}, duration));
 		}
 	});
 }


 function showConfirm(title = '确定要删除吗？', callback) {
 	wx.showModal({
 		title: '',
 		content: title,
 		cancelText: '取消',
 		confirmText: '确定',
 		success: res => {
 			if (res.confirm) {
 				callback && callback();
 			}
 		}
 	})
 }

 function showModal(content, title = '温馨提示', callback) {
 	wx.showModal({
 		title: '温馨提示',
 		content: content,
 		showCancel: false,
 		success(res) {
 			callback && callback();
 		}
 	});
 }


 function setPageData(that, data) {
 	// 删除页面保留数据
 	if (ccminiHelper.isDefined(data['__webviewId__']))
 		delete data['__webviewId__'];

 	that.setData(data);
 }

 function commListListener(that, e) {
 	if (ccminiHelper.isDefined(e.detail.search))
 		that.setData({
 			search: '',
 			sortType: '',
 		});
 	else {
 		that.setData({
 			dataList: e.detail.dataList,
 		});
 		if (e.detail.sortType)
 			that.setData({
 				sortType: e.detail.sortType,
 			});
 	}

 }

 function bindShowModalTap(e) {
 	this.setData({
 		modalName: e.currentTarget.dataset.modal
 	})
 }

 function bindHideModalTap(e) {
 	this.setData({
 		modalName: null
 	})
 }

 function showTopBtn(e, that) {
 	if (e.scrollTop > 100) {
 		that.setData({
 			topBtnShow: true
 		});
 	} else {
 		that.setData({
 			topBtnShow: false
 		});
 	}
 }


 function top() {
 	wx.pageScrollTo({
 		scrollTop: 0
 	})
 }

 function anchor(id, that) {
 	let query = wx.createSelectorQuery().in(that);
 	query.selectViewport().scrollOffset()

 	query.select('#' + id).boundingClientRect();
 	query.exec(function (res) {
 		var miss = res[0].scrollTop + res[1].top - 10;
 		wx.pageScrollTo({
 			scrollTop: miss,
 			duration: 300
 		});
 	});
 }

 // 链接跳转
 function goto(url, type = 'to') {

	type = type.toLowerCase();
 
 	for (let k in CCMINI_SETTING.PROJECT_SWITCH) {
 		if (url && url.includes(CCMINI_SETTING.PROJECT_SWITCH[k])) {
 			type = 'switch';
 			break;
 		}
 	}

 	if (type == 'switch' && CCMINI_SETTING.PROJECT_IS_SUB)
 		type = 'relaunch';

 	if (url && url.includes('pages')) {
 		if (url.indexOf('/') != 0) url = '/' + url;

 		if (!url.includes(CCMINI_SETTING.PROJECT_MARK))
 			url = '/' + CCMINI_SETTING.PROJECT_MARK + url;
 	}
 
 	if (type == 'redirect')
 		wx.redirectTo({
 			url
 		});
 	else if (type == 'switch')
 		wx.switchTab({
 			url
 		});
 	else if (type == 'back')
 		wx.navigateBack({
 			delta: 0,
 		});
 	else if (type == 'relaunch')
 		wx.reLaunch({
 			url
 		})
 	else
 		wx.navigateTo({
 			url
 		})
 }

 function url(e, that) {
 	let url = e.currentTarget.dataset.url;
	 let type = e.currentTarget.dataset.type;
	 
 	for (let k in CCMINI_SETTING.PROJECT_SWITCH) {
 		if (url && url.includes(CCMINI_SETTING.PROJECT_SWITCH[k])) {
 			type = 'switch';
 			break;
 		}
 	}

 	if (type == 'switch' && CCMINI_SETTING.PROJECT_IS_SUB)
 		type = 'relaunch';

 	if (url && url.includes('pages')) {
 		if (url.indexOf('/') != 0) url = '/' + url;

 		if (!url.includes(CCMINI_SETTING.PROJECT_MARK))
 			url = '/' + CCMINI_SETTING.PROJECT_MARK + url;
 	}
 
 	if (type && type == 'redirect')
 		wx.redirectTo({
 			url
 		});
 	else if (type && type == 'switch')
 		wx.switchTab({
 			url
 		});
 	else if (type && type == 'relaunch')
 		wx.reLaunch({
 			url
 		});
 	else if (type && type == 'mini') {
 		wx.navigateToMiniProgram({
 			appId: url,
 			path: '',
 			envVersion: 'release'
 		});
 	} else if (type && type == 'copy') {
 		wx.setClipboardData({
 			data: url,
 			success(res) {
 				wx.getClipboardData({
 					success(res) {
 						showNoneToast('已复制到剪贴板');
 					}
 				})
 			}
 		});
 	} else if (type && type == 'back')
 		wx.navigateBack({
 			delta: 0,
 		});
 	else if (ccminiHelper.isDefined(e.currentTarget.dataset.phone))
 		wx.makePhoneCall({
 			phoneNumber: e.currentTarget.dataset.phone
 		});
 	else if (type && type == 'anchor') {
 		//锚点
 		anchor(url, that);
 	} else if (type && type == 'img' || type && type == 'image') {
 		if (url.indexOf('qlogo') > -1) { //微信大图
 			url = url.replace('/132', '/0');
 		}
 		let urls = [url];

 		if (ccminiHelper.isDefined(e.currentTarget.dataset.imgs))
 			urls = e.currentTarget.dataset.imgs;

 		wx.previewImage({
 			current: url,
 			urls
 		})
 	} else
 		wx.navigateTo({
 			url
 		});
 }

 function getId(that, options, idName = 'id') {
 	let id = options[idName];
 	if (!id) return false;

 	that.setData({
 		[idName]: id
 	});
 	return true;

 }

 function hint(msg, type = 'redirect') {
 	if (type == 'reLaunch')
 		wx.reLaunch({
 			url: '/' + CCMINI_SETTING.PROJECT_MARK + '/pages/about/hint?msg=' + encodeURIComponent(msg),
 		});
 	else
 		wx.redirectTo({
 			url: '/' + CCMINI_SETTING.PROJECT_MARK + '/pages/about/hint?msg=' + encodeURIComponent(msg),
 		});
 }

 //  重新加载
 function reload() {
 	wx.redirectTo({
 		url: '/pages/my/reload/my_reload',
 	});
 }

 module.exports = {
 	getPrevPage,
 	modifyListNode,
 	modifyPrevPageListNode,
 	delListNode,
 	delPrevPageListNode,
 	refreshPrevListNode,

 	scrollTop,

 	chooseImage,
 	previewImage,
 	delImage,

 	showSuccToast,
 	showNoneToast,
 	showLoadingToast,
 	showConfirm,
 	showModal,
 	setPageData,

 	hint,
 	reload,

 	commListListener,

 	bindShowModalTap,
 	bindHideModalTap,
 	showTopBtn,

 	getId,

 	model,
 	top,
 	url, // 跳转 
 	goto,
 	anchor,

 }