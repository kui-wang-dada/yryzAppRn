import React from 'react';
import { StyleSheet, TouchableOpacity, Dimensions, Keyboard, DeviceEventEmitter, KeyboardAvoidingView, Platform, PixelRatio } from 'react-native';
import { View, Icon, Text, TextInput, Message } from '@components';
import CommentList from '../article/components/CommentList'
import { transformSize, commonStyle, isIphoneX } from '@utils';
import { http, navigation } from '@services';
import store from '../../store'
import { KeyboardModule } from '@native-modules'
import { commentEmpty } from './assets'
const { width, height } = Dimensions.get('window');

export default class VideoCommentModal extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			keyboardHeight: 0,
			commentCount: 0,
			commentContent: '',
			placeholder: '文明发言有益身心健康~',
			showSend: false,
			focused: false,
			isReply: false,
			isVisible: false,
			sendComment: false,
		}
	}

	componentWillMount() {
		this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
		this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
	}

	componentWillUnmount() {
		this.keyboardDidShowListener.remove();
		this.keyboardDidHideListener.remove();
	}

	renderContent = () => {
		let { artData } = this.props;
		let emptyComponent = <Message content={`当前暂无评论`} image={commentEmpty} style={styles.empty} />;
		let commentProps = {
			commentWrapStyle: styles.itemWrap,
			avatarStyle: styles.itemIcon,
			nameStyle: styles.itemName,
			iconStyle: styles.itemLike,
			textStyle: styles.itemLikeNum,
			commentContentStyle: styles.itemReply,
			contentStyle: styles.itemContent,
			timeStyle: styles.itemTime,
			replyContentStyle: styles.itemReplyContent,
			replyUserStyle: styles.itemReplyName,
			replyText: styles.itemReplyText,
		}
		return (
			<View style={{ flex: 1 }} >
				<View style={styles.title}>
					<Text style={{ fontSize: transformSize(24), color: '#666' }}>{this.state.commentCount}条评论</Text>
					<TouchableOpacity style={styles.titleRight} onPress={this.close}>
						<Icon name='close-a' fontSize={transformSize(40)} color='#888' />
					</TouchableOpacity>
				</View>
				<View style={{ flex: 1, backgroundColor: "#333" }}>
					<CommentList
						artData={artData}
						scrollEnabled={true}
						onTotalUpdate={this.updateCommentTotal}
						handleReply={this._handleReply}
						ref={r => this._commentList = r}
						emptyComponent={emptyComponent}
						commentProps={commentProps} />
				</View>
				<View style={[styles.bottomInput, this.state.showSend && { backgroundColor: '#fff', paddingBottom: this.state.keyboardHeight }]}>
					<TextInput
						ref={(ref) => this._input = ref}
						multiline={true}
						placeholderTextColor='#999'
						maxLength={100}
						underlineColorAndroid={'transparent'}
						style={[styles.input, { color: this.state.showSend ? '#000' : '#999' }]}
						placeholder={this.state.placeholder}
						selectionColor={commonStyle.color_theme}
						onBlur={this._onInputBlur}
						onFocus={this._onFocus}
						onChangeText={(content) => this._onChangeText(content)}
						value={this.state.commentContent} />
					<TouchableOpacity style={[styles.send, this.state.showSend && { height: transformSize(80) }]}
						onPress={this.submitComment}>
						<Text style={[styles.sendText, { color: this.state.commentContent.length === 0 ? '#aaa' : commonStyle.color_theme, }]}>发送</Text>
					</TouchableOpacity>
				</View>
			</View>
		)
	}

	render() {
		this.getKeyboardHeight()
		return (
			< View style={[styles.bottomModal, this.state.isVisible && { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }]}>
				{
					Platform.OS === 'ios' ?
						(
							<KeyboardAvoidingView style={styles.container} behavior={'padding'}>
								{this.renderContent()}
							</KeyboardAvoidingView>
						) :
						(
							<View style={styles.container}>
								{this.renderContent()}
							</View>
						)
				}
				{isIphoneX() && this.state.isVisible ? <View style={{ width: '100%', height: transformSize(50), backgroundColor: '#222' }} /> : null}
			</View >
		);
	}

	getKeyboardHeight = () => {
		if (this.state.keyboardHeight === 0) {
			if (Platform.OS === 'android') {
				KeyboardModule.getKeyboardHeight().then((result) => {
					let keyboardHeight = result.keyboardHeight / PixelRatio.get()
					if (this.state.keyboardHeight !== keyboardHeight) {
						this.setState({ keyboardHeight })
					}
				})
			}
		}
	}


	_keyboardDidShow = () => {

	}

	_keyboardDidHide = () => {

	}

	_onInputBlur = () => {
		this.setState({ placeholder: '文明发言有益身心健康~', focused: false, showSend: false, isReply: false })
	}

	_onFocus = () => {
		//未登录 -> 跳转登录
		let { user } = store.getState();
		if (!user.isSignIn) {
			navigation.navigate('LoginScreen');
			return;
		}
		if (this.state.focused && this.state.showSend) return;
		this.setState({ focused: true, showSend: true });
	}

	_onChangeText = (commentContent) => {
		this.setState({
			commentContent
		})
	}

	_handleReply = (rootCommentItem, targetCommentItem) => {
		this.targetCommentItem = targetCommentItem;
		this.rootCommentItem = rootCommentItem;
		this._input.focus();
		this.setState({
			placeholder: `回复 ${targetCommentItem.nickName}`,
			isReply: true,
		})
	}

	submitComment = async () => {
		let { commentContent, isReply } = this.state;
		if (commentContent.length === 0) {
			return
		}
		if (this.state.sendComment) {
			return;
		} else {
			this.setState({
				sendComment: true
			})
		}
		let { id, author = {} } = this.props.artData
		try {
			let res = await http({
				url: `/services/app/v1/comment/publish`,
				method: 'post',
				data: {
					comment: commentContent,
					infoId: id,
					moduleCode: isReply ? '1005' : '1002',
					parentId: isReply ? this.targetCommentItem.id : 0,
					targetUserId: isReply ? this.targetCommentItem.userId : author.id,
					topId: isReply ? this.rootCommentItem.id : ''
				}
			})
			if (res.data.code === '200') {
				Keyboard.dismiss();
				this.setState({
					placeholder: '文明发言有益身心健康~',
					commentContent: '',
					showSend: false,
				})
				DeviceEventEmitter.emit('newComment', res.data.data)
			}
		} finally {
			this.setState({
				focused: false,
				sendComment: false
			})
		}
	}

	updateCommentTotal = (number) => {
		if (number <= 0) {
			number = 0;
		}
		this.setState({
			commentCount: number,
		});
		if (this.props.updateCommentTotal) {
			this.props.updateCommentTotal(number)
		}
	};

	close = () => {
		this.setState({
			isVisible: false
		})
		if (this.props.onClose) {
			this.props.onClose();
		}
		Keyboard.dismiss();
	}

	open = () => {
		this.setState({
			isVisible: true
		})
	}
}

