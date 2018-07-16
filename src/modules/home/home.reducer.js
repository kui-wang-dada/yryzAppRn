import * as homeActions from './home.action';
// TBD load local images
const DEFAULT_STATE = {
	adList: [],
	subjectList: [],
	hotWords: '',
	narmalIds: [],
	recommendIds: []

};
export default function (state = DEFAULT_STATE, action = {}) {
	switch (action.type) {
		case homeActions.LOAD_ADS: {
			// action.payload ={asList:[ad,ad]}
			return { ...state, ...action.payload };
		}
		case homeActions.DELETE_ADS: {
			return Object.assign({}, state, { adList: DEFAULT_STATE.adList });
		}
		case homeActions.LOAD_SUBJECT: {
			return { ...state, ...action.payload };
		}
		case homeActions.LOAD_HOTWORDS: {
			return { ...state, ...action.payload };
		}
		case homeActions.NARMAL_IDS: {
			return { ...state, ...action.payload };
		}
		case homeActions.RECOMMEND_IDS: {
			return { ...state, ...action.payload };
		}
		case homeActions.DATA_CACHE: {
			return { ...state, ...action.payload };
		}
		default:
			return state;

	}
}