module.exports = { //workfit
	PROJECT_COLOR: '#FED202',
	NAV_COLOR: '#000000',
	NAV_BG: '#FED202',

	// setup
	SETUP_CONTENT_ITEMS: [
		{ title: '关于我们', key: 'SETUP_CONTENT_ABOUT' }, 
	],

	// 用户
	USER_REG_CHECK: false,
	USER_FIELDS: [
	],

	NEWS_NAME: '公告',
	NEWS_CATE: [
		{ id: 1, title: '本店公告', style: 'leftpic' },
	],
	NEWS_FIELDS: [

	],

	MEET_NAME: '预约',
	MEET_CATE: [
		{ id: 1, title: '私教预约', style: 'leftbig1' },
		{ id: 2, title: '项目预约', style: 'leftbig1' },
		{ id: 3, title: '团课预约', style: 'leftbig1' },
	],
	MEET_CAN_NULL_TIME: false, // 是否允许有无时段的日期保存和展示
	MEET_FIELDS: [
		{
			mark: 'level', title: '星级', type: 'select',
			selectOptions: [
				{ label: '1星', val: '1' },
				{ label: '2星', val: '2' },
				{ label: '3星', val: '3' },
				{ label: '4星', val: '4' },
				{ label: '5星', val: '5' },
				{ label: '6星', val: '6' }],
			def: '1', must: true
		},
		{ mark: 'spec', title: '特点标签', type: 'tag', must: true, max:30},
		{ mark: 'cover', title: '封面图片', type: 'image', min: 1, max: 1, must: true },
		{ mark: 'desc', title: '简介', type: 'textarea', max: 60, must: true },
		{ mark: 'content', title: '详情', type: 'content', must: true },
	],

	MEET_JOIN_FIELDS: [
		{ mark: 'name', type: 'text', title: '姓名', must: true, min: 2, max: 30, edit: false },
		{ mark: 'phone', type: 'text', len: 11, title: '手机号', must: true, edit: false },
	],

	// 时间默认设置
	MEET_NEW_NODE:
	{
		mark: 'mark-no', start: '10:00', end: '10:59', limit: 50, isLimit: true, status: 1,
		stat: { succCnt: 0, cancelCnt: 0, adminCancelCnt: 0, }
	},
	MEET_NEW_NODE_DAY: [
		{
			mark: 'mark-am', start: '09:00', end: '11:59', limit: 30, isLimit: true, status: 1,
			stat: { succCnt: 0, cancelCnt: 0, adminCancelCnt: 0, }
		},
		{
			mark: 'mark-pm', start: '14:00', end: '17:59', limit: 50, isLimit: true, status: 1,
			stat: { succCnt: 0, cancelCnt: 0, adminCancelCnt: 0, }
		}
	]


}