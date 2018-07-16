import * as searchActions from './search.action';

const DEFAULT_STATE = {
	history: [],
};

export default function (state = DEFAULT_STATE, action = {}) {
	switch (action.type) {
		case searchActions.LOAD_HISTORY: {
			// action.payload ={history: ['word1', 'word2']}
			return state;
		}
		case searchActions.ADD_HISTORY: {
			let historyArr = Object.assign([], state.history);
			historyArr.unshift(action.payload.keyword);
			// 去重
			let uniqHistoryArr = [...new Set(historyArr)];
			let historyLimit = uniqHistoryArr.slice(0, 5);
			let newState = Object.assign({}, state, { history: historyLimit });

			return newState;
		}
		case searchActions.DELETE_HISTORY: {
			let newArr = state.history.filter((item) => {
				return item !== action.payload.keyword;
			});
			return { history: newArr };
		}
		default:
			return state;
	}
}