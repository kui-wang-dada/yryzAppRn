import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { transformNum, transformSize, commonStyle } from '@utils';
import { Icon, Image, Touchable, HightLight } from '@components'
export default class HomeItemHor extends Component {
	constructor(props) {
		super(props);
		this.state = {

		};
	}
	static defaultProps = {
		data: null
	}
	render() {
		let { data } = this.props
		let { title, appliName, appName, likeCount, viewCount, coverImgUrl, imgUrl } = data
		let appNamelocal = appliName || appName
		if (data) {
			return (

				<Touchable type="withoutFeedback" onPress={this.props.goToDetail}>
					<View style={[
						s.wrapper,
						this.props.style
					]}>
						<View style={s.leftWrap}>
							{this._renderText(s.title, 2, title || "没有内容")}
							{this.renderBottom(appNamelocal, likeCount, viewCount)}
						</View>
						<View style={s.rightWrap}>
							<Image style={s.rightImg} source={{ uri: coverImgUrl }} type="square"></Image>
						</View>
					</View>
				</Touchable>



			);
		} else {
			return (<View></View>)
		}

	}
	renderBottom = (appNamelocal, likeCount, viewCount) => {
		return (
			<View style={s.BottomWrap}>
				{this._renderText(s.BottomLeft, 1, appNamelocal || "没有内容")}
				<View style={s.BottomCenter}>
					<Icon name='good' size={10} color="#bbb"></Icon>
					<Text style={s.BottomLike}>{transformNum(likeCount)}</Text>
				</View>
				<View style={s.BottomRight}>
					<Icon name='eyes' size={12} color="#bbb"></Icon>
					<Text style={s.BottomRead}>{transformNum(viewCount)}</Text>
				</View>
			</View>
		)
	}

	_renderText(style, line, text) {
		return (
			<HightLight
				style={style}
				numberOfLines={line}
				text={text}
				activeStyle={s.activeStyle}
				search={this.props.keyWords} />
		);
	}


	componentDidMount() {

	}

}

const s = StyleSheet.create({
	wrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginHorizontal: transformSize(40),
		paddingVertical: transformSize(50),
		// borderBottomWidth: transformSize(1),
		// borderBottomColor: '#eee',
	},
	leftWrap: {
		flexDirection: 'column',
		justifyContent: 'space-around',
		marginRight: transformSize(50),
		flex: 1,
		height: transformSize(180)
	},
	title: {
		fontSize: commonStyle.fontSize_title_oneLevelTab_38,			// 38
		lineHeight: transformSize(54),
		marginBottom: transformSize(40),
		fontWeight: 'bold',
		overflow: 'hidden',
		color: commonStyle.fontColor_main_title,    // #000

	},
	BottomWrap: {
		flexDirection: 'row',
	},
	BottomLeft: {
		fontSize: transformSize(22),
		color: commonStyle.fontColor_assist_icon,    // #bbb

	},
	BottomCenter: {
		marginLeft: transformSize(40),
		flexDirection: 'row',
		alignItems: 'center',
	},
	BottomLike: {
		marginLeft: transformSize(10),
		fontSize: commonStyle.fontSize_tag_22,   // 22
		color: commonStyle.fontColor_assist_icon,   // #bbb 
	},
	BottomRight: {
		marginLeft: transformSize(40),
		flexDirection: 'row',
		alignItems: 'center',
	},
	BottomRead: {
		marginLeft: transformSize(10),
		fontSize: commonStyle.fontSize_tag_22,    // 22
		color: commonStyle.fontColor_assist_icon,     // #bbb 
	},
	rightWrap: {},
	rightImg: {
		width: transformSize(224),
		height: transformSize(180),
		borderRadius: transformSize(10),
		overlayColor: "white"
	},
	activeStyle: {
		color: commonStyle.color_theme
	},
});
