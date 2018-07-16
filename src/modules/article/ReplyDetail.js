import React from 'react';
import { StyleSheet, View, Text, Image, Touchable, FlowList, Alert, Platform, Keyboard, InputKeyboard, ActionSheet, Toast } from '@components';
import { DeviceEventEmitter } from 'react-native';
import { commonStyle, cache, transformTime, modal } from '@utils';
import { Author, Like, CommentItem } from './components';
import { http } from '@services';
import { connect } from 'react-redux';
import {
	likeCommentAction, cancelLikeCommentAction, deleteCommentAction, addReplyAction, loadCommentItemAction, deleteReplyAction
} from './article.action';
import { withUser } from '@modules/user';

let baseInputHeight = Platform.select({
	'ios': commonStyle.transformSize(60),
	'android': commonStyle.transformSize(86),
})

@withUser(false)
@connect()
class ReplyDetail extends React.Component {
	static navigationOptions = ({ navigation }) => {
		let replyCount = navigation.getParam('replyCount');
		return {
			headerTitle: <View style={s.headerWrap}><Text style={s.headerText}>{`${replyCount}条回复`}</Text></View>,
			headerStyle: {
				borderBottomWidth: StyleSheet.hairlineWidth,
				elevation: 0,
				borderBottomColor: '#e5e5e5',
			},
		}
	}

