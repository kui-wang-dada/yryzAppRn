import MessageScreen from './MessageScreen'
import AnnounceScreen from './AnnounceScreen'
import AnnounceDetailScreen from './AnnounceDetailScreen'
import push from './push.reducer'
import announce from './announce.reducer'
let routes = {
	Message: {
		screen: MessageScreen,
	},
	Announce: {
		screen: AnnounceScreen,
	},
	AnnounceDetail: {
		screen: AnnounceDetailScreen
	}
}
let reducers = {
	push,
	announce
}
export { routes, reducers }