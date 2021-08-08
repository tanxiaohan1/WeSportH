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
 * Notes: 云基本操作模块
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2020-09-05 04:00:00
 * Version : CCMiniCloud Framework Ver 2.0.1 ALL RIGHTS RESERVED BY 明章科技
 */
const ccminiCloudBase = require('./ccmini_cloud_base.js');
 
function log(method, err, level = 'error') {
	const cloud = ccminiCloudBase.getCloud();
	const log = cloud.logger();
	log.error({
		method: method,
		errCode: err.code,
		errMsg: err.message,
		errStack: err.stack
	});
}
 
async function getTempFileURLOne(fileID) {
	if (!fileID) return '';

	const cloud = ccminiCloudBase.getCloud();
	let result = await cloud.getTempFileURL({
		fileList: [fileID],
	})
	if (result && result.fileList && result.fileList[0] && result.fileList[0].tempFileURL)
		return result.fileList[0].tempFileURL;
	return '';
}
 
async function getTempFileURL(tempFileList, isValid = false) {
	if (!tempFileList || tempFileList.length == 0) return [];

	const cloud = ccminiCloudBase.getCloud();
	let result = await cloud.getTempFileURL({
		fileList: tempFileList,
	})
	console.log(result);

	let list = result.fileList;
	let outList = [];
	for (let i = 0; i < list.length; i++) {
		let pic = {};
		if (list[i].status == 0) {  
			pic.url = list[i].tempFileURL;
			pic.cloudId = list[i].fileID;
			outList.push(pic)
		} else { 
			if (!isValid) {
				pic.url = list[i].fileID;  
				pic.cloudId = list[i].fileID;
				outList.push(pic)
			}
		}
	}
	console.log(outList);
	return outList;
}

 
async function handlerCloudFiles(oldFiles, newFiles) {
	const cloud = ccminiCloudBase.getCloud();
	for (let i = 0; i < oldFiles.length; i++) {
		let isDel = true;
		for (let j = 0; j < newFiles.length; j++) {
			if (oldFiles[i].url == newFiles[j].url) { 
				newFiles[j].cloudId = oldFiles[i].cloudId;
				isDel = false;
				break;
			}
		} 

		if (isDel && oldFiles[i].cloudId) {

			let result = await cloud.deleteFile({
				fileList: [oldFiles[i].cloudId],
			});
			console.log(result);
		}

	}

	return newFiles;
} 
 
async function deleteFiles(list = []) {
	const cloud = ccminiCloudBase.getCloud();
	if (!Array.isArray(list) || list.length == 0) return;
	await cloud.deleteFile({
		fileList: list,
	});
}

module.exports = {
	log,
	getTempFileURL,
	getTempFileURLOne,
	deleteFiles,
	handlerCloudFiles
}