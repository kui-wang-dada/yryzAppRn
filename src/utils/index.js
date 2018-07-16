
import env from './env';
import * as commonStyle from './commonStyle';
import * as filter from './filter';
import { default as modal } from './modal';
import resizeImage from './resizeImage';

let transformSize = commonStyle.transformSize;

module.exports = {
	// 网络请求的缓存
	get cache() {
		return require('./cache').default;
	},
	get cacheAsync() {
		return require('./cacheAsync').default;
	},
	// iphoneX的适配
	get isIphoneX() {
		return filter.isIphoneX;
	},
	get isIPhone5() {
		return filter.isIPhone5;
	},
	// 接口数据的一层封装
	get parseResponse() {
		return filter.parseResponse;
	},
	get isPhoneAvailable() {
		return filter.isPhoneAvailable;
	},
	get isPwdValid() {
		return filter.isPwdValid;
	},
	// 对万以上的数字的封装
	get transformNum() {
		return filter.transformNum;
	},
	get openUrl() {
		return filter.openUrl;
	},
	get transformTime() {
		return filter.transformTime;
	},
	get umengTrack() {
		return require('./umengTrack').default;
	},
	env,
	// 颜色字体大小适配
	commonStyle,
	// 弹出层的调用方法
	// 当前仅涉及到YModal
	modal,
	// 大小适配
	transformSize,
	// 图片的大小编辑
	resizeImage,
};
