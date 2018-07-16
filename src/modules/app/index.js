import AppDetail from './AppDetail';
import router from './router';
let routes = {
	AppDetail: {
		screen: AppDetail,
	},
	...router
}


export default { routes }
