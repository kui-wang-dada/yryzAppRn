export const DELETE_HISTORY = 'DELETE_HISTORY';
export const ADD_HISTORY = 'ADD_HISTORY';
export const LOAD_HISTORY = 'LOAD_HISTORY';

export function deleteHistory(payload) {
	return { type: DELETE_HISTORY, payload };
}

export function addHistory(payload) {
	return { type: ADD_HISTORY, payload };
}

export function loadHistory(payload) {
	return { type: LOAD_HISTORY, payload };
}