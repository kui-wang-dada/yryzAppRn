import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	Image,
	ImageBackground,
	Icon,
	FlatList,
	ReadMoreText,
	Touchable,
	ImagePreview,
} from '@components';
import { Author, Like } from '@modules/article';
import { VideoScreen as Video } from '@modules/video';
import { commonStyle, modal, transformTime, transformNum } from '@utils';
import { HomeItemHor, HomeItemVer, HomeItemVideo } from '@modules/home/components'
import { navigation } from '@services';
export default class DiscussItem extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}
	render() {
		let { createDate, likeCount, likeFlag, id, content, moduleCode, contentFlag, coverImgType } = this.props.data;
		let item = this.props.data
		let index = this.props.index
		if (moduleCode === "1002") {
			if (contentFlag === 1) {
				return (
					<HomeItemVideo
						style={s.border}
						data={item}
						goToDetail={() => this.handleVideoPress()}
					></HomeItemVideo>
				)
			} else {
				if (coverImgType === 1) {
					return (
						<HomeItemHor
							style={s.border}
							data={item}
							goToDetail={() => this.goToDetail(item.id, index)}
						></HomeItemHor>
					)
				} else {
					return (
						<HomeItemVer
							style={s.border}
							data={item}
							goToDetail={() => this.goToDetail(item.id, index)}
						></HomeItemVer>
					)
				}
			}
		} else {
			return (
				<Touchable style={s.itemWrap} onPress={this.props.goToSquare}>

					<View style={s.contentWrap}>
						<ReadMoreText numberOfLines={4}>
							<Text style={s.contentTxt}>{content}</Text>
						</ReadMoreText>
					</View>
					{this.renderImage()}
					<View style={s.authorWrap}>
						<View transparent style={s.likeWrap}>
							<Icon name="good" style={s.likeIcon} />
							<Text style={s.likeText}>{transformNum(likeCount)}</Text>
						</View>
						<Text style={{}}>{transformTime(createDate)}</Text>
					</View>
				</Touchable>
			)
		}
	}
	renderImage = () => {
		let { videoUrl, videoThumbnailUrl, coverImgUrl = '', contentFlag } = this.props.data;
		let imgUrlArr = coverImgUrl && coverImgUrl.split(',');
		if (contentFlag === 0) {
			return
		}
		if (contentFlag === 2) {
			return (
				<Touchable onPress={this.handleVideoPress}>
					<ImageBackground style={s.videoImg} source={{ uri: videoThumbnailUrl }}>
						<View style={s.playWrap}><Icon style={s.playIcon} name="play-a"></Icon></View>
					</ImageBackground>
				</Touchable>);
		}
		if (contentFlag === 1) {
			this.imgUrlArr = imgUrlArr.map((item) => { return { source: { uri: item } } });

			if (imgUrlArr.length === 1) {
				return (
					<Touchable onPress={this.handleImgPress(0)} style={s.imgWrap}>
						<Image style={s.singleImg} source={{ uri: imgUrlArr[0] }}></Image>
					</Touchable>
				);
			} else {
				// let imgNode = imgUrlArr.map((item, index) => {
				// 	return <Image style={[s.multiImg]} source={{ uri: item.trim() }} key={index.toString()} />
				// })
				// return <View style={s.multiImgWrap}>{imgNode}</View>;

				let imgNode = <FlatList
					data={imgUrlArr}
					renderItem={({ item, index }) => {
						return (<Touchable onPress={this.handleImgPress(index)}><Image style={[s.flatMultiImg]} source={{ uri: item.trim() }} /></Touchable>)
					}}
					listKey={(item, index) => 'item' + index.toString()}
					keyExtractor={(item, index) => 'item' + index.toString()}
					numColumns={3}
					columnWrapperStyle={s.columnWrap}
				/>
				return <View style={s.multiImgList}>{imgNode}</View>;

			}
		}

	}

	goToDetail = (id, index) => {
		return
		// this.props.navigation.navigate('ArticleDetail', { id })

	}
	handleVideoPress = () => {
		let { videoUrl, videoThumbnailUrl } = this.props.data;
		navigation.navigate('Video', { uri: videoUrl, thumbnailUri: videoThumbnailUrl });
	}
	handleImgPress = (index) => () => {

		let previewNode = (
			<ImagePreview imageUrls={this.imgUrlArr} initialPage={index}
				onClick={(page) => {
					modal.close();
				}}
			/>
		)
		modal.show(previewNode);
	}
}

const cols = 3;
const imageWidth = commonStyle.transformSize(218);
const vMargin = (commonStyle.SCREEN_WIDTH - cols * imageWidth - commonStyle.transformSize(156)) / (cols + 1);
const hMargin = commonStyle.transformSize(10);

const s = StyleSheet.create({
	itemWrap: {
		paddingVertical: commonStyle.transformSize(40),
		paddingHorizontal: commonStyle.transformSize(40),
		borderBottomWidth: commonStyle.transformSize(2),
		borderBottomColor: "#eee",
		backgroundColor: '#fff',
	},
	border: {
		borderBottomColor: "#eee",
		borderBottomWidth: commonStyle.transformSize(2),
	},
	authorWrap: {
		marginTop: commonStyle.transformSize(25),
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	contentWrap: {
		// marginLeft: commonStyle.transformSize(90),
		marginTop: commonStyle.transformSize(20),
	},
	contentTxt: {
		fontSize: commonStyle.transformSize(30),
		lineHeight: commonStyle.transformSize(46),
		color: '#000',
	},
	imgWrap: {
		overflow: 'hidden',
		borderRadius: commonStyle.transformSize(14),
	},
	videoImg: {
		marginTop: commonStyle.transformSize(20),
		// marginLeft: commonStyle.transformSize(90),
		width: commonStyle.transformSize(670),
		height: commonStyle.transformSize(486),
		borderRadius: commonStyle.transformSize(8),

		overflow: 'hidden',
		...commonStyle.centerWrap,
	},
	singleImg: {
		marginTop: commonStyle.transformSize(20),
		// marginLeft: commonStyle.transformSize(90),
		width: commonStyle.transformSize(670),
		height: commonStyle.transformSize(296),
		borderRadius: commonStyle.transformSize(8),

	},
	flatMultiImg: {
		width: imageWidth,
		height: commonStyle.transformSize(188),
		marginRight: commonStyle.transformSize(10),
		marginTop: commonStyle.transformSize(10),
	},
	multiImg: {
		width: imageWidth,
		height: commonStyle.transformSize(188),
		marginLeft: vMargin,
		marginTop: hMargin,
	},
	noMarginRight: {
		marginRight: 0,
	},
	playWrap: {
		width: commonStyle.transformSize(114),
		height: commonStyle.transformSize(114),
		borderRadius: commonStyle.transformSize(57),
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		...commonStyle.centerWrap,
	},
	playIcon: {
		fontSize: commonStyle.transformSize(36),
		color: '#fff',
		transform: [
			{
				translateX: commonStyle.transformSize(6)
			}
		]
	},
	multiImgList: {
		// paddingLeft: commonStyle.transformSize(90),
		justifyContent: 'flex-start',
	},
	multiImgWrap: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginLeft: commonStyle.transformSize(76),
	},

	likeWrap: {
		flexDirection: 'row',
	},
	likeIcon: {
		fontSize: commonStyle.transformSize(30),
		color: '#dbdbdb'
	},
	likeText: {
		fontSize: commonStyle.transformSize(24),
		color: '#dbdbdb',
		marginLeft: commonStyle.transformSize(9)
	},
});