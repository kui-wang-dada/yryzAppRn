import * as Action from './attention.action'

const DEFAULT_STATE = {
	userList: [],
	squareList: []
};

function createReducer(initialState, handlers) {
	return function reducer(state = initialState, action) {
		if (handlers.hasOwnProperty(action.type)) {
			let newState = handlers[action.type](state, action);
			return { ...state, ...newState }
		} else {
			return state;
		}
	}
}

let loadUser = (state, action) => {
	let userList = action.payload;
	return { userList };
}

let addUser = (state, action) => {
	let { userList } = state
	let payload = action.payload;
	let addList = (payload instanceof Array) ? payload : [payload];
	userList = [...addList, ...userList]
	return { userList };
}

let deleteUser = (state, action) => {
	let { userList } = state
	let payload = action.payload;
	let removeList;
	if (payload instanceof Array) {
		removeList = payload
	} {
		removeList = [payload.infoId || payload]
	}
	userList = userList.filter((item) => !removeList.includes(item.infoId))
	console.log('userList', JSON.stringify(userList))
	return { userList };
}
let clearUser = (state, action) => {
	let { squareList } = state;
	return { userList: [], squareList }
}
let loadSquare = (state, action) => {
	let squareList = action.payload;
	return { squareList };
}
let addSquare = (state, action) => {
	let { squareList } = state
	let payload = action.payload;
	if (payload.kid && !payload.infoId) {
		payload.infoId = payload.kid
	}
	let addList = (payload instanceof Array) ? payload : [payload];
	squareList = [...addList, ...squareList]
	return { squareList };
}
let deleteSquare = (state, action) => {
	let { squareList } = state
	let payload = action.payload;
	let removeList;
	if (payload instanceof Array) {
		removeList = payload
	} {
		removeList = [payload.kid || payload]
	}
	squareList = squareList.filter((item) => !removeList.includes(item.infoId))
	return { squareList };
}
let clearSquare = (state, action) => {
	let { userList } = state;
	return { userList, squareList: [] }
}


let reducer = createReducer(DEFAULT_STATE, {
	[Action.LOAD_USER]: loadUser,
	[Action.ADD_USER]: addUser,
	[Action.DELETE_USER]: deleteUser,
	[Action.CLEAR_USER]: clearUser,
	[Action.LOAD_SQUARE]: loadSquare,
	[Action.ADD_SQUARE]: addSquare,
	[Action.DELETE_SQUARE]: deleteSquare,
	[Action.CLEAR_SQUARE]: clearSquare
});
export default reducer;