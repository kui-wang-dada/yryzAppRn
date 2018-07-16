import React from 'react';
import PropTypes from 'prop-types';
import {
	Touchable,
	View,
	Text,
	// Video,
	Image,
	Tag,
	TagGroup,
	StyleSheet,
	Icon,
} from '@components';
import {
	navigation
} from '@services';
import {
	resizeImage, commonStyle, transformNum
} from '@utils';
class ArticleItem extends React.Component {
	constructor(...args) {
		super(...args);
		this.handlePress = this.handlePress.bind(this);
	}

	render() {
		return (
			<Touchable onPress={this.handlePress} style={this.props.touchableStyle}>
				{this.renderMain(this.props)}
			</Touchable>
		);
	}

	renderMain(props) {
		const data = props.data;
		const horizontal = props.horizontal || (data.coverImgType === 1);

		const style = [
			s.main
		].concat(props.style);
		const innerStyle = [];
		const titleProps = {
			text: data.title,
			lineCount: 2,
			style: [s.title,
			].concat(props.titleStyle)
		};
		const mediaProps = {
			data,
			videoDurationVisible: true,
			style: [
				s.media,
			].concat(props.mediaStyle),
		};
		const tagsProps = {
			appName: data.appliName,
			likeCount: data.likeCount,
			viewCount: data.viewCount,
			maxCount: props.maxTagsCount,
			style: [
				s.tags
			].concat(props.tagsStyle),
			tagStyle: [
				s.tag
			].concat(props.tagStyle)
		};

		if (horizontal) {
			innerStyle.push(s.horizontalInner);
			titleProps.lineCount = 2;
			titleProps.style = [
				s.title,
				s.titleInHorizontal
			];
			mediaProps.horizontal = true;
			mediaProps.videoDurationVisible = false;
			mediaProps.style = [
				s.media,
				s.mediaInHorizontal,
			].concat(props.mediaStyle, props.mediaStyleInHorizontal);
			tagsProps.style = [
				s.tags,
				s.tagsInHorizontal
			].concat(props.tagsStyle);
		}

		return (
			<View padder style={style}>
				<View style={innerStyle}>
					{this.renderTitle(titleProps)}
					{this.renderMedia(mediaProps)}
				</View>
				{this.props.showsTags ? this.renderTags(tagsProps) : null}
			</View>
		);
	}

	renderTitle(props) {
		return <Text numberOfLines={props.lineCount} style={props.style}>{props.text}</Text>;
	}

	renderMedia(props) {
		const data = props.data;
		const style = props.style;
		let imgUri = '';
		if (data.coverImgUrl) {
			imgUri = resizeImage(data.coverImgUrl, props.horizontal ? 'article-item-s' : 'article-item')
		} else if (data.imgUrl) {
			imgUri = resizeImage(data.imgUrl, props.horizontal ? 'article-item-s' : 'article-item')
		} else {
			imgUri = 'http://img05.tooopen.com/images/20140328/sy_57865838889.jpg'
		}

		// if (data.videoUrl) {
		// 	return (
		// 		<Video
		// 			preview
		// 			poster={imgUri}
		// 			uri={data.videoUrl}
		// 			duration={props.videoDurationVisible ? data.videoDuration : undefined}
		// 			style={style}
		// 		/>
		// 	);
		// }

		return this.renderImage({
			uri: imgUri,
			style
		});
	}

	renderImage(props) {
		return <Image source={{ uri: props.uri }} style={props.style} />;
	}

	renderTags(props) {
		return (
			<View style={s.bottomWrap}>
				<Text style={s.bottomLeft}>{props.appName}</Text>
				<View style={s.bottomCenter}>
					<Icon name='good' size={12} style={s.iconStyle}></Icon>
					<Text style={s.bottomLike}>{transformNum(props.likeCount)}</Text>
				</View>
				<View style={s.bottomRight}>
					<Icon name='eyes' size={12} style={s.iconStyle}></Icon>
					<Text style={s.bottomRead}>{transformNum(props.viewCount)}</Text>
				</View>
			</View>
		);
	}

