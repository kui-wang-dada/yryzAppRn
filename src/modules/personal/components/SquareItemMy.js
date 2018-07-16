import React, { Component } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, Platform } from 'react-native';
import { transformNum, transformSize, textSecondaryColor } from '@utils';
import { Icon, ImageBackground } from '@components'
import ShadowBg from '@assets/images/squareintem-shadow-bg.png';

export default class SquareItemMy extends Component {

	constructor(props) {
		super(props);
		this.state = {
		};
	}

	static defaultProps = {
		data: null
	}

	render() {
		let { data, style } = this.props
		let { imgUrl, joinCount, subject, infoId } = data
		if (data) {
			return (
				<View style={s.wrap}>
					<TouchableOpacity onPress={() => this.props.goToDetail(infoId)}>
						<ImageBackground source={ShadowBg} imageStyle={{ resizeMode: 'stretch', }} style={[s.wrapper, this.props.style]}>
							<Image style={s.coverImage} source={{ uri: imgUrl }} />
							<Text style={s.number}>{`${joinCount}人正在说`}</Text>
							<View style={{ paddingHorizontal: transformSize(20) }}>
								<Text style={s.title} numberOfLines={2}>{subject}</Text>
							</View>
						</ImageBackground>
					</TouchableOpacity>
				</View>
			);
		} else {
			return (<View />)
		}
	}
}

const s = StyleSheet.create({
	wrap: {
		paddingHorizontal: transformSize(27),
		elevation: 8,
		shadowColor: 'black',
		shadowOffset: {
			width: 0,
			height: 3
		},
		shadowOpacity: 0.2,
		shadowRadius: 3,
		marginVertical: transformSize(50),
	},
	wrapper: {
		width: transformSize(696),
		paddingHorizontal: transformSize(13),

		overflow: 'hidden',

	},
	coverImage: {
		width: '100%',
		borderTopLeftRadius: transformSize(10),
		borderTopRightRadius: transformSize(10),
		overflow: 'hidden',
		height: transformSize(360),

	},
	number: {
		position: 'absolute',
		height: transformSize(32),
		fontSize: transformSize(22),
		paddingHorizontal: transformSize(22),
		marginTop: transformSize(28),
		marginHorizontal: transformSize(32),
		backgroundColor: 'black',
		opacity: 0.28,
		borderRadius: transformSize(16),
		justifyContent: 'center',
		alignItems: 'center',
		textAlignVertical: 'center',
		padding: 0,
		includeFontPadding: false,
		color: 'white',

	},
	title: {
		marginVertical: transformSize(24),
		fontSize: transformSize(34),
		lineHeight: transformSize(46),
		overflow: 'hidden',
		color: '#000',

		padding: 0,
		includeFontPadding: false,
		...Platform.select({
			android: {
				height: transformSize(90),
			},
			ios: {
			},
		}),
	},
});