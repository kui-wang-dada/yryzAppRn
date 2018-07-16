import React from 'react';
import {
	StyleSheet, View,
} from 'react-native';
import {
	Text,
} from './';

// import styles from '../../styles';
import { commonStyle as styles } from '@utils';

class Tag extends React.Component {

	render() {
		return (
			<View style={[style.border, this.props.style]}>
				<Text {...this.props} style={[style.tag, this.props.textStyle]}></Text>
			</View>
		);
	}
}

const style = StyleSheet.create({
	tag: {
		includeFontPadding: false,
		fontSize: styles.transformSize(24),
		color: '#b6b6b6',
		overflow: 'hidden'
	},
	border: {
		paddingHorizontal: styles.transformSize(9),
		paddingVertical: styles.transformSize(3),
		backgroundColor: styles.assistColor,
		borderRadius: styles.transformSize(4),
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: '#dddddd'
	}

});

export default Tag;