const styles = StyleSheet.create({
	bottomModal: {
		justifyContent: 'flex-end',
		backgroundColor: 'transparent'
	},
	container: {
		flex: 1,
		borderTopLeftRadius: transformSize(20),
		borderTopRightRadius: transformSize(20),
		maxHeight: height * 3 / 4,
		backgroundColor: '#333'
	},
	title: {
		height: transformSize(80),
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	titleRight: {
		position: 'absolute',
		paddingTop: transformSize(30),
		paddingRight: transformSize(30),
		height: transformSize(80),
		right: 0,
		top: 0,
	},
	bottomInput: {
		flexDirection: 'column',
		borderTopLeftRadius: transformSize(20),
		borderTopRightRadius: transformSize(20),
		backgroundColor: '#222',
		paddingTop: Platform.OS === 'ios' ? transformSize(10) : 0
	},
	input: {
		width: '100%',
		textAlign: 'left',
		maxHeight: transformSize(200),
		lineHeight: transformSize(40),
		paddingHorizontal: transformSize(40),
		paddingVertical: transformSize(25),
		backgroundColor: 'transparent',
		fontSize: transformSize(28)
	},
	send: {
		height: 0,
		paddingHorizontal: transformSize(40)
	},
	sendText: {
		textAlign: 'right',
		fontSize: transformSize(30)
	},
	empty: {
		paddingTop: transformSize(200)
	},
	itemWrap: {
		paddingVertical: transformSize(0),
		paddingTop: transformSize(50)
	},
	itemIcon: {
		width: transformSize(54),
		height: transformSize(54),
		borderRadius: transformSize(27),
	},
	itemName: {
		color: '#999',
		fontSize: transformSize(24)
	},
	itemLike: {
		color: '#999',
	},
	itemLikeNum: {
		color: '#999',
	},
	itemContent: {
		color: '#fff',
		marginLeft: transformSize(70),
		marginTop: transformSize(10),
		fontSize: transformSize(28)
	},
	itemTime: {
		color: '#999',
		marginLeft: transformSize(70),
		fontSize: transformSize(24)
	},
	itemReply: {
		color: '#eee',
		backgroundColor: '#3c3c3c',
		marginLeft: transformSize(70)
	},
	itemReplyContent: {
		color: '#eee'
	},
	itemReplyName: {
		color: '#eee'
	},
	itemReplyText: {
		color: '#999'
	}
})