	handlePress = () => {
		// YZhugeIo.track('4文章详情', {
		// 	'来源': ({
		// 		'HomeTab': '首页tab',
		// 		'SearchScreen': '搜索',
		// 		'CategoryTab': '趣文',
		// 		'SubjectHome': '发现-专题',
		// 		'DiscoverTab': '发现-活动',
		// 		'App': '应用详情栏目tab',
		// 		'Attention': '我的收藏',
		// 		'MyEvaluate': '我的评价',
		// 		'VideoScreen': '我的视频',
		// 	})[this.props.navigation.state.routeName],
		// 	'文章': this.props.data.title
		// });
		// YZhugeIo.track('猜你喜欢', {
		// 	'文章标题': this.props.data.title
		// });

		this.props.onPress(this.props.data);
	}

	static propTypes = {
		data: PropTypes.object,
		horizontal: PropTypes.bool,
		showsTags: PropTypes.bool,
		maxTagsCount: PropTypes.number,
		onPress: PropTypes.func,
		style: PropTypes.any,
		touchableStyle: PropTypes.any,
		mediaStyle: PropTypes.any,
		tagsStyle: PropTypes.any,
		tagStyle: PropTypes.any,
	};

	static defaultProps = {
		horizontal: false,
		showsTags: true,
		maxTagsCount: Infinity,
		onPress: (data) => {
			navigation.navigate('ArticleDetail', {
				id: data.id
			});
		}
	};
}

const s = StyleSheet.create({
	main: {
		paddingVertical: commonStyle.transformSize(40),
		backgroundColor: '#fff',
		paddingHorizontal: commonStyle.padding,
	},
	horizontalInner: {
		flexDirection: 'row',
	},

	title: {
		fontWeight: 'bold',
		fontSize: commonStyle.transformSize(38),
		lineHeight: commonStyle.transformSize(54),
		marginBottom: commonStyle.transformSize(30),
		color: '#000',
	},
	titleInHorizontal: {
		flex: 1
	},
	media: {
		width: '100%',
		height: commonStyle.transformSize(514),
		borderRadius: commonStyle.transformSize(16),

		// For `Video`
		paddingBottom: 0,
	},
	iconStyle: {
		color: commonStyle.color_Icon,
	},
	mediaInHorizontal: {
		width: commonStyle.transformSize(224),
		height: commonStyle.transformSize(180),
		marginLeft: commonStyle.transformSize(46)
	},
	tags: {
		marginTop: commonStyle.transformSize(40)
	},
	tagsInHorizontal: {
		marginTop: commonStyle.transformSize(-42)
	},
	tag: {
		color: '#999',
		// borderWidth: commonStyle.transformSize(2),
		fontSize: commonStyle.transformSize(22),
		backgroundColor: 'transparent',
		marginBottom: 0
	},
	bottomWrap: {
		flexDirection: 'row',
		marginTop: -commonStyle.transformSize(28),
	},
	bottomLeft: {
		fontSize: commonStyle.transformSize(22),
		color: commonStyle.fontColor_assist_icon,    // #bbb
	},
	bottomCenter: {
		marginLeft: commonStyle.transformSize(40),
		flexDirection: 'row',
	},
	bottomLike: {
		marginLeft: commonStyle.transformSize(10),
		fontSize: commonStyle.fontSize_tag_22,   // 22
		color: commonStyle.fontColor_assist_icon,   // #bbb 
	},
	bottomRight: {
		marginLeft: commonStyle.transformSize(40),
		flexDirection: 'row',
	},
	bottomRead: {
		marginLeft: commonStyle.transformSize(10),
		fontSize: commonStyle.fontSize_tag_22,    // 22
		color: commonStyle.fontColor_assist_icon,     // #bbb 
	},
});

export default ArticleItem;