import * as userActions from './user.action';
const DEFAULT_STATE = {
	isSignIn: false,
	userName: '',
};
const USERDATA = {};
export default function (state = DEFAULT_STATE, action = {}) {
	switch (action.type) {
		case userActions.SIGN_IN:
			USERDATA = { ...state, ...action.payload, isSignIn: true };
			return { ...state, ...action.payload, isSignIn: true };
		case userActions.SIGN_OUT:
			return DEFAULT_STATE;
		case userActions.SIGN_EDIT:
			return { ...state, ...USERDATA, ...action.payload };
		default:
			return state;
	}
}