import * as Action from './message.action';

const DEFAULT_STATE = []

export default function (state = DEFAULT_STATE, action = {}) {
	switch (action.type) {
		case Action.LOAD_ANNOUNCE: {
			let newState = action.payload;
			newState.forEach((item) => {
				state.forEach((element) => {
					if (element.id === item.id) {
						item.hasRead = element.hasRead;
					}
				});
			});
			console.log(JSON.stringify(newState))
			return [...newState];
		}
		case Action.DELETE_ANNOUNCE: {
			let oldState = action.payload;
			return [...oldState];
		}
		default:
			return state;
	}
}