	constructor(props) {
		super(props);
		this.state = {
			inputHeight: baseInputHeight,
			replyCount: this.total,
			commentContent: '',
			commentData: this.props.navigation.state.params.commentData,
			disableComment: false,
		}
	}
	render() {
		let { id, nickName, headImg, createDate, comment, likeCount, likeFlag, userId, parentId, targetUserNickName } = this.props.navigation.state.params.commentData;
		let { replyCount, commentData } = this.state;
		// request={this.getReplyListRequest}

		return (
			<View>
				<FlowList
					request={this.getReplyListRequest}
					ListHeaderComponent={this.renderHead()}
					renderItem={this.renderReplyItem}
					emptyNode={<View style={s.emptyView} />}
					ref={r => this._refReplyList = r}
					onFetchedData={this.onFetchedData}
				/>
				<InputKeyboard
					ref={r => this._inputKeyboard = r}
					alertSubmit={this.submitComment}
					user={this.props.user}
				/>
				{/*<View style={[s.commentContent, this.props.commentContentStyle]}>{this.renderReply()}</View>*/}
			</View>
		)
	}
	renderHead = () => {
		let { replyCount, commentData } = this.state;
		let { id, nickName, headImg, createDate, comment, userId, parentId, targetUserNickName, likeFlag, likeCount } = commentData;
		if (!id) {
			return null;
		}
		return (
			<View style={s.container}>
				<View style={s.commentWrap}>
					<View style={s.contentWrap}>
						<Author {...this.props}
							name={nickName}
							avatar={headImg}
							id={userId}
							nameStyle={s.nickName}
						/>
						<Like
							moduleCode={'1005'}
							id={id}
							count={likeCount}
							active={likeFlag ? true : false}
							vertical={false}
							onChangeLike={this.onChangeLike}
							style={s.likeWrap}
						/>
					</View>
					<Touchable onPress={this.handleCommentPress()}><Text style={s.commentTxt}>{comment}</Text></Touchable>
					<Text style={s.timeWrap}>{transformTime(createDate, true)}</Text>
				</View>
				<Text style={s.replyMargin}>{replyCount}条回复</Text>
			</View>
		)
	}
	onChangeLike = (likeState, itemId) => {
		let { commentData } = this.props.navigation.state.params;
		let likeCount = likeState ? commentData.likeCount + 1 : commentData.likeCount - 1;
		commentData = { ...commentData, ...{ likeFlag: likeState ? 1 : 0, likeCount } };
		this.setState({ commentData });
		let actionType = likeState ? likeCommentAction : cancelLikeCommentAction;
		this.props.dispatch(actionType({ commentItemId: commentData.id }));
		DeviceEventEmitter.emit('updateCommentList');
	}
	handleCommentPress = (targetComment) => () => {
		let userSelf = this.props.user.userId;
		// 区分comment and reply
		this.deleteComment = targetComment ? false : true;
		this.targetCommentItem = targetComment || this.commentData;
		let options = userSelf === this.targetCommentItem.userId ? ['删除', '取消'] : ['回复', '取消'];
		if (Platform.OS === 'android') {
			let component = (
				<ActionSheet
					cancelButtonIndex
					callback={this.actionCallback}
					options={options}
				/>)
			modal.show(component, 'ActionSheet');
		} else {
			ActionSheet.show({ options, cancelButtonIndex: 1 }, this.actionCallback);
		}
	}
	actionCallback = (index) => {
		let userSelf = this.props.user.userId;
		if (index === 0) {
			if (userSelf !== this.targetCommentItem.userId) {
				this._inputKeyboard.focusCommentInput(this.targetCommentItem);
			} else {
				this.onDeleteItem && this.onDeleteItem(this.targetCommentItem, this.deleteComment, this.commentData);
			}
		}
	}
	onDeleteItem = (targetCommentItem, deleteComment, rootCommentItem) => {
		let noticeText = deleteComment ? '是否删除这条评论？' : '是否删除这条回复？';
		Alert.alert('', noticeText,
			[{
				text: '确认', onPress: async () => {
					// todo: delete Comment data
					await http({
						url: `/services/app/v1/comment/del/${targetCommentItem.id}`,
						method: 'delete',
					})
					if (deleteComment) {
						// 删除评论就删除所有相关回复
						this.replyList = [];
						this.replyCount = 0;
						this.setState({ replyCount: this.replyCount, commentData: {} }, () => {
							this.props.navigation.setParams({ 'replyCount': this.replyCount });
							this.props.dispatch(deleteCommentAction({ commentId: rootCommentItem.id }));
							this.props.navigation.goBack();
							Toast.show('删除成功');
						});
					} else {
						this.replyList = this.replyList.filter((item) => item.id !== targetCommentItem.id);
						this.replyCount--;
						this.setState({ replyCount: this.replyCount }, () => {
							this.props.navigation.setParams({ 'replyCount': this.replyCount })
						});
						this.props.dispatch(deleteReplyAction({ replyId: targetCommentItem.id }));
					}
					this._refReplyList.updateData(this.replyList);
					DeviceEventEmitter.emit('updateCommentList');
				}
			},
			{ text: '取消', onPress: () => { }, style: 'cancel' }])
	}
	onFetchedData = (data, res) => {
		this.replyList = data;
		this.replyCount = res.data.data.count;
		this.setState({ replyCount: this.replyCount });
		let commentItem = { ...this.commentData, replyList: [...this.replyList] };
		this.props.dispatch(loadCommentItemAction({ commentItem }));

	}
	submitComment = async (commentContent) => {
		if (commentContent.length < 1 || commentContent.length > 100) {
			return;
		}
		if (this.state.disableComment) {
			return;
		}
		let { id } = this.artData;
		let res = await http({
			url: `/services/app/v1/comment/publish`,
			method: 'post',
			data: {
				comment: commentContent,
				infoId: id,
				moduleCode: '1005',
				parentId: this.targetCommentItem.id,
				targetUserId: this.targetCommentItem.userId,
				topId: this.commentData.id
			}
		})

		Keyboard.dismiss();
		if (res.data.code === '200') {
			this.onAddComment && this.onAddComment(res.data.data);
			this.setState({ disableComment: false });
			return;
		}
		this.setState({ disableComment: false });
	}
	onAddComment = (data) => {
		this.replyList.unshift(data);
		this._refReplyList.updateData(this.replyList);
		this.total++;
		this.setState({ replyCount: this.total }, () => {
			this.props.navigation.setParams({ 'replyCount': this.total });
		});
		this.props.dispatch(addReplyAction({ replyItem: data }));
		DeviceEventEmitter.emit('updateCommentList');

	}
	renderReplyItem = ({ item }) => {
		let { userId, id, likeCount, likeFlag } = this.props.navigation.state.params.commentData;
		let { nickName, headImg, targetUserNickName } = item;

		let replyNode = <Text><Text style={[s.replyText, this.props.replyText]}>回复</Text>
			<Text style={s.replyUser}>{targetUserNickName}:</Text></Text>;
		let replyTxt = item.targetUserId !== userId ? replyNode : null;

		return (
			<View style={s.itemWrap}>
				<Author name={nickName} avatar={headImg} id={item.userId} nameStyle={s.nickName}
				/>
				<Touchable onPress={this.handleCommentPress(item)}
					style={s.commentItem}
				>
					<Text style={[s.replyContent, this.props.replyContentStyle]}>
						{replyTxt}
						{item.comment}
					</Text>
				</Touchable>
				<Text style={s.timeWrap}>{transformTime(item.createDate, true)}</Text>
			</View>
		);
	}
	getReplyListRequest = (pageNo, pageSize) => {
		let { params } = this.props.navigation.state;
		let listRequest = `/services/app/v2/comment/reply/list/${pageNo}/${pageSize}`;
		return {
			url: listRequest,
			params: {
				commentId: params.commentData.id,
			}
		}
	}
	componentDidMount() {
		this.commentData = this.props.navigation.state.params.commentData;
		this.artData = this.props.navigation.state.params.artData;
		this.total = this.props.navigation.state.params.replyCount;
		this.props.navigation.setParams({ 'replyCount': this.total });

	}
}

