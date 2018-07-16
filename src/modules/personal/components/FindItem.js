import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, Platform } from 'react-native';
import { transformNum, transformSize, textSecondaryColor } from '@utils';
import { Icon, ImageBackground, Touchable } from '@components'

export default class FindItem extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		let { data, style } = this.props;

		return (
			<View style={[s.Wrap, style]}>
				<Touchable style={s.itemWrap} onPress={() => this.props.goToDetail(data)}>
					<Image style={s.coverImage} source={{ uri: data.indexBannerImg }} />
					<View style={s.textWrap}><Text style={s.text}>{data.configTitle}</Text></View>
				</Touchable>
			</View>
		)
	}

}

const s = StyleSheet.create({
	Wrap: {
		paddingHorizontal: transformSize(40),
	},
	itemWrap: {
		flex: 1,
		height: transformSize(340),
		position: 'relative',
		borderRadius: transformSize(5),
		backgroundColor: '#f4f4f4',
		overflow: 'hidden',
		marginBottom: transformSize(50),
		marginTop: transformSize(50)
	},
	coverImage: {
		width: '100%',
		height: '100%',
	},
	textWrap: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		paddingLeft: transformSize(20),
		paddingVertical: transformSize(22),
		backgroundColor: 'rgba(174, 174, 174, 0.5)',
	},
	text: {
		color: '#fff',
		fontSize: transformSize(36),
	}
})