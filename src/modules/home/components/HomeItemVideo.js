import React, { Component } from 'react'
import { View, StyleSheet, Text, ImageBackground } from 'react-native'
import { videoPlay, homeVideoOpacity } from '../assets'
import { Image, Icon, Touchable } from '@components'
import { transformSize } from '@utils'
export default class HomeHeader extends Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}
	static defaultProps = {
		data: null,
		style: null
	}

	render() {
		let { data } = this.props
		let { title, description, userNickName, likeCount, viewCount, videoThumbnailUrl, coverImgUrl, imgUrl } = data
		if (data) {
			return (
				<Touchable onPress={this.props.goToDetail} type="withoutFeedback" >
					<View style={[s.borderWrap, this.props.style]}>
						<View style={[s.wrapper]} >
							<Image source={{ uri: coverImgUrl || videoThumbnailUrl || imgUrl }} style={s.ImgBackground} type="square"></Image>
							<Image source={videoPlay} style={s.imgPlay}></Image>

							<ImageBackground source={homeVideoOpacity} style={s.BottomWrap}>
								<View style={s.IconWrap}>
									<Icon name="play-a" size={transformSize(22)} style={s.BottomIcon}></Icon>
									<Text style={s.BottomPlayCount}>{viewCount}</Text>
								</View>
								<Text style={s.title}>{title}</Text>
							</ImageBackground>
						</View>
					</View>

				</Touchable>

			);
		} else {
			return (<View></View>)
		}

	}

	componentDidMount() {

	}

}

const s = StyleSheet.create({
	borderWrap: {
		paddingHorizontal: transformSize(40),
		paddingVertical: transformSize(50),
	},
	wrapper: {

		width: transformSize(670),
		height: transformSize(558),
		borderRadius: transformSize(10),
		alignItems: 'center',
		justifyContent: 'center',
	},
	ImgBackground: {
		width: transformSize(670),
		height: transformSize(558),
		borderRadius: transformSize(10),
		overlayColor: "white",
		position: "absolute",
		left: 0,
		right: 0,
		top: 0,
		bottom: 0
	},
	imgPlay: {
		width: transformSize(114),
		height: transformSize(114),
		backgroundColor: "transparent",

	},
	BottomWrap: {
		justifyContent: 'flex-end',
		position: "absolute",
		bottom: 0,
		width: transformSize(670),
		height: transformSize(240),

		// backgroundColor: "rgba(0,0,0,0.3)",
		paddingHorizontal: transformSize(30),
		// borderRadius: transformSize(10),
		// overlayColor: 'white'
	},

	IconWrap: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: transformSize(28)
	},
	BottomIcon: {
		marginRight: transformSize(8),
		color: "#fff",

	},
	BottomPlayCount: {
		color: "#fff",
		fontSize: transformSize(22),

	},
	title: {
		color: "#fff",
		fontSize: transformSize(30),
		lineHeight: transformSize(40),
		marginBottom: transformSize(28)
	},
})