import * as artAction from './article.action';

const defaultState = {
	commentItem: {},
	deletedCommentIdList: [],
};

export default function (state = defaultState, action = {}) {
	switch (action.type) {
		case artAction.LIKE_COMMENT: {
			// let newCommentLikeList = [].concat(state, action.payload.commentItemId);
			let likeCount = state.commentItem.likeCount + 1;
			let commentItem = Object.assign({}, state.commentItem, { likeFlag: 1, likeCount });
			return { ...state, ...{ commentItem } };
		}
		case artAction.CANCEL_LIKE_COMMENT: {
			let likeCount = state.commentItem.likeCount - 1;
			let commentItem = Object.assign({}, state.commentItem, { likeFlag: 0, likeCount });
			return { ...state, ...{ commentItem } };
		}
		case artAction.ADD_REPLY: {
			let newCommentItem = Object.assign({}, state.commentItem);
			newCommentItem.replyList = newCommentItem.replyList || [];
			newCommentItem.replyList.unshift(action.payload.replyItem);
			newCommentItem.replyCount += 1;
			return { ...state, ...{ commentItem: newCommentItem } }
		}
		case artAction.DELETE_REPLY: {
			let commentItem = Object.assign({}, state.commentItem);
			commentItem.replyList = commentItem.replyList.filter((item) => {
				return item.id !== action.payload.replyId;
			});
			commentItem.replyCount -= 1;
			console.log('newCommentItem --- DELETE_REPLY', commentItem);
			return { ...state, ...{ commentItem } };
		}

		case artAction.LOAD_COMMENT_ITEM: {
			// let newCommentItem = Object.assign({}, state.commentItem, action.payload.commentItem);
			let newCommentItem = { ...state.commentItem, ...action.payload.commentItem };
			return { ...state, ...{ commentItem: newCommentItem } };
		}
		case artAction.DELETE_COMMENT: {
			let deletedCommentIdList = [...state.deletedCommentIdList, ...[action.payload.commentId]];
			return { ...defaultState, ...{ deletedCommentIdList } };
		}
		default:
			return state;

	}
}