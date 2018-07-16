import React, { Component } from 'react'
import { View, StyleSheet, Text, ImageBackground } from 'react-native'
import { Image, Icon, Touchable } from '@components'
import { transformSize, commonStyle, modal, transformNum } from '@utils'
import { backOpacity } from '../assets'
export default class VideoItem extends Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}
	static defaultProps = {
		data: null
	}
	render() {
		let { data, index } = this.props
		if (data) {

			let oddStyle = index % 2 === 0 ? s.leftStyle : null
			return (
				<View style={s.wrapper}>
					{/* {this.renderMain(firstData, firstStyle)} */}
					{/* {this.renderMain(secondData)} */}
					{this.renderMain(data, oddStyle)}
				</View>

			)
		} else {
			return (<View></View>)
		}


	}
	renderMain = (data, styleWrap) => {
		if (data) {
			let { videoThumbnailUrl, coverImgUrl, title, author, viewCount, headImg, nickName } = data
			return (

				<Touchable onPress={this.props.goToDetail}>
					<View style={[s.wrapperUnit, styleWrap]}>
						<Image source={{ uri: videoThumbnailUrl || coverImgUrl }} style={s.imgBackground} type="long"></Image>
						<ImageBackground source={backOpacity} style={{
							width: transformSize(373),
							height: transformSize(240),
						}}>
							<View style={s.conWrap}>
								<Text style={s.conTitle} numberOfLines={2}>{title}</Text>
								{this.renderBottom(author, viewCount, headImg, nickName)}
							</View>
						</ImageBackground>

					</View>
				</Touchable>

			);
		} else {
			return (<View></View>)
		}
	}
	renderBottom = (author, viewCount, headImg = "", nickName) => {
		let headImgLocal = ""
		let nickNameLocal = ""
		if (author) {
			headImgLocal = author.headImg
			nickNameLocal = author.nickName
		} else {
			headImgLocal = headImg
			nickNameLocal = nickName
		}
		return (
			<Touchable style={s.bottomWrap} onPress={this.props.goToProfile}>
				<View style={s.bottomLeft}>
					<View style={s.bottomAvatar}>
						<Image source={{ uri: headImgLocal }} style={s.bottomAvatar}></Image>
					</View>

					<Text style={s.bottomName}>{nickNameLocal}</Text>
				</View>
				<View style={s.bottomRight}>
					<Icon name='play-a' style={s.playIcon} size={8}></Icon>
					<Text style={s.playCount}>{transformNum(viewCount)}</Text>
				</View>
			</Touchable>
		)
	}
	componentDidMount() {

	}

}

const s = StyleSheet.create({
	wrapper: {
		flexDirection: 'row',
		marginBottom: transformSize(2)
	},
	wrapperUnit: {
		width: transformSize(373),
		height: transformSize(596),
		alignItems: 'center',
		justifyContent: 'flex-end',
		backgroundColor: 'white',
	},
	leftStyle: {
		marginRight: transformSize(4)
	},
	imgBackground: {
		width: transformSize(373),
		height: transformSize(596),
		position: "absolute",
		top: 0,
		bottom: 0,
		left: 0,
		right: 0
	},
	conWrap: {
		width: transformSize(373),
		height: transformSize(240),
		justifyContent: 'flex-end',
		paddingHorizontal: transformSize(16),
		// backgroundColor: "rgba(0,0,0,0.3)",

	},
	conTitle: {
		color: '#fff',
		fontSize: commonStyle.fontSize_video_title_26,   // 26
		lineHeight: transformSize(34),
		marginBottom: transformSize(18)

	},
	bottomWrap: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: transformSize(10)
	},
	bottomLeft: {
		flexDirection: 'row',
		alignItems: 'center',
		overflow: "hidden"
	},
	bottomAvatar: {
		width: transformSize(34),
		height: transformSize(34),
		borderRadius: transformSize(17),
		// overlayColor: "rgba(0,0,0,0)",
		overflow: "hidden"
	},
	bottomName: {
		marginLeft: transformSize(10),
		color: '#fff',
		fontSize: transformSize(22)
	},
	bottomRight: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	playIcon: {
		color: '#fff'
	},
	playCount: {
		marginLeft: transformSize(8),
		color: '#fff',
		fontSize: transformSize(22)
	},
})
