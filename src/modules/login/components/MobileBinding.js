import React from 'react';
import PropTypes from 'prop-types';
import {
	Button,
	Form,
	Item,
	Input,
	H2,
	Text,
	View,
	InviteCode
} from '@components';
import {
	Validator,
	http,
} from '@services';
import MobileCode from './MobileCode';
import getInviteCode from '../services/getInviteCode';
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
});

class MobileBinding extends React.Component {
	render() {
		return (
			<View style={signStyles.pureForm}>
				<View style={signStyles.pureFormHead}>
					<H2 style={signStyles.pureFormTitle}>绑定手机</H2>
				</View>
				<Form>
					<Item>
						<Input
							keyboardType="phone-pad"
							returnKeyType="next"
							clearButtonMode="always"
							placeholder="手机号"
							editable={!this.props.mobile}
							maxLength={11}
							value={this.state.mobile}
							onChangeText={this.handleFieldChange('mobile')}
							style={signStyles.input}
						/>
					</Item>
					<MobileCode action="5" mobile={this.state.mobile} onChangeText={this.handleFieldChange('code')} />
					<InviteCode inviteCodeInit={this.state.inviteCode} handleFieldChange={this.handleInviteChange.bind(this)}/>
					<Button block onPress={this.submit} style={signStyles.submitTrigger}><Text>绑定手机</Text></Button>
				</Form>
			</View>
		);
	}

	async componentDidMount() {
		this.setState({
			inviteCode: await getInviteCode()
		});
	}

	handleFieldChange = (fieldName) => (value) => {
		this.setState({
			[fieldName]: value
		});
	};
	handleInviteChange = (fieldName,value)=>{
		this.setState({
			[fieldName]: value
		});
	}
	submit = async () => {
		const {
			mobile,
			code,
		} = this.state;
		await validator.validate([
			{
				name: 'mobile',
				value: mobile
			},
			{
				name: 'code',
				value: code
			},
		]);
		await http.post('/services/app/v1/user/account/phone/binder', {
			inviteCode: this.state.inviteCode,
			userId: this.props.userId,
			phone: mobile,
			veriCode: code,
		});
		this.props.onSuccess(mobile);
	};

	state = {
		inviteCode: '',
		mobile: this.props.mobile,
		code: '',
	};

	static propTypes = {
		userId: PropTypes.string,
		mobile: PropTypes.string,
	};

	static defaultProps = {
		mobile: ''
	};
}

export default MobileBinding;