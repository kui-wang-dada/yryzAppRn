import React from 'react';
import PropTypes from 'prop-types';
import {
	Touchable,
	View,
	Text,
	Image,
	Tag,
	TagGroup,
	withNavigation,
	StyleSheet
} from '@components';
import {
	navigate
} from '@services';
import {
	commonStyle as styles,
	resizeImage
} from '@utils';

@withNavigation
class ArticleItem extends React.Component {
	constructor(...args) {
		super(...args);
		this.handlePress = this.handlePress.bind(this);
	}

	render() {
		return (
			<Touchable type="highlight" onPress={this.handlePress} style={this.props.touchableStyle}>
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
			list: data.labels,
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

		if (data.videoUrl) {
			return (
				// <Video
				// 	preview
				// 	poster={imgUri}
				// 	uri={data.videoUrl}
				// 	duration={props.videoDurationVisible ? data.videoDuration : undefined}
				// 	style={style}
				// />
				<Image source={{ uri: imgUri }} style={style} />
			);
		}

		return this.renderImage({
			uri: imgUri,
			style
		});
	}

	renderImage(props) {
		return <Image source={{ uri: props.uri }} style={props.style} />;
	}

	renderTags(props) {
		if (!(props.list && props.list.length)) {
			return null;
		}
		const tags = props.list.slice(0, props.maxCount).map((item, index) => (
			<Tag key={index} onPress={this.createTagPressHandler(item.kid)} style={props.tagStyle}>{item.labelName}</Tag>
		));
		return (
			<TagGroup style={props.style}>
				{tags}
			</TagGroup>
		);
	}

	handlePress() {
		this.props.onPress(this.props.data);
	}

	createTagPressHandler(tagId) {
		return () => {
			navigate('TagPage', {
				tagId,
				isArticle: true
			});
		};
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
			navigate('Article', {
				id: data.id
			});
		}
	};
}

const s = StyleSheet.create({
	main: {
		paddingVertical: styles.transformSize(40),
		backgroundColor: 'white',
		paddingHorizontal: styles.transformSize(50),

	},
	horizontalInner: {
		flexDirection: 'row',
	},

	title: {
		fontWeight: 'bold',
		fontSize: styles.transformSize(52),
		lineHeight: styles.transformSize(70),
		marginBottom: styles.transformSize(30),
	},
	titleInHorizontal: {
		flex: 1
	},
	media: {
		width: '100%',
		height: styles.transformSize(514),
		borderRadius: styles.transformSize(16),

		// For `Video`
		paddingBottom: 0,
	},
	mediaInHorizontal: {
		width: styles.transformSize(384),
		height: styles.transformSize(296),
		marginLeft: styles.transformSize(46)
	},
	tags: {
		marginTop: styles.transformSize(40)
	},
	tagsInHorizontal: {
		marginTop: styles.transformSize(-42)
	},
	tag: {
		...styles.border,
		color: styles.assistColor,
		borderWidth: styles.transformSize(2),
		backgroundColor: 'transparent',
		marginBottom: 0
	}
});

export default ArticleItem;