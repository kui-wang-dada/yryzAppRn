import Categories from './Categories';
import AppDetail from './AppDetail';
import TagCategory from './TagCategory';

export default {
	Categories: {
		screen: Categories,
	},
	AppDetail: {
		screen: AppDetail,
		path: 'app/:id',
	},
	TagCategory: {
		screen: TagCategory,
	}
}