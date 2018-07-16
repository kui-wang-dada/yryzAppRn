import React from 'react';
import {
	TouchableHighlight,
	TouchableOpacity,
	TouchableNativeFeedback,
	TouchableWithoutFeedback,
} from 'react-native';
import PropTypes from 'prop-types';

class Touchable extends React.Component {
	render() {
		const type = types[this.props.type];
		const Component = type.component;
		return <Component {...type.props} {...this.props} />;
	}

	static propTypes = {
		type: PropTypes.oneOf([
			'highlight',
			'opacity',
			'nativeFeedback',
			'withoutFeedback',
		])
	};

	static defaultProps = {
		type: 'opacity'
	};
}

const types = {
	'highlight': {
		component: TouchableHighlight,
		props: {
			onPress() { }
		}
	},
	'opacity': {
		component: TouchableOpacity,
		props: {
		}
	},
	'nativeFeedback': {
		component: TouchableNativeFeedback
	},
	'withoutFeedback': {
		component: TouchableWithoutFeedback
	},
};

export default Touchable;