import React, { Component } from 'react';
import {
	StyleSheet, Text, View,
	withNavigation,
	Tag, TagGroup, YIcon, Touchable, Image
} from '@components';
import { transformSize, inlineWrap, padder, textPrimaryColor, border } from '@styles';
import { YZhugeIo } from '@ydk';
import PropTypes from 'prop-types';
let defaultLogo = require('../../assets/images/no-pic.jpg');
@withNavigation
export default class extends Component {

	_renderActivity(active) {
		if (active && active.title) {
			return (
				<Touchable onPress={() => this.props.navigation.navigate("Article", { id: active.id })}>
					<View style={styles.activityWrapper}>
						<YIcon name="gift" style={styles.giftIcon} />
						<Text style={styles.activityContent} numberOfLines={1}>{active.title}</Text>
					</View>
				</Touchable>
			);
		}
	}

	avg(a, b) {
		var res = parseInt((a / b) * 10) / 10;// 保留两位、三位小数 同理
		return res;
	}

	_renderContent(data) {
		// console.warn("appItemData:", JSON.stringify(data))
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
			<View style={styles.inner}>
				<View style={iconSize}>
					<Image style={[styles.icon, iconSize]} source={logoSource} />
				</View>
				<View style={styles.contentWrap}>
					<Text style={styles.title} numberOfLines={1}>{data.appliName}</Text>
					<Text style={styles.description} numberOfLines={this.props.contentOfLines}>
						{data.description || data.slog || data.appSlogan}
					</Text>
				</View>
			</View>
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
		if (data.appStatictis) {
			data.downloadCount = data.appStatictis.downloadCount;
		}
		if (data.attentionNum > 9999) {
			data.attentionNum = this.avg(data.attentionNum, 10000) + "w";
		}
		const iconSize = {
			width: transformSize(this.props.iconSize)
		};
		return (
			<View style={styles.tagWrap}>
				<View style={[styles.browse, iconSize]}>
					{this.props.showAttention ?
						<Text style={styles.browseText}>{data.attentionNum || data.appFollowCount || 0}{this.props.scalarType}</Text>
						: null}
				</View>
				<TagGroup>
					{
						data.labels.map((label, index) => {
							return (
								<Tag style={{ color: tagColor, backgroundColor: '#fff', borderWidth: transformSize(2), borderColor: '#e3e3e3' }}
									key={index}
									onPress={this.onTagPress.bind(this, label)}
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

	renderBottomLine() {
		const { bottomLine } = this.props;
		if (bottomLine) {
			return (
				<View style={[padder, styles.bg]}>
					<View style={styles.bottomline}></View>
				</View>
			);
		}
	}

	render() {
		let { data, style = {}, selected } = this.props;
		return (
			<Touchable
				type="highlight" style={style}
				onPress={this.onSelect.bind(this)} >
				<View style={styles.container}>
					<View style={[styles.wrapper, style]}>
						{this._renderContent(data)}
						{this._renderTag(data)}
						{this._renderActivity(data.latestActivity)}
					</View>
					{this.renderBottomLine()}
				</View>
			</Touchable>
		);
	}

	onTagPress(label) {
		this.props.navigation.navigate("TagPage", {
			tagId: label.id,
			isArticle: false,
		});
	}

	onSelect() {
		let { data, style, selected, onPress } = this.props;
		if (onPress) {
			onPress();
			return;
		}
		this.props.navigation.navigate('App', { id: data.id });
		YZhugeIo.track('猜你喜欢', {
			'应用名称': data.appliName,
		});
	}

	static PropTypes = {
		showAttention: PropTypes.boolean,   // 是否关注数
		bottomLine: PropTypes.boolean,   // 是否显示下划线
		tagColor: PropTypes.string,		 // 定制标签的颜色
		selected: PropTypes.func,		 // 选中的回调
		scalarType: PropTypes.string,     // 显示下载数或者关注数等需要显示的文字,
		contentOfLines: PropTypes.number,
		iconSize: PropTypes.number,
	}

	static defaultProps = {
		scalarType: '次获取',
		showAttention: true,
		bottom: 0,
		tagColor: '#ff9160',
		bottomLine: false,
		contentOfLines: 2,
		iconSize: 250
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white'
	},
	wrapper: {
		paddingTop: transformSize(50),
		paddingBottom: transformSize(34),
		...padder,
	},
	inner: {
		...inlineWrap,
		marginBottom: transformSize(10)
	},
	icon: {
		borderRadius: transformSize(40),
		overlayColor: '#fff',
		// width: transformSize(300),
		// height: transformSize(300),
		...border
	},
	title: {
		fontSize: transformSize(56),
		color: textPrimaryColor,
		marginLeft: transformSize(50),
	},
	contentWrap: {
		flex: 1,
		paddingTop: transformSize(15)
	},
	description: {
		fontSize: transformSize(46),
		includeFontPadding: false,
		lineHeight: transformSize(70),
		minHeight: transformSize(176),
		marginLeft: transformSize(50),
		marginTop: transformSize(22),
	},
	tagWrap: {
		...inlineWrap
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
		...inlineWrap,
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
	}
});