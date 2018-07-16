import React from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet,
	LayoutAnimation,
	Alert,
} from 'react-native';
import {
	Input,
	Button,
	Item,
	Text,
	View,
} from '@components';
import {
	http,
	Validator
} from '@services';
import Countdown from './Countdown';
import styles from '@styles';
import signStyles from '../styles';

class MobileCode extends React.Component {
	render() {
		return (
			<Item>
				<Input
					keyboardType="numeric"
					placeholder="验证码"
					clearButtonMode="always"
					style={signStyles.input}
					{...this.props}
				/>
				{this.renderTrigger()}
			</Item>
		);
	}

	renderTrigger() {
		const content = this.state.inCd
			? (
				<Text style={s.countdown}>
					<Countdown beginning={60} onEnd={this.endCd} />
					<Text> s</Text>
				</Text>
			)
			: (
				<Button transparent onPress={this.sendCode.bind(this)} style={s.trigger}>
					<Text style={s.triggerText}>发送验证码</Text>
				</Button>
			);

		return <View style={s.triggerWrapper}>{content}</View>;
	}

	async sendCode() {
		await this.validator.validate([
			{
				name: 'mobile',
				value: this.props.mobile
			}
		]);
		await http.post('/services/app/v1/user/sender/vercode', {
			code: this.props.action,
			phone: this.props.mobile,
			type: '1'
		});
		Alert.alert('', '验证码已发送，若长时间未收到，60 秒后可重新发送');
		this.setState({
			inCd: true
		});
	}

	endCd = () => {
		LayoutAnimation.easeInEaseOut();
		this.setState({
			inCd: false
		});
	};

	state = {
		inCd: false
	};

	validator = new Validator({
		mobile: this.props.mobileRules
	});

	static propTypes = {
		...Input.propTypes,
		action: PropTypes.string,
		mobile: PropTypes.string,
		mobileRules: PropTypes.array,
	};

	static defaultProps = {
		mobileRules: [
			{
				rule: 'required',
				message: '请输入手机号'
			},
			'mobile'
		]
	};
}

const s = StyleSheet.create({
	triggerWrapper: {
		...styles.borderLeft,
		width: styles.transformSize(320),
		height: styles.transformSize(66)
	},
	trigger: {
		width: '100%',
		height: '100%',
		paddingTop: 0,
		paddingBottom: 0,
	},
	triggerText: {
		flex: 1,
		textAlign: 'center',
	},
	countdown: {
		textAlign: 'center'
	}
});

export default MobileCode;