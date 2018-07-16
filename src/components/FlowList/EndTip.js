import React from 'react';

import {
	View, Dimensions, LayoutAnimation, Text, Image, StyleSheet,
	Animated,
	ActivityIndicator
} from 'react-native';
import noMoreIcon from '@assets/images/no-more-1.gif';
export default class EndTip extends React.Component {

	render() {
		const tipText = this.props.visible ? '没有更多了哦~' : '内容加载中...'
		return (
			<View style={styles.endTipContainer}
				ref={element => this.endTip = element}>
				{this.props.visible ? null : <ActivityIndicator style={styles.endTipIcon} />}
				<Text style={styles.endTipText}>{tipText}</Text>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	endTipContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 20,
	},
	endTipIcon: {
		marginRight: 10
	},
	endTipText: {
		textAlign: 'center',
		color: '#999'
	}
});