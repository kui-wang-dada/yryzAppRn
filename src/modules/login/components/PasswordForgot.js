import React from 'react';
import {
	Alert
} from 'react-native';
import Swiper from 'react-native-swiper';
import md5 from 'md5';
import {
	Button,
	Form,
	Item,
	Input,
	H2,
	Text,
	View,
	Toast,
} from '@components';
import {
	Validator,
	http,
	sign
} from '@services';
import MobileCode from './MobileCode';
import signStyles from '../styles';

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
	],
	repeatingPassword: [
		{
			rule: 'required',
			message: '请再次输入密码'
		}
	],
});

class PasswordForgot extends React.Component {
	render() {
		return (
			<View style={signStyles.pureForm}>
				<Swiper
					loop={false}
					scrollEnabled={false}
					showsPagination={false}
					showsButtons={false}
					ref={this.setRef('swiperRef')}
				>
					<View>
						<View style={signStyles.pureFormHead}>
							<H2 style={signStyles.pureFormTitle}>忘记密码</H2>
						</View>
						<Form>
							<Item>
								<Input
									keyboardType="phone-pad"
									returnKeyType="next"
									clearButtonMode="always"
									placeholder="手机号"
									maxLength={11}
									onChangeText={this.handleFieldChange('mobile')}
									style={signStyles.input}
								/>
							</Item>
							<MobileCode action="2" mobile={this.state.mobile} onChangeText={this.handleFieldChange('code')} />
							<Button block onPress={this.next.bind(this)} style={signStyles.submitTrigger}><Text>下一步</Text></Button>
						</Form>
					</View>
					<View>
						<View style={signStyles.pureFormHead}>
							<H2 style={signStyles.pureFormTitle}>重设密码</H2>
							<Text style={signStyles.pureFormSubTitle}>重设密码后可用手机号登录</Text>
						</View>
						<Form>
							<Item>
								<Input
									secureTextEntry
									placeholder="密码"
									clearButtonMode="always"
									onChangeText={this.handleFieldChange('password')}
									style={signStyles.input}
								/>
							</Item>
							<Item>
								<Input
									secureTextEntry
									placeholder="再次输入密码"
									clearButtonMode="always"
									onChangeText={this.handleFieldChange('repeatingPassword')}
									style={signStyles.input}
								/>
							</Item>
							<Button block onPress={this.submit} style={signStyles.submitTrigger}><Text>完成</Text></Button>
						</Form>
					</View>
				</Swiper>
			</View>
		);
	}

	async next() {
		await validator.validate([
			{
				name: 'mobile',
				value: this.state.mobile
			},
			{
				name: 'code',
				value: this.state.code
			},
		]);
		this.swiperRef.scrollBy(1);
	}

	setRef = (refName) => (element) => {
		this[refName] = element;
	};

	handleFieldChange = (fieldName) => (value) => {
		this.setState({
			[fieldName]: value
		});
	};

	submit = async () => {
		const {
			mobile,
			code,
			password,
			repeatingPassword
		} = this.state;
		await validator.validate([
			{
				name: 'password',
				value: password
			},
			{
				name: 'repeatingPassword',
				value: repeatingPassword
			},
		]);

		if (repeatingPassword !== password) {
			Alert.alert('新密码输入不一致，请重新输入');
			return;
		}

		await http.post('/services/app/v1/user/pwd/forget', {
			phone: mobile,
			veriCode: code,
			password: md5(password)
		});
		sign.close();
		Toast({
			text: '密码修改成功，可以用新密码登录啦'
		});
	};

	state = {
		mobile: '',
		code: '',
		password: '',
		repeatingPassword: ''
	};

	swiper = null;
}

export default PasswordForgot;