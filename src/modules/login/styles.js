import { StyleSheet, Image, Platform } from 'react-native'
import React, { Component } from 'react';
// import styles from '@styles';
import {
	commonStyle,
	transformSize,
	isIphoneX
} from '@utils'

const style = StyleSheet.create({
	input: {
		fontSize: transformSize(56),
		height: transformSize(186)
	},
	submitTrigger: {
		marginTop: transformSize(150)
	},
	addon: {
		flexDirection: 'row-reverse',
		justifyContent: 'space-between',
		marginTop: transformSize(20)
	},
	addonMainText: {
		color: '#ff9160'
	},
	addonSecondaryText: {
		color: '#666'
	},
	pureForm: {
		flex: 1,
		paddingTop: transformSize(190)
	},
	pureFormHead: {
		marginBottom: transformSize(150)
	},
	pureFormTitle: {
		fontSize: transformSize(82),
	},
	pureFormSubTitle: {
		fontSize: transformSize(56),
		marginTop: transformSize(48)
	},
	containerStyle: {
		//整个页面撑满屏幕
		flexDirection: 'column',
		flex: 1,
		backgroundColor: 'white',
	},
	textPwdStyles: {
		fontSize: transformSize(32),
		color: "#333333",
		alignSelf: 'center',
	},
	topRoom: {
		marginTop: transformSize(50),

	},
	textLoginStyles: {
		fontSize: transformSize(60),
		color: "#000000",
		fontWeight: "bold",
	},
	imgLogoStyles: {
		width: transformSize(86),
		height: transformSize(86),
		marginRight:transformSize(20),
		resizeMode: Image.resizeMode.stretch,
	},
	headLoginHorizontalViewStyle: {
		//通用水平外层包裹
		flexDirection: 'row',
		backgroundColor: 'white',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: transformSize(92)
	},
	otherLoginHead: {
		flexDirection: 'row',
		backgroundColor: 'transparent',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: transformSize(230),
		marginBottom: transformSize(50)
	},
	wxLogin: {
		color: "#75d98a",
		fontSize: transformSize(60),
		marginHorizontal: transformSize(50)
	},
	otherqqLoginContain: {
		width: transformSize(176),
		height: transformSize(70),
		marginLeft: transformSize(16),
		marginRight:transformSize(16),
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 20,
		backgroundColor: '#eef7ff',
	},
	otherwxLoginContain: {
		width: transformSize(176),
		height: transformSize(70),
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 20,
		backgroundColor: '#ecf9eb',
	},
	otherwbLoginContain: {
		width: transformSize(176),
		height: transformSize(70),
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 20,
		backgroundColor: '#fef3f3',
	},
	qqLogin: {
		color: "#9dbbfe",
		fontSize: transformSize(60),
		marginHorizontal: transformSize(50)
	},
	wbLogin: {
		color: "#ff8282",
		fontSize: transformSize(45),
		marginHorizontal: transformSize(50)
	},
	loginForgetText: {
		fontSize: transformSize(30),
		color: "#543dca",
	},
	loginContainerSecondStyle: {
		//登录界面左右间距95
		marginLeft: commonStyle.SCREEN_WIDTH * 0.12,
		marginRight: commonStyle.SCREEN_WIDTH * 0.12,
		flexDirection: 'column',
		backgroundColor: 'white',
	},
	inputTextStyle: {
		//输入框
		flex: 1,
		height: transformSize(100),
		padding: 0,
		fontSize: 14,
		alignSelf: 'center',
		backgroundColor: 'white',
	},
	inputViewStyle: {
		//输入框外层包裹
		flexDirection: 'row',
		height: 50,
		backgroundColor: 'white',
	},
	commonHorizontalViewStyle: {
		//通用水平外层包裹
		flexDirection: 'row',
		height: 50,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'transparent',
	},
	normalText12Style: {
		//通用12sp居中文字
		alignSelf: 'center',
		fontSize: 12,
	},
	normalText14Style: {
		//通用14sp居中文字
		alignSelf: 'center',
		fontSize: 14,
	},
	normalText16Style: {
		//通用16sp居中文字
		alignSelf: 'center',
		fontSize: 16,
	},
	btnText16Style: {
		//白色16sp居中文字
		alignSelf: 'center',
		color: 'white',
		fontSize: 16,
	},
	sendCodeTextStyle:{
		//蓝色30居中字体
		fontSize: transformSize(30),
		alignItems: 'center',
		color: '#0185ff',
	},
	horizontalLoginLineStyle: {
		//三方登录分隔线
		height: transformSize(1),
		width: transformSize(70),
		backgroundColor: '#dddddd',
	},
	horizontalLineStyle: {
		//水平分隔线
		height: transformSize(0.5),
		backgroundColor: '#cccccc',
	},
	verticalLineStyle: {
		//垂直分隔线
		width: 1,
		backgroundColor: '#E4E4E4',
	},
	bottomBigBtnStyle: {
		//登录注册底部操作按钮
		height: 50,
		marginTop: 40,
		marginLeft: 40,
		marginRight: 40,
		backgroundColor: '#DF5F5F',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 8,
	},
	sendVerifyCodeBtnStyle: {
		//发送验证码按钮
		height: 38,
		width: 110,
		marginTop: 6,
		marginBottom: 6,
		marginLeft: 8,
		marginRight: 8,
		backgroundColor: 'red',
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'flex-end',
		backgroundColor: '#DF5F5F',
		borderRadius: 6,
	},
	dialogContainerStyle: {
		//弹窗背景
		flex: 1,
		justifyContent: 'center',
		padding: 40,
		backgroundColor: 'rgba(0, 0, 0, 0.5)'
	},
	dialogInnerStyle: {
		borderRadius: 10,
		backgroundColor: 'white',
	},
	sendVerifyCodeBtnStyle: {
		// 发送验证码按钮
		height: 38,
		marginTop: 6,
		marginBottom: 6,
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'flex-end',
	},
	phoneInput: {
		textAlign: 'left',
		height: transformSize(100),
		padding: 0,
		width: commonStyle.SCREEN_WIDTH * 0.76,
	},
	bottomBg: {
		position: 'absolute',
		top: (commonStyle.SCREEN_HEIGHT - 165 + (Platform.OS === 'ios' ? (isIphoneX() ? -34 : 20) : 3)),
		left: 0,
		right: 0,
		width: commonStyle.SCREEN_WIDTH
	}
});

export default style;
