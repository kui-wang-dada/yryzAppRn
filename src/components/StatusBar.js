import { StatusBar as ReactNativeStatusBar, Platform } from 'react-native';
import React, { Component } from 'react';
export default class StatusBar extends Component {
	render() {
		let props = this.props;
		let androidProps = {};
		if (Platform.OS !== 'ios') {
			console.log('Platform', JSON.stringify(Platform));
			androidProps.barStyle = props.barStyle || 'dark-content';

			// androidProps.ba = typeof props.translucent !== 'undefined' ? props.translucent : 'transparent';
			if (Platform.Version >= 23) {
				androidProps.barStyle = 'dark-content';
				androidProps.backgroundColor = '#ccc';
			} else if (Platform.Version >= 19) {
				androidProps.barStyle = 'dark-content';
				androidProps.backgroundColor = '#ccc';
			}
		}
		console.log(props, androidProps);
		return (<ReactNativeStatusBar {...this.props} {...androidProps} />);
	}
}