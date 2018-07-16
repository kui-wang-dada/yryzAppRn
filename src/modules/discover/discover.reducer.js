import * as discoverActions from './discover.action';

const DEFAULT_STATE = {
	hotWords: '',
};

export default function (state = DEFAULT_STATE, action = {}) {
	switch (action.type) {
		case discoverActions.LOAD_HOTWORDS: {
			return { ...state, ...action.payload };
		}
		default:
			return state;
	}
}