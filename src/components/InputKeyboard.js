import React, { Component } from 'react';
import {
	View, StyleSheet, Text, TouchableOpacity,
	TextInput, Keyboard, KeyboardAvoidingView, Platform
} from 'react-native';
import { Touchable } from '@components';
import {
	transformSize,
	SCREEN_WIDTH,
	SCREEN_HEIGHT,
	commonStyle,
} from '@utils';
import { navigation } from '@services';

let keyboardVerticalOffset = Platform.select({
	'ios': commonStyle.transformSize(130),
	'android': -commonStyle.transformSize(500)
})

export default class InputKeyboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			alertFlag: false,
			inputContent: '',
			inputHeight: transformSize(60),
			inputHolder: '文明发言有益身心健康...',

		};
	}

	render() {
		return (

			this.state.alertFlag
				? (
					<View style={s.wrapper}>
						<TouchableOpacity
							style={s.alertBg}
							onPress={() => this.alertDismiss()}
						>

						</TouchableOpacity>
						{this.renderAlert()}
					</View>

				) : (
					null
				)

		);
	}

	componentWillMount() {
		this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
		this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
	}
	componentDidMount() {

	}
	_keyboardDidShow = () => {
		// this.setState({
		// 	alertFlag: true,
		// });
	}

	_keyboardDidHide = () => {
		// this.setState({
		// 	alertFlag: false,
		// });
	}
	componentWillUnmount() {
		this.keyboardDidShowListener.remove();
		this.keyboardDidHideListener.remove();
	}

	renderAlert = () => {
		let alertText = [s.alertText];
		let { inputContent } = this.state;

		let validComment = inputContent.trim().length >= 1 && inputContent.trim().length <= 100;
		if (validComment) {
			alertText.push(s.activeAlertText);
		}
		return (

			<KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={keyboardVerticalOffset} style={[
				s.alertWrap,
			]}
			>
				<TextInput
					style={[
						s.alertInput,
						{ height: this.state.inputHeight }
					]}
					underlineColorAndroid="transparent"
					multiline
					placeholder={this.state.inputHolder}
					onChangeText={(inputContent) => {
						this.setState({ inputContent })
						if (this.props.onChangeText)
							this.props.onChangeText(inputContent)
					}}
					onContentSizeChange={this.onContentSizeChange}
					value={this.state.inputContent}
					ref={(ref) => this._alertInput = ref}
					onFocus={this.handleCommentFocus} onBlur={this.handleCommentBlur}
				>
				</TextInput>
				<Touchable disabled={!validComment}
					onPress={() => this.alertSubmit(this.state.inputContent)} transparent style={s.alertTextWrap}
				>
					<Text style={alertText}>发布</Text>
				</Touchable>
			</KeyboardAvoidingView>

		);
	}
	handleCommentFocus = async () => {
		let { user } = this.props;
		if (!user.isSignIn) {
			this._alertInput.blur();
			navigation.navigate('LoginScreen');
		} else {
			this.setState({ focused: true });
		}
	}
	handleCommentBlur = () => {
		let { inputContent } = this.state;
		if (inputContent.length <= 0) {
			this.setState({ inputHolder: '文明发言有益身心健康…', focused: false });
		} else {
			this.setState({ focused: false });
		}
	}
	focusCommentInput = (item) => {
		this.targetCommentItem = item;
		this.setState({
			alertFlag: true,
			inputHolder: `回复 ${item.nickName}`
		},
			() => {
				this._alertInput.focus()
			}
		);
	}
	onContentSizeChange = (event) => {
		let height = event.nativeEvent.contentSize.height
		if (height >= transformSize(60)) {
			this.setState({ inputHeight: height });
		}

	}
	open = () => {
		this.setState({ alertFlag: true }, () => {
			this._alertInput.focus();
		});
	}

	alertDismiss = () => {
		// keyboard.dismiss();
		this.setState({
			alertFlag: false,
			inputContent: ''
		});
	}

	alertSubmit = (inputContent) => {
		this.setState({
			alertFlag: false,
			inputContent: ''
		});
		this.props.alertSubmit(inputContent);
	}
}

const s = StyleSheet.create({
	wrapper: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
	},
	alertBg: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	alertWrap: {
		position: 'absolute',
		bottom: 0,
		paddingHorizontal: transformSize(40),
		borderTopLeftRadius: transformSize(20),
		borderTopRightRadius: transformSize(20),
		width: transformSize(750),
		backgroundColor: 'white',
		// height: scaleSize(80),
		opacity: 1,
	},
	alertInput: {
		flex: 1,
		fontSize: transformSize(28),
		color: '#000',
		lineHeight: transformSize(40),
		marginTop: transformSize(16),
		// flexWrap: 'wrap',
		textAlignVertical: 'top'

	},
	alertTextWrap: {
		alignSelf: 'flex-end',
		paddingTop: transformSize(20),
		paddingBottom: transformSize(28),
	},
	alertText: {
		// width: transformSize(80),
		color: '#999',
		fontSize: transformSize(30)
	},
	activeAlertText: { color: '#7154d1' }
});