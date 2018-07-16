



let appReducers = {};
let appRoutes = {};
let appModel = {};
export function loadModule(modules) {
	appModel = modules;

	for (let key in modules) {
		let model = modules[key];

		let { reducers, routes } = model;

		if (reducers) {
			appReducers = { ...appReducers, ...reducers }
		}
		if (routes) {
			appRoutes = { ...appRoutes, ...routes }
		}
	}

	return { appReducers, appRoutes }
}
export function getModel(model) {
	return appModel[model];
}
export function getAppReducers() {
	return appReducers;
}

export function getAppRoutes() {
	return appRoutes;
}