import React, { Component } from 'react';
import { PropTypes } from 'prop-types'
import {
	View,
	Image,
	Text,
	StyleSheet,
	TouchableOpacity
} from 'react-native';
import { transformSize } from '@utils'
export default class VideoDetailBehaviorIcon extends Component {
	static propTypes = {
		...View.propTypes,
		image: PropTypes.object,
		number: PropTypes.string,
		onPress: PropTypes.func
	};

	constructor(props) {
		super(props);
		this.state = {

		};
	}

	_onPress = () => {
		if (this.props.onPress) {
			this.props.onPress();
		}
	}

	render() {
		return (
			<TouchableOpacity style={styles.container} onPress={this._onPress} activeOpacity={1}>
				<Image style={styles.icon} source={this.props.image} />
				<Text style={[styles.number, styles.shadow]}>{this.props.number}</Text>
			</TouchableOpacity>
		);
	};
}

const styles = StyleSheet.create({
	container: {
		// backgroundColor: 'transparent',
		alignItems: 'center'
	},

	icon: {
		// backgroundColor: '#f0f0f0',
		width: transformSize(64),
		height: transformSize(64),
	},

	number: {
		includeFontPadding: false,
		lineHeight: transformSize(26),
		color: '#ffffff',
		fontSize: transformSize(26),
		marginTop: transformSize(12),
		textAlign: 'center',
	},

	shadow: {
		shadowColor: '#E5E5E5',
		shadowOffset: {
			width: 0,
			height: 3
		},
		shadowOpacity: 0.2,
		shadowRadius: 3,
		// elevation: 3,
	},
});