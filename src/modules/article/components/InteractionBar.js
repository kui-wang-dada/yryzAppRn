/**
 * 文章详情页底部交互栏
 */

import React, { Component } from 'react';
import {
	View, Icon,
	StyleSheet, Touchable, Keyboard, Text, Platform,
	KeyboardAvoidingView, TextInput, Share
} from '@components';
import { http, navigation } from '@services';
import {
	transformNum, env, commonStyle, modal
} from '@utils';
import Collect from './Collect';
import Like from './Like';
import { sign, ButtonWithAuth } from '@modules/user';

let baseInputHeight = Platform.select({
	'ios': commonStyle.transformSize(60),
	'android': commonStyle.transformSize(86),
})

let keyboardVerticalOffset = Platform.select({
	'ios': commonStyle.transformSize(150),
	'android': -commonStyle.transformSize(600)
})
export default class InteractionBar extends Component {
	constructor(props) {
		super(props);
		this.setRefCommentInput = this.setRefCommentInput.bind(this);
	}
	state = {
		following: false,
		focused: false,
		btnActive: false,
		commentContent: '',
		liked: false,
		followed: false,
		inputHolder: '我想说两句…',
		isReply: false,
		showActionBar: true,
		inputHeight: baseInputHeight,
		disableComment: false,
	}
	componentWillMount() {
		this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
		this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
	}
	render() {
		let { id } = this.props.data;
		let { likeCount = '', commentCount, favoriteFlag, likeFlag } = this.props.data.behavior;
		let { focused, commentContent, liked, followed, inputHolder, showActionBar } = this.state;
		let { showCommentView } = this.props;
		let commentTxtStyle = [s.submitTxt];
		let validComment = commentContent.trim().length >= 1 && commentContent.trim().length <= 100;
		if (validComment) {
			commentTxtStyle.push(s.activeTxt);
		}
		commentCount = commentCount < 0 ? 0 : commentCount;
		return (
			<KeyboardAvoidingView style={s.container} behavior="padding" keyboardVerticalOffset={keyboardVerticalOffset}>
				<View style={[s.commentView, !showCommentView && s.hide]}>
					<View style={[s.commentInput, focused && s.commentInputFocused]}>
						<TextInput ref={this.setRefCommentInput} placeholder={inputHolder}
							multiline
							onFocus={this.handleCommentFocus} onBlur={this.handleCommentBlur}
							onChangeText={(commentContent) => this.setState({ commentContent })}
							onContentSizeChange={this.onContentSizeChange}
							underlineColorAndroid={'transparent'}
							value={this.state.commentContent}
							style={[s.commentTextInput, { height: Math.max(baseInputHeight, this.state.inputHeight) }]}
						/>
						<Touchable disabled={!validComment}
							onPress={this.submitComment} transparent
							style={[s.commentBtn, focused ? '' : s.hide]}>
							<Text style={commentTxtStyle}>发布</Text>
						</Touchable>
					</View>

				</View>
				<View style={[s.actionBar, focused && !showActionBar ? s.hide : '']}>
					<Like count={likeCount}
						renderText={(count) => `点赞 ${count}`}
						onChangeLike={this.props.onChangeLike}
						id={id} moduleCode={'1002'}
						iconStyle={s.actionIcon}
						textStyle={s.actionText}
						style={s.actionInner}
						activeText={true}
						active={likeFlag === 1} vertical
					/>
					<Touchable
						transparent
						block
						onPress={this.pressComment}
						style={s.action}
					>
						<View style={[s.actionInner, s.firstActionInner]}>
							<Icon name="comments" style={s.actionIcon} />
							<Text style={s.actionText}>评论 {transformNum(commentCount)}</Text>
						</View>
					</Touchable>
					<Collect active={favoriteFlag === 1}
						iconStyle={s.actionIcon} id={id}
						textStyle={[s.actionText]}
						style={[s.actionInner, { paddingBottom: 3 }]}
						onChange={this.props.changeCollectState}
					/>
					<Touchable block onPress={this.share} style={s.action} transparent>
						<View style={[s.actionInner]}>
							<Icon name="transpond" style={s.actionIcon} />
							<Text style={s.actionText}>分享</Text>
						</View>
					</Touchable>
				</View>
			</KeyboardAvoidingView >
		)
	}
	_keyboardDidShow = () => {
		console.log('DidShow')
		this.setState({ showActionBar: false });
	}

