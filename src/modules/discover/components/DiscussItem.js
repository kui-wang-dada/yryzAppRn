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
import { commonStyle, modal, transformTime } from '@utils';
import { navigation } from '@services';
import { recommendTag } from '../assets';
export default class DiscussItem extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		}
	}
	render() {
		let { nickName, userImg = '', createDate, createUserId, likeCount, likeFlag, kid, content, imgUrl, videoUrl, videoThumbnailUrl, recommend } = this.props.data;
		let returnCodeLength = content.match(/\n/g) && content.match(/\n/g).length;
		let less4Lines = content.length <= 80 && returnCodeLength <= 4;
		return (
			<View style={[s.itemWrap, this.props.style]}>
				<View style={s.authorWrap}>
					<Author name={nickName} avatar={userImg} time={transformTime(createDate)} id={createUserId} nameStyle={s.authorName} />
					<Like moduleCode={'1009'} id={parseInt(kid)} count={likeCount}
						active={likeFlag ? true : false} vertical={false}
						onChangeLike={this.props.onChangeLike} style={s.likeWrap}
					/>
				</View>
				<View style={s.contentWrap}>
					{
						less4Lines ? <Text style={s.contentTxt}>{content}</Text> :
							<ReadMoreText numberOfLines={4}>
								<Text style={s.contentTxt}>{content}</Text>
							</ReadMoreText>
					}
				</View>
				{recommend ? <Image source={recommendTag} style={s.recommendTag}></Image> : null}
				{this.renderImage()}
			</View>
		)
	}
	renderImage = () => {
		let { imgUrl = '', videoUrl, videoThumbnailUrl, contentType } = this.props.data;
		let imgUrlArr = imgUrl && imgUrl.split(',');
		if (contentType === 0) {
			return null;
		}
		if (contentType === 2) {
			return (
				<Touchable onPress={this.handleVideoPress} style={s.imgWrap}>
					<Image style={s.videoImg} source={{ uri: videoThumbnailUrl }}>
					</Image>
					<View style={s.playWrap}><Icon style={s.playIcon} name="play-a"></Icon></View>
				</Touchable>);
		}
		if (contentType === 1) {
			this.imgUrlArr = imgUrlArr.map((item) => { return { source: { uri: item } } });;
			if (imgUrlArr.length === 1) {
				return (
					<Touchable onPress={this.handleImgPress(0)} style={s.imgWrap}>
						<Image style={s.singleImg} source={{ uri: imgUrlArr[0] }}></Image>
					</Touchable>
				);
			} else {
				// let imgNode = imgUrlArr.map((item, index) => {
				// 	return <Touchable onPress={this.handleImgPress(index)} key={index.toString()}><Image style={[s.multiImg]} source={{ uri: item.trim() }} key={index.toString()} /></Touchable>
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
const imageWidth = commonStyle.transformSize(188);
const vMargin = (commonStyle.SCREEN_WIDTH - cols * imageWidth - commonStyle.transformSize(156)) / (cols + 1);
const hMargin = commonStyle.transformSize(10);

const s = StyleSheet.create({
	itemWrap: {
		paddingVertical: commonStyle.transformSize(40),
		paddingHorizontal: commonStyle.transformSize(40),
		backgroundColor: '#fff',
		// position: 'relative',
	},
	authorWrap: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	contentWrap: {
		marginLeft: commonStyle.transformSize(90),
		marginTop: commonStyle.transformSize(20),
	},
	contentTxt: {
		fontSize: commonStyle.transformSize(30),
		lineHeight: commonStyle.transformSize(46),
		color: '#000',
	},
	recommendTag: {
		position: 'absolute',
		top: commonStyle.transformSize(90),
		right: commonStyle.transformSize(35),
		// width: commonStyle.transformSize(128),
		backgroundColor: 'transparent',
	},
	imgWrap: {
		overflow: 'hidden',
		borderRadius: commonStyle.transformSize(14),
	},
	videoImg: {
		marginTop: commonStyle.transformSize(20),
		marginLeft: commonStyle.transformSize(90),
		width: commonStyle.transformSize(584),
		height: commonStyle.transformSize(486),
		borderRadius: commonStyle.transformSize(14),
		overflow: 'hidden',
		...commonStyle.centerWrap,
	},
	singleImg: {
		marginTop: commonStyle.transformSize(20),
		marginLeft: commonStyle.transformSize(90),
		width: commonStyle.transformSize(584),
		height: commonStyle.transformSize(296),
		borderRadius: commonStyle.transformSize(14),
		overflow: 'hidden',
		overlayColor: "white",
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
		position: 'absolute',
		// top: commonStyle.transformSize(190),
		top: '50%',
		// right: commonStyle.transformSize(235),
		right: '50%',
		transform: [
			{ translateX: commonStyle.transformSize(100) },
			{ translateY: -commonStyle.transformSize(50) },
		]

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
		paddingLeft: commonStyle.transformSize(90),
		justifyContent: 'flex-start',
	},
	multiImgWrap: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginLeft: commonStyle.transformSize(76),
	},
	authorName: {
		color: '#999',
	}
});