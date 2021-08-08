const ccminiApplication = require('./framework/handler/ccmini_application.js');

// 云函数入口函数
exports.main = async (event, context) => {
	return await ccminiApplication.ccminiApp(event, context);
}