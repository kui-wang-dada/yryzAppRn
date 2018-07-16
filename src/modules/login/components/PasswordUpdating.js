import React from 'react';
import {
	Alert
} from 'react-native';
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
	sign,
} from '@services';
import signStyles from '../styles';

const validator = new Validator({
	password: [
		{
			rule: 'required',
			message: '请输入当前密码'
		}
	],
	newPassword: [
		{
			rule: 'required',
			message: '请输入新密码'
		},
		'password'
	],
	repeatingNewPassword: [
		{
			rule: 'required',
			message: '请再次输入新密码'
		}
	],
});

class PasswordUpdating extends React.Component {
	render() {
		return (
			<View style={signStyles.pureForm}>
				<View style={signStyles.pureFormHead}>
					<H2 style={signStyles.pureFormTitle}>修改密码</H2>
				</View>
				<Form>
					<Item>
						<Input
							secureTextEntry
							placeholder="当前密码"
							returnKeyType="next"
							clearButtonMode="always"
							onChangeText={this.handleFieldChange('password')}
							style={signStyles.input}
						/>
					</Item>
					<Item>
						<Input
							secureTextEntry
							placeholder="新密码"
							returnKeyType="next"
							clearButtonMode="always"
							onChangeText={this.handleFieldChange('newPassword')}
							style={signStyles.input}
						/>
					</Item>
					<Item>
						<Input
							secureTextEntry
							placeholder="再次输入新密码"
							returnKeyType="done"
							clearButtonMode="always"
							onChangeText={this.handleFieldChange('repeatingNewPassword')}
							style={signStyles.input}
						/>
					</Item>
					<Button block onPress={this.submit} style={signStyles.submitTrigger}><Text>确认修改</Text></Button>
				</Form>
			</View>
		);
	}

	handleFieldChange = (fieldName) => (value) => {
		this.setState({
			[fieldName]: value
		});
	};

	submit = async () => {
		const {
			password,
			newPassword,
			repeatingNewPassword
		} = this.state;
		await validator.validate([
			{
				name: 'password',
				value: password
			},
			{
				name: 'newPassword',
				value: newPassword
			},
			{
				name: 'repeatingNewPassword',
				value: repeatingNewPassword
			},
		]);

		if (repeatingNewPassword !== newPassword) {
			Alert.alert('新密码输入不一致，请重新输入');
			return;
		}

		await http.post('/services/app/v1/user/pwd/editor', {
			password: md5(password),
			newPassword: md5(newPassword)
		});
		sign.close();
		Toast({
			text: '密码修改成功'
		});
		//TrackModule.setEvent('4修改密码');
	};

	state = {
		password: '',
		newPassword: '',
		repeatingNewPassword: ''
	};
}

export default PasswordUpdating;
