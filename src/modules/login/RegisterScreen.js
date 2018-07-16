import React, { Component } from 'react';
import {
	AppRegistry,
	StyleSheet,
	FlatList,
	Button,
	TouchableOpacity,
	Text,
	TextInput,
	View,
	Image,
	StatusBar
} from 'react-native';
import getInviteCode from './services/getInviteCode';
import { InviteCode,Toast, AutoHideKeyboard, Icon } from '@components';
import LoginBigButton from './components/LoginBigButton';
import PhoneTextInput from './components/TextInputString'
import TextInputVerifyCode from './components/TextInputVerifyCode'
import commonStyles  from './styles';
import { sendVerifyCodeByType, codeType, excuteRegister,TouchableHighlight, logIn } from "./services/LoginPrenster";
import {
	commonStyle,
	isPhoneAvailable,
	isPwdValid,
	transformSize,
	env,
	umengTrack
} from '@utils';
import { http } from "@services";
import { SafeAreaView } from 'react-navigation';
import { connect } from 'react-redux';
import {
	signIn,
	signOut,
	signEdit
} from '@modules/user/user.action';
import { login_bg } from './asset';
import { StackActions, NavigationActions } from 'react-navigation';

let mapStateToProps = (state) => {
	return {
		user: state.user,
	};
};
@connect(mapStateToProps)
@AutoHideKeyboard
export default class RegisterScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			phoneNum: '',
			password: '',
			verifyCode: '',
			inviteCode: '',
			inviteFlag: false,
			isLoading: false
		};
	}

	async componentDidMount() {
		let inviteFlag = (await http('/services/app/v1/new/invite/checkOnInvite')).data.data.inviteFlag
	  	this.setState({
			inviteCode: await getInviteCode(),
			inviteFlag: inviteFlag
		});
	}

	isRegisterAvailable() {
		if (this.state.phoneNum.length === 11 && this.state.password.length > 5) {
			return this.state.verifyCode.length === 4
		}
		return false
	}

	render() {
		let renderInviteCode = (
				this.state.inviteFlag
					?
					<PhoneTextInput
						disabled={this.state.isLoading}
						keyboardType="numeric"
						style={{marginTop: transformSize(50)}}
						returnKeyType='next'
						placeholder={'邀请码（选填)'}
						value={this.state.inviteCode}
						onChangeText={(inviteCode) => this.setState({inviteCode})}
					/>
					:
					null
			);
		return (<SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
			<View style={commonStyles.containerStyle}>
			<View style={[commonStyles.headLoginHorizontalViewStyle, { marginTop:transformSize(60)}]}>
				<Text style={commonStyles.textLoginStyles}>悠然一指</Text>
			</View>
			<View style={commonStyles.loginContainerSecondStyle}>
				<PhoneTextInput
					disabled={this.state.isLoading}
					keyboardType="numeric"
					clearButtonMode='while-editing'
					placeholder={'请输入手机号'}
					onChangeText={(phoneNum) => this.setState({phoneNum})}
					maxLength={11}
				/>
				<TextInputVerifyCode placeholder={'请输入验证码'}
									 disabled={this.state.isLoading}
									 style={styles.input}
									 onChangeText={(verifyCode) => this.setState({verifyCode})}
									 onClick={(shouldStartCountting) => {
										 this.onSendVerifyCodePress(shouldStartCountting);
									 }}
				/>
				<PhoneTextInput
					disabled={this.state.isLoading}
					style={{marginTop: transformSize(50)}}
					returnKeyType='next'
					placeholder={'请输入密码'}
					secureTextEntry={true}
					onChangeText={(password) => this.setState({password})}
					maxLength={18}
				/>
				{renderInviteCode}
			</View>
			<LoginBigButton loginBigButtonText={'注册'} isLoading={this.state.isLoading} complete={ this.isRegisterAvailable() } clickFinish={() => this.clickRegister()} />
			<View style={{ marginTop: transformSize(30), alignItems: 'center', }}>
				<Text>点击代表同意并接受<Text onPress={() => { this.agreement() }} style={styles.hightLight} >《用户服务协议》</Text>的条款</Text>
			</View>
			<Image source={login_bg} style={commonStyles.bottomBg} />
			</View>
			</SafeAreaView>
		);
	}

	click() {
		this.props.navigation.goBack();
	}

	onSendVerifyCodePress = (shouldStartCountting) => {
		//点击发送验证码
		if (isPhoneAvailable(this.state.phoneNum)) {
			shouldStartCountting(true);
			sendVerifyCodeByType(codeType.register, this.state.phoneNum)
			.catch(function(error) {
				shouldStartCountting(false);
				umengTrack('获取验证码', { '结果': `失败+${error}` })
			  });
			umengTrack('获取验证码', { '结果': '成功' })
		} else {
			shouldStartCountting(false);
			Toast.show('请输入正确的手机号');
		}
	}

 	clickRegister() {

		if (!isPwdValid(this.state.password)) {
			Toast.show('密码格式不正确');
			return
		}
		this.register()
	}

	async register() {
		try {
			this.setState({ isLoading: true })
			let data = await excuteRegister(this.state.inviteCode, this.state.verifyCode, this.state.phoneNum, this.state.password)
			this.setState({ isLoading: false })
			logIn(data.data.data);
			umengTrack('注册', { '结果': '成功' })
			//重置navigate栈，返回至home页
			let resetAction = StackActions.reset({
			  index: 0,
			  actions: [NavigationActions.navigate({ routeName: 'App' })],
			});
			this.props.navigation.dispatch(resetAction);
		} catch (error) {
			umengTrack('注册', { '结果': `失败+${error}` })
			this.setState({ isLoading: false })
		}
	}

	agreement() {
		let href = `${env.webBaseUrl}/static/page/user-agreement.html`;
		this.props.navigation.navigate('WebViewScreen', { url: href, menuVisible: false});
	}
}

const styles = StyleSheet.create({
	sendVerifyCodeBtnStyle: {
		// 发送验证码按钮
		height: transformSize(80),
		marginTop: 0,
		marginBottom: 0,
		marginRight: transformSize(40),
		alignItems: 'center',
		justifyContent: 'center',
		alignSelf: 'flex-end',
	},
	btnTextStyle: {
		fontSize: commonStyle.fontSize_content_summary_28,
		alignItems: 'center',
		color: 'white',
	},
	phoneInput: {
		fontSize: commonStyle.fontSize_login_30,
		borderRadius: transformSize(80),
		backgroundColor: commonStyle.color_textinput,
		textAlign: 'left',
		height: transformSize(80),
		paddingLeft: transformSize(40),
		paddingRight: transformSize(50),
		width: commonStyle.SCREEN_WIDTH * 0.76,
	},
	codeInput: {
		flex: 1,
		fontSize: commonStyle.fontSize_login_30,
		alignSelf: 'flex-start',
		backgroundColor: commonStyle.color_textinput,
		textAlign: 'left',
		marginLeft: transformSize(44),
		marginRight: transformSize(10),
		height: transformSize(80),
	},
	hightLight: { color: commonStyle.color_login_theme },
});
