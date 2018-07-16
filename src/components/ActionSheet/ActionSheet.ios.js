import React from 'react';
import {
	ActionSheetIOS
} from 'react-native';


class ActionSheet extends React.Component {
	render() {
		return null;
	}

	static init() { }

	static show(...args) {
		return ActionSheetIOS.showActionSheetWithOptions(...args);
	}
}

export default ActionSheet;