import DiscoverScreen from './DiscoverScreen';
import SquareDetail from './SquareDetail';
const DiscoverRoute = {
	DiscoverScreen: {
		screen: DiscoverScreen,
	},
	SquareDetail: {
		screen: SquareDetail,
		path: 'square/:id',
		navigationOptions: {
			header: null,
		}
	}
}
export default DiscoverRoute