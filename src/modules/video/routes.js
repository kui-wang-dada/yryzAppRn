
import VideoDetailScreen from './VideoDetailScreen';
import VideoScreen from './VideoScreen';
import RecordScreen from './RecordScreen';
import VideoTrimScreen from './VideoTrimScreen'

const VideoRoute = {
	VideoDetail: {
		screen: VideoDetailScreen,
		path: 'video/:id',
		navigationOptions: {
			header: null,
			tabBarVisible: false,
		},
	},
	Video: {
		screen: VideoScreen,
		navigationOptions: {
			header: null,
			tabBarVisible: false,
			gesturesEnabled: false,
		},
	},
	Record: {
		screen: RecordScreen,
		navigationOptions: {
			header: null,
			tabBarVisible: false,
			gesturesEnabled: false,
		},
	},
	VideoTrimScreen: {
		screen: VideoTrimScreen,
		navigationOptions: {
			header: null,
			tabBarVisible: false,
			gesturesEnabled: false,
		},
	}
}
export default VideoRoute