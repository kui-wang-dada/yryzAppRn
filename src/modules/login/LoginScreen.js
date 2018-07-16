import React, { Component } from 'react';
import {
	AppRegistry,
	StyleSheet,
	FlatList,
	Button,
	Text,
	Alert,
	TextInput,
	TouchableHighlight,
	View,
	Image,
	StatusBar,
	Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import LoginBigButton from './components/LoginBigButton';
import CountDownButton from './components/CountDownButton';
import getInviteCode from './services/getInviteCode';
import commonStyles from './styles';
import { Share } from 'ydk-react-native';
import PhoneTextInput from './components/TextInputString';
import { Toast, AutoHideKeyboard} from '@components'
import {
	commonStyle,
	transformSize,
	isPhoneAvailable,
	isPwdValid,
	umengTrack
} from '@utils';
import { login_bg } from './asset';

import { sendVerifyCodeByType, codeType, excutePwdLogin, excuteCodeLogin, excuteLoginThird, logIn } from "./services/LoginPrenster";
import { connect } from 'react-redux';
import {
	signIn,
	signOut,
	signEdit
} from '@modules/user/user.action';
import {
	Icon
} from '@components'
import { StackActions, NavigationActions } from 'react-navigation';
let mapStateToProps = (state) => {
	return {
		user: state.user,
	};
};

@connect(mapStateToProps)

@AutoHideKeyboard
export default class LoginScreen extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			phoneNum: '',
			password: '',
			verifyCode: '',
			isShow: false,
			loginCheck: '密码登录',
			installWx: false,
			installQQ: false,
			installSina: false,
			installNull: false,
			isLoading: false,
		};
	}

	async componentDidMount() {
		this.getInstall();
		this.props.navigation.setParams({ pressHeaderRight: this.clickRegister });
		this.setState({
			inviteCode: await getInviteCode(),
		});

		if (this.props.navigation.isFocused()) {
			umengTrack('登录弹出')
		}
	}

	async getInstall() {
		let res = await Share.getInstallPlatforms()
		if (res.length === 0) {
			this.setState({
				installNull: true
			})
		}
		for (item of res) {
			switch (item) {
				case 'qq':
					// this.setState({
					// 	installQQ: true
					// })
					break;
				case 'sinaWeibo':
					this.setState({
						installSina: true
					})
					break;
				case 'weChat':
					this.setState({
						installWx: true
					})
					break;

			}
		}
	}

	clickRegister = () => {
		this.props.navigation.navigate('RegisterScreen');
	}

	_finish = () => {
		this.props.navigation.goBack();
	}

	isLoginButtonAvailable() {
		if (this.state.phoneNum.length === 11) {
			return (this.state.isShow ? this.state.password.length > 5 : this.state.verifyCode.length === 4)
		}
		return false
	}

	render() {
		let isVisible = this.state.isShow
			? (
				<Text
					style={[commonStyles.loginForgetText, { marginRight: transformSize(30) }]}
					onPress={() => {
						this.props.navigation.navigate('RetrievePasswordScreen');
					 }}
				>
					忘记密码
				</Text>)
			: (
				<CountDownButton
					enable btnStyle={styles.sendVerifyCodeBtnStyle}
					textStyle={{ fontSize: transformSize(30) }}
					enableColor="#543dca"
					disableColor="#543dca"
					timerCount={60}
					timerTitle="获取验证码"
					timerActiveTitle={[
						'请在（',
						's）后重试'
					]}
					onClick={(shouldStartCountting) => {
						// shouldStartCountting(this.onSendVerifyCodePress);
						if (!this.state.isLoading) {
							this.onSendVerifyCodePress(shouldStartCountting);
						}
					}}
				/>
			);
		let head = (
			<View style={{
				flexDirection: 'row',
				padding: transformSize(36)
			}}
			>
			</View>);
		let otherLogin = this.state.installNull ? null : <View style={commonStyles.otherLoginHead}>
			<View style={commonStyles.horizontalLoginLineStyle} />
			<Text style={styles.otherloginTexttyle}>其他登录方式</Text>
			<View style={commonStyles.horizontalLoginLineStyle} />
		</View>
		let qqLogin = this.state.installQQ ?
			<Icon name={'qq'} style={commonStyles.qqLogin} onPress={() => this.qqLogin()} disabled={this.state.isLoading} /> : null
		let wxlogin = this.state.installWx ?
			<Icon name={'wechat'} style={commonStyles.wxLogin} onPress={() => this.wxLogin()} disabled={this.state.isLoading} /> : null
		let wblogin = this.state.installSina ?
			<Icon name={'sina'} style={commonStyles.wbLogin} onPress={() => this.wbLogin()} disabled={this.state.isLoading}/> : null
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
				<View style={commonStyles.containerStyle}>
					{head}
					<View style={commonStyles.headLoginHorizontalViewStyle}>
						<Text style={commonStyles.textLoginStyles}>悠然一指</Text>
					</View>
					<View style={commonStyles.loginContainerSecondStyle}>
						<PhoneTextInput
	                        disabled={this.state.isLoading}
	                        keyboardType="numeric"
							maxLength={11}
	                        placeholder={'请输入手机号'}
	                        onChangeText={(phoneNum) => this.setState({phoneNum})}
	                    />
						<View style={styles.InputContainer}>
							<TextInput style={styles.codeInput}
								disabled={this.state.isLoading}
								placeholder={this.state.isShow ? '请输入密码' : '请输入验证码'}
								onChangeText={this._codeOnChangeText}
								clearButtonMode='while-editing'
								selectionColor={commonStyle.color_theme}
								placeholderTextColor={commonStyle.fontColor_assist_content}
								underlineColorAndroid="transparent"
								keyboardType={this.state.isShow ? null : 'numeric'}
								secureTextEntry={this.state.isShow ? true : false}
								key={this.state.isShow ? 1 : 0}
								keyboardDismissMode={'interactive'}
								maxLength={this.state.isShow ? 18 : 4}
							/>
							{isVisible}
						</View>
					</View>
					<LoginBigButton
						loginBigButtonText="登录"
						complete={this.isLoginButtonAvailable()}
						clickFinish={() => this.clickLogin()}
						isLoading={this.state.isLoading}
					/>
					<Text style={[
						commonStyles.textPwdStyles,
						commonStyles.topRoom
					]} onPress={this.loginCheckClick}
					>{this.state.loginCheck}
					</Text>
					<Image source={login_bg} style={commonStyles.bottomBg} />
					{otherLogin}
					<View style={commonStyles.commonHorizontalViewStyle}>
						{wxlogin}
						{qqLogin}
						{wblogin}
					</View>
				</View>
			</SafeAreaView>
		);
	}

 	clickLogin() {

		if (!isPhoneAvailable(this.state.phoneNum)) {
			Toast.show('请输入正确的手机号')
			return
		}

		if (!isPwdValid(this.state.password) && this.state.isShow) {
			Toast.show('密码格式不正确')
			return
		}
		this.login()
	}

	async login() {
		this.setState({ isLoading: true })
		let data = null;
		try {
			if (this.state.isShow) {
				data = await excutePwdLogin(this.state.phoneNum, this.state.password)
			} else {
				data = await excuteCodeLogin(this.state.phoneNum, this.state.verifyCode)
			}
			logIn(data.data.data);
			let loginWay = this.state.isShow ? '密码登录' : '手机动态码登录'
			umengTrack('首次登录方式', { '登录方式': loginWay })
			this.setState({ isLoading: false })
			this.props.navigation.goBack();
		} catch (error) {
			this.setState({ isLoading: false })
			umengTrack('登入', { '结果': `失败+${error}`})
		}
	}

	async wxLogin() {
		try {
			this.setState({ isLoading: true })
			let auth = await Share.authorizeLogin(Share.weChat)
			// alert(auth.token)
			let res = await excuteLoginThird(auth.token, auth.userId, '1')
			umengTrack('首次登录方式', { '登录方式': '微信登录' })
			this.jumpBindPhone(res, '1', auth)
		} catch (ex) {
			this.setState({ isLoading: false })
			Toast.show('请求失败')
		}
	}

	async qqLogin() {
		try {
			this.setState({ isLoading: true })
			let auth = await Share.authorizeLogin(Share.qq)
			// alert(auth.token)
			let res = await excuteLoginThird(auth.token, auth.userId, '3')
			umengTrack('首次登录方式', { '登录方式': 'QQ登录' })
			this.jumpBindPhone(res, '3', auth)
		} catch (ex) {
			this.setState({ isLoading: false })
			Toast.show('请求失败')
		}
	}

	async wbLogin() {
		try {
			this.setState({ isLoading: true })
			let auth = await Share.authorizeLogin(Share.sinaWeibo)
			// alert(auth.token)
			let res = await excuteLoginThird(auth.token, auth.userId, '2')
			umengTrack('首次登录方式', { '登录方式': '微博登录' })
			this.jumpBindPhone(res, '2', auth)
		} catch (ex) {
			this.setState({ isLoading: false })
			Toast.show('请求失败')
		}
	}

	jumpBindPhone(res, type, auth) {
		this.setState({ isLoading: false })
		let userData = res.data.data

		if (!userData.custPhone) {
			this.props.navigation.navigate('BindPhoneNumbScreen', { inviteCode: this.state.inviteCode, userId: userData.userId, userData: userData});
			return;
		}
		logIn(userData);
		this.props.navigation.goBack();
	}

	// const auth = await YShareSDK.authorizeLogin(platform);
	onSendVerifyCodePress = (shouldStartCountting) => {
		// 点击发送验证码
		if (isPhoneAvailable(this.state.phoneNum)) {
			sendVerifyCodeByType(codeType.codeLogin, this.state.phoneNum);
			umengTrack('获取验证码', { '结果': '成功' })
			shouldStartCountting(true);
		} else {
			shouldStartCountting(false);
			Toast.show('请输入正确的手机号');
		}
	}

	onChangeText = (inputData) => {
		this.setState({ phoneNum: inputData });
	}

	_codeOnChangeText = (inputData) => {
		if (!this.state.isShow) {
			this.setState({ verifyCode: inputData });
		} else {
			this.setState({ password: inputData });
		}
	}

	loginCheckClick = () => {
		this.setState({
			isShow: !this.state.isShow,
			verifyCode: '',
			password: '',
			loginCheck: this.state.loginCheck === '密码登录' ? '验证码登录' : '密码登录',
		})

		// alert(this.state.isShow)
	}
}

