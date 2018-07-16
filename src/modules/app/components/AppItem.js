import React, { Component } from 'react';
import {
	decorateheet, Text, View,
	withNavigation,
	StyleSheet,
	Tag, TagGroup, HightLight, Touchable, Image
} from '@components';
// import { transformSize, inlineWrap, padder, textPrimaryColor, border } from '@utils';
import {
	commonStyle as styles,
	resizeImage,
	cache
} from '@utils';
const { transformSize } = styles;
import PropTypes from 'prop-types';
let defaultLogo = require('@assets/images/logo-placeholder.png');
@withNavigation
export default class extends Component {

	avg(a, b) {
		var res = parseInt((a / b) * 10) / 10;// 保留两位、三位小数 同理
		return res;
	}

	_renderLeft(data) {
		let logoSource = { uri: data.appliIcon };
		let iconSize = this.props.iconSize;
		iconSize = {
			width: transformSize(iconSize),
			height: transformSize(iconSize)
		};
		if (!data.appliIcon) {
			logoSource = defaultLogo;
		}
		return (
			<View style={[decorate.leftBox, iconSize]}>
				<Image style={[decorate.icon, iconSize]} source={logoSource} />
			</View>
		);
	}

	_renderRight(data) {
		return (
			<View style={decorate.contentWrap}>
				{this._renderText(decorate.title, 1, data.appliName)}
				{this._renderText(decorate.slogan, 1, data.slog || data.appSlogan)}
				{this._renderText(
					decorate.description,
					this.props.contentOfLines,
					data.description || data.slog || data.appSlogan)
				}
				{
					this.props.showTag ?
						this._renderTag(data)
						: null
				}
			</View>
		);
	}

	_renderText(style, line, text) {
		return (
			text
				? <HightLight
					style={style}
					numberOfLines={line}
					text={text}
					activeStyle={decorate.activeStyle}
					search={this.props.keyWords} />
				: null
		);
	}

	_renderTag(data) {
		const { tagColor, tagClick } = this.props;
		try {
			data.labels = data.labels || data.labelName || [];
			// 后端部分结构不同, 有的用的label数组有的用的labelName,  兼容转换
			if (typeof data.labels === "string") {
				// 和dest 属性对应
				const dest = data.labelDesp.split(",");
				data.labels = data.labels.split(",").map((text, index) => {
					return {
						labelName: text,
						id: dest[index]
					};
				});
			}
		} catch (e) {
			data.labels = [];
		}
		const iconSize = {
			width: transformSize(this.props.iconSize)
		};
		return (
			<View>
				<TagGroup>
					{
						data.labels.map((label, index) => {
							return (
								<Tag
									key={index}
									onPress={this.onTagPress.bind(this, label)}
									style={{ borderWidth: StyleSheet.hairlineWidth }}
								>
									{label.labelName}
								</Tag>
							);
						})
					}
				</TagGroup>
			</View>
		);
	}

	render() {
		let { data, style = {} } = this.props;
		return (
			<Touchable
				type="highlight" style={style}
				onPress={this.onSelect.bind(this)} >
				<View style={[decorate.container, style]}>
					{this._renderLeft(data)}
					{this._renderRight(data)}
				</View>
			</Touchable>
		);
	}

	onTagPress(label) {
		if (this.props.tagPress) {
			return this.props.tagPress(label);
		}
		this.props.navigation.navigate("TagCategory", {
			tagId: label.id,
			isArticle: false,
			labelName: label.labelName
		});
	}

	onSelect() {
		let { data, style, onPress } = this.props;
		if (onPress) {
			onPress(data);
			return;
		}
		this.props.navigation.navigate('AppDetail', { id: data.id });
	}

	static PropTypes = {
		showAttention: PropTypes.boolean,   // 是否关注数
		bottomLine: PropTypes.boolean,   // 是否显示下划线
		tagColor: PropTypes.string,		 // 定制标签的颜色
		onPress: PropTypes.func,		 // 选中的回调
		scalarType: PropTypes.string,     // 显示下载数或者关注数等需要显示的文字,
		contentOfLines: PropTypes.number,
		iconSize: PropTypes.number,
		showTag: PropTypes.boolean
	}

	static defaultProps = {
		showAttention: true,
		bottom: 0,
		tagColor: '#999',
		showTag: true,
		bottomLine: false,
		contentOfLines: 3,
		iconSize: 147
	}
}

const decorate = StyleSheet.create({
	container: {
		paddingTop: transformSize(40),
		paddingBottom: transformSize(24),
		paddingHorizontal: transformSize(40),
		flexDirection: 'row',
		backgroundColor: 'white',
	},
	leftBox: {
		marginRight: transformSize(22),
		borderRadius: transformSize(32),
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: '#e3e3e3',
		overflow: 'hidden',
	},
	icon: {
		borderRadius: transformSize(32),
		overlayColor: '#fff',
		overflow: 'hidden',

		// backgroundColor: '#f1f1f1'
	},
	title: {
		marginBottom: transformSize(20),
		fontSize: transformSize(36),
		fontWeight: '600',
		color: 'black'
	},
	contentWrap: {
		flex: 1,
		paddingTop: transformSize(10)
	},
	description: {
		fontSize: transformSize(28),
		lineHeight: transformSize(40),
		// includeFontPadding: false,
		marginBottom: transformSize(30),
		color: 'black'
	},
	browse: {
		marginRight: transformSize(50)
	},
	browseText: {
		textAlign: "center",
		fontSize: transformSize(44),
		color: '#666'
	},
	giftIcon: {
		fontSize: transformSize(46),
		color: "#9ac7ff"
	},
	activityWrapper: {
		paddingTop: transformSize(51),
		alignItems: 'center'
	},
	activityContent: {
		fontSize: transformSize(46),
		color: "#ff9bb0",
		paddingLeft: transformSize(38)
	},
	bottomline: {
		height: transformSize(2),
		backgroundColor: "#e3e3e3"
	},
	bg: {
		backgroundColor: 'white'
	},
	slogan: {
		fontSize: styles.transformSize(26),
		marginBottom: styles.transformSize(30),
		color: "#999"
	},
	activeStyle: {
		color: styles.color_theme
	}
});
