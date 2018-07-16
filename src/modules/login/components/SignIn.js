import React from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	LayoutAnimation
} from 'react-native';
import md5 from 'md5';
import {
	Button,
	Text,
	View,
	Form,
	Item,
	Input,
	YIcon,
	H2,
} from '@components';
import {
	http,
	Validator
} from '@services';
import styles from '@styles';
import signStyles from '../styles';
import MobileCode from './MobileCode';
import { YZhugeIo, YCommon, YShareSDK } from '@ydk';
const validator = new Validator({
	mobile: [
		{
			rule: 'required',
			message: '请输入手机号'
		},
		'mobile'
	],
	password: [
		{
			rule: 'required',
			message: '请输入密码'
		}
	],
	code: [
		{
			rule: 'required',
			message: '请输入验证码'
		},
		'mobile-code'
	]
});

class SignIn extends React.Component {
	render() {
		const wayElements = {
			'password': {
				auth: (
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
				),
				addon: (
					<View style={signStyles.addon}>
						<Button transparent onPress={() => { this.switchWay('code'); }}>
							<Text style={signStyles.addonMainText}>手机动态密码登录</Text>
						</Button>
						<Button transparent onPress={this.props.toPasswordForgot}>
							<Text style={signStyles.addonSecondaryText}>忘记密码？</Text>
						</Button>
					</View>
				)
			},
			'code': {
				auth: (
					<MobileCode
						returnKeyType="done"
						action="9"
						mobile={this.state.mobile}
						onChangeText={this.handleFieldChange('code')}
					/>
				),
				addon: (
					<View style={signStyles.addon}>
						<Button transparent onPress={() => { this.switchWay('password'); }}>
							<Text style={signStyles.addonMainText}>密码登录</Text>
						</Button>
					</View>
				)
			}
		};
		const wayElement = wayElements[this.state.way];

		return (
			<Form>
				<Item>
					<Input
						keyboardType="phone-pad"
						returnKeyType="next"
						placeholder="手机号"
						returnKeyType="next"
						clearButtonMode="always"
						maxLength={11}
						onChangeText={this.handleFieldChange('mobile')}
						style={signStyles.input}
					/>
				</Item>
				{wayElement.auth}
				<Button block onPress={this.submit.bind(this)} style={signStyles.submitTrigger}><Text>登录</Text></Button>
				{wayElement.addon}
				{this.renderThirdParty()}
			</Form>
		);
	}

	componentWillMount() {
		this.initThirdPartyConfigs();
	}

	switchWay(way) {
		LayoutAnimation.easeInEaseOut();
		this.setState({
			way
		});
	}

	async submit() {
		// 诸葛埋点
		//TrackModule.setEvent('登录', {
			// 'userId': ''
		});

		const validatingFields = [
			{
				name: 'mobile',
				value: this.state.mobile
			}
		];

		let url = '';
		const body = {
			phone: this.state.mobile,
			appChannel: YCommon.channel
		};

		switch (this.state.way) {
			case 'password': {
				validatingFields.push({
					name: 'password',
					value: this.state.password
				});
				url = '/services/app/v1/user/login';
				Object.assign(body, {
					password: md5(this.state.password)
				});
				//TrackModule.setEvent('4首次登录方式', {
					'登录方式': '密码登录'
				});
				break;
			}

			case 'code': {
				validatingFields.push({
					name: 'code',
					value: this.state.code
				});
				url = '/services/app/v1/user/login/vercode';
				Object.assign(body, {
					veriCode: this.state.code
				});
				//TrackModule.setEvent('4首次登录方式', {
					'登录方式': '手机动态码登录'
				});
				break;
			}

			default: {
				throw new Error(`Sign-in way "${this.state.way}" is invalid.`);
			}
		}

		await validator.validate(validatingFields);
		const userData = (await http.post(url, body)).data.data;
		this.props.onSuccess(userData);

		// 诸葛埋点
		//TrackModule.setEvent('登录成功', {
			// 'userId': ''
		});

	}

	async byThirdParty(platform) {
		this.props.onThirdPartyStart();
		//TrackModule.setEvent('4首次登录方式', {
			'登录方式': ({
				'wechat': '微信登录',
				'sinaWeibo': '微博登录',
			})[platform]
		});

		try {
			const auth = await YShareSDK.authorizeLogin(platform);
			const userData = (await http.post('/services/app/v1/user/login/third', {
				accessToken: auth.token,
				openId: auth.userId,
				appChannel: YCommon.channel,
				type: ({
					'wechat': '1',
					'sinaWeibo': '2',
				})[platform]
			})).data.data;
			this.props.onThirdPartySuccess(userData);
		} catch (error) {
			throw error;
		} finally {
			this.props.onThirdPartyEnd();
		}
	}

	initThirdPartyConfigs = async () => {
		const defaultConfigs = [
			{
				icon: {
					name: 'wechat',
					color: '#75d98a'
				},
				app: 'wechat'
			},
			{
				icon: {
					name: 'sina',
					color: '#ff8282'
				},
				app: 'sinaWeibo'
			},
		];
		const configs = [].concat(this.state.thirdPartyConfigs);

		for (config of defaultConfigs) {
			if (await YShareSDK.isClientInstalled(config.app)) {
				configs.push(config);
			}
		}

		this.setState({
			thirdPartyConfigs: configs
		});
	};

	handleFieldChange = (fieldName) => (value) => {
		this.setState({
			[fieldName]: value
		});
	};

	renderThirdParty = () => {
		const triggers = this.state.thirdPartyConfigs.map((config, index) => (
			<Button
				key={index}
				transparent
				onPress={() => { this.byThirdParty(config.app); }}
				style={style.thirdPartyTrigger}
			>
				<YIcon name={config.icon.name} style={[style.thirdPartyTriggerIcon, {color: config.icon.color}]} />
			</Button>
		));

		return (
			<View style={style.thirdParty}>
				<View style={style.thirdPartyTitle}>
					<View style={style.thirdPartyTitleLine}></View>
					<H2 style={style.thirdPartyTitleText}>第三方登录</H2>
					<View style={style.thirdPartyTitleLine}></View>
				</View>
				<View style={style.thirdPartyTriggers}>
					{triggers}
				</View>
			</View>
		);
	};

	state = {
		way: 'password',
		mobile: '',
		password: '',
		code: '',
		thirdPartyConfigs: []
	};
	accountInput = null;

	static propTypes = {
		toPasswordForgot: PropTypes.func,
		onSuccess: PropTypes.func,
		onThirdPartyStart: PropTypes.func,
		onThirdPartySuccess: PropTypes.func,
		onThirdPartyEnd: PropTypes.func,
	};
}

const style = StyleSheet.create({
	thirdParty: {
		marginTop: styles.transformSize(170)
	},
	thirdPartyTitle: {
		...styles.inlineWrap,
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: styles.transformSize(20)
	},
	thirdPartyTitleText: {
		fontSize: styles.transformSize(46),
		textAlign: 'center',
		color: '#bfbfbf',
		marginHorizontal: styles.transformSize(36)
	},
	thirdPartyTitleLine: {
		flex: 1,
		height: 1,
		backgroundColor: '#d7d7d7'
	},
	thirdPartyTriggers: {
		...styles.inlineWrap,
		justifyContent: 'center',
	},
	thirdPartyTrigger: {
		padding: styles.transformSize(84),
		paddingTop: styles.transformSize(84),
		paddingBottom: styles.transformSize(84),
	},
	thirdPartyTriggerIcon: {
		fontSize: styles.transformSize(90),
	},
});

export default SignIn;
