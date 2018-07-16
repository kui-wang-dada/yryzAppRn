export const LIKE_COMMENT = 'LIKE_COMMENT';
export const CANCEL_LIKE_COMMENT = 'CANCEL_LIKE_COMMENT';

export const GET_ALL_COMMENT = 'GET_ALL_COMMENT';
export const DELETE_COMMENT = 'DELETE_COMMENT';

export const ADD_REPLY = 'ADD_REPLY';
export const DELETE_REPLY = 'DELETE_REPLY';
export const GET_ALL_REPLY = 'GET_ALL_REPLY';


export const LOAD_COMMENT_ITEM = 'LOAD_COMMENT_ITEM';

export function loadCommentItemAction(payload) {
	return { type: LOAD_COMMENT_ITEM, payload };
}


export function likeCommentAction(payload) {
	return { type: LIKE_COMMENT, payload };
}
export function cancelLikeCommentAction(payload) {
	return { type: CANCEL_LIKE_COMMENT, payload };
}



export function getAllCommentAction(payload) {
	return { type: GET_ALL_COMMENT, payload };
}
export function deleteCommentAction(payload) {
	return { type: DELETE_COMMENT, payload };
}
export function addReplyAction(payload) {
	return { type: ADD_REPLY, payload };
}
export function deleteReplyAction(payload) {
	return { type: DELETE_REPLY, payload };
}
export function getAllReplyAction(payload) {
	return { type: GET_ALL_REPLY, payload };
}