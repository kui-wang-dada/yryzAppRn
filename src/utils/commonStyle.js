import {
	Dimensions,
	Platform,
	PixelRatio,
	StyleSheet
} from 'react-native';

const DESIGN_WIDTH = 750;
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

// ---color---
// error info warn success
const color_theme = '#543DCA';
const color_assist_1 = "#7762E1";
const color_assist_2 = "#FE5551";
const color_button_detail = "#B3B3B3";
const color_button_back = "#333333"

const color_background = "#F4F4F4";
const color_border_1 = "#EEEEEE";
const color_border_2 = "#E5E5E5";
const color_Icon = "#DDDDDD";
const color_button_unableClick = "#CCCCCC";
const color_login_theme = "#543dca";
const color_textinput = "#F0F0F0";

const fontColor_main_title = "#000000";
const fontColor_assist_1 = "#333333";
const fontColor_assist_2 = "#666666";
const fontColor_assist_content = "#999999";
const fontColor_assist_3 = "#AAAAAA";
const fontColor_assist_icon = "#BBBBBB";
const fontColor_assist_4 = "#B3B3B3";
const fontColor_assist_like = "#FE5551";

// ---font size---
const fontSize_title_oneLevelTab_38 = transformSize(38);
const fontSize_content_detail_34 = transformSize(34);
const fontSize_twoLevelTab_32 = transformSize(32);
const fontSize_login_30 = transformSize(30);
const fontSize_content_summary_28 = transformSize(28);
const fontSize_video_title_26 = transformSize(26);
const fontSize_login_title_24 = transformSize(24);
const fontSize_tag_22 = transformSize(22);

// ---space---
const borderWidth = StyleSheet.hairlineWidth;

const padding = transformSize(40);
const commonHeaderHeight = transformSize(120);

const border = {
	borderWidth: borderWidth,
	borderColor: color_border_1
};


// ---align---
const centerWrap = {
	justifyContent: 'center',
	alignItems: 'center',
};

// ---function---
function transformSize(designSize) {

	const number = designSize / DESIGN_WIDTH * SCREEN_WIDTH;

	let remainder = number % 1;
	const int = number - remainder;
	// 防止非标准Android屏，不做处理
	if (Platform.OS === 'android' && parseInt(PixelRatio.get()) !== PixelRatio.get()) {

	} else {
		remainder = (0.25 <= remainder && remainder < 0.75 ? 0.5 : Math.round(remainder));
	}
	return int + remainder;
}

function toPercent(designSize, parentSize = DESIGN_WIDTH) {
	return `${designSize / parentSize * 100}%`;
}



export {
	// 颜色
	color_theme,
	color_assist_1,
	color_assist_2,
	color_button_detail,
	color_button_back,

	color_background,
	color_border_1,
	color_border_2,
	color_Icon,
	color_button_unableClick,
	color_login_theme,

	color_textinput,

	fontColor_main_title,
	fontColor_assist_1,
	fontColor_assist_2,
	fontColor_assist_content,
	fontColor_assist_3,
	fontColor_assist_icon,
	fontColor_assist_4,
	fontColor_assist_like,

	// ---font size---
	fontSize_title_oneLevelTab_38,
	fontSize_twoLevelTab_32,
	fontSize_content_detail_34,
	fontSize_content_summary_28,
	fontSize_video_title_26,
	fontSize_login_title_24,
	fontSize_tag_22,
	fontSize_login_30,




	borderWidth,
	padding,

	centerWrap,

	transformSize,
	toPercent,

	SCREEN_WIDTH,
	SCREEN_HEIGHT,

	border,
	commonHeaderHeight,
};

export default {
	// color---
	// 颜色
	color_theme,
	color_assist_1,
	color_assist_2,
	color_button_detail,
	color_button_back,

	color_background,
	color_border_1,
	color_border_2,
	color_Icon,
	color_button_unableClick,
	color_login_theme,

	color_textinput,

	fontColor_main_title,
	fontColor_assist_1,
	fontColor_assist_2,
	fontColor_assist_content,
	fontColor_assist_3,
	fontColor_assist_icon,
	fontColor_assist_4,
	fontColor_assist_like,

	// ---font size---

	fontSize_title_oneLevelTab_38,
	fontSize_twoLevelTab_32,
	fontSize_content_detail_34,
	fontSize_content_summary_28,
	fontSize_video_title_26,
	fontSize_login_title_24,
	fontSize_tag_22,
	fontSize_login_30,


	// space---
	borderWidth,
	padding,

	// align---
	centerWrap,

	// function---
	transformSize,

	toPercent,

	SCREEN_WIDTH,
	SCREEN_HEIGHT,

	// others---
	border,

	commonHeaderHeight,
};
