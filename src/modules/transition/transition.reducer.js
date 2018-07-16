import * as actions from './transition.action';
const DEFAULT_STATE = {
	interest_choosed: false,
	interest_skiped: false,
	interests: null
};
export default function (state = DEFAULT_STATE, action = {}) {
	switch (action.type) {
	case actions.CHOOSE_INTEREST:
			return { interests: action.payload, interest_choosed: true, interest_skiped: false }
	case actions.SKIP_INTEREST:
			return { interest_choosed: false, interest_skiped: true }
	default:
		return state;
	}
}
