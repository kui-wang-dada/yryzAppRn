import React from 'react';
import {
	StyleSheet,
	Linking
} from 'react-native';
import md5 from 'md5';
import {
	Button,
	View,
	Form,
	Item,
	Input,
	Text,
	Toast,
	InviteCode
} from '@components';
import {
	http,
	sign,
	Validator,
} from '@services';
import MobileCode from './MobileCode';
import styles from '@styles';
import signStyles from '../styles';
import { YZhugeIo, YCommon, Constants } from '@ydk';
import getInviteCode from '../services/getInviteCode';

const validator = new Validator({
	mobile: [
		{
			rule: 'required',
			message: '请输入手机号'
		},
		'mobile'
	],
	code: [
		{
			rule: 'required',
			message: '请输入验证码'
		},
		'mobile-code'
	],
	password: [
		{
			rule: 'required',
			message: '请输入密码'
		},
		'password'
	]
});

class SignUp extends React.Component {
	render() {
		return (
			<Form>
				<Item>
					<Input
						keyboardType="phone-pad"
						placeholder="手机号"
						returnKeyType="next"
						clearButtonMode="always"
						maxLength={11}
						onChangeText={this.handleFieldChange('mobile')}
						style={signStyles.input}
					/>
				</Item>
				<MobileCode
					returnKeyType="next"
					action="1"
					mobile={this.state.mobile}
					onChangeText={this.handleFieldChange('code')}
				/>
				<Item>
					<Input
						secureTextEntry
						placeholder="密码"
						returnKeyType="done"
						clearButtonMode="always"
						onChangeText={this.handleFieldChange('password')}
						style={signStyles.input}
					/>
				</Item>
				<InviteCode inviteCodeInit={ this.state.inviteCode } handleFieldChange={this.handleInviteChange.bind(this)}/>
				<Button block onPress={this.submit.bind(this)} style={signStyles.submitTrigger}><Text>注册</Text></Button>
				<View style={[signStyles.addon, style.addon]}>
					<Text onPress={this.goToAgreement} style={[signStyles.addonSecondaryText, style.agreementTip]}>
						注册代表同意并接受<Text style={style.highlight}>《用户服务协议》</Text>的条款
					</Text>
				</View>
			</Form>
		);
	}
	async componentDidMount() {
	  	this.setState({
			inviteCode: await getInviteCode()
		});
	}

	async submit() {
		await validator.validate([
			{
				name: 'mobile',
				value: this.state.mobile
			},
			{
				name: 'code',
				value: this.state.code
			},
			{
				name: 'password',
				value: this.state.password
			},
		]);
		await http.post('/services/app/v1/user/register', {
			inviteCode: this.state.inviteCode,
			custPhone: this.state.mobile,
			veriCode: this.state.code,
			custPwd: md5(this.state.password),
			appChannel: YCommon.channel
		});
		if (this.state.inviteCode) {
			//TrackModule.setEvent('4邀请码注册', {});
		}
		// 诸葛埋点
		// TrackModule.setEvent('注册成功', {
		// 	'custPhone': this.state.mobile
		// });
		await sign.close();
		sign.in();
	}

	handleFieldChange = (fieldName) => (value) => {
		this.setState({
			[fieldName]: value
		});
	};
    handleInviteChange = (fieldName, value) => {
    	this.setState({
    		[fieldName]: value
    	});
    }
	goToAgreement = () => {
		Linking.openURL(`${Constants.webBaseUrl}/static/page/user-agreement.html`);
	};

	state = {
		inviteCode: '',
		mobile: '',
		code: '',
		password: '',
	};
}

const style = StyleSheet.create({
	addon: {
		justifyContent: 'center'
	},
	agreementTip: {
		fontSize: styles.transformSize(44),
		lineHeight: styles.transformSize(94)
	},
	highlight: {
		fontSize: styles.transformSize(44),
		color: styles.themeColor
	}
});

export default SignUp;