export default ReplyDetail;

const s = StyleSheet.create({
	container: {
		backgroundColor: '#f4f4f4',
	},
	commentWrap: {
		backgroundColor: '#fff',
		paddingHorizontal: commonStyle.padding,
		paddingTop: commonStyle.transformSize(50),
		paddingBottom: commonStyle.transformSize(36),
	},
	itemWrap: {
		paddingTop: commonStyle.transformSize(22),
		paddingBottom: commonStyle.transformSize(34),
		paddingHorizontal: commonStyle.padding,
		backgroundColor: '#f4f4f4',
	},
	contentWrap: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	deleteBtn: {
		alignItems: 'flex-end',
	},
	commentTxt: {
		marginTop: commonStyle.transformSize(20),
		marginLeft: commonStyle.transformSize(90),
		fontSize: commonStyle.transformSize(30),
		marginRight: commonStyle.transformSize(12),
		color: '#000',
	},
	nickName: {
		color: '#666',
		fontSize: commonStyle.transformSize(32),
	},
	timeWrap: {
		fontSize: commonStyle.transformSize(24),
		color: '#999',
		marginLeft: commonStyle.transformSize(90),
		marginTop: commonStyle.transformSize(16),
	},

	likeWrap: {
		marginTop: commonStyle.transformSize(20),
	},
	commentItem: {
		flexDirection: 'row',
		marginTop: commonStyle.transformSize(12),
	},
	commentContent: {
		marginTop: commonStyle.transformSize(26),
		paddingTop: commonStyle.transformSize(10),
		paddingLeft: commonStyle.transformSize(30),
		paddingRight: commonStyle.transformSize(16),
		paddingBottom: commonStyle.transformSize(28),
		borderRadius: commonStyle.transformSize(10),
	},
	replyUser: {
		fontSize: commonStyle.transformSize(30),
		color: '#999',
	},
	replyText: {
		fontSize: commonStyle.transformSize(26),
		color: '#000',
		marginLeft: commonStyle.transformSize(6),
		marginRight: commonStyle.transformSize(8),
	},
	replyContent: {
		color: '#000',
		fontSize: commonStyle.transformSize(30),
		marginLeft: commonStyle.transformSize(90),
	},
	moreCommentText: {
		color: '#7762e1',
		fontSize: commonStyle.transformSize(26),
		marginTop: commonStyle.transformSize(20),
	},
	headerWrap: {
		justifyContent: 'center',
		alignItems: 'center',
		width: '80%',
	},
	headerText: {
		fontSize: commonStyle.transformSize(34),
		fontWeight: 'bold',
		color: '#000',
	},
	innerSepa: {
		width: 0,
		height: 0,
		// height: commonStyle.transformSize(22),
		borderWidth: 0,

		borderBottomWidth: commonStyle.transformSize(22),
		borderBottomColor: '#e5e5e5',
	},
	replyMargin: {
		marginTop: commonStyle.transformSize(30),
		marginHorizontal: commonStyle.padding,
		height: commonStyle.transformSize(80),
	},
	emptyView: {
		backgroundColor: '#f4f4f4',
	}
})
