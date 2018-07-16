import * as Action from './message.action'

const DEFAULT_STATE = {
	pushInfoList: [],
	pushCount: 0,
	announceCount: 0,
	announceInfo: {
		title: '系统公告',
		content: '暂无公告',
		hasRead: true
	}
}

function createReducer(initialState, handlers) {
	return function reducer(state = initialState, action) {
		// 判断是否存在该action
		if (handlers.hasOwnProperty(action.type)) {
			let newState = handlers[action.type](state, action);
			let pushInfoList = newState.hasOwnProperty('pushInfoList') ? newState.pushInfoList : state.pushInfoList;
			let announceCount = newState.hasOwnProperty('announceCount') ? newState.announceCount : state.announceCount;
			let pushCount = processPushCount(pushInfoList, announceCount);
			return { ...state, ...newState, pushCount }
		} else {
			return state;
		}
	}
}

let processPushCount = (infoList, initCount = 0) => {
	// reduce(callbackFun,initValue)  callbackFun包含四个值(previousValue`必需`,currentValue`必需`,index,array) 
	// previousValue 上一次计算结束后返回的值 
	return infoList.reduce((total, item) => { if (!item.hasRead) total++; return total }, initCount);
}

let addPush = (state, action) => {
	let pushInfo = action.payload;
	let { pushInfoList } = state;
	pushInfo.time = getTimestamp();
	pushInfo.hasRead = false;
	// filter(function(currentValue`必需`,index,arr)) , 返回符合条件元素
	pushInfoList = pushInfoList.filter((item) => {
		return item.messageId !== pushInfo.messageId;
	});
	// unshift 向数组开头添加单个/多个item,并返回length
	pushInfoList.unshift(pushInfo);
	return { pushInfoList };
}

let changePush = (state, action) => {
	let pushInfo = action.payload;
	let { pushInfoList } = state;
	for (let item of pushInfoList) {
		if (item.messageId === pushInfo.messageId) item.hasRead = true
	}
	return { pushInfoList };
}

let deletePush = (state, action) => {
	let { pushInfoList } = state
	let payload = action.payload;
	let removeList = (payload instanceof Array) ? payload : [payload];
	let removeIdList = removeList.map((item) => item.messageId);
	pushInfoList = pushInfoList.filter((item) => !removeIdList.includes(item.messageId));
	return { pushInfoList };
}

let clearPush = (state, action) => {
	return DEFAULT_STATE;
}

let addAnnounce = (state, action) => {
	let { announceCount } = state;
	let announceInfo = action.payload;
	announceInfo.time = getTimestamp();
	announceInfo.content = announceInfo.title;
	announceInfo.title = '系统公告';
	announceInfo.hasRead = false;
	announceCount++;
	return { announceCount, announceInfo };
}

let changeAnnounce = (state, action) => {
	let { announceInfo } = state
	announceInfo.hasRead = true;
	return { announceCount: 0, announceInfo };
}

let getTimestamp = () => {
	return new Date().getTime();
}

let reducer = createReducer(DEFAULT_STATE, {
	[Action.ADD_PUSH]: addPush,
	[Action.CHANGE_PUSH]: changePush,
	[Action.DELETE_PUSH]: deletePush,
	[Action.CLEAR_PUSH]: clearPush,
	[Action.ADD_ANNOUNCE]: addAnnounce,
	[Action.CHANGE_ANNOUNCE]: changeAnnounce
});
export default reducer;