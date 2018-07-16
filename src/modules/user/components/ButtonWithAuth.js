import React from 'react';
import {
	NavigationActions
} from 'react-navigation'
import { Touchable } from '@components';
import store from '../../../store'
import { navigation } from '@services';

let _navigator;

class ButtonWithAuth extends React.Component {
	setTopLevelNavigator(navigatorRef) {
		_navigator = navigatorRef;
	}

	navigate(routeName, params) {
		_navigator.dispatch(
			NavigationActions.navigate({
				routeName,
				params,
			})
		);
	}

	render() {
		return <Touchable {...this.props} onPress={this.handlePress} />;
	}

	handlePress = async () => {
		let { user } = store.getState();
		if (!user.isSignIn) {
			navigation.navigate('LoginScreen');
		} else {
			this.props.onPress();
		}
	};

}

export default ButtonWithAuth;