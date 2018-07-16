import React from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	Alert
} from 'react-native';
import {
	Button,
	Form,
	Item,
	Input,
	H2,
	Text,
	View,
	Steps,
	withUser
} from '@components';
import {
	Validator,
	http,
	sign,
} from '@services';
import MobileCode from './MobileCode';
import styles from '@styles';
import signStyles from '../styles';


@withUser(false)
class MobileUpdating extends React.Component {
	render() {
		return (
			<View style={signStyles.pureForm}>
				<View style={signStyles.pureFormHead}>
					<H2 style={signStyles.pureFormTitle}>更换绑定</H2>
				</View>
				<Steps
					items={[
						{
							title: '解绑旧号码',
							content: (
								<Form>
									<Item>
										<Input
											keyboardType="phone-pad"
											returnKeyType="next"
											clearButtonMode="always"
											placeholder="旧手机号"
											maxLength={11}
											value={this.state.oldMobile}
											onChangeText={this.handleFieldChange('oldMobile')}
											style={signStyles.input}
										/>
									</Item>
									<MobileCode
										action="8"
										mobile={this.state.oldMobile}
										mobileRules={this.rules.oldMobile}
										onChangeText={this.handleFieldChange('oldCode')}
									/>
									<Button block onPress={this.validateOld} style={signStyles.submitTrigger}><Text>去绑定新号码</Text></Button>
								</Form>
							)
						},
						{
							title: '绑定新号码',
							content: (
								<Form>
									<Item>
										<Input
											keyboardType="phone-pad"
											returnKeyType="next"
											clearButtonMode="always"
											placeholder="新手机号"
											maxLength={11}
											value={this.state.newMobile}
											onChangeText={this.handleFieldChange('newMobile')}
											style={signStyles.input}
										/>
									</Item>
									<MobileCode action="5" mobile={this.state.newMobile} onChangeText={this.handleFieldChange('newCode')} />
									<Button block onPress={this.bindNew} style={signStyles.submitTrigger}><Text>确认绑定新号码</Text></Button>
								</Form>
							)
						},
						{
							title: '绑定成功',
							content: (
								<View style={s.success}>
									<Text style={s.successTitle}>新手机号绑定成功</Text>
									<Text style={s.successTip}>新绑定的手机号码为：{this.state.newMobile}</Text>
									<Button block onPress={sign.close} style={signStyles.submitTrigger}><Text>回到设置页</Text></Button>
								</View>
							)
						},
					]}
					index={this.state.step}
				/>
			</View>
		);
	}

	nextStep() {
		this.setState((state) => ({
			step: state.step + 1
		}));
	}

	handleFieldChange = (fieldName) => (value) => {
		this.setState({
			[fieldName]: value
		});
	};

	validateOld = async () => {
		const {
			oldMobile,
			oldCode,
		} = this.state;
		await this.validator.validate([
			{
				name: 'oldMobile',
				value: oldMobile
			},
			{
				name: 'oldCode',
				value: oldCode
			},
		]);
		const valid = (await http.post('/services/app/v1/user/checker/vercode', {
			code: '8',
			phone: oldMobile,
			veriCode: oldCode,
		})).data.data.check === '1';

		if (!valid) {
			Alert.alert('', '短信验证码错误');
			return;
		}

		this.nextStep();
	};

	bindNew = async () => {
		const {
			newMobile,
			newCode,
		} = this.state;
		await this.validator.validate([
			{
				name: 'newMobile',
				value: newMobile
			},
			{
				name: 'newCode',
				value: newCode
			},
		]);
		await http.post('/services/app/v1/user/account/phone/binder', {
			userId: this.props.user.userId,
			phone: newMobile,
			veriCode: newCode,
		});
		this.nextStep();
		this.props.onSuccess(newMobile);
	};

	state = {
		oldMobile: '',
		oldCode: '',
		newMobile: '',
		newCode: '',
		step: 0
	};

	rules = {
		oldMobile: [
			{
				rule: 'required',
				message: '请输入旧手机号'
			},
			'mobile',
			{
				test: (value) => {
					return value === this.props.user.custPhone;
				},
				message: '请输入正确的旧手机号'
			}
		],
		oldCode: [
			{
				rule: 'required',
				message: '请输入验证码'
			},
			'mobile-code'
		],
		newMobile: [
			{
				rule: 'required',
				message: '请输入新手机号'
			},
			'mobile'
		],
		newCode: [
			{
				rule: 'required',
				message: '请输入验证码'
			},
			'mobile-code'
		],
	};

	validator = new Validator(this.rules);

	static propTypes = {
		onSuccess: PropTypes.func
	};
}

const s = StyleSheet.create({
	success: {
		alignItems: 'center',
		paddingVertical: styles.transformSize(120)
	},
	successTitle: {
		fontWeight: 'bold',
		fontSize: styles.transformSize(60),
		color: styles.themeColor,
		marginBottom: styles.transformSize(80)
	},
	successTip: {
		fontSize: styles.transformSize(56)
	}
});

export default MobileUpdating;