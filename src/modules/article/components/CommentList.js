/**
 * 评论列表
 */
import React, { Component } from 'react';
import {
	http,
	// withUser
} from '@services';
import { View, StyleSheet, Alert, Message, FlowList } from '@components';
import { commonStyle } from '@utils';
import { noData } from '@assets';
import CommentItem from './CommentItem';
import { connect } from 'react-redux';
import { DeviceEventEmitter } from 'react-native';
import { addReplyAction, deleteReplyAction } from '../article.action';

let mapStateToProps = (state) => {
	return {
		commentItem: state.article.commentItem,
		deletedCommentIdList: state.article.deletedCommentIdList,
		user: state.user
	};
};

@connect(mapStateToProps)
export default class CommentList extends Component {
	constructor(props) {
		super(props);
		this.setRefCommentList = this.setRefCommentList.bind(this);
		this.getCommentRequest = this.getCommentRequest.bind(this);

	}
	render() {
		let emptyComp = this.props.emptyComponent || <Message content={`当前暂无评论, 快来评论抢沙发`} image={noData} style={s.emptyImageStyle} />;

		return (
			<FlowList {...this.props}
				ref={this.setRefCommentList}
				disabledRefresh={true}
				scrollEnabled={this.props.scrollEnabled || false}
				request={this.getCommentRequest}
				renderItem={this.renderItem}
				emptyComponent={emptyComp}
				onFetchedData={this.onFetchedData}
			></FlowList>
		);
	}
	componentDidMount() {
		this.listener = DeviceEventEmitter.addListener('newComment', this.onAddComment);
		this.updateListener = DeviceEventEmitter.addListener('updateCommentList', this.updateListData);
		if (!this.data) { return; }
		this._refCommentList.updateData(this.data);

	}
	updateListData = () => {
		// 同步replydetail page相关操作产生的数据
		let { commentItem, deletedCommentIdList } = this.props;
		this.data.map((item) => {
			if (item.id === commentItem.id) {
				item = { ...item, ...commentItem };
			}
			return item;
		})
		this.data = this.data.filter((item) => {
			if (deletedCommentIdList.includes(item.id)) {
				this.total -= 1;
				this.props.onTotalUpdate(this.total);
			}
			return !deletedCommentIdList.includes(item.id);
		});
		this._refCommentList.updateData(this.data);
	}
	componentWillUnmount() {
		this.listener.remove();
		this.updateListener.remove();
	}
	onAddComment = (newComment) => {
		if (newComment.moduleCode === '1002') {
			this.data.unshift(newComment);
			this.total++;
			this.props.onTotalUpdate(this.total);
		} else {
			this.data.map((item) => {
				if (item.id === newComment.parentId) {
					item.replyList.unshift(newComment);
					item.replyCount += 1;
				}
				return item;
			})
			this.props.dispatch(addReplyAction({ replyItem: newComment }));
		}
		this._refCommentList.updateData(this.data);

	}
	setRefCommentList = (r) => {
		this._refCommentList = r;
	}
	onFetchedData = (data, res) => {
		this.data = data;
		this.total = res.data.data.count;
		this.props.onTotalUpdate(this.total);
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
						this.data = this.data.filter((item) => {
							return item.id !== targetCommentItem.id;
						})
						this.total--;
						this.props.onTotalUpdate(this.total);
					} else {
						this.data.map((item) => {
							if (item.id === rootCommentItem.id) {
								item.replyList = item.replyList.filter((replyItem) => replyItem.id !== targetCommentItem.id)
								item.replyCount -= 1;
							}
							return item;
						})
						this.props.dispatch(deleteReplyAction({ replyId: targetCommentItem.id }));
					}

					this._refCommentList.updateData(this.data);

				}
			},
			{ text: '取消', onPress: () => { }, style: 'cancel' }])
	}
	renderItem = ({ item, index }) => {
		let { artData, commentProps } = this.props;
		if (this.props.commentItem.id === item.id) {
			item = this.props.commentItem;
		}
		return (
			<CommentItem
				data={item}
				artData={artData}
				onDeleteItem={this.onDeleteItem}
				handleReply={this.props.handleReply}
				onChangeLike={this.onChangeLike}
				user={this.props.user}
				{...commentProps}
			/>
		);
	}
	onChangeLike = (likeState, commentId) => {
		this.data = this.data.map((item) => {
			if (item.id === commentId) {
				item.likeFlag = likeState ? 1 : 0;
				likeState ? item.likeCount += 1 : item.likeCount -= 1;
			}
			return Object.assign({}, item);
		})
		this._refCommentList.updateData(this.data);

	}
	getCommentRequest = (pageNo, pageSize) => {
		let listRequest = `/services/app/v2/comment/list/${pageNo}/${pageSize}`;
		return {
			url: listRequest,
			params: {
				infoId: this.props.artData.id,
				moduleCode: '1002',
				order: 0,
			}
		}
	}
}

const s = StyleSheet.create({
	noCommentWrap: {
		height: commonStyle.transformSize(376),
	},
	emptyImageStyle: {
		paddingTop: commonStyle.transformSize(60),
		paddingBottom: commonStyle.transformSize(70),
	}
})