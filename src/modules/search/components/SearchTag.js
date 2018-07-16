import React, { Component } from 'react';
import { StyleSheet, View, Text, Touchable } from '@components';
import { commonStyle as styles } from '@utils';

export default class SearchTag extends Component {
	render() {
		let { label, index } = this.props;
		let divider = index % 2 === 0;
		return (
			<View style={[style.wrap, this.props.style]}>
				{divider ? (<View style={style.divider} />) : <View />}
				<View style={style.indexWrap}>
					<Text style={style.index}>{index}</Text>
				</View>
				<Touchable onPress={this.props.onPress}><Text style={style.label} numberOfLines={1}>{label}</Text></Touchable>
			</View >
		);
	}
}
const style = StyleSheet.create({
	wrap: {
		flexDirection: 'row',
		alignItems: 'center',
		width: '50%',
		marginBottom: styles.transformSize(42),
	},
	indexWrap: {
		width: styles.transformSize(32),
		height: styles.transformSize(32),
		borderRadius: styles.transformSize(16),
		backgroundColor: '#f4f4f4',
		alignItems: 'center',
		justifyContent: 'center',
	},
	index: {
		padding: 0,
		includeFontPadding: false,
		fontSize: styles.transformSize(18),
		color: '#999',
	},
	label: {
		width: (styles.SCREEN_WIDTH - styles.transformSize(300)) / 2,
		fontSize: styles.transformSize(26),
		color: '#666',
		marginLeft: styles.transformSize(18),
	},
	divider: {
		width: styles.transformSize(1),
		height: styles.transformSize(26),
		backgroundColor: '#dddd',
		marginLeft: styles.transformSize(-22),
		marginRight: styles.transformSize(44),
	}
});