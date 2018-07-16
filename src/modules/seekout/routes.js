
import SeekOutDeatilPK from './Detail.pk';
import SeekOutDeatilSequence from './Detail.sequence';
import SeekOutScreen from './SeekOutScreen';
import Combination from './Detail.combination'


const SeekOutRoute = {
	SeekOutScreen: {
		screen: SeekOutScreen,
		navigationOptions: {
			header: null,
			tabBarVisible: false,
		},
	},
	SeekOutDeatilPK: {
		screen: SeekOutDeatilPK,
		path: 'findPk/:id',
		navigationOptions: {
			header: null,
			tabBarVisible: false,
		},
	},
	SeekOutDeatilSequence: {
		screen: SeekOutDeatilSequence,
		path: 'findSequence/:id',
		navigationOptions: {
			header: null,
			tabBarVisible: false,
		},
	},
	Combination: {
		screen: Combination,
		path: 'findProgram/:id'
	},

}

export default SeekOutRoute