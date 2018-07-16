import React, { Component } from 'react';
import { View, Touchable, Text, StyleSheet, ActionSheet, Icon, Platform } from '@components';
import Author from './Author';
import Like from './Like';
import { commonStyle, modal, transformTime } from '@utils';
import { withUser } from '@modules/user';
import { navigation } from '@services';


class CommentItem extends Component {
	render() {
		let { id, nickName, headImg, createDate, comment, likeCount = 0, likeFlag,
			userId, parentId, targetUserNickName, replyList = [] } = this.props.data;
		// let replyNode = <View style={[s.commentContent, this.props.commentContentStyle]}>{this.renderReply(this.props.data)}</View>;
		return (
			<View style={[s.itemWrap, this.props.commentWrapStyle]}>
				<View style={s.contentWrap}>
					<Author {...this.props}
						name={nickName}
						avatar={headImg}
						id={userId}
						nameStyle={[s.nickName, this.props.nameStyle]}
					/>
					<Like {...this.props}
						moduleCode={'1005'}
						id={id}
						count={likeCount}
						active={likeFlag ? true : false}
						vertical={false}
						onChangeLike={this.props.onChangeLike}
						style={s.likeWrap}
					/>
				</View>

				<Touchable onPress={this.handleCommentPress()}><Text style={[s.commentTxt, this.props.contentStyle]}>{comment}</Text></Touchable>
				<Text style={[s.timeWrap, this.props.timeStyle]}>{transformTime(createDate, true)}</Text>
				{this.renderReply(this.props.data)}
			</View>
		)
	}
	renderReply = (data) => {
		if (!data.replyList || data.replyList.length < 1) {
			return null;
		}
		let { replyCount, id } = data;
		let replyList = data.replyList || [];
		let replyUserStyle = [s.replyUser, this.props.replyUserStyle];
		let replyListComp = replyList.map((item, index) => {
			if (index > 2) {
				return null;
			}
			return (
				<Touchable onPress={this.handleCommentPress(item)}
					style={s.commentItem}
					key={index.toString()}
				>
					<Text style={[s.replyContent, this.props.replyContentStyle]}>
						<Text style={replyUserStyle}>{item.nickName}</Text>
						<Text style={[s.replyText, this.props.replyText]}>回复</Text>
						<Text style={replyUserStyle}>{item.targetUserNickName}:</Text>
						{item.comment}
					</Text>
				</Touchable>

			)
		})
		// 解决数据从replyDetail页面同步过来不显示该链接的问题
		let moreComment = replyCount > 3 ? (
			<Touchable onPress={this.pressMoreComment}>
				<Text style={[s.moreCommentText, this.props.moreCommentText]}>
					共{replyCount}条回复<Icon name="arrow-right" style={s.moreCommentText}></Icon>
				</Text>
			</Touchable>
		) : null;
		return (
			<View style={[s.commentContent, this.props.commentContentStyle]}>
				<View>
					{replyListComp}
					{moreComment}
				</View>
				<View style={s.commentNote}></View>
			</View>
		);
	}
	pressMoreComment = () => {
		navigation.navigate('ReplyDetail', { commentData: this.props.data, replyCount: this.props.data.replyCount, artData: this.props.artData });
	}
	handleCommentPress = (targetComment) => () => {
		let userSelf = this.props.user.userId;
		// 当前targetCommentItem为该评论或评论的回复
		this.deleteComment = targetComment ? false : true;
		this.targetCommentItem = targetComment || this.props.data;
		let options = userSelf === this.targetCommentItem.userId ? ['删除', '取消'] : ['回复', '取消'];
		if (Platform.OS === 'android') {
			let component = (
				<ActionSheet
					cancelButtonIndex
					callback={this.actionCallback}
					options={options}
				/>)
			modal.show(component, 'ActionSheet')
		} else {
			ActionSheet.show({ options, cancelButtonIndex: 1 }, this.actionCallback);
		}

	}
	actionCallback = (index) => {
		// 回复或删除该评论
		let userSelf = this.props.user.userId;
		if (index === 0) {
			if (userSelf !== this.targetCommentItem.userId) {
				// 传入根评论数据和targetCommentItem
				this.props.handleReply(this.props.data, this.targetCommentItem);
			} else {
				this.props.onDeleteItem && this.props.onDeleteItem(this.targetCommentItem, this.deleteComment, this.props.data)
			}
		}
	}
}

export default CommentItem;
const s = StyleSheet.create({
	itemWrap: {
		paddingVertical: commonStyle.transformSize(50),
		paddingHorizontal: commonStyle.padding,
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
		color: '#999',
		fontSize: commonStyle.transformSize(32),
	},
	likeWrap: {
		marginTop: commonStyle.transformSize(20),
	},
	timeWrap: {
		fontSize: commonStyle.transformSize(24),
		color: '#999',
		marginLeft: commonStyle.transformSize(90),
		marginTop: commonStyle.transformSize(16),
	},
	commentItem: {
		flexDirection: 'row',
		marginTop: commonStyle.transformSize(12),
	},
	commentContent: {
		marginLeft: commonStyle.transformSize(90),
		marginTop: commonStyle.transformSize(26),
		backgroundColor: '#f7f7f7',
		paddingTop: commonStyle.transformSize(10),
		paddingLeft: commonStyle.transformSize(30),
		paddingRight: commonStyle.transformSize(16),
		paddingBottom: commonStyle.transformSize(28),
		borderRadius: commonStyle.transformSize(10),
	},
	replyUser: {
		fontSize: commonStyle.transformSize(26),
		color: '#999',
		marginRight: commonStyle.transformSize(6),
	},
	replyText: {
		fontSize: commonStyle.transformSize(26),
		color: '#000',
		marginRight: commonStyle.transformSize(6),
	},
	replyContent: {
		color: '#000',
		fontSize: commonStyle.transformSize(26),
	},
	moreCommentText: {
		color: '#7762e1',
		fontSize: commonStyle.transformSize(26),
		marginTop: commonStyle.transformSize(20),
	},
	commentNote: {
		width: commonStyle.transformSize(20),
		borderWidth: commonStyle.transformSize(15),
		borderColor: '#fff',
		borderBottomColor: '#f7f7f7',
		position: 'absolute',
		top: -commonStyle.transformSize(28),
		left: commonStyle.transformSize(16),
		zIndex: 2,

	}
})