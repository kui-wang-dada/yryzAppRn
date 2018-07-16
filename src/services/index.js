import * as modules from './modules';
import * as navigation from './navigation';
import http from './http';
import share from './share';
import net from './net';
// module.exports = {
// 	get sign() {
// 		return require('./sign').default;
// 	},
// 	get net() {
// 		return require('./net').default;
// 	},
// 	get http() {
// 		return require('./http').default;
// 	},
// 	get setNavigator() {
// 		return navigation.setNavigator;
// 	},
// 	get navigate() {
// 		return navigation.navigate;
// 	},
// 	get goBack() {
// 		return navigation.goBack;
// 	},
// 	get getAppReducers() {
// 		return modules.getAppReducers;
// 	},
// 	get getAppRoutes() {
// 		return modules.getAppRoutes;
// 	},
// 	get getModel() {
// 		return modules.getModel;
// 	},
// 	get withUser() {
// 		return require('./withUser')
// 	},

// };
export { navigation }

export function getAppReducers() {
	return modules.getAppReducers;
}
export function getAppRoutes() {
	return modules.getAppRoutes;
}
export function getModel() {
	return modules.getModel;
}
export { http, net, share };

