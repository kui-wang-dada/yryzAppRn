import React, { Component } from 'react';
import { Platform, View, DeviceEventEmitter } from 'react-native';
import { navigation } from '@services';
import { modal } from '@utils';
import { YModal } from '@components';

const prefix = Platform.OS === 'android' ? 'yryzapp://open/' : 'yryzapp://';

import AppNavigator from './AppNavigator';

class App extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<View style={{ flex: 1 }}>
				<AppNavigator ref={(nav) => { navigation.setNavigator(nav); }}
					onNavigationStateChange={(prevState, currentState) => {
						const currentScreen = getActiveRouteName(currentState);
						const prevScreen = getActiveRouteName(prevState);
						DeviceEventEmitter.emit('onNavigationStateChange', { currentScreen: currentScreen, prevScreen: prevScreen });
					}}
					uriPrefix={prefix} />
				<YModal ref={modal.setInstance}></YModal>
			</View>
		)
	}
}

// gets the current screen from navigation state
function getActiveRouteName(navigationState) {
	if (!navigationState) {
		return null;
	}
	const route = navigationState.routes[navigationState.index];
	// dive into nested navigators
	if (route.routes) {
		return getActiveRouteName(route);
	}
	return route.routeName;
}

export default App;