	_keyboardDidHide = () => {
		console.log('_keyboardDidHide')
		this.setState({ showActionBar: true });
	}
	componentWillUnmount() {
		this.keyboardDidShowListener.remove();
		this.keyboardDidHideListener.remove();
	}
	onContentSizeChange = (event) => {
		this.setState({ inputHeight: event.nativeEvent.contentSize.height });
	}
	pressComment = () => {
		// todo 点击评论按钮滚动效果
		this.props.onCommentPress && this.props.onCommentPress();
	}
	setRefCommentInput = (r) => {
		this.refCommentInput = r;
	}
	focusCommentInput = (rootCommentItem, targetCommentItem) => {
		this.targetCommentItem = targetCommentItem;
		this.rootCommentItem = rootCommentItem;
		this.refCommentInput.focus();
		this.setState({
			inputHolder: `回复 ${targetCommentItem.nickName}`,
			isReply: true,
		});
	}

	submitComment = async () => {
		let { commentContent, isReply, disableComment } = this.state;
		if (disableComment) {
			return;
		}
		this.setState({ disableComment: true });
		if (commentContent.length < 1 || commentContent.length > 200) {
			return;
		}
		let { id, author = {} } = this.props.data;
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

		Keyboard.dismiss();
		if (res.data.code === '200') {
			this.setState({ focused: false, commentContent: '', disableComment: false });
			this.props.onAddComment && this.props.onAddComment(res.data.data);
			return;
		}
		this.setState({ focused: false, disableComment: false });
	}
	handleCommentFocus = async () => {

		let { user } = this.props;
		if (!user.isSignIn) {
			this.refCommentInput.blur();
			navigation.navigate('LoginScreen');
		} else {
			this.setState({ focused: true });
		}
	}
	handleCommentBlur = () => {
		let { commentContent } = this.state;
		if (commentContent.length <= 0) {
			this.setState({ inputHolder: '我想说两句…', focused: false, isReply: false });
		} else {
			this.setState({ focused: false });
		}
	}
	share = () => {
		let { application = {}, title, description, id, coverImgUrl = '', payFlag } = this.props.data;
		// if (!payFlag) {
		// 	title = `【${application.appliName}】${title}`;
		// }
		let shareData = {
			title: `【悠然一指】${title}`,
			content: description,
			imgUrl: coverImgUrl.split(',')[0] || application.appliIcon,
			url: `${env.webBaseUrl}/article-share/${id}`
		};
		let shareComp = <Share data={shareData} />
		modal.show(shareComp, 'share');
	};

}

let artionBarBottomPadding = (Platform.OS === "ios" && commonStyle.SCREEN_WIDTH === 375 && commonStyle.SCREEN_HEIGHT === 812) ? commonStyle.transformSize(60) : 0;
const s = StyleSheet.create({
	container: {
		borderTopWidth: 0.5,
		borderTopColor: '#dfdfdf',
		backgroundColor: '#fff',
		position: 'absolute',
		right: 0,
		bottom: 0,
		left: 0,
	},
	commentView: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		backgroundColor: '#fff',
		paddingTop: commonStyle.transformSize(18),
		paddingHorizontal: commonStyle.padding,
	},
	commentInput: {
		flex: 1,
		backgroundColor: '#f8f8f8',
		borderRadius: commonStyle.transformSize(12),
		overflow: 'hidden',
		paddingHorizontal: commonStyle.transformSize(30),
	},
	commentInputFocused: {
		backgroundColor: '#fff',
		paddingHorizontal: 0,
	},
	commentTextInput: {
		flex: 1,
		textAlign: 'justify',
		height: commonStyle.transformSize(98),
		fontSize: commonStyle.transformSize(28),
	},
	commentBtn: {
		backgroundColor: '#fff',
		alignSelf: 'flex-end',
		paddingTop: commonStyle.transformSize(20),
		paddingBottom: commonStyle.transformSize(28),
	},
	submitTxt: {
		color: '#999',
	},
	activeTxt: {
		color: '#fe5551',
	},
	actionBar: {
		paddingTop: commonStyle.transformSize(16),
		paddingBottom: artionBarBottomPadding,
		justifyContent: 'space-around',
		flexDirection: 'row',
		backgroundColor: '#fff',
		// ...commonStyle.borderTop,
	},
	action: {
		paddingTop: 0,
		paddingBottom: 0,
		borderRadius: 0,
		flex: 1,
	},
	actionInner: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: 0,
		paddingBottom: commonStyle.transformSize(10),
		flex: 1,
	},
	firstActionInner: {
	},
	actionIcon: {
		fontSize: commonStyle.transformSize(32),
		color: '#b3b3b3',
		zIndex: 9,
	},
	activeActionIcon: {
		color: '#fe5551',
	},
	actionText: {
		backgroundColor: 'transparent',
		color: '#b3b3b3',
		fontSize: commonStyle.transformSize(22),
		marginTop: commonStyle.transformSize(9),
	},
	hide: {
		display: 'none',
	}
});




