import React from 'react';
import PropTypes from 'prop-types';
import {
	StyleSheet
} from 'react-native';
import {
	View,
	Text,
	Image,
	Button,
} from './';

import { commonStyle as styles, transformSize } from '@utils';

import success from '../assets/images/emptyView/success.png';
import failed from '../assets/images/emptyView/failed.png'
import favoriteEmpty from '../assets/images/emptyView/emptyFavorite.png'
import noSearchResult from '../assets/images/emptyView/searchFailed.png';
import noNetwork from '../assets/images/emptyView/noNetwork.png';
import noData from '../assets/images/emptyView/noData.png';
import notFound from '../assets/images/emptyView/404.png';
import noMessage from '../assets/images/emptyView/noMessage.png';
import wait from '../assets/images/emptyView/wait.png';

const presets = {
	'request-success': {
		image: success,
		content: '成功！',
	},
	'request-failed': {
		image: failed,
		content: '失败！',
	},
	'no-favorite': {
		image: favoriteEmpty,
		content: '收藏夹为空！',
	},
	'no-search-result': {
		image: noSearchResult,
		content: '未搜到您想要的内容！'
	},
	'no-network': {
		image: noNetwork,
		content: '没有信号！',
		actionTitle: '重新加载',
	},
	'no-data': {
		image: noData,
		content: '暂无数据！'
	},
	'no-page': {
		image: notFound,
		content: '页面错误！'
	},
	'please-wait': {
		image: wait,
		content: '内容还在筹备中！'
	}
};

export default class Message extends React.Component {
	constructor(...args) {
		super(...args);
		this.handleAction = this.handleAction.bind(this);
	}

	render() {
		let config;

		if (this.props.preset) {
			config = presets[this.props.preset];

			if (!config) {
				throw new Error(`Cannot find a preset named "${this.props.preset}".`);
			}
		} else {
			config = {
				image: this.props.image,
				title: this.props.title,
				content: this.props.content,
				actionTitle: this.props.actionTitle,
			};
		}

		const image = config.image ? <Image source={config.image} style={s.image} /> : null;
		const title = config.title ? <Text style={s.title}>{config.title}</Text> : null;
		const textColor = this.props.textColor ? this.props.textColor : styles.fontColor_assist_2;
		const content = config.content ? <Text style={[s.content, { color: textColor }]}>{config.content}</Text> : null;
		const actionButton = config.actionTitle ? (
			<Button
				title={config.actionTitle}
				onPress={this.handleAction}
				containerStyle={s.actionButtonWrapper}
				buttonStyle={s.actionButton}
				titleStyle={s.actionButtonText}
			/>
		) : null;
		return (
			<View style={[s.main].concat(this.props.style)}>
				{image}
				{title}
				{content}
				{actionButton}
			</View>
		);
	}

	handleAction() {
		if (!this.props.onAction) {
			throw new Error('`onAction` is required if there is an action button.');
		}

		this.props.onAction();
	}

	static defaultProps = {
		style: {
			paddingVertical: transformSize(250)
		}
	}
}

propTypes = {
	style: PropTypes.style,
	preset: PropTypes.oneOf(Object.keys(presets)),
	image: PropTypes.number,
	title: PropTypes.string,
	content: PropTypes.string,
	actionTitle: PropTypes.string,
	onAction: PropTypes.func,
	textColor: PropTypes.string
};

const s = StyleSheet.create({
	main: {
		alignItems: 'center',
	},
	image: {
		marginBottom: transformSize(30)
	},
	title: {
		fontSize: transformSize(36),
		marginBottom: transformSize(20)
	},
	content: {
		fontSize: transformSize(30),
		color: styles.fontColor_assist_2
	},
	actionButtonWrapper: {
		width: '74.7%',
		marginTop: transformSize(100)
	},
	actionButton: {
		padding: transformSize(24),
		backgroundColor: styles.color_background,
		borderRadius: transformSize(42)
	},
	actionButtonText: {
		fontSize: transformSize(32),
		padding: 0,
	},
});
