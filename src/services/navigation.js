import { NavigationActions } from 'react-navigation';

let navigator = null;
export function setNavigator(nav) {
	navigator = nav;
}
export function navigate(routeName, params) {
	if (navigator) {
		const action = NavigationActions.navigate({ routeName, params });
		navigator.dispatch(action);
	}
}

export function goBack() {
	if (navigator) {
		const action = NavigationActions.back({});
		navigator.dispatch(action);
	}
}