LoginScreen.navigationOptions = ({ navigation }) => {
	return {
		headerRight: (
			<Text style={{
				textAlign: 'right',
				marginRight: transformSize(40),
				fontSize: transformSize(30),
				color: '#333333',
			}} onPress={navigation.getParam('pressHeaderRight')}
			>注册
			</Text>
		)
	}
}

const styles = StyleSheet.create({
	sendVerifyCodeBtnStyle: {
		// 发送验证码按钮
		height: transformSize(80),
		marginTop: 0,
		marginBottom: 0,
		marginRight: transformSize(44),
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'flex-end',
	},
	InputContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: transformSize(50),
		borderRadius: transformSize(80),
		backgroundColor: commonStyle.color_textinput,
		height: transformSize(80),
		width: commonStyle.SCREEN_WIDTH * 0.76,
	},
	phoneInput: {
		fontSize: commonStyle.fontSize_login_30,
		borderRadius: transformSize(80),
		backgroundColor: commonStyle.color_textinput,
		textAlign: 'left',
		height: transformSize(80),
		paddingHorizontal: transformSize(44),
		width: commonStyle.SCREEN_WIDTH * 0.76,
	},
	codeInput: {
		flex: 1,
		alignSelf: 'flex-start',
		fontSize: commonStyle.fontSize_login_30,
		backgroundColor: commonStyle.color_textinput,
		textAlign: 'left',
		marginLeft: transformSize(44),
		marginRight: transformSize(10),
		height: transformSize(80),
	},
	backButton: {
		width: transformSize(60),
		height: transformSize(60),
		paddingRight: transformSize(30),
		fontSize: commonStyle.transformSize(36),
	},
	otherloginTexttyle: {
		marginHorizontal: transformSize(20),
		fontSize: commonStyle.fontSize_login_title_24,
		color: commonStyle.fontColor_assist_content
	}
});
