/**
 * Notes:   
 * Ver : CCMiniCloud Framework 2.0.1 ALL RIGHTS RESERVED BY www.code942.com
 * Date: 2021-08-14 07:48:00 
 */
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		optionsStr: { //待选项
			type: String,
			value: '',
		},
		optionsArr: { //待选项
			type: Array,
			value: '',
		},

		item: { // 选中值
			type: String,
			value: '',
		},
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		idx: 0,
		options: []
	},

	/**
	 * 生命周期方法
	 */
	lifetimes: {
		attached: function () {

		},

		ready: function () {
			let options = this.data.optionsStr;
			if (options) {
				options = options.replace('，', ',');
				options = options.split(',');
				this.setData({
					options
				});
			} else {
				this.setData({
					options: this.data.optionsArr
				});
			}
			this.selected(this.data.item);
		},

		detached: function () {
			// 在组件实例被从页面节点树移除时执行
		},
	},

	/**
	 * 组件的方法列表
	 */
	methods: {

		// 触发改变
		bindChange: function (e) {
			let ret = this.data.options[this.data.idx];
			if (!ret) ret = '';
			this.triggerEvent('myEvent', ret);
		},

		// 选中值
		selected: function (item) {
			if (this.data.options.length == 1) {
				this.setData({
					idx: 0
				});
				this.triggerEvent('myEvent', this.data.options[0]);
				return;
			} else {
				for (let k in this.data.options) {
					if (item == this.data.options[k]) {
						this.setData({
							idx: k
						});
						return;
					}
				}
				this.setData({
					idx: -1
				});
			}



		}
	}
})