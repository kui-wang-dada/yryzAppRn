import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';

import { transformNum, transformSize, commonStyle, } from '@utils';
import { Icon, Image, Touchable, HightLight } from '@components'
export default class HomeItemVer extends Component {
	constructor(props) {
		super(props);
		this.state = {

		};
	}
	static defaultProps = {
		data: null
	}
	render() {

		let { data, goToDetail } = this.props
		let { title, description, appliName, appName, likeCount, viewCount, coverImgUrl, imgUrl } = data
		let appNamelocal = appliName || appName

		if (data) {
			return (
				<Touchable type="withoutFeedback" onPress={this.props.goToDetail}>
					<View style={[
						s.wrapper,
						this.props.style
					]}>
						<Image source={{ uri: coverImgUrl || imgUrl }} style={s.img} type="wide"></Image>
						{this._renderText(s.title, 2, title || "没有内容")}
						{this._renderText(s.summary, 2, description || "没有内容")}
						{this.renderBottom(appNamelocal, likeCount, viewCount)}
					</View>
				</Touchable >
			);
		} else {
			return (<View></View>)
		}

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

	renderBottom = (appNamelocal, likeCount, viewCount) => {
		return (
			<View style={s.BottomWrap}>
				{this._renderText(s.BottomLeft, 1, appNamelocal || "没有内容")}
				<View style={s.BottomCenter}>
					<Icon name='good' size={10} color="#ddd"></Icon>
					<Text style={s.BottomLike}>{transformNum(likeCount) || 0}</Text>
				</View>
				<View style={s.BottomRight}>
					<Icon name='eyes' size={12} color="#ddd"></Icon>
					<Text style={s.BottomRead}>{transformNum(viewCount) || 0}</Text>
				</View>
			</View>
		)
	}

	componentDidMount() {

	}


}

const s = StyleSheet.create({
	wrapper: {
		flexDirection: 'column',
		alignItems: 'flex-start',
		marginHorizontal: transformSize(40),
		marginVertical: transformSize(50),
		// borderBottomWidth: transformSize(1),
		// borderBottomColor: '#eee',
	},
	img: {
		width: transformSize(670),
		height: transformSize(210),
		marginBottom: transformSize(25),
		borderRadius: transformSize(10),
		overlayColor: "white"
	},
	title: {
		fontSize: commonStyle.fontSize_title_oneLevelTab_38,			// 38
		lineHeight: transformSize(54),
		marginBottom: transformSize(20),
		color: commonStyle.fontColor_main_title,    // #000
		fontWeight: 'bold',
	},
	summary: {
		fontSize: commonStyle.fontSize_content_summary_28,    // 28
		lineHeight: transformSize(40),
		marginBottom: transformSize(25),
		color: commonStyle.fontColor_assist_content,    // #999
	},

	BottomWrap: {
		flexDirection: 'row',

	},
	BottomLeft: {
		fontSize: commonStyle.fontSize_tag_22,    // 22
		color: commonStyle.fontColor_assist_icon,     // #bbb 

	},
	BottomCenter: {
		marginLeft: transformSize(40),
		flexDirection: 'row',
		alignItems: 'center',
		paddingRight: transformSize(10)
	},
	BottomLike: {
		marginLeft: transformSize(10),
		fontSize: commonStyle.fontSize_tag_22,    // 22
		color: commonStyle.fontColor_assist_icon,     // #bbb 
	},
	BottomRight: {
		marginLeft: transformSize(30),
		flexDirection: 'row',
		alignItems: 'center',
	},
	BottomRead: {
		marginLeft: transformSize(10),
		fontSize: commonStyle.fontSize_tag_22,    // 22
		color: commonStyle.fontColor_assist_icon,     // #bbb 
	},
	activeStyle: {
		color: commonStyle.color_theme
	},
});
