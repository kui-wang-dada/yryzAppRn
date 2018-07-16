import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Image as Image1 } from 'react-native';
import { transformNum, transformSize, textSecondaryColor, commonStyle } from '@utils';
import { Icon, ImageBackground, Image, Text } from '@components'
import { ShadowBg } from '../assets'
import { navigation } from '@services'
import { Author } from '@modules/article';
import { SCREEN_WIDTH } from '@utils/commonStyle';

export default class SquareItem extends Component {

	constructor(props) {
		super(props);
		this.state = {

		};
	}

	static defaultProps = {
		data: null
	}

	componentDidMount() {

	}

	render() {
		let { data } = this.props
		let { imgUrl, joinList = [], joinCount, subject, kid } = data
		let wrapperStyle = [s.wrapper];
		let coverStyle = [s.coverImage];
		let titleStyle = [s.title];
		if (this.props.wrapper) {
			wrapperStyle.push({
				paddingHorizontal: transformSize(15)
			})
			coverStyle.push({
				width: SCREEN_WIDTH - transformSize(86),
				height: transformSize(360)
			})
		} else {
			wrapperStyle.push({
				width: transformSize(544),
				height: transformSize(528),
				paddingHorizontal: transformSize(11),
			})
			coverStyle.push({
				width: transformSize(544),
				height: transformSize(280)
			})
			titleStyle.push({
				height: transformSize(90)
			})
		}

		if (data) {
			return (
				<TouchableOpacity onPress={() => this.goToDetail(kid)} style={commonStyle.container}>
					<ImageBackground source={ShadowBg} imageStyle={{ resizeMode: 'stretch', }} style={[wrapperStyle, this.props.style]}>
						<View style={{ borderRadius: transformSize(16), overflow: 'hidden' }}>
							<Image type='wide' style={coverStyle} source={{ uri: imgUrl }} />
							<View style={s.numberWrap}>
								<Text style={s.number}>{`${joinCount}人正在说`}</Text>
							</View>
							<View style={{ paddingHorizontal: transformSize(20) }}>
								<Text style={titleStyle} numberOfLines={2}>{subject}</Text>
								{this.renderJoinedContent(joinList)}
							</View>
						</View>
					</ImageBackground>
				</TouchableOpacity>
			);
		} else {
			return (<View />)
		}
	}

	renderJoinedContent(joinList) {
		if (joinList && joinList.length > 0) {
			return (
				<View>
					<View style={s.divider} />
					<View style={s.joinedWrapper}>
						{this.renderJoined(joinList)}
						<Text style={s.tip}>正在参与...</Text>
					</View>
				</View>
			);
		} else {
			return null;
		}
	}

	renderJoined(data) {
		let maxLength = this.props.wrapper ? 9 : 5;
		let length = (data && data.length < maxLength) ? data.length : maxLength;
		let temp = data.slice(0, length);
		return temp.map((item, index) => (
			<Image
				key={index}
				source={{ uri: item.userImg }}
				style={s.avatar} />
		));
	}

	goToDetail(id) {
		this.props.navigation.navigate('SquareDetail', { id: id })
	}

}

const s = StyleSheet.create({
	wrapper: {
		borderRadius: transformSize(10),
		paddingTop: transformSize(7),
		paddingBottom: transformSize(16),
		overflow: 'hidden',
	},
	coverImage: {
		borderTopLeftRadius: transformSize(16),
		borderTopRightRadius: transformSize(16),
	},
	numberWrap: {
		position: 'absolute',
		marginTop: transformSize(28),
		marginHorizontal: transformSize(32),
		backgroundColor: 'rgba(0,0,0,0.28)',
		paddingHorizontal: transformSize(22),
		paddingVertical: transformSize(4),
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: transformSize(16),
		overflow: 'hidden',
	},
	number: {
		fontSize: transformSize(22),
		textAlignVertical: 'center',
		padding: 0,
		includeFontPadding: false,
		color: 'white',
		backgroundColor: 'transparent'
	},
	title: {
		marginVertical: transformSize(24),
		fontSize: transformSize(34),
		lineHeight: transformSize(46),
		overflow: 'hidden',
		color: '#000',
		padding: 0,
		includeFontPadding: false,
	},
	divider: {
		height: transformSize(1),
		backgroundColor: '#e5e5e5'
	},
	joinedWrapper: {
		flexDirection: 'row',
		marginVertical: transformSize(20),
		alignItems: 'center',
		overflow: 'hidden',
	},
	avatar: {
		width: transformSize(44),
		height: transformSize(44),
		borderRadius: transformSize(22),
		overflow: 'hidden',
		overlayColor: '#fff',
		marginRight: transformSize(10),

	},
	tip: {
		fontSize: transformSize(22),
		marginLeft: transformSize(10),
		overflow: 'hidden',
		color: '#bbbbbb',
		padding: 0,
		includeFontPadding: false,
	}
});